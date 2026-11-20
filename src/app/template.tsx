"use client";

import { useEffect, useRef, type ReactNode } from "react";

const revealTargets = [
  ".feature",
  ".section-heading",
  ".story-card",
  ".gallery-tile",
  ".amenity-list",
  ".info-panel",
  ".contact-grid",
  ".faq details",
  ".photo-credits",
  ".enquire-inner",
].join(", ");

export default function Template({ children }: { children: ReactNode }) {
  const page = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!page.current || !("IntersectionObserver" in window)) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections = page.current.querySelectorAll<HTMLElement>(revealTargets);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const section = entry.target as HTMLElement;
        section.dataset.scrollReveal = "shown";
        observer.unobserve(section);
      }
    }, { rootMargin: "0px 0px -12px 0px" });

    function syncReveals() {
      observer.disconnect();
      for (const section of sections) {
        delete section.dataset.scrollReveal;
        if (motion.matches || section.getBoundingClientRect().top < window.innerHeight + 16) continue;
        section.dataset.scrollReveal = "pending";
        observer.observe(section);
      }
    }

    syncReveals();
    motion.addEventListener("change", syncReveals);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", syncReveals);
    };
  }, []);

  return <div ref={page} className="page-motion">{children}</div>;
}
