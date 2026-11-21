import type { Metadata } from "next";
import Link from "next/link";
import { Wifi, Bath, Tv, CarFront } from "lucide-react";
import { photos, resort } from "@/lib/resort";
import RoomCatalog from "@/components/RoomCatalog";
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
      <PageHero label="Stay" title="Stay at Mugumo Valley" description="Compare room types and find a place to stay in Thika." photo={photos.double} />
      <section className="wrap section-space">
        <div className="section-heading catalog-heading">
          <h2>Find your room</h2>
          <Link href="/book/" className="button button-primary">Check availability</Link>
        </div>
        <RoomCatalog />
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
