import type { Metadata } from "next";
import { attractions, photos } from "@/lib/resort";
import { EnquireBand, Feature, PageHero } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Explore Thika",
  description: "Plan visits to Fourteen Falls, Ol Donyo Sabuk National Park and Chania Falls during your time in Thika.",
};

export default function AttractionsPage() {
  return (
    <>
      <PageHero label="Around Thika" title="Explore beyond the resort" description="Waterfalls and trails to visit during your time in Thika." photo={photos.falls} />
      <div className="wrap section-space feature-stack">
        {attractions.map((attraction, index) => (
          <Feature key={attraction.name} photo={attraction.photo} label={attraction.type} title={attraction.name} reverse={index % 2 === 1}>
            <p>{attraction.description}</p>
            <div className="actions">
              <a className="button button-primary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.mapQuery)}`}>View on Google Maps</a>
              {attraction.official && <a className="text-link" href={attraction.official}>Park information</a>}
            </div>
          </Feature>
        ))}
      </div>
      <EnquireBand />
    </>
  );
}
