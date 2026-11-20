import type { Metadata } from "next";
import { attractions, resort } from "@/lib/resort";
import Gallery from "@/components/Gallery";
import { PageHero } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "See the pool, grounds, dining and rooms at The Mugumo Valley Resort in Thika.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero label="Gallery" title="A look around Mugumo Valley" description="See the rooms, the pool and the spaces around the resort." />
      <section className="wrap section-space">
        <Gallery />
        <section className="photo-credits" id="photo-credits">
          <h2>Photo credits</h2>
          <p>Resort photos are from <a href={resort.listing}>The Mugumo Valley Resort’s Expedia listing</a>. The dining terrace photo is from <a href={resort.diningTerraceListing}>the resort’s Skyscanner listing</a>.</p>
          <ul>
            {attractions.map(({ name, credit }) => <li key={name}><a href={credit.href}>{name}</a> by {credit.author} · <a href={credit.licenseHref}>{credit.license}</a> · Resized and cropped for display.</li>)}
          </ul>
        </section>
      </section>
    </>
  );
}
