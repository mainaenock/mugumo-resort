import type { Metadata } from "next";
import DemoAdmin from "@/components/DemoAdmin";
import { PageHero } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Demo admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <PageHero label="Resort operations" title="Demo admin" description="Manage reservations, simulated payments, room inventory and the sample menu." />
      <div className="wrap booking-shell"><DemoAdmin /></div>
    </>
  );
}
