"use client";

import { useState } from "react";
import { price } from "@/lib/booking";
import { menuSettings, useDemoData } from "@/lib/demo-store";
import { menu } from "@/lib/resort";

const categories = ["All", ...new Set(menu.map(({ category }) => category))];

export default function DiningMenu() {
  const { data } = useDemoData();
  const [category, setCategory] = useState("All");
  const items = menu
    .map((item) => ({ item, settings: menuSettings(data, item) }))
    .filter(({ item, settings }) => settings.visible && (category === "All" || category === item.category));

  return (
    <section id="menu" className="dining-menu" aria-labelledby="menu-title">
      <div className="section-heading">
        <h2 id="menu-title">Sample menu</h2>
        <p className="field-hint">Illustrative dishes and prices for the demo. Call the restaurant for today’s menu.</p>
      </div>
      <div className="gallery-filters" role="group" aria-label="Menu categories">
        {categories.map((name) => <button type="button" key={name} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}
      </div>
      {items.length ? <ul className="menu-grid">
        {items.map(({ item, settings }) => <li key={item.id} className="story-card menu-card">
          <div><p className="menu-category">{item.category}</p><h3>{item.name}</h3></div>
          <p>{item.description}</p>
          <strong>{price(settings.price)}</strong>
        </li>)}
      </ul> : <p className="admin-empty" role="status">There are no visible demo dishes in this category.</p>}
    </section>
  );
}
