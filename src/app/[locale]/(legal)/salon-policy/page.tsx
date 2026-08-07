import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Policy, { type PolicySection } from "@/components/Policy";

export const metadata: Metadata = {
  title: "Salon Policy | Love You Nail Salon",
  description:
    "Love You Nail Salon appointment, cancellation, payment, refund and salon policies.",
};

export default async function SalonPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SalonContent />;
}

function SalonContent() {
  const t = useTranslations("Salon");
  const sections = t.raw("sections") as PolicySection[];
  return (
    <Policy
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      sections={sections}
    />
  );
}
