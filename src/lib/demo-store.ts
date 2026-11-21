"use client";

import { useMemo, useSyncExternalStore } from "react";
import { availableRooms, guestError, nights, stayError, type Guest, type Payment, type PaymentMethod, type Reservation, type RoomSettings, type Stay } from "./booking";
import { rooms, type MenuItem, type Room } from "./resort";

type MenuSettings = { price: number; visible: boolean };
type DemoData = {
  reservations: Reservation[];
  payments: Payment[];
  rooms: Record<string, RoomSettings>;
  menu: Record<string, MenuSettings>;
};

const storageKey = `mugumo-demo-v1:${process.env.NEXT_PUBLIC_BASE_PATH ?? "/"}`;
const updateEvent = "mugumo-demo-update";
const emptyData: DemoData = { reservations: [], payments: [], rooms: {}, menu: {} };

function parseData(raw: string | null): DemoData {
  return raw ? JSON.parse(raw) : emptyData;
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

export function roomSettings(data: DemoData, room: Room): RoomSettings {
  return data.rooms[room.id] ?? { rate: room.rate, inventory: room.inventory };
}

export function menuSettings(data: DemoData, item: MenuItem): MenuSettings {
  return data.menu[item.id] ?? { price: item.price, visible: true };
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
    const room = rooms.find((item) => item.id === roomId);
    if (!room || stay.guests > room.capacity) throw new Error("Choose a room that fits your group.");

    const { rate, inventory } = roomSettings(data, room);
    if (rate !== quotedRate) throw new Error("The room rate has changed. Review the new total before trying again.");
    if (!availableRooms(room, inventory, stay, data.reservations)) {
      throw new Error("This room is no longer available for those dates. Go back to choose another room or change your dates.");
    }

    const total = rate * nights(stay);
    const reservation: Reservation | null = outcome === "paid" ? {
      ...stay, id: `MV-${id.replaceAll("-", "").slice(0, 12).toUpperCase()}`, roomId, guest, nightlyRate: rate, total, status: "confirmed",
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

export function saveRoomSettings(room: Room, settings: RoomSettings) {
  return transact((data) => ({
    next: { ...data, rooms: { ...data.rooms, [room.id]: settings } },
    result: undefined,
  }));
}

export function saveMenuSettings(item: MenuItem, settings: MenuSettings) {
  return transact((data) => ({
    next: { ...data, menu: { ...data.menu, [item.id]: settings } },
    result: undefined,
  }));
}
