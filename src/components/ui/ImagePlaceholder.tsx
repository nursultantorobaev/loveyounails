/**
 * Photo-ready placeholder. Real imagery drops in later (public/… or a CMS);
 * for now it renders a soft branded gradient so layouts read as premium.
 */
export default function ImagePlaceholder({
  label,
  className = "",
  rounded = "rounded-3xl",
}: {
  label?: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${rounded} ${className}`}
      style={{
        background:
          "linear-gradient(135deg, #f4ece0 0%, #e9dccb 45%, #dbc7a8 100%)",
      }}
      aria-hidden={label ? undefined : true}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8 text-gold/50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M12 20s-7-4.35-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.65 12 20 12 20z" />
      </svg>
      {label && (
        <span className="absolute bottom-3 right-4 text-[0.6rem] uppercase tracking-[0.2em] text-brown/40">
          {label}
        </span>
      )}
    </div>
  );
}
