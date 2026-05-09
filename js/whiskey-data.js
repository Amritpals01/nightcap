/**
 * basePriceCAD = approximate BC retail reference (750 ml unless noted).
 * Selling price = base × 1.4 (40% markup), rounded to nearest dollar.
 */
const WHISKEY_MARKUP = 1.4;

const WHISKEY_ITEMS = [
  {
    id: 'johnnie-walker-black',
    name: 'Johnnie Walker Black Label',
    size: '750 ml',
    basePrice: 48,
    badge: 'Popular',
    desc: 'Smooth blended Scotch — iconic depth and balance.',
    image: 'images/whiskey/johnnie-walker-black.jpg',
  },
  {
    id: 'glenfiddich-12',
    name: 'Glenfiddich 12',
    size: '750 ml',
    basePrice: 68,
    badge: null,
    desc: 'Speyside single malt — pear, oak, and honey.',
    image: 'images/whiskey/glenfiddich-12.jpg',
  },
  {
    id: 'lagavulin-16',
    name: 'Lagavulin 16',
    size: '750 ml',
    basePrice: 135,
    badge: 'Peated',
    desc: 'Islay smoke and maritime sweetness — a cult classic.',
    image: 'images/whiskey/lagavulin-16.jpg',
  },
  {
    id: 'jameson',
    name: 'Jameson Irish Whiskey',
    size: '750 ml',
    basePrice: 36,
    badge: null,
    desc: 'Triple-distilled Irish — easygoing and versatile.',
    image: 'images/whiskey/jameson.jpg',
  },
  {
    id: 'buffalo-trace',
    name: 'Buffalo Trace',
    size: '750 ml',
    basePrice: 42,
    badge: 'Bourbon',
    desc: 'Kentucky straight bourbon — caramel and spice.',
    image: 'images/whiskey/buffalo-trace.jpg',
  },
  {
    id: 'yamazaki-12',
    name: 'Yamazaki 12',
    size: '750 ml',
    basePrice: 185,
    badge: 'Japanese',
    desc: 'Japanese single malt — layered fruit and Mizunara oak.',
    image: 'images/whiskey/yamazaki-12.jpg',
  },
];

function sellingPrice(base) {
  return Math.round(base * WHISKEY_MARKUP);
}

/** Shelf SKUs for non-whisky categories (prices already include service markup). */
const OTHER_ITEMS = [
  { id: 'champagne-tier', name: 'Sparkling & Prosecco', price: 63 },
  { id: 'wine-tier', name: 'Wine (750 ml tier)', price: 31 },
  { id: 'beer-tier', name: 'Beer & cider (six-pack tier)', price: 22 },
];
