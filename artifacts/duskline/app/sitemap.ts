import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { kits } from "@/lib/kits";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/trade",
    "/quote-builder",
    "/trade-resources",
    "/trade-resources/12v-vs-24v",
    "/trade-resources/ip-ratings-explained",
    "/trade-resources/driver-sizing",
    "/terms",
    "/privacy",
  ];

  const kitRoutes = kits.map((kit) => `/kits/${kit.slug}`);

  return [...staticRoutes, ...kitRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
