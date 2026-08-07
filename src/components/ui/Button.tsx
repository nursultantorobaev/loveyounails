import Link from "next/link";

type Variant = "solid" | "outline" | "light" | "glass";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-colors";

const variants: Record<Variant, string> = {
  solid: "bg-espresso text-cream hover:bg-gold-dark",
  outline:
    "border border-espresso/25 text-espresso hover:border-gold-dark hover:text-gold-dark",
  light: "bg-cream text-espresso hover:bg-gold hover:text-espresso",
  glass:
    "border border-cream/50 text-cream backdrop-blur-sm hover:bg-cream hover:text-espresso",
};

export default function Button({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
