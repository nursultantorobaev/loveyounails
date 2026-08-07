import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Policy, { type PolicySection } from "@/components/Policy";

export const metadata: Metadata = {
  title: "Privacy Policy | Love You Nail Salon",
  description:
    "How Love You Nail Salon collects, uses and protects your personal information.",
};

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
