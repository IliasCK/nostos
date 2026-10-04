"""Eurostat indicators for the Greece vs peers page -> src/data/peers.json (SPEC §8). Runs monthly.

Source: Eurostat dissemination API (JSON-stat 2.0). Every dataset code and
filter below was checked against the live API; see docs/sources.md.
For each indicator, the latest period in which every required country has a
value is used, so the chart compares like with like.
"""

from __future__ import annotations

import json
import urllib.parse

from common import DATA, fail, http_get, now_iso, read_json, write_if_changed
from validate import PEER_COUNTRIES, PEER_INDICATORS, validate_peers

API = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/"
GEO = {"GR": "EL", "BG": "BG", "RO": "RO", "PT": "PT", "ES": "ES", "IT": "IT", "EU27": "EU27_2020"}

INDICATORS = {
    "gdpPerCapitaPps": {
        "dataset": "nama_10_pc",
        "filters": {"unit": "CP_PPS_EU27_2020_HAB", "na_item": "B1GQ"},
        "unit": "PPS (EU27_2020) per inhabitant, current prices",
        "label": "GDP per capita in PPS",
    },
    "aicPerCapitaPps": {
        "dataset": "prc_ppp_ind",
        "filters": {"na_item": "EXP_PPS_EU27_2020_HAB", "ppp_cat": "A01"},
        "unit": "PPS (EU27_2020) per inhabitant",
        "label": "Actual individual consumption per capita in PPS",
    },
    "netEarningsPps": {
        "dataset": "earn_nt_net",
        "filters": {"currency": "PPS", "estruct": "NET", "ecase": "P1_NCH_AW100"},
        "unit": "PPS per year, single person without children earning 100% of the average wage",
        "label": "Annual net earnings in PPS",
    },
    "priceLevelIndex": {
        "dataset": "prc_ppp_ind",
        "filters": {"na_item": "PLI_EU27_2020", "ppp_cat": "A01"},
        "unit": "Index, EU27_2020 = 100 (actual individual consumption)",
        "label": "Price level index",
    },
    "housingCostOverburden": {
        "dataset": "ilc_lvho07a",
        "filters": {"unit": "PC", "age": "TOTAL", "sex": "T", "rskpovth": "TOTAL"},
        "unit": "% of population",
        "label": "Housing cost overburden rate",
    },
    "minimumWagePps": {
        "dataset": "earn_mw_cur",
        "filters": {"currency": "PPS"},
        "unit": "PPS per month",
        "label": "Monthly minimum wage in PPS",
    },
}
OUT = DATA / "peers.json"


def url_for(spec: dict) -> str:
    query = [("format", "JSON"), ("lang", "EN")] + [("geo", g) for g in GEO.values()] + list(spec["filters"].items())
    return API + spec["dataset"] + "?" + urllib.parse.urlencode(query)


def series_by_period(raw: dict) -> dict[str, dict[str, float]]:
    """JSON-stat → {period: {country: value}}. All non-geo/time dimensions are fixed by the filters."""
    dims, size = raw["id"], raw["size"]
    for dim, n in zip(dims, size):
        if dim not in ("geo", "time") and n != 1:
            raise ValueError(f"dimension {dim} not fixed by filters ({n} values)")
    strides = [1] * len(size)
    for i in range(len(size) - 2, -1, -1):
        strides[i] = strides[i + 1] * size[i + 1]
    geo_pos, time_pos = dims.index("geo"), dims.index("time")
    geos = {v: k for k, v in raw["dimension"]["geo"]["category"]["index"].items()}
    times = {v: k for k, v in raw["dimension"]["time"]["category"]["index"].items()}
    back = {v: k for k, v in GEO.items()}
    out: dict[str, dict[str, float]] = {}
    for key, value in raw.get("value", {}).items():
        k = int(key)
        geo = geos[(k // strides[geo_pos]) % size[geo_pos]]
        period = times[(k // strides[time_pos]) % size[time_pos]]
        out.setdefault(period, {})[back[geo]] = value
    return out


def fetch() -> dict:
    indicators = {}
    errors: list[str] = []
    for ind, spec in INDICATORS.items():
        url = url_for(spec)
        try:
            by_period = series_by_period(json.loads(http_get(url, accept="application/json")))
        except Exception as e:  # noqa: BLE001 - report every failing indicator
            errors.append(f"{ind} ({spec['dataset']}): {e}")
            continue
        absent_ok = PEER_INDICATORS[ind][1]
        required = [c for c in PEER_COUNTRIES if c not in absent_ok]
        complete = sorted(p for p, v in by_period.items() if all(c in v for c in required))
        if not complete:
            errors.append(f"{ind}: no period with all of {required}")
            continue
        period = complete[-1]
        indicators[ind] = {
            "label": spec["label"],
            "dataset": spec["dataset"],
            "filters": spec["filters"],
            "url": url,
            "unit": spec["unit"],
            "year": period,
            "values": {c: by_period[period].get(c) for c in PEER_COUNTRIES if c in by_period[period]},
            "notAvailable": [c for c in PEER_COUNTRIES if c not in by_period[period]],
        }
    if errors:
        fail("peers: fetching failed, nothing written", errors)
    return {"source": API, "fetchedAt": now_iso(), "countries": PEER_COUNTRIES, "indicators": indicators}


def main() -> None:
    data = fetch()
    errors = validate_peers(data, read_json(OUT))
    if errors:
        fail("peers: validation failed, nothing written", errors)
    write_if_changed(OUT, data)


if __name__ == "__main__":
    main()
