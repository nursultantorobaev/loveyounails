"use client";

import { useEffect } from "react";

/** Opens the FAQ question named in the URL hash (#faq-3) and scrolls to it, so a
 *  search result or shared link lands on the answer, already expanded. */
export default function FaqHashOpener() {
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!/^faq-\d+$/.test(id)) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);
  return null;
}
