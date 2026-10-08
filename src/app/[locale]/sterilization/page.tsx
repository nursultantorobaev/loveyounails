import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Button from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Sterilization" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function SterilizationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SterilizationContent />;
}

type Step = { title: string; body: string };

// Linked from the "Sterility" word in the home page Advantages block.
function SterilizationContent() {
  const t = useTranslations("Sterilization");
  const steps = t.raw("steps") as Step[];

  return (
    <>
      {/* Hero: the autoclave video behind the title */}
      <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-espresso">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/media/sterilization/sterilization.mp4"
          poster="/media/sterilization/sterilization-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/55 to-espresso/25" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 md:px-8 md:pb-20">
          <p className="eyebrow !text-gold">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[1.05] text-cream md:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cream/85">{t("lead")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        {/* Intro */}
        <div className="grid gap-6 text-brown leading-relaxed md:grid-cols-2 md:gap-12">
          <p>{t("intro1")}</p>
          <p>{t("intro2")}</p>
        </div>

        {/* Steps */}
        <section className="mt-20">
          <h2 className="text-3xl text-espresso md:text-4xl">{t("stepsTitle")}</h2>
          <ol className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-sand pt-6">
                <span className="font-display text-4xl text-gold-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-medium text-espresso">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brown">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Fresh set + closing */}
        <section className="mt-20 rounded-3xl bg-espresso px-6 py-14 text-center text-cream md:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl leading-tight md:text-4xl">{t("freshTitle")}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-cream/75 leading-relaxed">{t("freshBody")}</p>
          <p className="mx-auto mt-8 max-w-xl font-display text-2xl italic text-gold">{t("closing")}</p>
          <div className="mt-10">
            <Button href="/locations" variant="light">
              {t("cta")}
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
