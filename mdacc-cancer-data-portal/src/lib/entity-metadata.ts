export function uniqueCompactMetadata(items: Array<string | undefined>, max = 4): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const item of items) {
    const value = item?.trim();
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    output.push(value);
    if (output.length >= max) {
      break;
    }
  }

  return output;
}

export function formatUpdatedMetadata(lastUpdated: string | undefined): string | undefined {
  if (!lastUpdated?.trim()) {
    return undefined;
  }
  return `Updated ${lastUpdated.trim()}`;
}
