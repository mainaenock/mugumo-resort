import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resortMark } from "@/lib/resort";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "The Mugumo Valley Resort | Thika, Kenya", template: "%s | The Mugumo Valley Resort" },
  description: "Explore rooms, dining, outdoor swimming and nearby attractions at The Mugumo Valley Resort on Riverside Road in Thika, Kenya.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-opening" aria-hidden="true">
          <Image className="site-opening-mark" src={resortMark} alt="" width={512} height={512} priority />
        </div>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
