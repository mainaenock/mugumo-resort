import { type Room } from "./resort";

export type Stay = { checkIn: string; checkOut: string; guests: number };
export type Guest = { name: string; email: string };
export type PaymentMethod = "mpesa" | "card";
export type Reservation = Stay & {
  id: string;
  roomId: string;
  roomName?: string;
  guest: Guest;
  nightlyRate: number;
  total: number;
  status: "confirmed" | "cancelled";
};
export type Payment = {
  id: string;
  reservationId: string | null;
  method: PaymentMethod;
  amount: number;
  status: "paid" | "declined" | "refunded";
  createdAt: string;
};

export const paymentLabels: Record<PaymentMethod, string> = {
  mpesa: "M-PESA",
  card: "Card",
};

const day = 86_400_000;
const wholeDate = /^\d{4}-\d{2}-\d{2}$/;
const currency = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" });
const resortCalendar = new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Africa/Nairobi" });

export const price = (amount: number) => currency.format(amount);
export const showDate = (value: string) => dateFormat.format(new Date(value));
export const today = () => resortCalendar.format();
export const resortDate = (value: string) => resortCalendar.format(new Date(value));

function dateNumber(value: string) {
  const parsed = Date.parse(value);
  return wholeDate.test(value) && Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value ? parsed : NaN;
}

export function addDays(date: string, days: number) {
  const value = dateNumber(date);
  if (!Number.isFinite(value)) return "";
  const next = new Date(value + day * days).toISOString();
  return next[0] === "+" ? "" : next.slice(0, 10);
}

export function nights(stay: Stay) {
  return (dateNumber(stay.checkOut) - dateNumber(stay.checkIn)) / day;
}

export function stayError(stay: Stay) {
  const count = nights(stay);
  if (!Number.isFinite(count)) return "Choose valid check-in and check-out dates.";
  if (stay.checkIn < today()) return "Choose a check-in date from today onward.";
  if (count < 1) return "Check-out must be after check-in.";
  if (count > 30) return "The demo accepts stays of up to 30 nights.";
  if (stay.guests !== 1 && stay.guests !== 2) return "Choose one or two guests.";
  return "";
}

export function guestError(guest: Guest) {
  if (!guest.name.trim()) return "Enter the lead guest’s name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim())) return "Enter a valid email address.";
  return "";
}

export function availableRooms(room: Room, inventory: number, stay: Stay, reservations: Reservation[]) {
  const overlapping = reservations.filter((reservation) =>
    reservation.status === "confirmed" && reservation.roomId === room.id &&
    reservation.checkIn < stay.checkOut && reservation.checkOut > stay.checkIn,
  );
  let available = inventory;
  for (let date = stay.checkIn; date < stay.checkOut && available > 0; date = addDays(date, 1)) {
    const occupied = overlapping.filter((reservation) => reservation.checkIn <= date && date < reservation.checkOut).length;
    available = Math.min(available, inventory - occupied);
  }
  return Math.max(0, available);
}
