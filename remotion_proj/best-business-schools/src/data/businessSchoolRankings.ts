import generated from "./generated/businessSchoolRankings.generated.json";

export type SchoolKey = string;

export type RankingEntry = {
  key: SchoolKey;
  rank: number;
  tied: boolean;
  name: string;
  fullName: string;
  color: string;
  overallScore: number | null;
  rankingSourceId: string;
};

export type RankingMovement = {
  kind: "new" | "up" | "down" | "same";
  delta: number | null;
  previousRank: number | null;
};

export type YearlyRanking = {
  year: number;
  status: string;
  statusNote: string | null;
  statusSourceId: string | null;
  entries: RankingEntry[];
};

export const START_YEAR = generated.startYear;
export const END_YEAR = generated.endYear;
export const VISUAL_METRIC = generated.visualMetric;
export const YEAR_DURATION_SECONDS = 1.5;

export const YEARS = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, index) => START_YEAR + index
);

export const YEARLY_RANKINGS = generated.years as YearlyRanking[];

export const getRankingForYear = (year: number): YearlyRanking => {
  const ranking = YEARLY_RANKINGS.find((item) => item.year === year);
  if (!ranking) {
    return {
      year,
      status: "missing",
      statusNote: null,
      statusSourceId: null,
      entries: []
    };
  }
  return ranking;
};
