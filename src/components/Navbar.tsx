"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigation } from "@/lib/resort";
import Brand from "./Brand";

export default function Navbar() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [menuPage, setMenuPage] = useState<string | null>(null);
  const menuOpen = menuPage === pathname;
  const menu = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    menu.current?.querySelector<HTMLAnchorElement>('a[aria-current="page"], a')?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuPage(null);
        toggle.current?.focus();
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Brand />
        <nav ref={menu} id="site-navigation" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          {navigation.map(({ label, href }) => (
            <Link key={href} href={href} aria-current={(href.replace(/\/$/, "") || "/") === pathname ? "page" : undefined} onClick={() => setMenuPage(null)}>
              {label}
            </Link>
          ))}
          <Link className="mobile-contact" href="/contact/" aria-current={pathname === "/contact" ? "page" : undefined} onClick={() => setMenuPage(null)}>Contact</Link>
        </nav>
        <Link className="button button-primary header-action" href="/book/" aria-current={pathname === "/book" ? "page" : undefined} onClick={() => setMenuPage(null)}>Book now</Link>
        <button ref={toggle} className="menu-toggle" type="button" aria-controls="site-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuPage(menuOpen ? null : pathname)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
