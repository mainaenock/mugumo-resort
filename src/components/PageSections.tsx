import Link from "next/link";
import { resort, type Photo } from "@/lib/resort";
import ResortPhoto from "./ResortPhoto";

export function PageHero({ label, title, description, photo }: {
  label: string;
  title: string;
  description: string;
  photo?: Photo;
}) {
  return (
    <header className={`page-hero${photo ? " has-photo" : ""}`}>
      {photo && <div className="hero-picture"><ResortPhoto photo={photo} sizes="100vw" priority /></div>}
      <div className="wrap page-hero-content">
        <p className="eyebrow">{label}</p>
        <h1>{title}</h1>
        <p className="page-intro">{description}</p>
      </div>
    </header>
  );
}

export function EnquireBand({ title = "Plan your visit", detail = "Get in touch with the resort for availability and enquiries." }: { title?: string; detail?: string }) {
  return (
    <section className="enquire-band">
      <div className="wrap enquire-inner">
        <div><h2>{title}</h2><p>{detail}</p></div>
        <div className="actions">
          <Link href="/contact/" className="button button-gold">Contact the resort</Link>
          <a href={resort.tel} className="button button-outline-light">{resort.phone}</a>
        </div>
      </div>
    </section>
  );
}

export function Feature({ id, photo, photoCaption, label, title, children, reverse = false }: {
  id?: string;
  photo: Photo;
  photoCaption?: string;
  label?: string;
  title: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section id={id} className={`feature${reverse ? " is-reversed" : ""}`}>
      <figure className="feature-figure">
        <div className="feature-photo"><ResortPhoto photo={photo} sizes="(max-width: 760px) 100vw, 55vw" /></div>
        {photoCaption && <figcaption>{photoCaption}</figcaption>}
      </figure>
      <div className="feature-copy">
        {label && <p className="eyebrow">{label}</p>}
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}
