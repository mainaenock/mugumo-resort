"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { showDate } from "@/lib/booking";
import { blogPhotos, postHref } from "@/lib/catalog";
import { getPosts, useDemoData } from "@/lib/demo-store";
import ResortPhoto from "./ResortPhoto";
import { PageHero } from "./PageSections";

export function BlogListing() {
  const { data } = useDemoData();
  const posts = getPosts(data).filter((post): post is typeof post & { publishedAt: string } => post.publishedAt !== null)
    .sort((first, second) => second.publishedAt.localeCompare(first.publishedAt));
  if (!posts.length) return <p className="catalog-empty">There are no published posts yet.</p>;
  return (
    <div className="card-grid">
      {posts.map((post) => <article className="story-card" key={post.id}>
        <Link className="card-photo" href={postHref(post.id)} aria-label={post.title}><ResortPhoto photo={blogPhotos[post.image]} sizes="(max-width: 760px) 100vw, 33vw" /></Link>
        <div className="card-copy">
          <time className="blog-date" dateTime={post.publishedAt}>{showDate(post.publishedAt)}</time>
          <h2 className="blog-card-title">{post.title}</h2>
          <p>{post.excerpt}</p>
          <Link className="text-link" href={postHref(post.id)} aria-label={`Read ${post.title}`}>Read post</Link>
        </div>
      </article>)}
    </div>
  );
}

export function BlogArticle() {
  const id = useSearchParams().get("post");
  const { data, ready } = useDemoData();
  const post = getPosts(data).find((item) => item.id === id && item.publishedAt);
  if (!post?.publishedAt) return <section className="wrap section-space missing-page">
    <h1>{ready ? "Post unavailable" : "Loading post…"}</h1>
    <Link className="text-link" href="/blog/">Back to the blog</Link>
  </section>;

  return (
    <article>
      <PageHero label="Mugumo Valley Blog" title={post.title} description={post.excerpt} photo={blogPhotos[post.image]} />
      <div className="wrap section-space blog-article">
        <time className="blog-date" dateTime={post.publishedAt}>{showDate(post.publishedAt)}</time>
        <div className="blog-body">{post.body.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <Link className="text-link" href="/blog/">Back to the blog</Link>
      </div>
    </article>
  );
}
