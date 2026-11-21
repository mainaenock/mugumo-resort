"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, CircleCheck, CreditCard, Smartphone, Users } from "lucide-react";
import { addDays, availableRooms, guestError, nights, paymentLabels, price, showDate, stayError, today, type Guest, type PaymentMethod, type Reservation, type Stay } from "@/lib/booking";
import { roomSettings, submitCheckout, useDemoData } from "@/lib/demo-store";
import { rooms } from "@/lib/resort";
import ResortPhoto from "./ResortPhoto";

const steps = ["Dates", "Room", "Guest details", "Payment"];
const emptyStay: Stay = { checkIn: "", checkOut: "", guests: 1 };
const emptyGuest: Guest = { name: "", email: "" };

function Summary({ stay, roomName, nightlyRate, children }: {
  stay: Stay;
  roomName: string;
  nightlyRate: number;
  children?: ReactNode;
}) {
  const count = nights(stay);
  return (
    <dl className="booking-totals">
      <div><dt>Room</dt><dd>{roomName}</dd></div>
      <div><dt>Check-in</dt><dd>{showDate(stay.checkIn)}</dd></div>
      <div><dt>Check-out</dt><dd>{showDate(stay.checkOut)}</dd></div>
      <div><dt>Guests</dt><dd>{stay.guests}</dd></div>
      <div><dt>{count} {count === 1 ? "night" : "nights"} × {price(nightlyRate)}</dt><dd>{price(count * nightlyRate)}</dd></div>
      {children}
    </dl>
  );
}

export default function BookingFlow() {
  const params = useSearchParams();
  const { data, ready, error: storageError } = useDemoData();
  const [step, setStep] = useState(0);
  const [stay, setStay] = useState(emptyStay);
  const [roomId, setRoomId] = useState("");
  const [guest, setGuest] = useState(emptyGuest);
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [outcome, setOutcome] = useState<"paid" | "declined">("paid");
  const [receipt, setReceipt] = useState<Reservation | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const panel = useRef<HTMLElement>(null);

  const preferredRoom = rooms.find((room) => room.id === params.get("room"));
  const selectedRoom = rooms.find((room) => room.id === roomId);
  const rate = selectedRoom ? roomSettings(data, selectedRoom).rate : 0;
  const results = step > 0 ? rooms.filter((room) => room.capacity >= stay.guests).map((room) => {
    const { rate, inventory } = roomSettings(data, room);
    return { room, rate, available: availableRooms(room, inventory, stay, data.reservations) };
  }) : [];
  const selectedAvailable = results.some(({ room, available }) => room.id === roomId && available > 0);
  const summaryRoom = step > 1 || selectedAvailable ? selectedRoom : undefined;

  function goTo(nextStep: number) {
    setStep(nextStep);
    setError("");
    panel.current?.focus();
  }

  function searchRooms(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = stayError(stay);
    if (invalid) return setError(invalid);
    if (!roomId && preferredRoom && preferredRoom.capacity >= stay.guests) {
      if (availableRooms(preferredRoom, roomSettings(data, preferredRoom).inventory, stay, data.reservations)) setRoomId(preferredRoom.id);
    }
    goTo(1);
  }

  async function pay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRoom || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await submitCheckout({
        id: crypto.randomUUID(),
        stay,
        roomId,
        guest: { name: guest.name.trim(), email: guest.email.trim() },
        method,
        outcome,
        quotedRate: rate,
      });
      if (!result) {
        setError("Demo payment declined. No reservation was made. Choose Successful payment below to try again.");
        return;
      }
      setReceipt(result);
      panel.current?.focus();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Checkout could not finish. Please try again.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  function startAgain() {
    setReceipt(null);
    setRoomId("");
    setStay(emptyStay);
    setGuest(emptyGuest);
    setMethod("mpesa");
    setOutcome("paid");
    goTo(0);
  }

  return (
    <>
      <p className="demo-notice"><strong>Front-end demo</strong><span>Use sample guest details. Reservations and payment results are saved in this browser, and no money is charged.</span></p>
      {!receipt && <ol className="booking-steps" aria-label="Booking progress">
        {steps.map((label, index) => <li key={label} aria-current={index === step ? "step" : undefined} data-complete={index < step}>{label}</li>)}
      </ol>}
      <div className="booking-layout">
        <section aria-label={receipt ? "Booking confirmation" : steps[step]} className="booking-panel" ref={panel} tabIndex={-1}>
          {(error || storageError) && <p className="form-error" role="alert">{error || storageError}</p>}
          {receipt ? (
            <div className="booking-confirmation">
              <CircleCheck size={42} aria-hidden="true" />
              <h2>Demo booking confirmed</h2>
              <p>Thanks, {receipt.guest.name}. Your reference is <strong className="booking-reference">{receipt.id}</strong>.</p>
              <Summary stay={receipt} roomName={selectedRoom?.name ?? "Room"} nightlyRate={receipt.nightlyRate}>
                <div className="summary-total"><dt>Simulated payment · {paymentLabels[method]}</dt><dd>{price(receipt.total)}</dd></div>
              </Summary>
              <div className="actions">
                <button type="button" className="button button-primary" onClick={startAgain}>Make another booking</button>
                <Link className="text-link" href="/admin/">Open demo admin</Link>
              </div>
            </div>
          ) : step === 0 ? (
            <form className="booking-form" onSubmit={searchRooms}>
              <div>
                <h2>When are you visiting?</h2>
                <p className="field-hint">{preferredRoom ? `Preferred room · ${preferredRoom.name}` : "Search for one room for up to two guests."}</p>
              </div>
              <div className="stay-fields">
                <label className="form-field">Check-in
                  <input type="date" required min={ready ? today() : undefined} value={stay.checkIn} onChange={(event) => {
                    const checkIn = event.target.value;
                    setStay({ ...stay, checkIn, checkOut: stay.checkOut > checkIn ? stay.checkOut : "" });
                    setError("");
                  }} />
                </label>
                <label className="form-field">Check-out
                  <input type="date" required min={stay.checkIn ? addDays(stay.checkIn, 1) : undefined} max={stay.checkIn ? addDays(stay.checkIn, 30) : undefined} value={stay.checkOut} onChange={(event) => setStay({ ...stay, checkOut: event.target.value })} />
                </label>
                <label className="form-field">Guests
                  <select value={stay.guests} onChange={(event) => setStay({ ...stay, guests: Number(event.target.value) })}>
                    <option value="1">1 guest</option><option value="2">2 guests</option>
                  </select>
                </label>
              </div>
              <button className="button button-primary" disabled={!ready || !!storageError}>Check availability</button>
            </form>
          ) : step === 1 ? (
            <form className="booking-form" onSubmit={(event) => { event.preventDefault(); goTo(2); }}>
              <h2>Choose a room</h2>
              <fieldset className="room-options">
                <legend className="sr-only">Available room types</legend>
                {results.map(({ room, rate: nightly, available }) => (
                  <label key={room.id} className="room-option" data-unavailable={!available}>
                    <input type="radio" name="room" value={room.id} checked={roomId === room.id && available > 0} disabled={!available} onChange={() => setRoomId(room.id)} />
                    <span className="room-option-photo"><ResortPhoto photo={room.photo} sizes="96px" /></span>
                    <span><strong>{room.name}</strong><small>{room.bed} · Pool view</small><small>{available ? `${available} available` : "Sold out for these dates"}</small></span>
                    <span className="room-option-price"><strong>{price(nightly * nights(stay))}</strong><small>{price(nightly)} / night</small></span>
                  </label>
                ))}
              </fieldset>
              {!results.some(({ available }) => available > 0) && <p role="status" className="field-hint">No rooms are available for this stay. Try different dates.</p>}
              <div className="actions">
                <button type="button" className="button button-outline" onClick={() => goTo(0)}>Change dates</button>
                <button className="button button-primary" disabled={!selectedAvailable}>Continue</button>
              </div>
            </form>
          ) : step === 2 ? (
            <form className="booking-form" onSubmit={(event) => {
              event.preventDefault();
              const invalid = guestError(guest);
              if (invalid) return setError(invalid);
              goTo(3);
            }}>
              <div><h2>Guest details</h2><p className="field-hint">Use a sample name and email for the lead guest.</p></div>
              <label className="form-field">Full name
                <input required autoComplete="off" maxLength={100} value={guest.name} onChange={(event) => setGuest({ ...guest, name: event.target.value })} placeholder="e.g. Amina Sample" />
              </label>
              <label className="form-field">Email address
                <input type="email" required autoComplete="off" maxLength={160} value={guest.email} onChange={(event) => setGuest({ ...guest, email: event.target.value })} placeholder="e.g. guest@example.com" />
              </label>
              <div className="actions">
                <button type="button" className="button button-outline" onClick={() => goTo(1)}>Back to rooms</button>
                <button className="button button-primary">Continue to payment</button>
              </div>
            </form>
          ) : (
            <form className="booking-form" onSubmit={pay} aria-busy={busy}>
              <div><h2>Simulate payment</h2><p className="field-hint">This demo uses full prepayment. No M-PESA PIN, phone number or card details are needed.</p></div>
              <fieldset className="payment-options" disabled={busy}>
                <legend>Payment method</legend>
                <label className="payment-option"><input type="radio" name="method" checked={method === "mpesa"} onChange={() => setMethod("mpesa")} /><Smartphone size={20} aria-hidden="true" /> M-PESA</label>
                <label className="payment-option"><input type="radio" name="method" checked={method === "card"} onChange={() => setMethod("card")} /><CreditCard size={20} aria-hidden="true" /> Card</label>
              </fieldset>
              <label className="form-field">Simulation result
                <select disabled={busy} value={outcome} onChange={(event) => { setOutcome(event.target.value === "declined" ? "declined" : "paid"); setError(""); }}>
                  <option value="paid">Successful payment</option><option value="declined">Declined payment</option>
                </select>
              </label>
              <div className="actions">
                <button type="button" className="button button-outline" onClick={() => goTo(2)} disabled={busy}>Back to guest details</button>
                <button className="button button-primary" disabled={busy || !!storageError}>{busy ? "Saving…" : `Simulate ${price(rate * nights(stay))} payment`}</button>
              </div>
            </form>
          )}
        </section>
        {!receipt && <aside className="booking-aside">
          <div className="booking-aside-photo"><ResortPhoto photo={summaryRoom?.photo ?? rooms[0].photo} sizes="(max-width: 800px) 100vw, 380px" /></div>
          <div className="booking-aside-copy">
            <h3>Your stay</h3>
            {summaryRoom ? (
              <Summary stay={stay} roomName={summaryRoom.name} nightlyRate={rate}>
                <div className="summary-total"><dt>Demo total</dt><dd>{price(rate * nights(stay))}</dd></div>
              </Summary>
            ) : (
              <ul className="stay-facts">
                <li><CalendarDays size={19} aria-hidden="true" /> Check-in from 2:00 pm</li>
                <li><CalendarDays size={19} aria-hidden="true" /> Check-out by 10:30 am</li>
                <li><Users size={19} aria-hidden="true" /> One room per booking</li>
              </ul>
            )}
          </div>
        </aside>}
      </div>
    </>
  );
}
