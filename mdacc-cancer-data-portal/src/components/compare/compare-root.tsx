"use client";

import { CompareProvider } from "@/components/compare/compare-context";

export function CompareRoot({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      {children}
    </CompareProvider>
  );
}
