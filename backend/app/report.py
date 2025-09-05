# backend/app/report.py
"""
Generate HTML report (Jinja2). Attempt PDF generation with pdfkit if available.
"""
import json
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, select_autoescape
from .db import fetch_incident_by_id
from .utils.helpers import now_iso

BASE_DIR = Path(__file__).resolve().parents[2]
TEMPLATES_DIR = BASE_DIR / "templates"
REPORTS_DIR = BASE_DIR / "reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

env = Environment(
    loader=FileSystemLoader(str(TEMPLATES_DIR)),
    autoescape=select_autoescape(["html", "xml"]),
)


def generate_report(incident_id: str) -> dict:
    """Return dict: {html_path: str, pdf_path: Optional[str]}"""
    inc = fetch_incident_by_id(incident_id)
    if not inc:
        raise ValueError("incident not found")

    tpl = env.get_template("report_template.html")
    rendered = tpl.render(
        incident=inc,
        generated_at=now_iso(),
        pretty_data=json.dumps(inc.get("data", {}), indent=2),
    )

    html_path = REPORTS_DIR / f"report_{incident_id}.html"
    html_path.write_text(rendered, encoding="utf-8")

    pdf_path = None
    try:
        import pdfkit
        # pdfkit requires wkhtmltopdf installed on the system.
        pdf_out = REPORTS_DIR / f"report_{incident_id}.pdf"
        pdfkit.from_file(str(html_path), str(pdf_out))
        pdf_path = str(pdf_out)
    except Exception:
        # if pdfkit or wkhtmltopdf missing, skip PDF generation gracefully
        pdf_path = None

    return {"html_path": str(html_path), "pdf_path": pdf_path}
