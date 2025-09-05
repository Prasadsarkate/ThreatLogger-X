from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..auth import verify_token
import os, random

router = APIRouter(prefix="/simulate", tags=["Simulation"])

SIM_DIR = "sim_files"
os.makedirs(SIM_DIR, exist_ok=True)


# ✅ Response model
class SimulateRunResponse(BaseModel):
    status: str
    renamed: int
    ransom_note: str


# ✅ Create dummy files
@router.post("/create-files")
def create_files(token: dict = Depends(verify_token)):
    created = 0
    for i in range(5):
        fname = os.path.join(SIM_DIR, f"test_{random.randint(1000,9999)}.txt")
        with open(fname, "w") as f:
            f.write("This is a dummy file.\n")
        created += 1
    return {"created": created}


# ✅ Run simulation (rename files + ransom note)
@router.post("/run", response_model=SimulateRunResponse)
def api_run_simulation(token: dict = Depends(verify_token)):
    renamed = 0
    for fname in os.listdir(SIM_DIR):
        old_path = os.path.join(SIM_DIR, fname)
        if os.path.isfile(old_path):
            new_path = old_path + ".locked"
            os.rename(old_path, new_path)
            renamed += 1

    ransom_path = os.path.join(SIM_DIR, "README_RESTORE_FILES.txt")
    ransom_message = "⚠️ Your files have been locked! Pay 1 BTC to unlock."
    with open(ransom_path, "w") as f:
        f.write(ransom_message)

    return {
        "status": "Simulation Completed",
        "renamed": renamed,
        "ransom_note": ransom_message,
    }
