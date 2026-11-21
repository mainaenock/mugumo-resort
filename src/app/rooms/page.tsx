import type { Metadata } from "next";
import Link from "next/link";
import { Wifi, Bath, Tv, CarFront } from "lucide-react";
import { photos, resort, rooms } from "@/lib/resort";
import ResortPhoto from "@/components/ResortPhoto";
import RoomRate from "@/components/RoomRate";
import { EnquireBand, PageHero } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Rooms",
  description: "Compare the deluxe single, double and twin pool-view rooms at The Mugumo Valley Resort in Thika.",
};

const amenities = [
  { label: "In-room Wi-Fi", Icon: Wifi },
  { label: "Private bathroom", Icon: Bath },
  { label: "Smart TV", Icon: Tv },
  { label: "On-site parking", Icon: CarFront },
];

export default function RoomsPage() {
  return (
    <>
      <PageHero label="Stay" title="Rooms with a pool view" description="Choose between a single, double or twin room for your stay in Thika." photo={photos.double} />
      <section className="wrap section-space">
        <div className="section-heading catalog-heading">
          <h2>Find your room</h2>
          <Link href="/book/" className="button button-primary">Check availability</Link>
        </div>
        <div className="card-grid">
          {rooms.map((room) => (
            <article className="story-card" key={room.name}>
              <Link className="card-photo" href={`/rooms/${room.id}/`} aria-label={`View ${room.name}`}><ResortPhoto photo={room.photo} sizes="(max-width: 760px) 100vw, 33vw" /></Link>
              <div className="card-copy">
                <h3>{room.name}</h3>
                <p>{room.guests} · {room.bed} · Pool view</p>
                <RoomRate room={room} />
                <Link className="text-link" href={`/rooms/${room.id}/`} aria-label={`View ${room.name} details`}>Room details</Link>
              </div>
            </article>
          ))}
        </div>
        <ul className="amenity-list" aria-label="Stay amenities">
          {amenities.map(({ label, Icon }) => <li key={label}><Icon size={21} aria-hidden="true" /> {label}</li>)}
        </ul>
        <div className="info-panel">
          <div><h3>Check-in & check-out</h3><p>Check in from 2:00 pm and check out by 10:30 am.</p></div>
          <a className="text-link" href={resort.listing}>Check dates and rates on Expedia</a>
        </div>
      </section>
      <EnquireBand title="Ask about a room" detail="Call the resort with your travel dates and preferred room type." />
    </>
  );
}
