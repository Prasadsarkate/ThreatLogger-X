# tests/test_simulator.py
import tempfile
import os
import shutil
from pathlib import Path
from backend.app import simulator


def test_create_and_simulate(tmp_path):
    # set SANDBOX_DIR to a temporary folder
    sandbox = tmp_path / "sandbox_test"
    os.environ["SANDBOX_DIR"] = str(sandbox)

    # create dummy files
    files = simulator.create_dummy_files(count=5)
    assert len(files) == 5
    for p in files:
        assert p.exists()
        assert sandbox in p.parents

    # run simulation
    res = simulator.safe_simulate_mass_rename(delay_between=0)
    assert "renamed" in res
    assert res["renamed"] == 5
    rn = sandbox / "READ_ME_TO_RECOVER.txt"
    assert rn.exists()
