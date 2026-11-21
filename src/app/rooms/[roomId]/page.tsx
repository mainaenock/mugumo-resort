import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Users, Waves } from "lucide-react";
import RoomRate from "@/components/RoomRate";
import { Feature, PageHero } from "@/components/PageSections";
import { resort, roomAmenities, rooms } from "@/lib/resort";

type Props = { params: Promise<{ roomId: string }> };

export function generateStaticParams() {
  return rooms.map(({ id }) => ({ roomId: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomId } = await params;
  const room = rooms.find(({ id }) => id === roomId);
  return room ? { title: room.name, description: room.description } : {};
}

export default async function RoomPage({ params }: Props) {
  const { roomId } = await params;
  const room = rooms.find(({ id }) => id === roomId);
  if (!room) notFound();

  return (
    <>
      <PageHero label="Pool-view rooms" title={room.name} description={room.description} />
      <section className="wrap section-space">
        <Link href="/rooms/" className="text-link catalog-back">All rooms</Link>
        <Feature title="Room details" photo={room.photo}>
          <ul className="room-detail-facts">
            <li><Users size={20} aria-hidden="true" /> {room.guests} maximum</li>
            <li><BedDouble size={20} aria-hidden="true" /> {room.bed}</li>
            <li><Waves size={20} aria-hidden="true" /> Pool view</li>
          </ul>
          <h3>What’s included</h3>
          <ul className="room-detail-amenities">{roomAmenities.map((item) => <li key={item}>{item}</li>)}</ul>
          <RoomRate room={room} />
          <Link href={`/book/?room=${room.id}`} className="button button-primary">Check availability</Link>
        </Feature>
        <div className="info-panel">
          <div><h3>Check-in & check-out</h3><p>Check in from 2:00 pm and check out by 10:30 am.</p></div>
          <a className="text-link" href={resort.tel}>Call about a real stay</a>
        </div>
      </section>
    </>
  );
}
