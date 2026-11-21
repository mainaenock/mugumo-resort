"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { paymentLabels, price, showDate } from "@/lib/booking";
import { cancelReservation, menuSettings, roomSettings, saveMenuSettings, saveRoomSettings, useDemoData } from "@/lib/demo-store";
import { menu, rooms } from "@/lib/resort";

const views = ["Reservations", "Payments", "Rooms", "Dining"] as const;
const paymentStatus = { paid: "Paid", declined: "Declined", refunded: "Refunded" };

export default function DemoAdmin() {
  const { data, ready, error: storageError } = useDemoData();
  const [view, setView] = useState<(typeof views)[number]>("Reservations");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [cancelId, setCancelId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const confirmed = data.reservations.filter((reservation) => reservation.status === "confirmed");
  const received = data.payments.reduce((total, payment) => total + (payment.status === "paid" ? payment.amount : 0), 0);
  const search = query.trim().toLowerCase();
  const reservations = data.reservations.filter((reservation) =>
    (filter === "all" || filter === reservation.status) &&
    [reservation.id, reservation.guest.name, reservation.guest.email].some((value) => value.toLowerCase().includes(search)),
  );

  async function save(action: () => Promise<unknown>, success: string) {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      await action();
      setMessage(success);
      setCancelId("");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "The update could not be saved.");
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  function formData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return new FormData(event.currentTarget);
  }

  return (
    <div className="admin-dashboard">
      <p className="demo-notice"><strong>Local demo</strong><span>This admin has no sign-in. It shows the sample data saved in this browser.</span></p>
      <dl className="admin-stats">
        <div><dt>Confirmed stays</dt><dd>{confirmed.length}</dd></div>
        <div><dt>Payment attempts</dt><dd>{data.payments.length}</dd></div>
        <div><dt>Net simulated payments</dt><dd>{price(received)}</dd></div>
      </dl>
      <nav className="gallery-filters admin-nav" aria-label="Demo admin sections">
        {views.map((item) => <button type="button" key={item} aria-pressed={view === item} onClick={() => {
          setView(item);
          setCancelId("");
          setMessage("");
          setError("");
        }}>{item}</button>)}
      </nav>
      {(error || storageError) && <p className="form-error" role="alert">{error || storageError}</p>}
      {message && <p className="form-success" role="status">{message}</p>}
      {!ready ? <p role="status">Loading demo records…</p> : view === "Reservations" ? (
        <section className="booking-panel admin-panel" aria-label="Reservations">
          <div className="admin-heading"><h2>Reservations</h2><Link className="text-link" href="/book/">Create a demo booking</Link></div>
          <div className="admin-filters">
            <label className="form-field">Search reservations
              <input type="search" placeholder="Guest name, email or reference" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <label className="form-field">Status
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">All statuses</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
          {!reservations.length ? (
            <p className="admin-empty">{data.reservations.length ? "No reservations match your filters." : "Completed demo bookings will appear here."}</p>
          ) : (
            <ul className="admin-records">
              {reservations.map((reservation) => (
                <li key={reservation.id}>
                  <div className="reservation-row">
                    <div><strong>{reservation.guest.name}</strong><small>{reservation.guest.email}</small><small className="booking-reference">{reservation.id}</small></div>
                    <div><strong>{rooms.find((room) => room.id === reservation.roomId)?.name}</strong><small>{showDate(reservation.checkIn)} – {showDate(reservation.checkOut)}</small><small>{reservation.guests} {reservation.guests === 1 ? "guest" : "guests"}</small></div>
                    <div><strong>{price(reservation.total)}</strong><small className="status-pill" data-status={reservation.status}>{reservation.status === "confirmed" ? "Confirmed" : "Cancelled"}</small></div>
                    {reservation.status === "confirmed" && <button type="button" className="button button-outline" disabled={busy || !!storageError} onClick={() => setCancelId(reservation.id)}>Cancel booking</button>}
                  </div>
                  {cancelId === reservation.id && <div className="cancel-panel">
                    <p>This will free the room and mark the simulated payment as refunded.</p>
                    <div className="actions">
                      <button type="button" className="button button-outline" disabled={busy} onClick={() => setCancelId("")}>Keep booking</button>
                      <button type="button" className="button button-danger" disabled={busy} onClick={() => void save(() => cancelReservation(reservation.id), `Booking ${reservation.id} cancelled.`)}>Confirm cancellation</button>
                    </div>
                  </div>}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : view === "Payments" ? (
        <section className="booking-panel admin-panel" aria-label="Payments">
          <div className="admin-heading"><h2>Payments</h2><p className="field-hint">Simulated transactions in KES</p></div>
          {data.payments.length ? <ul className="admin-records">
            {data.payments.map((payment) => <li className="payment-row" key={payment.id}>
              <div><strong>{paymentLabels[payment.method]}</strong><small>{payment.reservationId ?? "No reservation"}</small></div>
              <div><strong>{price(payment.amount)}</strong><small>{showDate(payment.createdAt)}</small></div>
              <span className="status-pill" data-status={payment.status}>{paymentStatus[payment.status]}</span>
            </li>)}
          </ul> : <p className="admin-empty">Successful and declined demo payments will appear here.</p>}
        </section>
      ) : view === "Rooms" ? (
        <section className="booking-panel admin-panel" aria-label="Room settings">
          <div className="admin-heading"><h2>Room inventory & rates</h2><Link className="text-link" href="/rooms/">View room listings</Link></div>
          <p className="field-hint">Set the nightly rate and number of demo rooms of each type. Existing bookings keep their original rates.</p>
          <div className="admin-edit-list">
            {rooms.map((room) => {
              const { rate, inventory } = roomSettings(data, room);
              return <form key={`${room.id}-${rate}-${inventory}`} className="admin-edit-row" onSubmit={(event) => {
                const fields = formData(event);
                void save(() => saveRoomSettings(room, { rate: Number(fields.get("rate")), inventory: Number(fields.get("inventory")) }), `${room.name} updated.`);
              }}>
                <div><h3>{room.name}</h3><p className="field-hint">{room.guests} · {room.bed}</p></div>
                <label className="form-field">Nightly rate (KES)<input type="number" name="rate" required min="1" max="1000000" step="1" defaultValue={rate} /></label>
                <label className="form-field">Room count<input type="number" name="inventory" required min="0" max="100" step="1" defaultValue={inventory} /></label>
                <button className="button button-primary" disabled={busy || !!storageError}>Save room</button>
              </form>;
            })}
          </div>
        </section>
      ) : (
        <section className="booking-panel admin-panel" aria-label="Dining settings">
          <div className="admin-heading"><h2>Sample menu</h2><Link className="text-link" href="/dining/#menu">View dining menu</Link></div>
          <div className="admin-edit-list">
            {menu.map((item) => {
              const settings = menuSettings(data, item);
              return <form key={`${item.id}-${settings.price}-${settings.visible}`} className="admin-edit-row" onSubmit={(event) => {
                const fields = formData(event);
                void save(() => saveMenuSettings(item, { price: Number(fields.get("price")), visible: fields.get("visible") === "true" }), `${item.name} updated.`);
              }}>
                <div><h3>{item.name}</h3><p className="field-hint">{item.category}</p></div>
                <label className="form-field">Price (KES)<input type="number" name="price" required min="1" max="1000000" step="1" defaultValue={settings.price} /></label>
                <label className="form-field">Menu visibility<select name="visible" defaultValue={String(settings.visible)}><option value="true">Visible</option><option value="false">Hidden</option></select></label>
                <button className="button button-primary" disabled={busy || !!storageError}>Save item</button>
              </form>;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
