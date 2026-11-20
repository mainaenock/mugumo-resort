import type { Metadata } from "next";
import { MapPin, Phone, CalendarDays, CircleParking } from "lucide-react";
import { photos, resort } from "@/lib/resort";
import { PageHero } from "@/components/PageSections";
import ResortPhoto from "@/components/ResortPhoto";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description: "Get directions to Riverside Road in Thika, call The Mugumo Valley Resort or check room availability online.",
};

const questions = [
  { question: "How do I book a room?", answer: "Call the resort to enquire about your dates and room preference. You can also check dates and rates on Expedia." },
  { question: "What time is check-in and check-out?", answer: "Check-in starts at 2:00 pm and check-out is by 10:30 am. Contact the resort if you need to arrange a different time." },
  { question: "Can I visit for swimming or dining?", answer: "Call ahead to confirm day-visit availability, pool access and restaurant hours." },
  { question: "Can I park at the resort?", answer: "The property lists free on-site self-parking." },
  { question: "Are the upper floors accessible by lift?", answer: "The property listing says upper floors are accessible by stairs. Call to discuss your access needs before visiting." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero label="Contact & directions" title="Plan your visit" description="Find us on Riverside Road in Thika. Call the resort to ask about stays, dining or day visits." />
      <div className="wrap section-space">
        <section className="contact-grid" aria-label="Contact information">
          <div className="contact-panel">
            <h2>Get in touch</h2>
            <div className="contact-row"><Phone aria-hidden="true" /><div><h3>Resort phone</h3><a href={resort.tel}>{resort.phone}</a></div></div>
            <div className="contact-row"><MapPin aria-hidden="true" /><div><h3>Address</h3><p>{resort.address}, Kenya</p><a className="text-link" href={resort.maps}>Get directions</a></div></div>
            <div className="contact-row"><CalendarDays aria-hidden="true" /><div><h3>Room availability</h3><a className="text-link" href={resort.listing}>View dates and rates on Expedia</a></div></div>
            <div className="contact-row"><CircleParking aria-hidden="true" /><div><h3>Parking</h3><p>Free on-site self-parking</p></div></div>
          </div>
          <div className="contact-image">
            <ResortPhoto photo={photos.grounds} sizes="(max-width: 760px) 100vw, 50vw" />
            <a className="button button-gold" href={resort.maps}><MapPin size={19} aria-hidden="true" /> Open in Google Maps</a>
          </div>
        </section>
        <section id="faq" className="faq">
          <div className="section-heading"><h2>Before you arrive</h2></div>
          {questions.map(({ question, answer }) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </section>
      </div>
    </>
  );
}
