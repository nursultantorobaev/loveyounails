// Job openings for the Careers page. Admins post them in a "Careers" tab of the
// shared Google Sheet (the same file as promos and hours); the page re-reads it
// every 10 minutes, so a new row shows up on the site without a deploy.
//
// Columns (header row, any order, EN or RU names):
//   Position | City | Studio | Type | Description | Active
// "Active" = yes/да/true/1 (blank also counts as active). Rows with Active = no are hidden.
//
// If the tab has no rows at all, or the sheet can't be read, the page shows the
// default openings from messages/*.json. To show "no open positions", keep the
// rows and set Active = no.

/** CSV export of the "Careers" tab (same file as promos/hours). Override with CAREERS_CSV_URL. */
const CAREERS_CSV_URL =
  process.env.CAREERS_CSV_URL ??
  "https://docs.google.com/spreadsheets/d/1UwWAaKHOJ1RsQ3SZ9SVqLktjZBaovflr/export?format=csv&gid=1772101724";

export interface Opening {
  position: string;
  city: string;
  studio: string;
  type: string;
  description: string;
}

/** Quote-aware CSV parser (commas/newlines/"" inside quoted fields). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false;
      } else field += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (ch !== "\r") field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const COLUMNS: Record<keyof Opening | "active", RegExp> = {
  position: /^(position|title|role|job|должность|вакансия)$/i,
  city: /^(city|город)$/i,
  studio: /^(studio|location|salon|студия|локация)$/i,
  type: /^(type|schedule|тип|график)$/i,
  description: /^(description|details|описание)$/i,
  active: /^(active|активна|активно)$/i,
};

/**
 * Openings from the sheet, or `null` when the sheet isn't set up / can't be
 * read / doesn't look like a Careers tab / has no rows yet — the page then uses
 * its defaults. An empty array means rows exist but all are Active = no.
 */
export async function getOpenings(): Promise<Opening[] | null> {
  if (!CAREERS_CSV_URL) return null;
  try {
    const res = await fetch(CAREERS_CSV_URL, { next: { revalidate: 600 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const [header, ...rows] = parseCsv(await res.text());
    if (!header) return null;
    const col = Object.fromEntries(
      Object.entries(COLUMNS).map(([key, re]) => [key, header.findIndex((h) => re.test(h.trim()))]),
    ) as Record<keyof typeof COLUMNS, number>;
    if (col.position < 0) return null; // not a Careers tab
    const cell = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");
    const listed = rows.filter((r) => cell(r, col.position));
    if (!listed.length) return null; // empty tab → defaults
    return listed
      .filter((r) => !/^(no|нет|false|0)$/i.test(cell(r, col.active)))
      .map((r) => ({
        position: cell(r, col.position),
        city: cell(r, col.city),
        studio: cell(r, col.studio),
        type: cell(r, col.type),
        description: cell(r, col.description),
      }));
  } catch {
    return null;
  }
}
