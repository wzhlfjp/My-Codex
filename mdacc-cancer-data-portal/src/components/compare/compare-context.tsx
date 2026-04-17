"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  buildCompareUrl,
  COMPARE_MAX_ITEMS,
  getCompareTypeLabel,
  type CompareSelection,
  type CompareSelectionItem,
} from "@/lib/compare";
import type { CompareEntityType } from "@/types/domain";

const STORAGE_KEY = "mdacc-portal-compare-selection-v1";

type CompareActionResult = {
  ok: boolean;
  message: string;
};

type CompareContextValue = {
  selection: CompareSelection;
  compareUrl: string | null;
  maxItems: number;
  isSelected: (type: CompareEntityType, id: string) => boolean;
  toggleItem: (type: CompareEntityType, item: CompareSelectionItem) => CompareActionResult;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CompareContext = createContext<CompareContextValue | null>(null);

function normalizeSelection(input: unknown): CompareSelection {
  if (!input || typeof input !== "object") {
    return { type: null, items: [] };
  }

  const rawType = (input as { type?: string }).type;
  const rawItems = (input as { items?: Array<{ id?: string; label?: string }> }).items;
  const type: CompareEntityType | null =
    rawType === "researcher" ||
    rawType === "dataset" ||
    rawType === "project" ||
    rawType === "technology" ||
    rawType === "disease-area"
      ? rawType
      : null;

  if (!Array.isArray(rawItems) || !type) {
    return { type, items: [] };
  }

  const seen = new Set<string>();
  const items = rawItems
    .map((item) => ({
      id: item.id?.trim() ?? "",
      label: item.label?.trim() || item.id?.trim() || "",
    }))
    .filter((item) => item.id.length > 0 && item.label.length > 0)
    .filter((item) => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    })
    .slice(0, COMPARE_MAX_ITEMS);

  return { type, items };
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<CompareSelection>(() => {
    if (typeof window === "undefined") {
      return { type: null, items: [] };
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { type: null, items: [] };
      }
      const parsed = JSON.parse(raw) as unknown;
      return normalizeSelection(parsed);
    } catch {
      return { type: null, items: [] };
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // no-op if localStorage is unavailable
    }
  }, [selection]);

  const value = useMemo<CompareContextValue>(() => {
    const isSelected = (type: CompareEntityType, id: string): boolean =>
      selection.type === type && selection.items.some((item) => item.id === id);

    const toggleItem = (type: CompareEntityType, item: CompareSelectionItem): CompareActionResult => {
      const nextId = item.id.trim();
      const nextLabel = item.label.trim() || nextId;

      if (!nextId) {
        return { ok: false, message: "Unable to compare an item without an ID." };
      }

      if (!selection.type || selection.type !== type) {
        setSelection({ type, items: [{ id: nextId, label: nextLabel }] });
        return { ok: true, message: `Started comparing ${getCompareTypeLabel(type).toLowerCase()}.` };
      }

      const exists = selection.items.some((entry) => entry.id === nextId);
      if (exists) {
        const remaining = selection.items.filter((entry) => entry.id !== nextId);
        setSelection({
          type: remaining.length > 0 ? type : null,
          items: remaining,
        });
        return { ok: true, message: "Removed from compare." };
      }

      if (selection.items.length >= COMPARE_MAX_ITEMS) {
        return { ok: false, message: `Compare limit reached (${COMPARE_MAX_ITEMS} items).` };
      }

      setSelection({
        type,
        items: [...selection.items, { id: nextId, label: nextLabel }],
      });
      return { ok: true, message: "Added to compare." };
    };

    const removeItem = (id: string) => {
      const remaining = selection.items.filter((entry) => entry.id !== id);
      setSelection({
        type: remaining.length > 0 ? selection.type : null,
        items: remaining,
      });
    };

    const clear = () => setSelection({ type: null, items: [] });

    const compareUrl =
      selection.type && selection.items.length > 0
        ? buildCompareUrl(
            selection.type,
            selection.items.map((item) => item.id),
          )
        : null;

    return {
      selection,
      compareUrl,
      maxItems: COMPARE_MAX_ITEMS,
      isSelected,
      toggleItem,
      removeItem,
      clear,
    };
  }, [selection]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareContextValue {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider.");
  }
  return context;
}
