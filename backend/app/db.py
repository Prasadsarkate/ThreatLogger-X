# backend/app/db.py
"""
Tiny sqlite wrapper for incidents. Uses a single connection for simplicity.
Data column stores JSON string.
"""
import sqlite3
import json
import uuid
from pathlib import Path
from .utils.helpers import now_iso

# DB file placed in project root (two levels up from this file)
BASE_DIR = Path(__file__).resolve().parents[2]
DB_PATH = Path("{}/ransom_sim.db".format(BASE_DIR))

_conn = None


def _get_conn():
    global _conn
    if _conn is None:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        _conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
        _conn.row_factory = sqlite3.Row
    return _conn


def init_db():
    conn = _get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS incidents (
            id TEXT PRIMARY KEY,
            timestamp TEXT,
            type TEXT,
            data TEXT
        )
        """
    )
    conn.commit()


def insert_incident(inc_type: str, data: dict) -> str:
    conn = _get_conn()
    cur = conn.cursor()
    iid = str(uuid.uuid4())
    ts = now_iso()
    cur.execute("INSERT INTO incidents (id, timestamp, type, data) VALUES (?, ?, ?, ?)",
                (iid, ts, inc_type, json.dumps(data)))
    conn.commit()
    return iid


def fetch_incidents(limit: int = 100):
    conn = _get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, timestamp, type, data FROM incidents ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cur.fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r[0],
            "timestamp": r[1],
            "type": r[2],
            "data": json.loads(r[3]) if r[3] else {}
        })
    return results


def fetch_incident_by_id(iid: str):
    conn = _get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, timestamp, type, data FROM incidents WHERE id = ?", (iid,))
    r = cur.fetchone()
    if not r:
        return None
    return {"id": r[0], "timestamp": r[1], "type": r[2], "data": json.loads(r[3])}


# initialize DB at import
init_db()

