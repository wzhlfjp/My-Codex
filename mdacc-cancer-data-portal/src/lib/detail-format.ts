export function hasDisplayValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "number") {
    return !Number.isNaN(value);
  }

  return true;
}

const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDateForDisplay(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map((part) => Number.parseInt(part, 10));
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    return DISPLAY_DATE_FORMATTER.format(utcDate);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }
  return DISPLAY_DATE_FORMATTER.format(parsed);
}

export function pluralizeWord(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return singular;
  }
  if (plural) {
    return plural;
  }

  if (singular.endsWith("y") && singular.length > 1) {
    const letterBeforeY = singular[singular.length - 2].toLowerCase();
    if (!["a", "e", "i", "o", "u"].includes(letterBeforeY)) {
      return `${singular.slice(0, -1)}ies`;
    }
  }

  return `${singular}s`;
}

export function formatCountValue(count: number, singular: string, plural?: string): string | undefined {
  if (count <= 0) {
    return undefined;
  }
  return `${count} ${pluralizeWord(count, singular, plural)}`;
}

export function formatRelatedSummary(count: number, singular: string, plural?: string): string {
  return `${count} related ${pluralizeWord(count, singular, plural)}.`;
}
