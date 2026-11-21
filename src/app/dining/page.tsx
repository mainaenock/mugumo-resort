import type { Metadata } from "next";
import Link from "next/link";
import { photos, resort } from "@/lib/resort";
import { Feature, PageHero } from "@/components/PageSections";
import DiningMenu from "@/components/DiningMenu";

export const metadata: Metadata = {
  title: "Dining",
  description: "Find out about breakfast, the restaurant and the bar at The Mugumo Valley Resort.",
};

export default function DiningPage() {
  return (
    <>
      <PageHero
        label="Dining"
        title="Restaurant & bar"
        description="Start the day with breakfast or stop by the restaurant and bar during your visit."
        photo={photos.diningTerrace}
      />
      <div className="wrap section-space">
        <div className="feature-stack">
          <Feature
            label="Restaurant"
            title="A table at Mugumo Valley"
            photo={photos.diningIllustration}
            photoCaption="AI-generated dining illustration."
          >
            <p>Call ahead to ask about the current menu, dietary requirements, or a table for your group.</p>
            <div className="actions">
              <Link className="button button-primary" href="#menu">Browse sample menu</Link>
              <a className="text-link" href={resort.tel}>Call about dining</a>
            </div>
          </Feature>
          <Feature title="Bar lounge" photo={photos.barTable} reverse>
            <p>Stop by the on-site bar for a drink. Ask the resort for current opening hours.</p>
          </Feature>
        </div>
        <div className="info-panel">
          <div>
            <h3>Breakfast</h3>
            <p>Continental breakfast is listed for overnight guests, from 7:30 to 9:30 am.</p>
          </div>
        </div>
        <DiningMenu />
      </div>
    </>
  );
}
