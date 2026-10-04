// The committed pipeline output (src/data/*.json) must load through the same
// loaders the calculator uses, with every currency and country present.
import { describe, expect, it } from 'vitest';
import fxFile from '../../src/data/fx.json';
import peersFile from '../../src/data/peers.json';
import priceLevelsFile from '../../src/data/price-levels.json';
import {
  CURRENCIES,
  ORIGIN_COUNTRIES,
  PEER_COUNTRIES,
  PEER_INDICATORS,
  fxRate,
  loadFx,
  loadPriceLevels,
  priceLevel,
  type PeersFile,
} from '../../src/lib/data';

describe('committed data files', () => {
  it('fx.json has a rate for every origin currency', () => {
    const fx = loadFx(fxFile);
    expect(fx.status).toBe('ok');
    for (const c of CURRENCIES) expect(fxRate(fx, c).status, c).toBe('ok');
  });

  it('price-levels.json has Greece and all 8 origin countries', () => {
    const levels = loadPriceLevels(priceLevelsFile);
    expect(levels.status).toBe('ok');
    for (const c of ['GR', ...ORIGIN_COUNTRIES] as const) expect(priceLevel(levels, c).status, c).toBe('ok');
  });

  it('peers.json has every indicator for every peer country (or says why not)', () => {
    const peers = peersFile as unknown as PeersFile;
    for (const ind of PEER_INDICATORS) {
      const block = peers.indicators[ind];
      expect(block, ind).toBeDefined();
      for (const c of PEER_COUNTRIES) {
        const has = typeof block.values[c] === 'number';
        expect(has || block.notAvailable.includes(c), `${ind} ${c}`).toBe(true);
      }
    }
    expect(peers.indicators.minimumWagePps.notAvailable.sort()).toEqual(['EU27', 'IT']);
  });
});
