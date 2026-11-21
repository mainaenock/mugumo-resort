"use client";

import { useState } from "react";
import { Banknote, CalendarCheck, CreditCard, Undo2 } from "lucide-react";
import { addDays, paymentLabels, price, resortDate, showDate, today, type Payment } from "@/lib/booking";
import type { DemoData } from "@/lib/demo-store";

export type Sale = Payment & { roomName?: string };
const statusLabels = { paid: "Paid", declined: "Declined", refunded: "Refunded" };
const chartDate = new Intl.DateTimeFormat("en-KE", { month: "short", day: "numeric", timeZone: "Africa/Nairobi" });
const compact = new Intl.NumberFormat("en-KE", { notation: "compact", maximumFractionDigits: 1 });

export function SalesTable({ sales }: { sales: Sale[] }) {
  if (!sales.length) return <p className="ops-empty">No transactions in this view. Completed and declined demo payments appear here.</p>;
  return (
    <div className="ops-table-wrap">
      <table className="ops-table" aria-label="Sales transactions">
        <thead><tr><th scope="col">Reservation</th><th scope="col">Date</th><th scope="col">Method</th><th scope="col">Status</th><th scope="col" className="ops-number">Amount</th></tr></thead>
        <tbody>{sales.map((sale) => <tr key={sale.id}>
          <td><strong>{sale.reservationId ?? "No reservation"}</strong>{sale.roomName && <small>{sale.roomName}</small>}</td>
          <td>{showDate(sale.createdAt)}</td>
          <td>{paymentLabels[sale.method]}</td>
          <td><span className="ops-status" data-status={sale.status}>{statusLabels[sale.status]}</span></td>
          <td className="ops-number">{price(sale.amount)}</td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}

export function sampleSales(end: string): Sale[] {
  const examples = [
    [0, 17000, "paid", "Deluxe Double"], [0, 6000, "paid", "Deluxe Single"],
    [1, 8000, "declined", ""], [1, 24000, "paid", "Deluxe Twin"],
    [2, 8500, "paid", "Deluxe Double"], [3, 16000, "refunded", "Deluxe Twin"],
    [4, 28000, "paid", "Deluxe Double"], [5, 12000, "paid", "Deluxe Single"],
    [6, 16000, "paid", "Deluxe Twin"], [9, 8500, "paid", "Deluxe Double"],
    [14, 24000, "paid", "Deluxe Twin"], [20, 18000, "paid", "Deluxe Single"],
    [25, 16000, "paid", "Deluxe Twin"],
  ] as const;
  return examples.map(([offset, amount, status, roomName], index) => ({
    id: `sample-${index}`,
    createdAt: `${addDays(end, -offset)}T09:00:00Z`,
    reservationId: status === "declined" ? null : `MV-SAMPLE-${108 - index}`,
    method: index % 3 ? "mpesa" : "card",
    status,
    roomName,
    amount,
  }));
}

function RevenueChart({ sales, end, days }: { sales: Sale[]; end: string; days: number }) {
  const interval = days === 7 ? 1 : 5;
  const firstDay = addDays(end, 1 - days);
  const buckets = Array.from({ length: days / interval }, (_, index) => {
    const start = addDays(firstDay, index * interval);
    const stop = addDays(start, interval - 1);
    const label = chartDate.format(new Date(start));
    const total = sales.reduce((sum, sale) => {
      const date = resortDate(sale.createdAt);
      return sale.status === "paid" && date >= start && date <= stop ? sum + sale.amount : sum;
    }, 0);
    return { start, label, total, range: interval === 1 ? label : `${label} – ${chartDate.format(new Date(stop))}` };
  });
  const highest = Math.max(1, ...buckets.map(({ total }) => total));
  const step = 10 ** Math.floor(Math.log10(highest));
  const max = Math.max(1000, Math.ceil(highest / step) * step);
  return (
    <figure className="ops-chart" aria-label="Net sales in Kenyan shillings by date">
      <div className="ops-chart-scale" aria-hidden="true">{[max, max * .75, max * .5, max * .25, 0].map((value) => <span key={value}>{compact.format(value)}</span>)}</div>
      <ul className="ops-chart-bars">
        {buckets.map(({ start, label, total, range }) => <li key={start}>
          <div className="ops-chart-column" style={{ height: total ? `${total / max * 100}%` : "2px" }} tabIndex={0} aria-label={`${range}, ${price(total)}`}>
            <span className="ops-chart-tooltip" aria-hidden="true">{range}<strong>{price(total)}</strong></span>
          </div>
          <span className="ops-chart-date" aria-hidden="true">{label}</span>
        </li>)}
      </ul>
    </figure>
  );
}

export default function AdminOverview({ data, sales, openSales }: { data: DemoData; sales: Sale[]; openSales: (sample: boolean) => void }) {
  const [mode, setMode] = useState<"sample" | "local" | null>(null);
  const [days, setDays] = useState(7);
  const sample = (mode ?? (data.payments.length ? "local" : "sample")) === "sample";
  const end = today();
  const start = addDays(end, 1 - days);
  const report = (sample ? sampleSales(end) : sales).filter((sale) => {
    const date = resortDate(sale.createdAt);
    return date >= start && date <= end;
  });
  const paid = report.filter((sale) => sale.status === "paid");
  const net = paid.reduce((sum, sale) => sum + sale.amount, 0);
  const refunds = report.reduce((sum, sale) => sum + (sale.status === "refunded" ? sale.amount : 0), 0);
  const metrics = [
    { label: "Net sales", value: price(net), Icon: Banknote },
    { label: "Paid bookings", value: new Set(paid.map((sale) => sale.reservationId).filter(Boolean)).size, Icon: CalendarCheck },
    { label: "Payment attempts", value: report.length, Icon: CreditCard },
    { label: "Refunded", value: price(refunds), Icon: Undo2 },
  ];

  return (
    <>
      <div className="ops-page-heading">
        <div><h1>Overview</h1><p>Booking and payment activity for Mugumo Valley Resort.</p></div>
        <div className="ops-report-controls">
          <label className="ops-field">Data source<select value={sample ? "sample" : "local"} onChange={(event) => setMode(event.target.value === "sample" ? "sample" : "local")}><option value="sample">Sample report</option><option value="local">This browser</option></select></label>
          <label className="ops-field">Date range<select value={days} onChange={(event) => setDays(Number(event.target.value))}><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select></label>
        </div>
      </div>
      <dl className="ops-metrics">{metrics.map(({ label, value, Icon }) => <div key={label}>
        <dt><Icon size={18} aria-hidden="true" />{label}</dt><dd>{value}</dd>
      </div>)}</dl>
      <section className="ops-card" aria-labelledby="revenue-heading">
        <div className="ops-card-heading">
          <div><h2 id="revenue-heading">Sales over time</h2><p>Net simulated revenue in KES</p></div>
          <span className="ops-report-label">{sample ? "Sample data" : "Browser data"}</span>
        </div>
        <RevenueChart sales={report} end={end} days={days} />
        {!report.length && <p className="ops-chart-note">No payments recorded for this period.</p>}
      </section>
      <section className="ops-card" aria-labelledby="recent-sales-heading">
        <div className="ops-card-heading">
          <div><h2 id="recent-sales-heading">Recent transactions</h2><p>{sample ? "Illustrative sales activity" : "Latest payment attempts in this period"}</p></div>
          <button className="ops-button ops-secondary" type="button" onClick={() => openSales(sample)}>View all sales</button>
        </div>
        <SalesTable sales={report.slice(0, 6)} />
      </section>
    </>
  );
}
