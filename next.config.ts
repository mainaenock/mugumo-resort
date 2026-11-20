import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function configureNext(phase: string): NextConfig {
  return {
    output: process.env.NEXT_STATIC_EXPORT === "1" ? "export" : undefined,
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    devIndicators: false,
    trailingSlash: true,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
    images: { unoptimized: true },
    turbopack: { root: process.cwd() },
  };
}
