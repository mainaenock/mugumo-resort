"use client";

import { useMemo, useSyncExternalStore } from "react";
import { availableRooms, guestError, nights, stayError, type Guest, type Payment, type PaymentMethod, type Reservation, type Stay } from "./booking";
import { menu, rooms } from "./resort";
import { starterPosts, type BlogPost, type MenuListing, type RoomListing } from "./catalog";

export type DemoData = {
  reservations: Reservation[];
  payments: Payment[];
  rooms: Record<string, Partial<RoomListing>>;
  menu: Record<string, Partial<MenuListing>>;
  roomListings: RoomListing[];
  menuListings: MenuListing[];
  posts: Record<string, BlogPost>;
};

const storageKey = `mugumo-demo-v1:${process.env.NEXT_PUBLIC_BASE_PATH ?? "/"}`;
const updateEvent = "mugumo-demo-update";
const emptyData: DemoData = { reservations: [], payments: [], rooms: {}, menu: {}, roomListings: [], menuListings: [], posts: {} };

function parseData(raw: string | null): DemoData {
  return raw ? { ...emptyData, ...JSON.parse(raw) } : emptyData;
}

function readSnapshot() {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === storageKey || event.key === null) callback();
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(updateEvent, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(updateEvent, callback);
  };
}

export function useDemoData() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => undefined);
  return useMemo(() => {
    try {
      return { data: parseData(snapshot ?? null), ready: snapshot !== undefined, error: "" };
    } catch {
      return { data: emptyData, ready: true, error: "The saved demo data could not be read in this browser." };
    }
  }, [snapshot]);
}

export function getRooms(data: DemoData): RoomListing[] {
  return [...rooms.map((room) => ({ ...room, visible: true, ...data.rooms[room.id] })), ...data.roomListings];
}

export function getMenu(data: DemoData): MenuListing[] {
  return [...menu.map((item) => ({ ...item, visible: true, ...data.menu[item.id] })), ...data.menuListings];
}

export function getPosts(data: DemoData): BlogPost[] {
  const posts = Object.fromEntries(starterPosts.map((post) => [post.id, post]));
  return Object.values({ ...posts, ...data.posts });
}

// Read and write inside the same lock so two tabs cannot sell the same last room.
async function transact<T>(change: (data: DemoData) => { next: DemoData; result: T }) {
  function commit() {
    let data: DemoData;
    try {
      data = parseData(localStorage.getItem(storageKey));
    } catch {
      throw new Error("Demo storage is unavailable. Check your browser settings and try again.");
    }
    const { next, result } = change(data);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      throw new Error("The demo changes could not be saved in this browser.");
    }
    window.dispatchEvent(new Event(updateEvent));
    return result;
  }

  return navigator.locks ? navigator.locks.request(storageKey, commit) : commit();
}

type Checkout = {
  id: string;
  stay: Stay;
  roomId: string;
  guest: Guest;
  method: PaymentMethod;
  outcome: "paid" | "declined";
  quotedRate: number;
};

export function submitCheckout({ id, stay, roomId, guest, method, outcome, quotedRate }: Checkout) {
  return transact<Reservation | null>((data) => {
    const priorAttempt = data.payments.find((payment) => payment.id === id);
    if (priorAttempt) {
      return { next: data, result: data.reservations.find((reservation) => reservation.id === priorAttempt.reservationId) ?? null };
    }

    const invalid = stayError(stay) || guestError(guest);
    if (invalid) throw new Error(invalid);
    const room = getRooms(data).find((item) => item.visible && item.id === roomId);
    if (!room || stay.guests > room.capacity) throw new Error("Choose a room that fits your group.");

    const { rate, inventory } = room;
    if (rate !== quotedRate) throw new Error("The room rate has changed. Review the new total before trying again.");
    if (!availableRooms(room, inventory, stay, data.reservations)) {
      throw new Error("This room is no longer available for those dates. Go back to choose another room or change your dates.");
    }

    const total = rate * nights(stay);
    const reservation: Reservation | null = outcome === "paid" ? {
      ...stay, id: `MV-${id.replaceAll("-", "").slice(0, 12).toUpperCase()}`, roomId, roomName: room.name, guest, nightlyRate: rate, total, status: "confirmed",
    } : null;
    const payment: Payment = { id, reservationId: reservation?.id ?? null, method, amount: total, status: outcome, createdAt: new Date().toISOString() };
    return {
      next: {
        ...data,
        reservations: reservation ? [reservation, ...data.reservations] : data.reservations,
        payments: [payment, ...data.payments],
      },
      result: reservation,
    };
  });
}

export function cancelReservation(id: string) {
  return transact((data) => ({
    next: {
      ...data,
      reservations: data.reservations.map((reservation) => reservation.id === id ? { ...reservation, status: "cancelled" } : reservation),
      payments: data.payments.map((payment) => payment.reservationId === id && payment.status === "paid" ? { ...payment, status: "refunded" } : payment),
    },
    result: undefined,
  }));
}

export function saveRoomListing(room: RoomListing) {
  return transact((data) => {
    if (!room.name || !room.description || !room.bed || !Number.isInteger(room.rate) || room.rate < 1 || room.rate > 1000000 ||
      !Number.isInteger(room.inventory) || room.inventory < 0 || room.inventory > 100 || ![1, 2].includes(room.capacity)) {
      throw new Error("Enter a room name, description, bed setup, valid rate and room count.");
    }
    const builtIn = rooms.some(({ id }) => id === room.id);
    const roomListings = data.roomListings.some(({ id }) => id === room.id)
      ? data.roomListings.map((item) => item.id === room.id ? room : item)
      : [...data.roomListings, room];
    const next = builtIn ? { ...data, rooms: { ...data.rooms, [room.id]: room } } : { ...data, roomListings };
    return { next, result: room };
  });
}

export function saveMenuListing(item: MenuListing) {
  return transact((data) => {
    if (!item.name || !item.description || !item.category || !Number.isInteger(item.price) || item.price < 1 || item.price > 1000000) {
      throw new Error("Enter an item name, description, category and valid price.");
    }
    const builtIn = menu.some(({ id }) => id === item.id);
    const menuListings = data.menuListings.some(({ id }) => id === item.id)
      ? data.menuListings.map((entry) => entry.id === item.id ? item : entry)
      : [...data.menuListings, item];
    const next = builtIn ? { ...data, menu: { ...data.menu, [item.id]: item } } : { ...data, menuListings };
    return { next, result: item };
  });
}

export function saveBlogPost(post: Omit<BlogPost, "publishedAt">, publish: boolean) {
  return transact((data) => {
    if (!post.title || !post.excerpt || !post.body) throw new Error("Enter a title, summary and article body.");
    const previous = getPosts(data).find(({ id }) => id === post.id);
    const saved = { ...post, publishedAt: publish ? previous?.publishedAt ?? new Date().toISOString() : null };
    return { next: { ...data, posts: { ...data.posts, [post.id]: saved } }, result: saved };
  });
}
