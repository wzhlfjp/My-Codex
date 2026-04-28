import type { Metadata } from "next";
import "./globals.css";
import { CompareRoot } from "@/components/compare/compare-root";
import { AppShell } from "@/components/layout/app-shell";
import { DEFAULT_PORTAL_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-metadata";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_PORTAL_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_PORTAL_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: DEFAULT_PORTAL_DESCRIPTION,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--page-bg)] text-slate-900">
        <CompareRoot>
          <AppShell>{children}</AppShell>
        </CompareRoot>
      </body>
    </html>
  );
}
