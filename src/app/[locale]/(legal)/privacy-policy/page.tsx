import type { Metadata } from "next";
import { localizedMeta } from "@/lib/seo";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Policy, { type PolicySection } from "@/components/Policy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedMeta(locale, "privacy", "/privacy-policy");
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations("Privacy");
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
