# backend/app/utils/helpers.py
import datetime


def now_iso():
    """Return current UTC time in ISO format (no microseconds) with Z suffix."""
    return datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
