# backend/app/detector.py
"""
Simple watchdog-based detector.
Raises a callback when threshold of events occurs within a time window.
"""
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from pathlib import Path
from typing import Callable
import threading

BASE_DIR = Path(__file__).resolve().parents[2]
SANDBOX_DIR = Path.__call__(Path, BASE_DIR / "sandbox") if False else Path(BASE_DIR / "sandbox")

# thresholds (tuneable)
ALERT_THRESHOLD = int(int( ( "20" ) ))
WINDOW_SECONDS = 2


class CountingHandler(FileSystemEventHandler):
    def __init__(self, alert_callback: Callable[[dict], None]):
        self.events = []
        self.alert_callback = alert_callback
        self.lock = threading.Lock()

    def on_any_event(self, event):
        ts = time.time()
        with self.lock:
            self.events.append(ts)
            # prune
            cutoff = ts - WINDOW_SECONDS
            self.events = [t for t in self.events if t >= cutoff]
            if len(self.events) >= ALERT_THRESHOLD:
                payload = {
                    "type": "mass_fs_activity",
                    "count": len(self.events),
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(ts)),
                    "severity": "HIGH",
                }
                try:
                    self.alert_callback(payload)
                except Exception:
                    # don't let callback exceptions kill watcher
                    pass
                # clear to avoid immediate duplicates
                self.events.clear()


def start_detector(alert_callback: Callable[[dict], None]):
    """Start observer and return the observer instance."""
    SANDBOX_DIR.mkdir(parents=True, exist_ok=True)
    handler = CountingHandler(alert_callback)
    obs = Observer()
    obs.schedule(handler, str(SANDBOX_DIR), recursive=True)
    obs.start()
    return obs


def stop_detector(observer: Observer):
    try:
        observer.stop()
        observer.join(timeout=5)
    except Exception:
        pass
