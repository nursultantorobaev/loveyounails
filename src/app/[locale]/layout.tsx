import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cormorant, Manrope } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrandIntro from "@/components/BrandIntro";

// Match the original Love You sites: Cormorant (display) + Manrope (body/nav).
const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const SITE_TITLE = "Love You Nail Salon | Premium Manicure & Pedicure";
const SITE_DESC =
  "Love You Nail Salon — premium Russian e-file manicure and smart pedicure with medical-grade sterility. Locations in Chicago, New York and Santa Monica. Book online today.";

export const metadata: Metadata = {
  metadataBase: new URL("https://loveyou.club"),
  title: SITE_TITLE,
  description: SITE_DESC,
  icons: {
    icon: "/brand/mark-gold.png",
    apple: "/brand/mark-gold.png",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: "https://loveyou.club",
    siteName: "Love You Nail Salon",
    type: "website",
    images: [
      {
        url: "/media/photos/nails-nude-macro.png",
        width: 1948,
        height: 1596,
        alt: "Love You Nail Salon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/media/photos/nails-nude-macro.png"],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <BrandIntro />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
