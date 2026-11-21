import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogArticle } from "@/components/ResortBlog";

export const metadata: Metadata = { title: "Mugumo Valley Blog", robots: { index: false } };

export default function BlogPostPage() {
  return <Suspense fallback={<p className="wrap section-space">Loading post…</p>}><BlogArticle /></Suspense>;
}
