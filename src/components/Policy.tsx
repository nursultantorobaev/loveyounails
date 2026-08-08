export interface PolicySection {
  title: string;
  paragraphs: string[];
}

/** Shared layout for legal / policy pages. */
export default function Policy({
  eyebrow = "Policies",
  title,
  intro,
  sections,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  sections: PolicySection[];
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 text-5xl uppercase leading-tight text-espresso">{title}</h1>
      {intro && (
        <p className="mt-6 text-lg text-brown leading-relaxed">{intro}</p>
      )}

      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-2xl text-espresso">{s.title}</h2>
            <div className="mt-3 space-y-3 text-brown leading-relaxed">
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
