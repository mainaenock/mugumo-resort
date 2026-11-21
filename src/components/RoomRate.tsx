"use client";

import { price } from "@/lib/booking";
import { roomSettings, useDemoData } from "@/lib/demo-store";
import type { Room } from "@/lib/resort";

export default function RoomRate({ room }: { room: Room }) {
  const { data } = useDemoData();
  return <p className="catalog-rate"><strong>{price(roomSettings(data, room).rate)}</strong> / night · Demo rate</p>;
}
