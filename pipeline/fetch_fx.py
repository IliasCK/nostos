"""ECB euro reference rates -> src/data/fx.json (SPEC §6.4, §7). Runs daily.

Source: ECB Data Portal API, dataset EXR, daily reference rates (2.15 pm CET),
units of currency per 1 EUR.
"""

from __future__ import annotations

import csv
import io

from common import DATA, fail, http_get, now_iso, read_json, write_if_changed
from validate import FX_CURRENCIES, validate_fx

URL = (
    "https://data-api.ecb.europa.eu/service/data/EXR/D."
    + "+".join(FX_CURRENCIES)
    + ".EUR.SP00.A?lastNObservations=1&format=csvdata"
)
OUT = DATA / "fx.json"


def fetch() -> dict:
    rows = list(csv.DictReader(io.StringIO(http_get(URL, accept="text/csv").decode("utf-8"))))
    rates = {r["CURRENCY"]: float(r["OBS_VALUE"]) for r in rows if r.get("OBS_VALUE")}
    dates = {r["TIME_PERIOD"] for r in rows}
    if len(dates) != 1:
        fail("fx: currencies have different latest dates", [str(sorted(dates))])
    return {
        "source": URL,
        "fetchedAt": now_iso(),
        "date": dates.pop(),
        "base": "EUR",
        "rates": {c: rates.get(c) for c in FX_CURRENCIES},
    }


def main() -> None:
    data = fetch()
    errors = validate_fx(data, read_json(OUT))
    if errors:
        fail("fx: validation failed, nothing written", errors)
    write_if_changed(OUT, data)


if __name__ == "__main__":
    main()
