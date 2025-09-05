from fastapi import APIRouter

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("/")
def get_incidents(limit: int = 20):
    return {"incidents": [{"id": "demo", "type": "mass_fs_activity", "severity": "HIGH"}]}
