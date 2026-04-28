import { truncateWithEllipsis } from "@/lib/text-format";

export function MetadataChips({
  items,
  max = 4,
  className,
}: {
  items: string[];
  max?: number;
  className?: string;
}) {
  const chips = items.slice(0, max);
  if (chips.length === 0) {
    return null;
  }

  return (
    <ul className={["flex flex-wrap gap-2", className ?? "mt-3"].join(" ")}>
      {chips.map((chip, index) => (
        <li
          key={`${chip}-${index}`}
          title={chip}
          aria-label={chip}
          className="max-w-[14rem] overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-blue-100 bg-blue-50/70 px-2.5 py-1 text-xs font-medium text-blue-900 sm:max-w-[16rem]"
        >
          {truncateWithEllipsis(chip, 44)}
        </li>
      ))}
    </ul>
  );
}
