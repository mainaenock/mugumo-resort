import Link from "next/link";
import { MapPin, Waves, Utensils, BedDouble } from "lucide-react";
import { photos, resort } from "@/lib/resort";
import HomeHero from "@/components/HomeHero";
import ResortPhoto from "@/components/ResortPhoto";
import { EnquireBand, Feature } from "@/components/PageSections";

const stories = [
  { id: "rooms", title: "Stay in Thika", label: "Rooms", body: "Choose a single, double or twin room with a pool view.", photo: photos.double, href: "/rooms/", action: "Explore rooms" },
  { id: "dining", title: "Restaurant & bar", label: "Dining", body: "Sit down for breakfast, a meal or a drink at the resort.", photo: photos.diningTerrace, href: "/dining/", action: "Explore dining" },
  { id: "attractions", title: "Out and about", label: "Around Thika", body: "Make time for Fourteen Falls, Chania Falls or a hike at Ol Donyo Sabuk.", photo: photos.falls, href: "/attractions/", action: "Explore Thika" },
];

export default function Home() {
  return (
    <>
      <HomeHero />
      <div className="quick-facts">
        <div className="wrap facts-inner">
          <a href={resort.maps}><MapPin aria-hidden="true" /> Riverside Road, Thika</a>
          <Link href="/rooms/"><BedDouble aria-hidden="true" /> Pool-view rooms</Link>
          <Link href="/resort/"><Waves aria-hidden="true" /> Outdoor swimming</Link>
          <Link href="/dining/"><Utensils aria-hidden="true" /> Restaurant & bar</Link>
        </div>
      </div>
      <div className="wrap section-space">
        <Feature id="welcome" photo={photos.grounds} label="The resort" title="A slower pace in Thika">
          <p>Spend the afternoon by the pool or find a spot under the trees. The resort grounds have space to sit outside, with a playground for younger visitors.</p>
          <Link href="/resort/" className="text-link">Discover the grounds</Link>
        </Feature>
      </div>
      <section className="tinted section-space">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">Your visit</p><h2>Make a day of it</h2></div>
          <div className="card-grid">
            {stories.map((story) => (
              <article id={story.id} className="story-card" key={story.id}>
                <Link className="card-photo" href={story.href} aria-label={story.action}><ResortPhoto photo={story.photo} sizes="(max-width: 760px) 100vw, 33vw" /></Link>
                <div className="card-copy">
                  <p className="eyebrow">{story.label}</p>
                  <h3>{story.title}</h3>
                  <p>{story.body}</p>
                  <Link className="text-link" href={story.href}>{story.action}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <div id="contact"><EnquireBand /></div>
    </>
  );
}
