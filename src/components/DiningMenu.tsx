"use client";

import { useState } from "react";
import { price } from "@/lib/booking";
import { getMenu, useDemoData } from "@/lib/demo-store";

export default function DiningMenu() {
  const { data } = useDemoData();
  const [category, setCategory] = useState<string | null>(null);
  const menu = getMenu(data).filter((item) => item.visible);
  const categories = [...new Set(menu.map((item) => item.category))];
  const selected = category && categories.includes(category) ? category : null;
  const items = menu.filter((item) => !selected || selected === item.category);

  return (
    <section id="menu" className="dining-menu" aria-labelledby="menu-title">
      <div className="section-heading">
        <h2 id="menu-title">Sample menu</h2>
        <p className="field-hint">Illustrative dishes and prices for the demo. Call the restaurant for today’s menu.</p>
      </div>
      <div className="gallery-filters" role="group" aria-label="Menu categories">
        <button type="button" aria-pressed={!selected} onClick={() => setCategory(null)}>All items</button>
        {categories.map((name) => <button type="button" key={name} aria-pressed={selected === name} onClick={() => setCategory(name)}>{name}</button>)}
      </div>
      {items.length ? <ul className="menu-grid">
        {items.map((item) => <li key={item.id} className="story-card menu-card">
          <div><p className="menu-category">{item.category}</p><h3>{item.name}</h3></div>
          <p>{item.description}</p>
          <strong>{price(item.price)}</strong>
        </li>)}
      </ul> : <p className="catalog-empty" role="status">There are no visible demo dishes at the moment.</p>}
    </section>
  );
}
