// Brand-standard price list. Verified identical on the Santa Monica and New York
// sites (2026-08-06); Chicago does not publish prices online, so it inherits this
// list until the client confirms Chicago-specific pricing.
//
// `from: true` means "starting from" (final price depends on length/detail).

export interface PriceItem {
  name: string;
  price: number;
  from?: boolean;
  note?: string;
}

export interface PriceCategory {
  title: string;
  items: PriceItem[];
}

export const PRICE_LIST: PriceCategory[] = [
  {
    title: "Manicures",
    items: [
      {
        name: "Russian Gel Manicure",
        price: 90,
        from: true,
        note: "Gel removal included",
      },
      { name: "Hard Gel Manicure", price: 120, from: true },
      {
        name: "Regular Manicure",
        price: 60,
        note: "Dazzle Dry brand",
      },
      { name: "Manicure for Men", price: 55, from: true },
    ],
  },
  {
    title: "Pedicures",
    items: [
      { name: "Russian Gel Pedicure", price: 90, from: true },
      {
        name: "Regular Pedicure",
        price: 80,
        note: "Dazzle-Dry brand",
      },
    ],
  },
  {
    title: "Mani & Pedi Combos",
    items: [
      {
        name: "Russian Gel Mani & Smart Pedi",
        price: 210,
        note: "Same time — two technicians",
      },
      { name: "Russian Gel Mani & Regular Pedi", price: 170 },
      {
        name: "Regular Polish Mani & Smart Pedi",
        price: 150,
        note: "Same time, Russian technique",
      },
      {
        name: "Combo Mani & Pedi",
        price: 135,
        note: "Dazzle-Dry brand",
      },
      { name: "Kids Mani & Pedi", price: 60 },
    ],
  },
  {
    title: "Extensions & Add-Ons",
    items: [
      { name: "Gel Extension", price: 180, from: true },
      { name: "Nail Art", price: 25, from: true },
      { name: "Gel Removal", price: 20, from: true },
    ],
  },
];
