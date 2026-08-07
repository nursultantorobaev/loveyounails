// Brand-standard price list (identical on the SM + NY sites; Chicago inherits it).
// `from: true` means "starting from". Text (names/notes/category titles) lives in
// the message catalogs, keyed by `key` / `id`.

export interface PriceItem {
  id: string;
  price: number;
  from?: boolean;
}

export interface PriceCategory {
  key: string;
  items: PriceItem[];
}

export const PRICE_LIST: PriceCategory[] = [
  {
    key: "manicures",
    items: [
      { id: "russian-gel-mani", price: 90, from: true },
      { id: "hard-gel-mani", price: 120, from: true },
      { id: "regular-mani", price: 60 },
      { id: "mani-men", price: 55, from: true },
    ],
  },
  {
    key: "pedicures",
    items: [
      { id: "russian-gel-pedi", price: 90, from: true },
      { id: "regular-pedi", price: 80 },
    ],
  },
  {
    key: "combos",
    items: [
      { id: "combo-russian-smart", price: 210 },
      { id: "combo-russian-regular", price: 170 },
      { id: "combo-polish-smart", price: 150 },
      { id: "combo-dazzle", price: 135 },
      { id: "kids", price: 60 },
    ],
  },
  {
    key: "extensions",
    items: [
      { id: "gel-extension", price: 180, from: true },
      { id: "nail-art", price: 25, from: true },
      { id: "gel-removal", price: 20, from: true },
    ],
  },
];
