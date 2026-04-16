function toTitleCaseWords(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 4 && word === word.toUpperCase()) {
        return word;
      }
      const lower = word.toLowerCase();
      return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
    })
    .join(" ");
}

export function formatProjectStatus(status?: string): string | undefined {
  const trimmed = status?.trim();
  if (!trimmed) {
    return undefined;
  }
  return toTitleCaseWords(trimmed.replace(/[_-]+/g, " "));
}

export function formatProjectType(projectType?: string): string | undefined {
  const trimmed = projectType?.trim();
  if (!trimmed) {
    return undefined;
  }
  return toTitleCaseWords(trimmed.replace(/[_-]+/g, " "));
}

export function formatProjectTimeline(startYear?: number, endYear?: number): string | undefined {
  if (startYear && endYear) {
    if (startYear === endYear) {
      return `${startYear}`;
    }
    return `${startYear} to ${endYear}`;
  }

  if (startYear) {
    return `Since ${startYear}`;
  }

  if (endYear) {
    return `Through ${endYear}`;
  }

  return undefined;
}
