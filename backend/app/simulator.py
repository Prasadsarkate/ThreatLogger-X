# backend/app/simulator.py
"""
Safe simulator: operates ONLY inside SANDBOX_DIR.
Creates dummy files and performs non-destructive 'ransom-like' rename.
"""
import os
import time
import uuid
from pathlib import Path
from typing import List

# base dir: project root
BASE_DIR = Path(__file__).resolve().parents[2]
SANDBOX_DIR = Path(os.environ.get("SANDBOX_DIR", str(BASE_DIR / "sandbox")))


def ensure_sandbox():
    SANDBOX_DIR.mkdir(parents=True, exist_ok=True)


def _is_inside_sandbox(p: Path) -> bool:
    try:
        return SANDBOX_DIR.resolve() in p.resolve().parents or p.resolve() == SANDBOX_DIR.resolve()
    except Exception:
        return False


def create_dummy_files(count: int = 50, size_kb: int = 1) -> List[Path]:
    """Create small dummy files inside the sandbox. Return list of created files."""
    ensure_sandbox()
    created = []
    for i in range(count):
        p = SANDBOX_DIR / f"file_{i}.txt"
        # write small harmless content
        with p.open("w", encoding="utf-8") as f:
            f.write(f"dummy content {i}\nuid:{uuid.uuid4()}\n")
        created.append(p)
    return created


def safe_simulate_mass_rename(delay_between: float = 0.01) -> dict:
    """
    Rename files inside sandbox by appending `.locked.sim` to their suffix.
    Do NOT modify content or operate outside sandbox.
    Returns a dict with renamed count and ransom_note path.
    """
    ensure_sandbox()
    files = sorted([p for p in SANDBOX_DIR.iterdir() if p.is_file()])
    renamed = 0
    for p in files:
        if not _is_inside_sandbox(p):
            # safety check - skip anything outside
            continue
        new = p.with_name(p.name + ".locked.sim")
        p.rename(new)
        renamed += 1
        time.sleep(delay_between)

    ransom_note = SANDBOX_DIR / "READ_ME_TO_RECOVER.txt"
    with ransom_note.open("w", encoding="utf-8") as f:
        f.write("THIS IS A SIMULATION RANSOM NOTE. No files were encrypted.\nFollow the instructions in the README for safe recovery.\n")

    return {"renamed": renamed, "ransom_note": str(ransom_note)}
