import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoomDetails from "@/components/RoomDetails";
import { rooms } from "@/lib/resort";

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
  if (!rooms.some(({ id }) => id === roomId)) notFound();
  return <RoomDetails roomId={roomId} />;
}
