export function truncateWithEllipsis(value: string, maxLength: number): string {
  const text = value.trim();
  if (maxLength < 2 || text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1)}…`;
}
