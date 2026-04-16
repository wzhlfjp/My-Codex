import { describe, expect, it } from "vitest";
import { buildRouteMetadata, getAbsoluteSiteUrl, SITE_NAME, SITE_URL } from "@/lib/site-metadata";

describe("site metadata helpers", () => {
  it("builds canonical and sharing metadata consistently", () => {
    const metadata = buildRouteMetadata({
      title: "Explore",
      description: "Explore the portal",
      path: "/explore",
    });

    expect(metadata.alternates?.canonical).toBe("/explore");
    expect(metadata.openGraph?.url).toBe("/explore");
    expect(metadata.openGraph?.siteName).toBe(SITE_NAME);
    expect(metadata.twitter?.card).toBe("summary");
  });

  it("builds absolute URLs from site base", () => {
    const absolute = getAbsoluteSiteUrl("/sitemap.xml");
    expect(absolute.startsWith(SITE_URL.origin)).toBe(true);
    expect(absolute.endsWith("/sitemap.xml")).toBe(true);
  });
});
