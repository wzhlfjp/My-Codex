import { ENDOWMENT_SOURCE_URLS, POPULATED_YEARS } from "./collegeEndowmentRankings";

export const ENDOWMENT_SOURCE_SUMMARY = [
  "NACUBO historic endowment market-values workbook covering fiscal years 1974 through 2023.",
  "2024 NACUBO-Commonfund Study of Endowments public institution market-value table.",
  "2025 NACUBO-Commonfund Study of Endowments public institution market-value table.",
  "Official university or university-archive sources for individually verified values missing from the NACUBO public workbook."
] as const;

export const ENDOWMENT_SOURCE_LINKS = ENDOWMENT_SOURCE_URLS;

export const ENDOWMENT_POPULATED_YEARS = POPULATED_YEARS;
