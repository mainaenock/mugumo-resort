import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap section-space missing-page">
      <h1>Page not found</h1>
      <p>Visit the homepage to find rooms, dining and directions.</p>
      <Link href="/" className="button button-primary">Go to the homepage</Link>
    </div>
  );
}
