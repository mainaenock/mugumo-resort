import type { Metadata } from "next";
import { Suspense } from "react";
import { LocalRoomDetails } from "@/components/RoomDetails";

export const metadata: Metadata = { title: "Room details", robots: { index: false } };

export default function LocalRoomPage() {
  return <Suspense fallback={<p className="wrap section-space">Loading room…</p>}><LocalRoomDetails /></Suspense>;
}
