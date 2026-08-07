/**
 * Elegant per-city skyline silhouette over a warm golden-hour gradient.
 * Brand-toned, license-clean placeholder art representing each market until
 * real studio/city photography is supplied.
 */
export default function CityScene({
  city,
  className = "",
}: {
  city: string;
  className?: string;
}) {
  const scene = SCENES[city] ?? SCENES.chicago;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(180deg,#f6efe3 0%,#efe0cb 55%,#e4cfa8 100%)",
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="city-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9a463" />
            <stop offset="1" stopColor="#9c7c46" />
          </linearGradient>
        </defs>
        {/* soft sun */}
        <circle cx="312" cy="70" r="34" fill="#e9cf9c" opacity="0.55" />
        {scene}
      </svg>
    </div>
  );
}

const F = "url(#city-fill)";

const SCENES: Record<string, React.ReactNode> = {
  chicago: (
    <g fill={F}>
      <rect x="30" y="150" width="30" height="110" />
      <rect x="64" y="118" width="28" height="142" />
      <rect x="98" y="74" width="34" height="186" />
      <line x1="115" y1="74" x2="115" y2="46" stroke="#9c7c46" strokeWidth="2" />
      <rect x="138" y="132" width="26" height="128" />
      <rect x="170" y="98" width="32" height="162" />
      <rect x="208" y="58" width="30" height="202" />
      <line x1="223" y1="58" x2="223" y2="30" stroke="#9c7c46" strokeWidth="2" />
      <rect x="244" y="120" width="26" height="140" />
      <rect x="276" y="92" width="34" height="168" />
      <rect x="316" y="138" width="28" height="122" />
      <rect x="350" y="112" width="26" height="148" />
    </g>
  ),
  "new-york": (
    <g fill={F}>
      <rect x="24" y="140" width="20" height="120" />
      <rect x="48" y="112" width="18" height="148" />
      <rect x="70" y="150" width="22" height="110" />
      <rect x="96" y="120" width="20" height="140" />
      <rect x="120" y="96" width="22" height="164" />
      {/* central spire (Empire State–like) */}
      <rect x="150" y="70" width="30" height="190" />
      <rect x="160" y="48" width="10" height="24" />
      <line x1="165" y1="48" x2="165" y2="26" stroke="#9c7c46" strokeWidth="2" />
      <rect x="186" y="108" width="20" height="152" />
      <rect x="210" y="134" width="24" height="126" />
      <rect x="238" y="100" width="20" height="160" />
      <rect x="262" y="150" width="22" height="110" />
      <rect x="288" y="118" width="26" height="142" />
      <rect x="318" y="140" width="20" height="120" />
      <rect x="342" y="122" width="24" height="138" />
    </g>
  ),
  "santa-monica": (
    <g>
      {/* horizon / sea line */}
      <line x1="0" y1="176" x2="400" y2="176" stroke="#c9a463" strokeWidth="1.5" opacity="0.7" />
      {/* pier deck */}
      <line x1="30" y1="182" x2="250" y2="182" stroke="url(#city-fill)" strokeWidth="4" />
      {[46, 78, 110, 142, 174, 206, 238].map((x) => (
        <line key={x} x1={x} y1="182" x2={x} y2="230" stroke="#9c7c46" strokeWidth="2.5" />
      ))}
      {/* Ferris wheel */}
      <g stroke="url(#city-fill)" strokeWidth="2.5" fill="none">
        <circle cx="150" cy="132" r="34" />
        <circle cx="150" cy="132" r="4" fill="url(#city-fill)" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1="150"
              y1="132"
              x2={150 + 34 * Math.cos(a)}
              y2={132 + 34 * Math.sin(a)}
            />
          );
        })}
        <line x1="150" y1="132" x2="150" y2="182" strokeWidth="3" />
      </g>
      {/* palm trees */}
      {[300, 344].map((x, i) => (
        <g key={x} stroke="url(#city-fill)" strokeWidth="2.5" fill="none">
          <path d={`M${x} 230 Q ${x - 4} 190 ${x + (i ? 4 : -2)} 150`} />
          <path d={`M${x + (i ? 4 : -2)} 150 q -22 -10 -30 -2`} />
          <path d={`M${x + (i ? 4 : -2)} 150 q 22 -12 32 -2`} />
          <path d={`M${x + (i ? 4 : -2)} 150 q -12 -18 -18 -22`} />
          <path d={`M${x + (i ? 4 : -2)} 150 q 14 -16 22 -20`} />
        </g>
      ))}
    </g>
  ),
};
