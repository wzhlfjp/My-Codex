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
          "rounded-md border px-2.5 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
          selected
            ? "border-slate-800 bg-slate-900 text-white hover:bg-slate-800"
            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900",
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
