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

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
