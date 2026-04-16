const SEARCH_SYNONYM_GROUPS = [
  ["mri", "magnetic resonance imaging", "mr imaging"],
  ["ct", "computed tomography", "cat scan"],
  ["pet", "positron emission tomography"],
  ["ngs", "next generation sequencing"],
  ["rna seq", "rnaseq", "rna sequencing", "transcriptomics", "gene expression profiling"],
  ["single cell", "single-cell", "singlecell", "scrna", "sc rna"],
  ["mass spectrometry", "mass spec", "ms"],
  ["proteomics", "protein profiling", "protein measurement", "mass spectrometry"],
  ["immunotherapy", "immune therapy"],
];

function normalizeSearchValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^\w\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsSearchTerm(haystack: string, term: string): boolean {
  if (!term) {
    return false;
  }

  if (!haystack.includes(term)) {
    return false;
  }

  if (term.length >= 4 || term.includes(" ")) {
    return true;
  }

  const boundaryPattern = new RegExp(`\\b${escapeRegExp(term)}\\b`);
  return boundaryPattern.test(haystack);
}

function buildSynonymMap(groups: string[][]): Record<string, string[]> {
  const map: Record<string, string[]> = {};

  groups.forEach((group) => {
    const normalizedGroup = [...new Set(group.map((term) => normalizeSearchValue(term)).filter(Boolean))];
    normalizedGroup.forEach((term) => {
      map[term] = normalizedGroup.filter((candidate) => candidate !== term);
    });
  });

  return map;
}

const SEARCH_SYNONYMS = buildSynonymMap(SEARCH_SYNONYM_GROUPS);

export function tokenizeSearchInput(input: string): string[] {
  return input
    .split(/\s+/)
    .map((token) => normalizeSearchValue(token))
    .filter(Boolean);
}

export function buildTokenGroups(tokens: string[]): string[][] {
  return tokens
    .map((token) => {
      const normalizedToken = normalizeSearchValue(token);
      if (!normalizedToken) {
        return [];
      }

      const variants = new Set<string>([normalizedToken]);
      (SEARCH_SYNONYMS[normalizedToken] ?? []).forEach((synonym) => variants.add(synonym));
      return [...variants];
    })
    .filter((group) => group.length > 0);
}

export function matchesTokenGroups(tokenGroups: string[][], fields: Array<string | undefined>): boolean {
  if (tokenGroups.length === 0) {
    return true;
  }

  const combined = normalizeSearchValue(fields.filter((field): field is string => Boolean(field)).join(" "));
  return tokenGroups.every((group) => group.some((term) => containsSearchTerm(combined, term)));
}

export function scoreTokenGroups(tokenGroups: string[][], title: string, body: string): number {
  if (tokenGroups.length === 0) {
    return 0;
  }

  const titleLower = normalizeSearchValue(title);
  const bodyLower = normalizeSearchValue(body);

  let score = 0;

  for (const group of tokenGroups) {
    let groupScore = 0;

    group.forEach((term) => {
      let variantScore = 0;
      if (containsSearchTerm(titleLower, term)) {
        variantScore += 3;
      }
      if (containsSearchTerm(bodyLower, term)) {
        variantScore += 1;
      }
      if (variantScore > groupScore) {
        groupScore = variantScore;
      }
    });

    if (groupScore === 0) {
      return -1;
    }

    score += groupScore;
  }

  return score;
}
