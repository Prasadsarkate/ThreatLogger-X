from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..auth import create_access_token, verify_password, get_password_hash

router = APIRouter(prefix="/auth", tags=["Auth"])

# simple in-memory users (replace with DB later)
fake_users = {"admin": get_password_hash("admin123")}

class LoginSchema(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginSchema):
    user_pass = fake_users.get(data.username)
    if not user_pass or not verify_password(data.password, user_pass):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": data.username})
    return {"access_token": token, "token_type": "bearer"}
