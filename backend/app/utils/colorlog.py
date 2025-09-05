# backend/app/utils/colorlog.py
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import box

console = Console()


def print_alert(alert: dict):
    """Pretty print an alert dictionary using rich."""
    table = Table(title="🚨 RansomSim Defender Alert 🚨", box=box.ROUNDED, show_lines=True)
    table.add_column("Field", style="cyan", no_wrap=True)
    table.add_column("Value", style="magenta")

    for k, v in alert.items():
        if k == "type":
            table.add_row("Type", f"[bold red]{v}[/bold red]")
        elif k == "count":
            table.add_row("Events Count", f"[yellow]{v}[/yellow]")
        elif k == "severity":
            sev = str(v).upper()
            color = "red" if sev == "HIGH" else "orange1" if sev == "MEDIUM" else "green"
            table.add_row("Severity", f"[bold {color}]{sev}[/bold {color}]")
        else:
            table.add_row(k.capitalize(), str(v))

    console.print(table)


def info(msg: str):
    console.print(Panel(msg, title="[green]INFO[/green]"))


def error(msg: str):
    console.print(Panel(msg, title="[red]ERROR[/red]"))
