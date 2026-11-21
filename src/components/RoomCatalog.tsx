"use client";

import Link from "next/link";
import { price } from "@/lib/booking";
import { roomHref } from "@/lib/catalog";
import { getRooms, useDemoData } from "@/lib/demo-store";
import ResortPhoto from "./ResortPhoto";

export default function RoomCatalog() {
  const { data } = useDemoData();
  const rooms = getRooms(data).filter((room) => room.visible);

  if (!rooms.length) return <p className="catalog-empty">No room listings are visible at the moment.</p>;
  return (
    <div className="card-grid">
      {rooms.map((room) => (
        <article className="story-card" key={room.id}>
          <Link className="card-photo" href={roomHref(room.id)} aria-label={`View ${room.name}`}><ResortPhoto photo={room.photo} sizes="(max-width: 760px) 100vw, 33vw" /></Link>
          <div className="card-copy">
            <h3>{room.name}</h3>
            <p>{room.guests} · {room.bed}</p>
            <p className="catalog-rate"><strong>{price(room.rate)}</strong> / night · Demo rate</p>
            <Link className="text-link" href={roomHref(room.id)} aria-label={`View ${room.name} details`}>Room details</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
