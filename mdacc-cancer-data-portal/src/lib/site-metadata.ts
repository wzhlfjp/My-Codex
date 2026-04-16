import type { Metadata } from "next";

export const SITE_NAME = "MD Anderson Cancer Data Portal";
export const DEFAULT_PORTAL_DESCRIPTION =
  "Research discovery portal for exploring researchers, projects, datasets, technologies, and disease areas using locally processed seed data.";

function resolveSiteUrl(rawValue?: string): URL {
  const fallback = new URL("http://localhost:3000");
  const value = rawValue?.trim();

  if (!value) {
    return fallback;
  }

  try {
    return new URL(value);
  } catch {
    try {
      return new URL(`https://${value}`);
    } catch {
      return fallback;
    }
  }
}

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function toOpenGraphTitle(title: string): string {
  return title === "Home" ? SITE_NAME : `${title} | ${SITE_NAME}`;
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function getAbsoluteSiteUrl(path: string): string {
  return new URL(normalizePath(path), SITE_URL).toString();
}

export function buildRouteMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const normalizedPath = normalizePath(path);

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical: normalizedPath,
    },
    openGraph: {
      title: toOpenGraphTitle(title),
      description,
      url: normalizedPath,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary",
      title: toOpenGraphTitle(title),
      description,
    },
  };
}
