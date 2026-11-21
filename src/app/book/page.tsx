import type { Metadata } from "next";
import { Suspense } from "react";
import BookingFlow from "@/components/BookingFlow";
import { PageHero } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Book your stay",
  description: "Check dates, compare rooms and try the Mugumo Valley Resort demo checkout.",
};

export default function BookingPage() {
  return (
    <>
      <PageHero label="Reservations" title="Book your stay" description="Find a pool-view room and try the resort’s online booking demo." />
      <div className="wrap booking-shell">
        <Suspense fallback={<p role="status">Loading booking form…</p>}>
          <BookingFlow />
        </Suspense>
      </div>
    </>
  );
}
