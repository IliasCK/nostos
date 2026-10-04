"""Run with: python -m unittest discover -s pipeline/tests -p 'test_*.py'"""

import copy
import json
import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import common  # noqa: E402
from validate import rent_warnings, validate_fx, validate_peers, validate_price_levels  # noqa: E402

TODAY = date(2026, 10, 4)
FX = {"source": "s", "fetchedAt": "t", "date": "2026-10-02", "base": "EUR", "rates": {"GBP": 0.85, "USD": 1.12, "AUD": 1.62, "SEK": 11.3}}
PL = {"source": "s", "fetchedAt": "t", "year": 2024, "basis": "b", "indices": {c: 80.0 for c in ["GR", "DE", "GB", "NL", "AU", "US", "BE", "SE", "CY"]}}


def peers():
    vals = lambda v: {c: v for c in ["GR", "BG", "RO", "PT", "ES", "IT", "EU27"]}  # noqa: E731
    block = lambda v: {"dataset": "d", "url": "u", "year": "2025", "unit": "x", "values": vals(v)}  # noqa: E731
    mw = block(1200)
    del mw["values"]["IT"], mw["values"]["EU27"]
    return {"source": "s", "fetchedAt": "t", "indicators": {
        "gdpPerCapitaPps": block(30000), "aicPerCapitaPps": block(20000), "netEarningsPps": block(20000),
        "priceLevelIndex": block(80), "housingCostOverburden": block(10), "minimumWagePps": mw}}


class FxTest(unittest.TestCase):
    def test_valid(self):
        self.assertEqual(validate_fx(FX, FX, TODAY), [])

    def test_missing_currency(self):
        d = copy.deepcopy(FX); del d["rates"]["SEK"]
        self.assertIn("fx: rate for SEK missing", validate_fx(d, None, TODAY))

    def test_out_of_range(self):
        d = copy.deepcopy(FX); d["rates"]["GBP"] = 8.5
        self.assertTrue(any("outside" in e for e in validate_fx(d, None, TODAY)))

    def test_change_band(self):
        d = copy.deepcopy(FX); d["rates"]["USD"] = 1.12 * 1.25
        self.assertTrue(any("25% change" in e for e in validate_fx(d, FX, TODAY)))
        d["rates"]["USD"] = 1.12 * 1.19
        self.assertEqual(validate_fx(d, FX, TODAY), [])

    def test_future_date(self):
        d = copy.deepcopy(FX); d["date"] = "2026-12-01"
        self.assertTrue(any("future" in e for e in validate_fx(d, None, TODAY)))


class PriceLevelTest(unittest.TestCase):
    def test_valid(self):
        self.assertEqual(validate_price_levels(PL, PL, TODAY), [])

    def test_missing_country(self):
        d = copy.deepcopy(PL); del d["indices"]["CY"]
        self.assertIn("priceLevels: index for CY missing", validate_price_levels(d, None, TODAY))

    def test_change_band_only_on_same_basis(self):
        d = copy.deepcopy(PL); d["indices"]["GR"] = 120.0
        self.assertTrue(validate_price_levels(d, PL, TODAY))
        other = dict(PL, basis="different")
        self.assertEqual(validate_price_levels(d, other, TODAY), [])


class PeersTest(unittest.TestCase):
    def test_valid_with_minimum_wage_gaps(self):
        self.assertEqual(validate_peers(peers()), [])

    def test_missing_required_country(self):
        d = peers(); del d["indicators"]["gdpPerCapitaPps"]["values"]["GR"]
        self.assertIn("peers: gdpPerCapitaPps value for GR missing", validate_peers(d))

    def test_missing_indicator(self):
        d = peers(); del d["indicators"]["housingCostOverburden"]
        self.assertIn("peers: indicator housingCostOverburden missing", validate_peers(d))

    def test_change_band(self):
        new = peers(); new["indicators"]["priceLevelIndex"]["values"]["RO"] = 120
        self.assertTrue(any("RO" in e for e in validate_peers(new, peers())))


class RentTest(unittest.TestCase):
    def test_not_entered(self):
        self.assertEqual(len(rent_warnings({"quarter": None}, TODAY)), 1)

    def test_fresh(self):
        self.assertEqual(rent_warnings({"quarter": "2026-Q2"}, TODAY), [])  # ended 30 Jun, 96 days

    def test_stale(self):
        self.assertTrue(rent_warnings({"quarter": "2026-Q1"}, TODAY))  # ended 31 Mar

    def test_q4_rollover(self):
        self.assertEqual(rent_warnings({"quarter": "2025-Q4"}, date(2026, 3, 1)), [])

    def test_malformed(self):
        self.assertTrue(rent_warnings({"quarter": "Q2 2026"}, TODAY))


class WriteIfChangedTest(unittest.TestCase):
    def test_timestamp_only_change_is_not_written(self):
        with tempfile.TemporaryDirectory() as d:
            common.ROOT = Path(d)
            path = Path(d) / "x.json"
            self.assertTrue(common.write_if_changed(path, {"fetchedAt": "1", "v": 1}))
            self.assertFalse(common.write_if_changed(path, {"fetchedAt": "2", "v": 1}))
            self.assertEqual(json.loads(path.read_text())["fetchedAt"], "1")
            self.assertTrue(common.write_if_changed(path, {"fetchedAt": "3", "v": 2}))


if __name__ == "__main__":
    unittest.main()
