import Link from "next/link";
import { navigation, resort } from "@/lib/resort";
import Brand from "./Brand";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="footer-description">Rooms, dining and time outdoors in Riverside, Thika.</p>
          </div>
          <nav aria-label="Footer navigation">
            <h2>Explore</h2>
            <ul>{navigation.slice(1).map(({ label, href }) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          </nav>
          <div className="footer-contact">
            <h2>Find us</h2>
            <p>{resort.address}, Kenya</p>
            <a href={resort.tel}>{resort.phone}</a>
            <Link href="/contact/">Contact & directions</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <small>© {resort.name}</small>
          <Link href="/gallery/#photo-credits">Photo credits</Link>
        </div>
      </div>
    </footer>
  );
}
