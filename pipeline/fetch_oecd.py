"""OECD price level indices -> src/data/price-levels.json (SPEC §6.4, §7). Runs monthly.

Source: OECD Data Explorer (SDMX), dataflow OECD.SDD.TPS,DSD_PPP@DF_PPP_CPL,1.1
("PPP detailed results, 2022 onwards: Price level indices"), measure PL (price
level), analytical category A01 (actual individual consumption), base area USA
(=100; most precise rounding; only ratios are used, so the base does not matter).
Takes the latest year in which all 9 countries have a value.
"""

from __future__ import annotations

import csv
import io
from datetime import date

from common import DATA, fail, http_get, now_iso, read_json, write_if_changed
from validate import PRICE_LEVEL_COUNTRIES, validate_price_levels

ISO3 = {"GR": "GRC", "DE": "DEU", "GB": "GBR", "NL": "NLD", "AU": "AUS", "US": "USA", "BE": "BEL", "SE": "SWE", "CY": "CYP"}
DATAFLOW = "OECD.SDD.TPS,DSD_PPP@DF_PPP_CPL,1.1"
URL = (
    f"https://sdmx.oecd.org/public/rest/data/{DATAFLOW}/"
    + "+".join(ISO3[c] for c in PRICE_LEVEL_COUNTRIES)
    + ".A.PL.A01.IX.USA?startPeriod={start}&format=csv"
)
BASIS = "OECD price level indices, actual individual consumption (AIC), USA=100"
OUT = DATA / "price-levels.json"


def fetch() -> dict:
    url = URL.format(start=date.today().year - 6)
    rows = list(csv.DictReader(io.StringIO(http_get(url, accept="text/csv").decode("utf-8"))))
    by_year: dict[str, dict[str, float]] = {}
    back = {v: k for k, v in ISO3.items()}
    for r in rows:
        if r.get("OBS_VALUE"):
            by_year.setdefault(r["TIME_PERIOD"], {})[back[r["REF_AREA"]]] = float(r["OBS_VALUE"])
    complete = sorted(y for y, v in by_year.items() if all(c in v for c in PRICE_LEVEL_COUNTRIES))
    if not complete:
        fail("priceLevels: no year with all 9 countries", [f"years seen: {sorted(by_year)}"])
    year = complete[-1]
    return {
        "source": url,
        "dataset": DATAFLOW,
        "fetchedAt": now_iso(),
        "year": int(year),
        "basis": BASIS,
        "indices": {c: by_year[year][c] for c in PRICE_LEVEL_COUNTRIES},
    }


def main() -> None:
    data = fetch()
    errors = validate_price_levels(data, read_json(OUT))
    if errors:
        fail("priceLevels: validation failed, nothing written", errors)
    write_if_changed(OUT, data)


if __name__ == "__main__":
    main()
