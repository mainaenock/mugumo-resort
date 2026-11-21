import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResortChrome from "@/components/ResortChrome";
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
        <ResortChrome navbar={<Navbar />} footer={<Footer />} opening={
          <div className="site-opening" aria-hidden="true">
            <Image className="site-opening-mark" src={resortMark} alt="" width={512} height={512} priority />
          </div>
        }>{children}</ResortChrome>
      </body>
    </html>
  );
}
