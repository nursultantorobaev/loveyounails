import type { Metadata } from "next";
import { MEMBERSHIP_TERMS } from "@/lib/membershipTerms";

export const metadata: Metadata = {
  title: "Membership Terms & Conditions | Love You Nail Salon",
  description:
    "Love You Nail Salon membership terms & conditions — 12-month commitment, no-refund policy, non-transferable, and acknowledgment.",
};

export default function MembershipTermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">Membership</p>
      <h1 className="mt-4 text-4xl leading-tight text-espresso md:text-5xl">
        {MEMBERSHIP_TERMS.title}
      </h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/membership-terms.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full bg-espresso px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-gold-dark"
        >
          Download PDF
        </a>
      </div>

      <p className="mt-8 text-lg leading-relaxed text-brown">
        {MEMBERSHIP_TERMS.intro}
      </p>

      <div className="mt-10 space-y-8">
        {MEMBERSHIP_TERMS.sections.map((s) => (
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

      <section className="mt-12 rounded-3xl bg-ivory p-7 md:p-9">
        <h2 className="text-2xl text-espresso">Acknowledgment</h2>
        <p className="mt-3 text-brown leading-relaxed">
          {MEMBERSHIP_TERMS.acknowledgmentIntro}
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-brown leading-relaxed">
          {MEMBERSHIP_TERMS.acknowledgments.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
