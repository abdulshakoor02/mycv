import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://abdulshakoor.example.com";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
