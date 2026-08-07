// Sample products for the upcoming Love You professional line.
// Preview only — checkout is not wired yet (foundation for future e-commerce).

export type ProductKind = "bottle" | "dropper" | "file" | "jar" | "spray";

export interface Product {
  slug: string;
  name: string;
  variant?: string;
  category: string;
  price: number;
  description: string;
  kind: ProductKind;
}

export const PRODUCTS: Product[] = [
  {
    slug: "signature-gel-polish-ballet-blush",
    name: "Signature Gel Polish",
    variant: "Ballet Blush",
    category: "Gel Polish",
    price: 18,
    description:
      "Long-wear, high-shine gel colour in a soft, flattering nude pink. Chip-resistant for weeks.",
    kind: "bottle",
  },
  {
    slug: "high-shine-top-coat",
    name: "High-Shine Top Coat",
    category: "Gel Polish",
    price: 16,
    description:
      "A glass-like finishing coat that locks in colour and adds mirror shine to any manicure.",
    kind: "bottle",
  },
  {
    slug: "nourishing-cuticle-oil",
    name: "Nourishing Cuticle Oil",
    category: "Nail Care",
    price: 14,
    description:
      "A lightweight blend of jojoba and vitamin E that softens cuticles and conditions the nail.",
    kind: "dropper",
  },
  {
    slug: "crystal-glass-nail-file",
    name: "Crystal Glass Nail File",
    category: "Tools",
    price: 12,
    description:
      "A gentle, precise glass file that shapes without splitting — a salon essential for home.",
    kind: "file",
  },
  {
    slug: "repair-hand-nail-cream",
    name: "Repair Hand & Nail Cream",
    category: "Nail Care",
    price: 15,
    description:
      "A rich, fast-absorbing cream that nourishes hands and strengthens nails between visits.",
    kind: "jar",
  },
];
