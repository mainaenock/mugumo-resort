"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function ResortChrome({ opening, navbar, footer, children }: { opening: ReactNode; navbar: ReactNode; footer: ReactNode; children: ReactNode }) {
  const admin = usePathname().replace(/\/$/, "") === "/admin";
  return (
    <>
      {!admin && opening}
      <a className="skip-link" href="#main-content">Skip to content</a>
      {!admin && navbar}
      <main id="main-content">{children}</main>
      {!admin && footer}
    </>
  );
}
