"use client";

import { CompareProvider } from "@/components/compare/compare-context";
import { CompareTray } from "@/components/compare/compare-tray";

export function CompareRoot({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      {children}
      <CompareTray />
    </CompareProvider>
  );
}
