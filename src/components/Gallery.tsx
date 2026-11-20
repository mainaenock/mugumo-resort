"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { imagePath, photos, type Photo } from "@/lib/resort";
import ResortPhoto from "./ResortPhoto";

const gallery: { label: string; category: "Grounds" | "Rooms" | "Dining"; photo: Photo }[] = [
  { label: "The outdoor pool", category: "Grounds", photo: photos.pool },
  { label: "The garden grounds", category: "Grounds", photo: photos.grounds },
  { label: "Deluxe double room", category: "Rooms", photo: photos.double },
  { label: "Poolside seating", category: "Grounds", photo: photos.gardenPool },
  { label: "Deluxe twin room", category: "Rooms", photo: photos.twin },
  { label: "Poolside dining terrace", category: "Dining", photo: photos.diningTerrace },
  { label: "Wine at the resort", category: "Dining", photo: photos.barTable },
  { label: "The playground", category: "Grounds", photo: photos.playground },
  { label: "Deluxe single room", category: "Rooms", photo: photos.single },
  { label: "An afternoon by the pool", category: "Grounds", photo: photos.leisure },
];

const categories = ["All photos", "Grounds", "Rooms", "Dining"];

export default function Gallery() {
  const [category, setCategory] = useState(categories[0]);
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = gallery.filter((item) => category === categories[0] || category === item.category);
  const selected = filtered[active];
  const move = (direction: number) => setActive((index) => (index + direction + filtered.length) % filtered.length);

  return (
    <>
      <div className="gallery-filters" role="group" aria-label="Filter resort photos">
        {categories.map((name) => <button key={name} type="button" aria-pressed={category === name} onClick={() => { setCategory(name); setActive(0); }}>{name}</button>)}
      </div>
      <div className="gallery-grid">
        {filtered.map((item, index) => (
          <button key={item.label} type="button" className="gallery-tile" onClick={() => { setActive(index); dialog.current?.showModal(); }} aria-label={`View ${item.label.toLowerCase()} photo`}>
            <span className="gallery-photo"><ResortPhoto photo={item.photo} sizes="(max-width: 580px) 100vw, (max-width: 760px) 50vw, 33vw" /></span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <dialog ref={dialog} className="lightbox" aria-label="Resort photo viewer" onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}>
        {selected && (
          <div className="lightbox-inner">
            <button type="button" className="lightbox-close" aria-label="Close photo" onClick={() => dialog.current?.close()}><X size={23} /></button>
            <div className="lightbox-photo"><Image src={imagePath(selected.photo)} alt={selected.photo.alt} fill sizes="90vw" loading="lazy" /></div>
            <div className="lightbox-controls">
              <button type="button" aria-label="Previous photo" onClick={() => move(-1)} disabled={filtered.length < 2}><ChevronLeft size={22} /></button>
              <p aria-live="polite">{selected.label} <span>{active + 1} / {filtered.length}</span></p>
              <button type="button" aria-label="Next photo" onClick={() => move(1)} disabled={filtered.length < 2}><ChevronRight size={22} /></button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
