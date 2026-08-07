import { useTranslations } from "next-intl";
import { bookingHref, mapsUrl, type DayHours, type Salon } from "@/lib/locations";

/** Collapse consecutive days that share the same hours; returns day-key ranges. */
function groupHours(hours: DayHours[]) {
  const key = (d: string) => d.slice(0, 3).toLowerCase();
  const out: { startKey: string; endKey: string | null; time: string }[] = [];
  let i = 0;
  while (i < hours.length) {
    const time = `${hours[i].open} – ${hours[i].close}`;
    let j = i;
    while (
      j + 1 < hours.length &&
      `${hours[j + 1].open} – ${hours[j + 1].close}` === time
    ) {
      j++;
    }
    out.push({
      startKey: key(hours[i].day),
      endKey: i === j ? null : key(hours[j].day),
      time,
    });
    i = j + 1;
  }
  return out;
}

export default function SalonCard({ salon }: { salon: Salon }) {
  const t = useTranslations("SalonCard");
  const href = bookingHref(salon);
  const isLink = href.startsWith("http");
  const hourRows = groupHours(salon.hours);

  return (
    <article className="grid gap-8 rounded-3xl border border-sand bg-cream p-7 md:grid-cols-[1fr_auto] md:p-9">
      <div>
        <h3 className="text-3xl text-espresso">{salon.name}</h3>

        {/* Address */}
        <p className="mt-4 flex items-start gap-3 text-brown">
          <PinIcon />
          <span>
            {salon.address}
            <br />
            {salon.city}, {salon.state} {salon.zip}
          </span>
        </p>

        {/* Phones */}
        <div className="mt-3 flex items-start gap-3 text-brown">
          <PhoneIcon />
          <span className="flex flex-col">
            {salon.phones.map((p) => (
              <a
                key={p}
                href={`tel:${p.replace(/[^\d+]/g, "")}`}
                className="transition-colors hover:text-gold-dark"
              >
                {p}
              </a>
            ))}
          </span>
        </div>

        {/* Hours */}
        <div className="mt-6">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold-dark">
            {t("workingHours")}
          </p>
          <dl className="mt-3 space-y-1.5">
            {hourRows.map((row) => (
              <div
                key={row.startKey}
                className="flex justify-between gap-6 text-sm text-brown"
              >
                <dt>
                  {row.endKey
                    ? `${t(`days.${row.startKey}`)} – ${t(`days.${row.endKey}`)}`
                    : t(`days.${row.startKey}`)}
                </dt>
                <dd className="tabular-nums">{row.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-center gap-3 md:w-48">
        {isLink ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-espresso px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold-dark"
          >
            {t("bookNow")}
          </a>
        ) : (
          <a
            href={href}
            className="inline-flex items-center justify-center rounded-full bg-espresso px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold-dark"
          >
            {t("callToBook")}
          </a>
        )}
        <a
          href={mapsUrl(salon)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-espresso/25 px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:border-gold-dark hover:text-gold-dark"
        >
          {t("directions")}
        </a>
      </div>
    </article>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
