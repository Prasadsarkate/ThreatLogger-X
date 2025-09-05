# backend/app/schemas.py
from pydantic import BaseModel
from typing import Optional


class SimulateCreateResponse(BaseModel):
    status: str
    created: int


class SimulateRunResponse(BaseModel):
    status: str
    renamed: int
    ransom_note: str


class AlertModel(BaseModel):
    type: str
    count: int
    timestamp: str
    severity: Optional[str] = "HIGH"


class QuarantineResponse(BaseModel):
    quarantined: int
    snapshot: str


class ReportResponse(BaseModel):
    html_path: str
    pdf_path: Optional[str] = None
