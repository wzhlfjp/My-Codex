"use client";

import { useState } from "react";
import { useCompare } from "@/components/compare/compare-context";
import type { CompareEntityType } from "@/types/domain";

export function CompareToggleButton({
  type,
  id,
  label,
  className,
}: {
  type: CompareEntityType;
  id: string;
  label: string;
  className?: string;
}) {
  const { isSelected, toggleItem } = useCompare();
  const [status, setStatus] = useState("");

  const selected = isSelected(type, id);

  const handleClick = () => {
    const result = toggleItem(type, { id, label });
    setStatus(result.message);
    window.setTimeout(() => setStatus(""), 1800);
  };

  return (
    <div className={["flex flex-col items-start gap-1", className ?? ""].join(" ").trim()}>
      <button
        type="button"
        onClick={handleClick}
        className={[
          "rounded-xl border px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
          selected
            ? "border-blue-700 bg-blue-700 text-white hover:bg-blue-600"
            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white",
        ].join(" ")}
        aria-pressed={selected}
      >
        {selected ? "Remove from compare" : "Add to compare"}
      </button>
      <p aria-live="polite" className="min-h-4 text-xs text-slate-500">
        {status}
      </p>
    </div>
  );
}
