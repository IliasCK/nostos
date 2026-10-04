// Build-time access to src/data/*.json. Files that don't exist yet (fx.json,
// price-levels.json before M5) simply come back as undefined.
const files = import.meta.glob<unknown>(['../../data/*.json', '../../data/manual/*.json'], {
  eager: true,
  import: 'default',
});

export const rawData = {
  fx: files['../../data/fx.json'],
  priceLevels: files['../../data/price-levels.json'],
  rent: files['../../data/manual/rent.json'],
};
