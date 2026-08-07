import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Credits | Love You Nail Salon",
};

interface Credit {
  subject: string;
  author: string;
  license: string;
  licenseUrl?: string;
  sourceUrl: string;
}

const CREDITS: Credit[] = [
  {
    subject: "Chicago skyline",
    author: "Marie Miller",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Chicago-skyline-lake-burnham.jpg",
  },
  {
    subject: "Manhattan skyline, New York",
    author: "Percival Kestreltail",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Lower_Manhattan,_New_York_skyline_from_Liberty_Island_2021.jpg",
  },
  {
    subject: "Santa Monica Pier",
    author: "Jelson25",
    license: "Public domain",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Aerial_Photo_of_Santa_Monica_Pier.jpg",
  },
];

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">Credits</p>
      <h1 className="mt-4 text-4xl leading-tight text-espresso md:text-5xl">
        Image Credits
      </h1>
      <p className="mt-6 text-brown leading-relaxed">
        City photography is used under the licenses below, via Wikimedia Commons.
      </p>
      <ul className="mt-8 space-y-5">
        {CREDITS.map((c) => (
          <li key={c.subject} className="text-brown">
            <span className="text-espresso">{c.subject}</span> — {c.author},{" "}
            {c.licenseUrl ? (
              <a
                href={c.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-dark underline underline-offset-4"
              >
                {c.license}
              </a>
            ) : (
              c.license
            )}
            .{" "}
            <a
              href={c.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-dark underline underline-offset-4"
            >
              Source
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
