import { photos, rooms, type MenuItem, type Room } from "./resort";

export type RoomListing = Room & { visible: boolean; amenities?: string[] };
export type MenuListing = MenuItem & { visible: boolean };
export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  image: keyof typeof blogPhotos;
  publishedAt: string | null;
};

export const roomPhotos = { double: photos.double, twin: photos.twin, single: photos.single };
export const blogPhotos = { grounds: photos.grounds, pool: photos.pool, dining: photos.diningTerrace, room: photos.double };

export function roomHref(id: string) {
  return rooms.some((room) => room.id === id) ? `/rooms/${id}/` : `/rooms/detail/?room=${encodeURIComponent(id)}`;
}

export const postHref = (id: string) => `/blog/post/?post=${encodeURIComponent(id)}`;

export const starterPosts: BlogPost[] = [
  {
    id: "a-slow-weekend-in-thika",
    title: "A slow weekend in Thika",
    excerpt: "A simple plan for a night away, with time by the pool, an unhurried breakfast and a stop on the way home.",
    body: "Leave some room in your itinerary. If you’re spending a night at Mugumo Valley, aim to arrive after check-in and leave the rest of the afternoon open. Walk through the grounds, find a seat by the pool, and ask the restaurant what’s on the menu that evening.\n\nTake the morning at your own pace. Have breakfast, pick up your bags and head out by 10:30 am. If you want to see more of Thika, you could make Chania Falls or Fourteen Falls your next stop. Check local access before you set out, especially after heavy rain.\n\nTravelling with friends? Compare the twin and double rooms before booking. Two separate beds can make a shared room more comfortable, and a single room is an option for anyone who wants their own space.",
    image: "grounds",
    publishedAt: "2026-11-21T08:00:00Z",
  },
  {
    id: "pack-for-a-poolside-day",
    title: "What to pack for a poolside day",
    excerpt: "Little things worth bringing for a day outdoors at Mugumo Valley.",
    body: "Start with a swimsuit, sandals and a bag for anything that gets wet. Bring a hat, sunscreen and a bottle of water if you plan to spend much of the day outdoors. If you’re visiting with children, a dry change of clothes can make the transition from the pool to lunch easier.\n\nIf you’re coming just for the day, call ahead to ask about pool access and restaurant hours. For a group meal, it’s worth asking what’s on the menu and mentioning any dietary requirements when you call.\n\nStaying overnight? Pack a light layer for dinner and keep your room booking details handy. You can use the resort’s directions page to find the Riverside Road entrance.",
    image: "pool",
    publishedAt: "2026-11-19T08:00:00Z",
  },
];
