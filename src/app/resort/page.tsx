import type { Metadata } from "next";
import { photos, resort } from "@/lib/resort";
import { EnquireBand, Feature, PageHero } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "The Resort",
  description: "Explore the outdoor pool, gardens and playground at The Mugumo Valley Resort in Riverside, Thika.",
};

export default function ResortPage() {
  return (
    <>
      <PageHero label="The resort" title="Time outdoors" description="Take a dip, sit in the gardens or bring the family out for the afternoon." photo={photos.gardenPool} />
      <div className="wrap section-space feature-stack">
        <Feature photo={photos.pool} label="Swimming" title="By the pool">
          <p>Swim in the outdoor pool or sit on the terrace. Call the resort for current pool hours and day-visit arrangements.</p>
          <a className="text-link" href={resort.tel}>Ask about swimming</a>
        </Feature>
        <Feature photo={photos.playground} label="Families" title="Room to play" reverse>
          <p>The grounds include a children’s playground with slides and climbing equipment, set among the trees and lawn.</p>
        </Feature>
        <Feature photo={photos.grounds} label="The grounds" title="Under the trees">
          <p>Find outdoor seating on the property. If you’re planning a group visit or an occasion, ask the resort about available spaces.</p>
        </Feature>
      </div>
      <EnquireBand />
    </>
  );
}
