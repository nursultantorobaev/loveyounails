import type { ProductKind } from "@/lib/products";

/**
 * Brand-toned line-art product illustration placeholder, per product type.
 * Swap for real product photography when available.
 */
export default function ProductImage({
  kind,
  className = "",
}: {
  kind: ProductKind;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: "linear-gradient(160deg,#f6efe3,#ece0cd)" }}
    >
      <svg
        viewBox="0 0 120 120"
        className="h-1/2 w-1/2 text-gold-dark"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ICONS[kind]}
      </svg>
    </div>
  );
}

const ICONS: Record<ProductKind, React.ReactNode> = {
  // nail polish bottle with brush cap
  bottle: (
    <>
      <rect x="46" y="20" width="28" height="14" rx="2" />
      <line x1="60" y1="34" x2="60" y2="44" />
      <path d="M42 60c0-9 6-16 18-16s18 7 18 16v34a6 6 0 0 1-6 6H48a6 6 0 0 1-6-6V60z" />
      <line x1="42" y1="70" x2="78" y2="70" />
    </>
  ),
  // dropper / serum bottle
  dropper: (
    <>
      <path d="M50 18h20M60 18v10" />
      <rect x="52" y="28" width="16" height="10" rx="2" />
      <path d="M46 46c0-5 4-8 14-8s14 3 14 8v42a8 8 0 0 1-8 8H54a8 8 0 0 1-8-8V46z" />
      <line x1="60" y1="58" x2="60" y2="84" />
    </>
  ),
  // glass nail file
  file: (
    <>
      <rect x="40" y="18" width="16" height="84" rx="8" transform="rotate(20 48 60)" />
      <line x1="52" y1="30" x2="66" y2="86" />
    </>
  ),
  // cream jar
  jar: (
    <>
      <rect x="34" y="30" width="52" height="12" rx="3" />
      <path d="M38 42h44v42a8 8 0 0 1-8 8H46a8 8 0 0 1-8-8V42z" />
      <path d="M52 62c4-4 12-4 16 0" />
    </>
  ),
  // spray bottle
  spray: (
    <>
      <path d="M40 20h14v10H40z" />
      <path d="M54 24h10l-4 6h-6" />
      <path d="M40 42c0-7 4-12 14-12s14 5 14 12v48a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V42z" />
    </>
  ),
};
