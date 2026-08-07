"use client";

import { useState } from "react";
import Link from "next/link";
import Wordmark from "./Wordmark";

const NAV = [
  { label: "About", href: "/#about" },
  { label: "Locations", href: "/locations" },
  { label: "Prices", href: "/prices" },
  { label: "Shop", href: "/shop" },
  { label: "Memberships", href: "/memberships" },
  { label: "Reviews", href: "/#reviews" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-sand/70 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        {/* Left: nav (desktop) */}
        <nav className="hidden flex-1 items-center gap-7 md:flex">
          {NAV.slice(0, 3).map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Center: wordmark */}
        <Wordmark variant="black" kind="mark" className="h-12 md:h-16" />

        {/* Right: nav + CTA (desktop) */}
        <div className="hidden flex-1 items-center justify-end gap-7 md:flex">
          {NAV.slice(3).map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
          <Link
            href="/locations"
            className="rounded-full bg-espresso px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold-dark"
          >
            Book
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-espresso md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-px w-6 bg-current transition-all ${
                open ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 block h-px w-6 bg-current transition-all ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-6 bg-current transition-all ${
                open ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-sand/70 bg-cream px-5 pb-6 pt-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-sand/50 py-3 text-sm uppercase tracking-[0.14em] text-brown"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/locations"
            onClick={() => setOpen(false)}
            className="mt-5 block rounded-full bg-espresso px-5 py-3 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-cream"
          >
            Book Appointment
          </Link>
        </nav>
      )}
    </header>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-brown transition-colors hover:text-gold-dark"
    >
      {label}
    </Link>
  );
}
