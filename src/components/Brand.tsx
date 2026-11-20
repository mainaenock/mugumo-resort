import Image from "next/image";
import Link from "next/link";

const logo = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/mugumo-resort.webp`;

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="The Mugumo Valley Resort home">
      <Image className="brand-logo" src={logo} alt="" width={64} height={64} />
      <span>
        <span className="brand-name">Mugumo Valley</span>
        <span className="brand-location">Resort · Thika</span>
      </span>
    </Link>
  );
}
