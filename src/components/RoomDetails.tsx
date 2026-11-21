"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BedDouble, Users } from "lucide-react";
import { Feature, PageHero } from "./PageSections";
import { price } from "@/lib/booking";
import { getRooms, useDemoData } from "@/lib/demo-store";
import { resort, roomAmenities } from "@/lib/resort";

export function LocalRoomDetails() {
  return <RoomDetails roomId={useSearchParams().get("room")} />;
}

export default function RoomDetails({ roomId }: { roomId: string | null }) {
  const { data, ready } = useDemoData();
  const room = getRooms(data).find((item) => item.id === roomId && item.visible);
  if (!room) return (
    <section className="wrap section-space missing-page">
      <h1>{ready ? "Room unavailable" : "Loading room…"}</h1>
      <Link className="text-link" href="/rooms/">Browse rooms</Link>
    </section>
  );
  const amenities = room.amenities ?? roomAmenities;
  return (
    <>
      <PageHero label="Rooms" title={room.name} description={room.description} />
      <section className="wrap section-space">
        <Link href="/rooms/" className="text-link catalog-back">All rooms</Link>
        <Feature title="Room details" photo={room.photo}>
          <ul className="room-detail-facts">
            <li><Users size={20} aria-hidden="true" /> {room.guests} maximum</li>
            <li><BedDouble size={20} aria-hidden="true" /> {room.bed}</li>
          </ul>
          {!!amenities.length && <><h3>What’s included</h3><ul className="room-detail-amenities">{amenities.map((item) => <li key={item}>{item}</li>)}</ul></>}
          <p className="catalog-rate"><strong>{price(room.rate)}</strong> / night · Demo rate</p>
          <Link href={`/book/?room=${encodeURIComponent(room.id)}`} className="button button-primary">Check availability</Link>
        </Feature>
        <div className="info-panel">
          <div><h3>Check-in & check-out</h3><p>Check in from 2:00 pm and check out by 10:30 am.</p></div>
          <a className="text-link" href={resort.tel}>Call about a stay</a>
        </div>
      </section>
    </>
  );
}
