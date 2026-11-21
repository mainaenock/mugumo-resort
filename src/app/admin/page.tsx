import type { Metadata } from "next";
import DemoAdmin from "@/components/DemoAdmin";
import "./admin.css";

export const metadata: Metadata = {
  title: "Demo admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <DemoAdmin />;
}
