import type { Metadata } from "next";
import { BlogListing } from "@/components/ResortBlog";
import { PageHero } from "@/components/PageSections";
import { photos } from "@/lib/resort";

export const metadata: Metadata = {
  title: "Blog",
  description: "Ideas for a stay in Thika and stories from The Mugumo Valley Resort.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero label="Blog" title="Stories from Mugumo Valley" description="Ideas for your stay and a few ways to spend your time in Thika." photo={photos.grounds} />
      <section className="wrap section-space" aria-label="Blog posts"><BlogListing /></section>
    </>
  );
}
