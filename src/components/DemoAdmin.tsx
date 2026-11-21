"use client";

import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, BookOpen, CalendarDays, ChartNoAxesCombined, ExternalLink, LayoutDashboard, Utensils } from "lucide-react";
import { price, showDate, today } from "@/lib/booking";
import { cancelReservation, getMenu, getPosts, getRooms, useDemoData } from "@/lib/demo-store";
import { resortMark } from "@/lib/resort";
import AdminOverview, { sampleSales, SalesTable } from "./AdminOverview";
import { BlogManager, MenuManager, RoomManager } from "./AdminListings";

const links = [
  { key: "overview", label: "Overview", Icon: LayoutDashboard },
  { key: "reservations", label: "Reservations", Icon: CalendarDays },
  { key: "sales", label: "Sales", Icon: ChartNoAxesCombined },
  { key: "rooms", label: "Room listings", Icon: BedDouble },
  { key: "menu", label: "Menu items", Icon: Utensils },
  { key: "blog", label: "Blog posts", Icon: BookOpen },
] as const;

type View = (typeof links)[number]["key"];

export default function DemoAdmin() {
  const { data, ready, error: storageError } = useDemoData();
  const [view, setView] = useState<View>("overview");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [salesFilter, setSalesFilter] = useState("all");
  const [salesSource, setSalesSource] = useState<"sample" | "local">("local");
  const [cancelId, setCancelId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const content = useRef<HTMLDivElement>(null);
  const rooms = getRooms(data);
  const roomNames = new Map(rooms.map((room) => [room.id, room.name]));
  const reservationNames = new Map(data.reservations.map((record) => [record.id, record.roomName ?? roomNames.get(record.roomId)]));
  const sales = data.payments.map((payment) => ({ ...payment, roomName: payment.reservationId ? reservationNames.get(payment.reservationId) : undefined }));
  const search = query.trim().toLowerCase();
  const reservations = data.reservations.filter((record) =>
    (filter === "all" || filter === record.status) &&
    [record.id, record.guest.name, record.guest.email, reservationNames.get(record.id) ?? ""].some((value) => value.toLowerCase().includes(search)),
  );

  function navigate(next: View) {
    setView(next);
    setCancelId("");
    setMessage("");
    setError("");
    content.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }

  async function save(action: () => Promise<unknown>, success: string) {
    if (saving.current || storageError) return false;
    saving.current = true;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      await action();
      setMessage(success);
      setCancelId("");
      return true;
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "The update could not be saved.");
      return false;
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="ops-shell">
      <aside className="ops-sidebar">
        <Link className="ops-brand" href="/admin/" aria-label="Mugumo Valley admin" onClick={() => navigate("overview")}>
          <Image src={resortMark} alt="" width={48} height={48} />
          <span><strong>Mugumo Valley</strong><small>Resort administration</small></span>
        </Link>
        <nav className="ops-navigation" aria-label="Administration">
          {links.map(({ key, label, Icon }) => <button type="button" key={key} aria-current={view === key ? "page" : undefined} disabled={busy} onClick={() => navigate(key)}>
            <Icon size={19} aria-hidden="true" />{label}
          </button>)}
        </nav>
        <p className="ops-sidebar-note">Front-end demo · browser storage</p>
      </aside>
      <div className="ops-workspace">
        <header className="ops-topbar">
          <span>Demo admin</span>
          <Link className="ops-button ops-secondary" href="/">View website<ExternalLink size={16} aria-hidden="true" /></Link>
        </header>
        <div className="ops-content" tabIndex={-1} ref={content}>
          {(storageError || error) && <p className="form-error" role="alert">{storageError || error}</p>}
          {message && <p className="form-success" role="status">{message}</p>}
          {!ready ? <p role="status">Loading dashboard…</p> : view === "overview" ? (
            <AdminOverview data={data} sales={sales} openSales={(sample) => {
              setSalesSource(sample ? "sample" : "local");
              setSalesFilter("all");
              navigate("sales");
            }} />
          ) : view === "reservations" ? (
            <>
              <div className="ops-page-heading">
                <div><h1>Reservations</h1><p>Find guest bookings and manage cancellations.</p></div>
                <Link className="ops-button ops-primary" href="/book/">Create demo booking</Link>
              </div>
              <section className="ops-card" aria-label="Reservation records">
                <div className="ops-card-heading ops-filters">
                  <label className="ops-field">Search bookings<input type="search" placeholder="Guest, room or reference" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
                  <label className="ops-field">Booking status<select value={filter} onChange={(event) => setFilter(event.target.value)}>
                    <option value="all">All statuses</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
                  </select></label>
                </div>
                {!reservations.length ? (
                  <p className="ops-empty">{data.reservations.length ? "No reservations match these filters." : "Completed demo bookings will appear here."}</p>
                ) : (
                  <div className="ops-table-wrap"><table className="ops-table" aria-label="Reservations">
                    <thead><tr><th scope="col">Guest</th><th scope="col">Room & stay</th><th scope="col">Total</th><th scope="col">Status</th><th scope="col"><span className="ops-sr-only">Actions</span></th></tr></thead>
                    <tbody>{reservations.map((record) => (
                      <Fragment key={record.id}>
                        <tr>
                          <td><strong>{record.guest.name}</strong><small>{record.guest.email}</small><small>{record.id}</small></td>
                          <td><strong>{reservationNames.get(record.id) ?? "Room"}</strong><small>{showDate(record.checkIn)} – {showDate(record.checkOut)}</small></td>
                          <td>{price(record.total)}</td>
                          <td><span className="ops-status" data-status={record.status}>{record.status === "confirmed" ? "Confirmed" : "Cancelled"}</span></td>
                          <td>{record.status === "confirmed" && <button type="button" className="ops-button ops-secondary" disabled={busy || !!storageError} onClick={() => setCancelId(record.id)}>Cancel booking</button>}</td>
                        </tr>
                        {cancelId === record.id && record.status === "confirmed" && <tr><td colSpan={5}>
                          <div className="ops-cancellation">
                            <p>Cancel this booking, release the room and mark the simulated payment as refunded?</p>
                            <div className="ops-actions">
                              <button className="ops-button ops-secondary" type="button" disabled={busy} onClick={() => setCancelId("")}>Keep booking</button>
                              <button className="ops-button ops-danger" type="button" disabled={busy} onClick={() => void save(() => cancelReservation(record.id), "Booking " + record.id + " cancelled.")}>Confirm cancellation</button>
                            </div>
                          </div>
                        </td></tr>}
                      </Fragment>
                    ))}</tbody>
                  </table></div>
                )}
              </section>
            </>
          ) : view === "sales" ? (
            <>
              <div className="ops-page-heading"><div><h1>Sales</h1><p>Review simulated payments, declines and refunds in KES.</p></div></div>
              <section className="ops-card" aria-label="Sales records">
                <div className="ops-card-heading ops-filters">
                  <label className="ops-field">Data source<select value={salesSource} onChange={(event) => setSalesSource(event.target.value === "sample" ? "sample" : "local")}><option value="local">This browser</option><option value="sample">Sample report</option></select></label>
                  <label className="ops-field">Payment status<select value={salesFilter} onChange={(event) => setSalesFilter(event.target.value)}>
                    <option value="all">All statuses</option><option value="paid">Paid</option><option value="declined">Declined</option><option value="refunded">Refunded</option>
                  </select></label>
                </div>
                <SalesTable sales={(salesSource === "sample" ? sampleSales(today()) : sales).filter((sale) => salesFilter === "all" || sale.status === salesFilter)} />
              </section>
            </>
          ) : view === "rooms" ? <RoomManager rooms={rooms} save={save} busy={busy || !!storageError} />
            : view === "menu" ? <MenuManager items={getMenu(data)} save={save} busy={busy || !!storageError} />
            : <BlogManager posts={getPosts(data)} save={save} busy={busy || !!storageError} />}
        </div>
      </div>
    </div>
  );
}
