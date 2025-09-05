"""
Single-entry FastAPI app wiring simulator, detector and responder.
Run with: `uvicorn backend.app.main:app --reload`
"""

import os
import traceback
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Request, Depends, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from jose import JWTError, jwt
from pydantic import BaseModel
from .simulator import create_dummy_files, safe_simulate_mass_rename
from .detector import start_detector, stop_detector
from .responder import quarantine_all, create_snapshot
from .report import generate_report
from .db import insert_incident, fetch_incidents
from .utils.colorlog import print_alert, info
from .schemas import (
    SimulateCreateResponse,
    SimulateRunResponse,
    QuarantineResponse,
    ReportResponse,
)

# -----------------------------
# Security Config (JWT basics)
# -----------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_THIS_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ✅ Extract & verify JWT from Authorization header
def verify_token(authorization: str = Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid auth header")

        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # user info return karega
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except Exception:
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")


# -----------------------------
# App Initialization
# -----------------------------
app = FastAPI(title="ThreatLogger X")

# static files (favicon, assets)
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

# allow local front-end during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🚨 later restrict karna ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_observer = None


def alert_callback(payload: dict):
    try:
        print_alert(payload)
    except Exception:
        pass
    try:
        iid = insert_incident(payload.get("type", "alert"), payload)
        info(f"Inserted incident {iid}")
    except Exception:
        traceback.print_exc()


@app.on_event("startup")
def startup_event():
    global _observer
    info("Starting detector...")
    _observer = start_detector(alert_callback)
    info("Detector started")


@app.on_event("shutdown")
def shutdown_event():
    global _observer
    if _observer:
        stop_detector(_observer)


# -----------------------------
# ✅ Auth Models + Endpoint
# -----------------------------
class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/auth/login")
def login(data: LoginRequest):
    if data.username == "admin" and data.password == "admin123":
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        token = jwt.encode(
            {"sub": data.username, "exp": expire},
            SECRET_KEY,
            algorithm=ALGORITHM
        )
        return {"access_token": token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")


# -----------------------------
# API Routes (secured)
# -----------------------------
@app.post("/simulate/create-files", response_model=SimulateCreateResponse)
def api_create_files(count: int = 50, user: dict = Depends(verify_token)):
    try:
        files = create_dummy_files(count)
        return {"status": "created", "created": len(files)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/simulate/run", response_model=SimulateRunResponse)
def api_run_simulation(user: dict = Depends(verify_token)):
    try:
        res = safe_simulate_mass_rename()
        iid = insert_incident("simulation_complete", res)
        return {
            "status": "simulation_complete",
            "renamed": res.get("renamed", 0),
            "ransom_note": res.get("ransom_note"),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/response/quarantine", response_model=QuarantineResponse)
def api_quarantine(user: dict = Depends(verify_token)):
    try:
        q = quarantine_all()
        snap = create_snapshot()
        insert_incident("response_quarantine", {**q, "snapshot": snap})
        return {"quarantined": q.get("quarantined", 0), "snapshot": snap}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/report/generate", response_model=ReportResponse)
def api_generate_report(incident_id: str, user: dict = Depends(verify_token)):
    try:
        out = generate_report(incident_id)
        return JSONResponse(content=out)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/incidents")
def api_list_incidents(limit: int = 100, user: dict = Depends(verify_token)):
    try:
        return fetch_incidents(limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------
# Custom 404 handler
# -----------------------------
@app.exception_handler(404)
async def custom_404(request: Request, exc):
    ip = request.client.host if request.client else "unknown"
    path = str(request.url)
    info(f"404 caught from {ip} on {path}")
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "path": path, "ip": ip},
    )
