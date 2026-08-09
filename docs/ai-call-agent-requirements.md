# Love You Nail Salon — AI Call Agent
## What we need from the Owner & Admins to begin

**Goal:** an AI phone assistant that answers calls 24/7 in **English, Russian, and
Spanish** — booking, rescheduling, answering questions, and handing off to staff
when needed. Phone is ~60% of all customer contact, so this is the highest-impact
automation.

**How it starts (low risk):** the AI runs as **after-hours + overflow** first — your
team still answers normally; the AI only catches calls they'd otherwise miss. Once
proven at one studio, we expand.

**Key technical fact:** Chicago & New York run on **Square** (full booking API →
fully automatable). Santa Monica runs on **Fresha**, which has **no public booking
API** — there the AI answers and quotes, then **texts the booking request to staff**.

Legend: 🔴 blocks the pilot · 🟡 needed soon · 🟢 helpful

---

## 👤 From the OWNER

**Access & accounts**
- 🔴 **Square account access** (owner-level) so we can connect the booking API — add
  us as a team member with Bookings/API permission, or approve a Square Developer app.
- 🔴 **Permission to forward the phone line(s)** to the AI (numbers are *not* replaced
  — calls simply forward). Start with **after-hours + overflow** only.
- 🟡 Approval of the monthly running cost (telephony + voice platform + AI usage —
  roughly a few cents per call minute).

**Decisions**
- 🔴 Which **pilot studio** to start with (recommend one Chicago location on Square).
- 🔴 v1 scope: **FAQ + booking + transfer-to-human**, or FAQ-only first?
- 🟡 **Escalation**: which staff member / number the AI transfers to, and when.
- 🟡 Confirm languages (EN / RU / ES), preferred **voice tone**, and the exact
  **greeting** ("Thank you for calling Love You Nail Salon…").

**Legal (these states are strict)**
- 🔴 Approve a **call-recording disclosure** at call start (California = all-party
  consent; Illinois has strict biometric/eavesdropping laws).
- 🟡 If we also automate **SMS**, we need the business **legal name + EIN + address**
  for carrier registration (A2P 10DLC).

---

## 🧑‍💼 From the ADMINS

**Square setup (Chicago + New York)**
- 🔴 Confirm in Square Appointments that **services** (durations + prices),
  **staff/team members** (with booking profiles), and **business hours** are correct
  and current.
- 🔴 The **Square API token / developer access** (or confirm the owner added us).
- 🟡 **Booking rules**: any-technician vs specific tech, minimum lead time,
  cancellation window, and how the **50% party-of-3+ deposit** is handled.

**Phone / SMS**
- 🔴 The **phone number for each location**, how calls are answered today, and whether
  the line can **forward**.
- 🟡 Current **SMS number/provider** (if we automate the ~30% that comes via text).

**Santa Monica (Fresha)**
- 🟡 **Fresha admin access** + agree the handoff: the AI answers/quotes and **texts the
  booking request to staff** (who receives it?).

**Knowledge for the AI**
- 🟡 A short **FAQ** dump: common questions + answers (parking, add-ons, gift cards,
  what needs a consult, membership mechanics, no-chip vs gel, etc.).
- 🟢 A few **real call recordings/transcripts** (even 5–10) — gold for making the AI
  sound right.
- 🟢 How customers are looked up today (usually by **phone number** in Square).

---

## ⚙️ What WE handle
Telephony (Twilio), the voice platform (Vapi/Retell), and the Claude "brain," plus all
integration work. The items above are what unblock us.

## ✅ The two true blockers to start the pilot
1. **Square access** for one studio.
2. **Permission to forward that studio's line** (after-hours/overflow).

Everything else we gather in parallel.
