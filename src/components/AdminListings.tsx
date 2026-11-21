"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { price, showDate } from "@/lib/booking";
import { blogPhotos, roomPhotos, type BlogPost, type MenuListing, type RoomListing } from "@/lib/catalog";
import { saveBlogPost, saveMenuListing, saveRoomListing } from "@/lib/demo-store";
import { roomAmenities } from "@/lib/resort";
import ResortPhoto from "./ResortPhoto";

export type AdminSave = (action: () => Promise<unknown>, success: string) => Promise<boolean>;
type Controls = { save: AdminSave; busy: boolean };
type Editor<T> = T | "new" | null;

function WorkspaceTitle({ title, action, href, open }: { title: string; action: string; href: string; open: () => void }) {
  return (
    <div className="ops-page-heading">
      <h1>{title}</h1>
      <div className="ops-actions">
        <Link className="ops-button ops-secondary" href={href}>View on website</Link>
        <button type="button" className="ops-button ops-primary" onClick={open}><Plus size={18} aria-hidden="true" />{action}</button>
      </div>
    </div>
  );
}

function EditorCard({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  return (
    <section className="ops-card" aria-labelledby="editor-heading">
      <div className="ops-card-heading"><h2 id="editor-heading">{title}</h2><button type="button" className="ops-button ops-secondary" onClick={close}>Close editor</button></div>
      {children}
    </section>
  );
}

function VisibilityField({ visible }: { visible?: boolean }) {
  return <label className="ops-field">Visibility<select name="visibility" defaultValue={visible === false ? "hidden" : "visible"}><option value="visible">Visible on website</option><option value="hidden">Hidden</option></select></label>;
}

function VisibilityStatus({ visible }: { visible: boolean }) {
  return <span className="ops-status" data-status={visible ? "visible" : "hidden"}>{visible ? "Visible" : "Hidden"}</span>;
}

function text(fields: FormData, key: string) {
  return String(fields.get(key) ?? "").trim();
}

export function RoomManager({ rooms, save, busy }: Controls & { rooms: RoomListing[] }) {
  const [editor, setEditor] = useState<Editor<RoomListing>>(null);
  const room = editor === "new" ? null : editor;
  const editingPhoto = Object.keys(roomPhotos).find((key) => roomPhotos[key as keyof typeof roomPhotos].file === room?.photo.file);

  async function saveRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const capacity = Number(fields.get("capacity"));
    const listing = {
      id: room?.id ?? crypto.randomUUID(),
      name: text(fields, "name"),
      description: text(fields, "description"),
      bed: text(fields, "bed"),
      capacity,
      guests: capacity === 1 ? "1 guest" : "2 guests",
      rate: Number(fields.get("rate")),
      inventory: Number(fields.get("inventory")),
      photo: roomPhotos[text(fields, "photo") as keyof typeof roomPhotos] ?? roomPhotos.double,
      visible: fields.get("visibility") === "visible",
      amenities: [...new Set(text(fields, "amenities").split(/[,\n]/).map((value) => value.trim()).filter(Boolean))],
    };
    if (await save(() => saveRoomListing(listing), `${listing.name} saved.`)) setEditor(null);
  }

  return (
    <>
      <WorkspaceTitle title="Room listings" action="Add room listing" href="/rooms/" open={() => setEditor("new")} />
      {editor && <EditorCard title={room ? "Edit room listing" : "New room listing"} close={() => setEditor(null)}>
        <form className="ops-editor" key={room?.id ?? "new"} onSubmit={saveRoom}>
          <label className="ops-field">Room name<input name="name" required maxLength={90} defaultValue={room?.name} /></label>
          <label className="ops-field">Bed setup<input name="bed" required maxLength={80} defaultValue={room?.bed} placeholder="e.g. 1 double bed" /></label>
          <label className="ops-field ops-wide">Description<textarea name="description" required maxLength={700} rows={3} defaultValue={room?.description} /></label>
          <label className="ops-field">Nightly rate (KES)<input name="rate" type="number" required min={1} max={1000000} defaultValue={room?.rate} /></label>
          <label className="ops-field">Room count<input name="inventory" type="number" required min={0} max={100} defaultValue={room?.inventory ?? 1} /></label>
          <label className="ops-field">Maximum guests<select name="capacity" defaultValue={room?.capacity ?? 2}><option value="1">1 guest</option><option value="2">2 guests</option></select></label>
          <label className="ops-field">Room photo<select name="photo" defaultValue={editingPhoto ?? "double"}><option value="double">Double room</option><option value="twin">Twin room</option><option value="single">Single room</option></select></label>
          <label className="ops-field">Amenities (comma separated)<input name="amenities" maxLength={400} defaultValue={room?.amenities?.join(", ") ?? roomAmenities.join(", ")} /></label>
          <VisibilityField visible={room?.visible} />
          <div className="ops-actions ops-wide"><button className="ops-button ops-primary" disabled={busy}>Save room listing</button></div>
        </form>
      </EditorCard>}
      <section className="ops-card">
        <div className="ops-card-heading"><div><h2>Room inventory</h2><p>{rooms.length} {rooms.length === 1 ? "listing" : "listings"}</p></div></div>
        <div className="ops-table-wrap"><table className="ops-table" aria-label="Room listings">
          <thead><tr><th scope="col">Room</th><th scope="col">Capacity</th><th scope="col">Nightly rate</th><th scope="col">Inventory</th><th scope="col">Status</th><th scope="col"><span className="ops-sr-only">Actions</span></th></tr></thead>
          <tbody>{rooms.map((room) => <tr key={room.id}>
            <td><div className="ops-room-cell"><span className="ops-thumbnail"><ResortPhoto photo={room.photo} sizes="56px" /></span><span><strong>{room.name}</strong><small>{room.bed}</small></span></div></td>
            <td>{room.guests}</td><td>{price(room.rate)}</td><td>{room.inventory}</td><td><VisibilityStatus visible={room.visible} /></td>
            <td><button type="button" className="ops-button ops-secondary" aria-label={`Edit ${room.name}`} onClick={() => setEditor(room)}>Edit</button></td>
          </tr>)}</tbody>
        </table></div>
      </section>
    </>
  );
}

export function MenuManager({ items, save, busy }: Controls & { items: MenuListing[] }) {
  const [editor, setEditor] = useState<Editor<MenuListing>>(null);
  const item = editor === "new" ? null : editor;

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const listing = {
      id: item?.id ?? crypto.randomUUID(),
      name: text(fields, "name"),
      description: text(fields, "description"),
      category: text(fields, "category"),
      price: Number(fields.get("price")),
      visible: fields.get("visibility") === "visible",
    };
    if (await save(() => saveMenuListing(listing), `${listing.name} saved.`)) setEditor(null);
  }

  return (
    <>
      <WorkspaceTitle title="Menu items" action="Add menu item" href="/dining/#menu" open={() => setEditor("new")} />
      {editor && <EditorCard title={item ? "Edit menu item" : "New menu item"} close={() => setEditor(null)}>
        <form className="ops-editor" key={item?.id ?? "new"} onSubmit={saveItem}>
          <label className="ops-field">Item name<input name="name" required maxLength={90} defaultValue={item?.name} /></label>
          <label className="ops-field">Category<input name="category" required maxLength={40} list="menu-categories" defaultValue={item?.category} placeholder="e.g. Mains" /></label>
          <datalist id="menu-categories">{[...new Set(items.map(({ category }) => category))].map((category) => <option key={category} value={category} />)}</datalist>
          <label className="ops-field ops-wide">Description<textarea name="description" required maxLength={500} rows={3} defaultValue={item?.description} /></label>
          <label className="ops-field">Price (KES)<input name="price" type="number" required min={1} max={1000000} defaultValue={item?.price} /></label>
          <VisibilityField visible={item?.visible} />
          <div className="ops-actions ops-wide"><button className="ops-button ops-primary" disabled={busy}>Save menu item</button></div>
        </form>
      </EditorCard>}
      <section className="ops-card">
        <div className="ops-card-heading"><div><h2>Dining catalog</h2><p>{items.length} {items.length === 1 ? "item" : "items"}</p></div></div>
        <div className="ops-table-wrap"><table className="ops-table" aria-label="Menu items">
          <thead><tr><th scope="col">Item</th><th scope="col">Category</th><th scope="col">Price</th><th scope="col">Status</th><th scope="col"><span className="ops-sr-only">Actions</span></th></tr></thead>
          <tbody>{items.map((item) => <tr key={item.id}>
            <td><strong>{item.name}</strong><small>{item.description}</small></td>
            <td>{item.category}</td><td>{price(item.price)}</td><td><VisibilityStatus visible={item.visible} /></td>
            <td><button type="button" className="ops-button ops-secondary" aria-label={`Edit ${item.name}`} onClick={() => setEditor(item)}>Edit</button></td>
          </tr>)}</tbody>
        </table></div>
      </section>
    </>
  );
}

export function BlogManager({ posts, save, busy }: Controls & { posts: BlogPost[] }) {
  const [editor, setEditor] = useState<Editor<BlogPost>>(null);
  const post = editor === "new" ? null : editor;

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const publish = submitter?.getAttribute("value") === "publish";
    const draft = {
      id: post?.id ?? crypto.randomUUID(),
      title: text(fields, "title"),
      excerpt: text(fields, "excerpt"),
      body: text(fields, "body"),
      image: text(fields, "image") as keyof typeof blogPhotos,
    };
    if (await save(() => saveBlogPost(draft, publish), publish ? "Blog post published." : "Draft saved.")) setEditor(null);
  }

  return (
    <>
      <WorkspaceTitle title="Blog posts" action="Write a post" href="/blog/" open={() => setEditor("new")} />
      {editor && <EditorCard title={post ? "Edit blog post" : "New blog post"} close={() => setEditor(null)}>
        <form className="ops-editor" key={post?.id ?? "new"} onSubmit={savePost}>
          <label className="ops-field">Post title<input name="title" required maxLength={125} defaultValue={post?.title} /></label>
          <label className="ops-field">Cover photo<select name="image" defaultValue={post?.image ?? "grounds"}><option value="grounds">Resort grounds</option><option value="pool">Outdoor pool</option><option value="dining">Dining terrace</option><option value="room">Double room</option></select></label>
          <label className="ops-field ops-wide">Summary<textarea name="excerpt" required maxLength={230} rows={2} defaultValue={post?.excerpt} /></label>
          <label className="ops-field ops-wide">Article body<textarea name="body" required maxLength={15000} rows={10} defaultValue={post?.body} placeholder="Use a blank line between paragraphs." /></label>
          <div className="ops-actions ops-wide">
            <button className="ops-button ops-primary" value="publish" disabled={busy}>{post?.publishedAt ? "Update published post" : "Publish post"}</button>
            <button className="ops-button ops-secondary" value="draft" disabled={busy}>{post?.publishedAt ? "Move to drafts" : "Save draft"}</button>
          </div>
        </form>
      </EditorCard>}
      <section className="ops-card">
        <div className="ops-card-heading"><div><h2>Posts</h2><p>{posts.filter((item) => item.publishedAt).length} published</p></div></div>
        <div className="ops-table-wrap"><table className="ops-table" aria-label="Blog posts">
          <thead><tr><th scope="col">Post</th><th scope="col">Status</th><th scope="col">Published date</th><th scope="col"><span className="ops-sr-only">Actions</span></th></tr></thead>
          <tbody>{[...posts].reverse().map((post) => <tr key={post.id}>
            <td><strong>{post.title}</strong><small>{post.excerpt}</small></td>
            <td><span className="ops-status" data-status={post.publishedAt ? "visible" : "hidden"}>{post.publishedAt ? "Published" : "Draft"}</span></td>
            <td>{post.publishedAt ? showDate(post.publishedAt) : "—"}</td>
            <td><button type="button" className="ops-button ops-secondary" aria-label={`Edit ${post.title}`} onClick={() => setEditor(post)}>Edit</button></td>
          </tr>)}</tbody>
        </table></div>
      </section>
    </>
  );
}
