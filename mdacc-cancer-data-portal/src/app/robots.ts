import type { MetadataRoute } from "next";
import { getAbsoluteSiteUrl, SITE_URL } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: getAbsoluteSiteUrl("/sitemap.xml"),
    host: SITE_URL.origin,
  };
}
