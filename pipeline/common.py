"""Shared helpers for the data pipeline (standard library only)."""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data"
USER_AGENT = "nostos-data-pipeline (+https://github.com/IliasCK/nostos)"


def http_get(url: str, accept: str = "*/*", attempts: int = 3, timeout: int = 60) -> bytes:
    """GET with a few retries on network errors and 5xx responses."""
    last: Exception | None = None
    for attempt in range(1, attempts + 1):
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": accept})
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return response.read()
        except urllib.error.HTTPError as e:
            last = e
            if e.code < 500:
                break
        except (urllib.error.URLError, TimeoutError) as e:
            last = e
        time.sleep(2 * attempt)
    raise RuntimeError(f"GET {url} failed: {last}")


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def read_json(path: Path) -> Any | None:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else None


def dumps(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def without_timestamp(data: Any) -> Any:
    return {k: v for k, v in data.items() if k != "fetchedAt"} if isinstance(data, dict) else data


def write_if_changed(path: Path, data: dict[str, Any]) -> bool:
    """Writes data unless only fetchedAt would change (so scheduled runs don't make no-op commits)."""
    previous = read_json(path)
    if previous is not None and without_timestamp(previous) == without_timestamp(data):
        print(f"{path.relative_to(ROOT)}: unchanged")
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(dumps(data), encoding="utf-8")
    print(f"{path.relative_to(ROOT)}: written")
    return True


def fail(message: str, errors: list[str]) -> None:
    """Prints errors (as GitHub Actions annotations when running there) and exits 1."""
    print(f"::error::{message}", file=sys.stderr)
    for e in errors:
        print(f"::error::  {e}", file=sys.stderr)
    sys.exit(1)
