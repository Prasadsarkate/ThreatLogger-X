# backend/app/responder.py
"""
Quarantine and snapshot logic.
"""
import shutil
from pathlib import Path
import time
import tarfile
import os

BASE_DIR = Path(__file__).resolve().parents[2]
SANDBOX_DIR = Path(os.environ.get("SANDBOX_DIR", str(BASE_DIR / "sandbox")))
QUARANTINE_DIR = Path(os.environ.get("QUARANTINE_DIR", str(BASE_DIR / "quarantine")))
SNAPSHOT_DIR = Path(os.environ.get("SNAPSHOT_DIR", str(BASE_DIR / "snapshots")))


def quarantine_all() -> dict:
    QUARANTINE_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    for p in list(SANDBOX_DIR.iterdir()):
        try:
            target = QUARANTINE_DIR / p.name
            # if target exists, add timestamp
            if target.exists():
                target = QUARANTINE_DIR / f"{p.name}.{int(time.time())}"
            shutil.move(str(p), str(target))
            count += 1
        except Exception:
            # skip problematic files
            continue
    return {"quarantined": count}


def create_snapshot() -> str:
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    ts = int(time.time())
    archive = SNAPSHOT_DIR / f"sandbox_snapshot_{ts}.tar.gz"
    # snapshot the quarantine dir if it exists; otherwise snapshot the sandbox
    src = QUARANTINE_DIR if any(QUARANTINE_DIR.iterdir()) else SANDBOX_DIR
    with tarfile.open(archive, "w:gz") as tar:
        # use arcname to avoid embedding full path
        tar.add(str(src), arcname=src.name)
    return str(archive)
