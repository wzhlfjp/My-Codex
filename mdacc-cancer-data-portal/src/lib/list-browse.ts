import { buildTokenGroups, matchesTokenGroups, tokenizeSearchInput } from "@/lib/search";

export function tokenizeQuery(query: string): string[] {
  return tokenizeSearchInput(query);
}

export function matchesQueryTokens(tokens: string[], fields: Array<string | undefined>): boolean {
  return matchesTokenGroups(buildTokenGroups(tokens), fields);
}

export function compareUpdatedDesc(aUpdated: string | undefined, bUpdated: string | undefined): number {
  const a = aUpdated ?? "";
  const b = bUpdated ?? "";
  return b.localeCompare(a);
}
