import Image from "next/image";
import { Link } from "@/i18n/navigation";

/**
 * Official Love You Nail Salon logo.
 * - variant "black" for light backgrounds, "gold" for dark backgrounds.
 * - kind "lockup" = full stacked logo, "mark" = monogram only.
 * Control the display size with a height class, e.g. className="h-14".
 */
export default function Wordmark({
  variant = "black",
  kind = "lockup",
  className = "h-12",
}: {
  variant?: "black" | "gold";
  kind?: "lockup" | "mark";
  className?: string;
}) {
  const src =
    kind === "mark" ? `/brand/mark-${variant}.png` : `/brand/logo-${variant}.png`;
  const [w, h] = kind === "mark" ? [276, 408] : [373, 578];

  return (
    <Link
      href="/"
      aria-label="Love You Nail Salon — home"
      className="inline-flex shrink-0"
    >
      <Image
        src={src}
        alt="Love You Nail Salon"
        width={w}
        height={h}
        priority
        className={`w-auto ${className}`}
      />
    </Link>
  );
}
