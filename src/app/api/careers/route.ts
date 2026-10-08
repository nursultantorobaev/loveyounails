// Receives a job application from the Careers form and emails it (with the
// résumé attached) to the hiring inbox via Resend's HTTP API.
//
// Env (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   required — without it the endpoint answers 503 and the form
//                    tells the candidate to email the hiring address directly.
//   CAREERS_TO       optional, default loveyouhires@gmail.com
//   CAREERS_FROM     optional, default "Love You Careers <onboarding@resend.dev>".
//                    Resend's shared onboarding@ sender can only deliver to the
//                    email the Resend account was created with, so create the
//                    account with the hiring inbox (or verify loveyou.club and
//                    set e.g. "Love You Careers <careers@loveyou.club>").

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TO = process.env.CAREERS_TO ?? "loveyouhires@gmail.com";
const FROM = process.env.CAREERS_FROM ?? "Love You Careers <onboarding@resend.dev>";
const MAX_FILE = 4 * 1024 * 1024; // Vercel caps request bodies at ~4.5 MB
const FILE_TYPES = /\.(pdf|docx?|png|jpe?g|heic)$/i;
const MIN_FILL_MS = 3000; // bots submit instantly

// Best-effort rate limit per IP (per serverless instance).
const recent = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const field = (fd: FormData, k: string, max = 300) => String(fd.get(k) ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Spam traps: a hidden field humans leave empty, and a minimum fill time.
  const startedAt = Number(fd.get("startedAt") ?? 0);
  if (field(fd, "company") || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true }); // pretend success, send nothing
  }

  const app = {
    name: field(fd, "name", 120),
    email: field(fd, "email", 200),
    phone: field(fd, "phone", 40),
    position: field(fd, "position", 120),
    city: field(fd, "city", 80),
    experience: field(fd, "experience", 80),
    portfolio: field(fd, "portfolio", 300),
    message: field(fd, "message", 3000),
    locale: field(fd, "locale", 5),
  };
  if (!app.name || !app.position || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Where they worked in the last 1–3 years: at least one salon (name + address)
  // unless they ticked "no salon experience yet".
  const noSalonExperience = fd.get("noSalonExperience") === "on";
  const salons = Array.from({ length: 3 }, (_, i) => ({
    salon: field(fd, `work_${i}_salon`, 120),
    address: field(fd, `work_${i}_address`, 200),
    period: field(fd, `work_${i}_period`, 40),
  })).filter((w) => w.salon || w.address);
  if (!noSalonExperience && !salons.some((w) => w.salon && w.address)) {
    return NextResponse.json({ ok: false, error: "work" }, { status: 400 });
  }

  const attachments: { filename: string; content: string }[] = [];
  const resume = fd.get("resume");
  if (resume instanceof File && resume.size > 0) {
    if (resume.size > MAX_FILE || !FILE_TYPES.test(resume.name)) {
      return NextResponse.json({ ok: false, error: "file" }, { status: 400 });
    }
    attachments.push({
      filename: resume.name.replace(/[^\w.\- ]+/g, "_").slice(0, 100),
      content: Buffer.from(await resume.arrayBuffer()).toString("base64"),
    });
  }

  const rows: [string, string][] = [
    ["Position", app.position],
    ["City", app.city],
    ["Name", app.name],
    ["Email", app.email],
    ["Phone", app.phone],
    ["Experience", app.experience],
    ["Portfolio / Instagram", app.portfolio],
    ["Site language", app.locale],
    ["Résumé", attachments.length ? attachments[0].filename : "—"],
  ];
  const html =
    `<h2 style="font-family:Georgia,serif">New job application — ${esc(app.position)}</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
    rows.map(([k, v]) => `<tr><td style="color:#8c7b6a">${k}</td><td>${esc(v || "—")}</td></tr>`).join("") +
    `</table>` +
    `<h3 style="font-family:Georgia,serif;margin-top:18px">Salons worked at (last 1–3 years)</h3>` +
    (noSalonExperience
      ? `<p style="font-family:Arial,sans-serif;font-size:14px">No salon experience yet.</p>`
      : `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
        `<tr style="color:#8c7b6a"><td>Salon</td><td>Address</td><td>Period</td></tr>` +
        salons.map((w) => `<tr><td>${esc(w.salon || "—")}</td><td>${esc(w.address || "—")}</td><td>${esc(w.period || "—")}</td></tr>`).join("") +
        `</table>`) +
    (app.message ? `<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${esc(app.message)}</p>` : "") +
    `<p style="font-family:Arial,sans-serif;font-size:12px;color:#8c7b6a">Sent from the Careers page on loveyou.club. Reply to this email to answer the candidate.</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: app.email,
      subject: `Job application: ${app.position}${app.city ? ` (${app.city})` : ""} — ${app.name}`,
      html,
      attachments,
    }),
    signal: AbortSignal.timeout(15000),
  }).catch(() => null);

  if (!res?.ok) {
    console.error("careers: resend failed", res?.status, res ? await res.text() : "network");
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
