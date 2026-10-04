"""Sanity checks for every dataset before it is written to src/data/ (SPEC §7).

Each validate_* function returns a list of error strings (empty = valid). The
fetchers call them and write nothing if any error is returned.

Run directly to check the committed files:  python pipeline/validate.py
That also prints a (non-failing) warning if the hand-entered rent figures are stale.
"""

from __future__ import annotations

import re
import sys
from datetime import date
from typing import Any

from common import DATA, read_json

FX_CURRENCIES = ["GBP", "USD", "AUD", "SEK"]
# Loose plausibility ranges (units per 1 EUR); they only catch broken data.
FX_RANGES = {"GBP": (0.5, 1.5), "USD": (0.6, 2.0), "AUD": (1.0, 3.0), "SEK": (6.0, 20.0)}
FX_MAX_CHANGE = 0.20  # ±20% vs previous value (SPEC §7)

PRICE_LEVEL_COUNTRIES = ["GR", "DE", "GB", "NL", "AU", "US", "BE", "SE", "CY"]
PRICE_LEVEL_RANGE = (10.0, 300.0)
PRICE_LEVEL_MAX_CHANGE = 0.20

PEER_COUNTRIES = ["GR", "BG", "RO", "PT", "ES", "IT", "EU27"]
PEER_INDICATORS = {
    # id: (plausible range, countries that may legitimately be absent)
    "gdpPerCapitaPps": ((3_000, 150_000), []),
    "aicPerCapitaPps": ((3_000, 100_000), []),
    "netEarningsPps": ((2_000, 100_000), []),
    "priceLevelIndex": ((20, 250), []),
    "housingCostOverburden": ((0, 100), []),
    # Italy has no statutory minimum wage; Eurostat publishes no EU27 aggregate.
    "minimumWagePps": ((100, 5_000), ["IT", "EU27"]),
}
PEER_MAX_CHANGE = 0.25

RENT_STALE_DAYS = 122  # ~4 months after the end of the quarter


def _is_number(v: Any) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool) and v == v


def _change_errors(label: str, new: float, old: Any, band: float) -> list[str]:
    if not _is_number(old) or old == 0:
        return []
    change = abs(new - old) / abs(old)
    if change > band:
        return [f"{label}: {old} → {new} is a {change:.0%} change (limit ±{band:.0%})"]
    return []


def _meta_errors(data: dict[str, Any], *keys: str) -> list[str]:
    return [f"missing or empty '{k}'" for k in ("source", "fetchedAt", *keys) if not data.get(k)]


def validate_fx(data: Any, previous: Any = None, today: date | None = None) -> list[str]:
    if not isinstance(data, dict):
        return ["fx: not an object"]
    errors = _meta_errors(data, "date")
    if data.get("base") != "EUR":
        errors.append("fx: base must be EUR")
    try:
        if date.fromisoformat(str(data.get("date"))) > (today or date.today()):
            errors.append(f"fx: date {data.get('date')} is in the future")
    except ValueError:
        errors.append(f"fx: invalid date {data.get('date')!r}")
    rates = data.get("rates") if isinstance(data.get("rates"), dict) else {}
    old_rates = (previous or {}).get("rates", {}) if isinstance(previous, dict) else {}
    for c in FX_CURRENCIES:
        v = rates.get(c)
        if not _is_number(v):
            errors.append(f"fx: rate for {c} missing")
            continue
        lo, hi = FX_RANGES[c]
        if not lo <= v <= hi:
            errors.append(f"fx: {c} rate {v} outside {lo}–{hi}")
        errors += _change_errors(f"fx: {c}", v, old_rates.get(c), FX_MAX_CHANGE)
    return errors


def validate_price_levels(data: Any, previous: Any = None, today: date | None = None) -> list[str]:
    if not isinstance(data, dict):
        return ["priceLevels: not an object"]
    errors = _meta_errors(data, "basis")
    year = data.get("year")
    this_year = (today or date.today()).year
    if not isinstance(year, int) or not this_year - 6 <= year <= this_year:
        errors.append(f"priceLevels: implausible year {year!r}")
    indices = data.get("indices") if isinstance(data.get("indices"), dict) else {}
    same_basis = isinstance(previous, dict) and previous.get("basis") == data.get("basis")
    old = previous.get("indices", {}) if same_basis else {}
    lo, hi = PRICE_LEVEL_RANGE
    for c in PRICE_LEVEL_COUNTRIES:
        v = indices.get(c)
        if not _is_number(v):
            errors.append(f"priceLevels: index for {c} missing")
            continue
        if not lo <= v <= hi:
            errors.append(f"priceLevels: {c} index {v} outside {lo}–{hi}")
        errors += _change_errors(f"priceLevels: {c}", v, old.get(c), PRICE_LEVEL_MAX_CHANGE)
    return errors


def validate_peers(data: Any, previous: Any = None) -> list[str]:
    if not isinstance(data, dict):
        return ["peers: not an object"]
    errors = _meta_errors(data)
    indicators = data.get("indicators") if isinstance(data.get("indicators"), dict) else {}
    old_indicators = previous.get("indicators", {}) if isinstance(previous, dict) else {}
    for ind, ((lo, hi), may_be_absent) in PEER_INDICATORS.items():
        block = indicators.get(ind)
        if not isinstance(block, dict):
            errors.append(f"peers: indicator {ind} missing")
            continue
        for key in ("dataset", "url", "year", "unit"):
            if not block.get(key):
                errors.append(f"peers: {ind}.{key} missing")
        values = block.get("values") if isinstance(block.get("values"), dict) else {}
        old_values = (old_indicators.get(ind) or {}).get("values", {})
        for c in PEER_COUNTRIES:
            v = values.get(c)
            if v is None and c in may_be_absent:
                continue
            if not _is_number(v):
                errors.append(f"peers: {ind} value for {c} missing")
                continue
            if not lo <= v <= hi:
                errors.append(f"peers: {ind} {c} = {v} outside {lo}–{hi}")
            errors += _change_errors(f"peers: {ind} {c}", v, old_values.get(c), PEER_MAX_CHANGE)
    return errors


def rent_warnings(data: Any, today: date | None = None) -> list[str]:
    """Warnings only (SPEC §7): rent figures are entered by hand."""
    today = today or date.today()
    if not isinstance(data, dict) or not data.get("quarter"):
        return ["rent.json: no quarter entered yet (Spitogatos figures still to be added)"]
    m = re.fullmatch(r"(\d{4})-Q([1-4])", str(data["quarter"]))
    if not m:
        return [f"rent.json: quarter {data['quarter']!r} is not in YYYY-Qn form"]
    year, q = int(m.group(1)), int(m.group(2))
    quarter_end = date(year + (q == 4), 1 if q == 4 else 3 * q + 1, 1)
    age = (today - quarter_end).days
    if age > RENT_STALE_DAYS:
        return [f"rent.json: {data['quarter']} ended {age} days ago; check for newer Spitogatos figures"]
    return []


def main() -> int:
    checks = [
        ("fx.json", validate_fx),
        ("price-levels.json", validate_price_levels),
        ("peers.json", validate_peers),
    ]
    failed = False
    for name, check in checks:
        data = read_json(DATA / name)
        if data is None:
            print(f"::warning::{name}: not present")
            continue
        errors = check(data)
        for e in errors:
            print(f"::error::{name}: {e}")
        failed |= bool(errors)
        if not errors:
            print(f"{name}: ok")
    for w in rent_warnings(read_json(DATA / "manual" / "rent.json")):
        print(f"::warning::{w}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
