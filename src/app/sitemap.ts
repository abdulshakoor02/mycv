import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://abdulshakoor.example.com";
  return [
    { url: base, lastModified: new Date("2026-01-01"), changeFrequency: "monthly", priority: 1 },
  ];
}
