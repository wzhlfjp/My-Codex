export type Dimensions = {
  width: number;
  height: number;
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);

export const formatCompactCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: value >= 1_000_000_000 ? 1 : 0
  }).format(value);

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
