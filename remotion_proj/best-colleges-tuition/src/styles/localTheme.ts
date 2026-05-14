export const theme = {
  colors: {
    ink: "#f9fbff",
    muted: "rgba(255, 255, 255, 0.58)",
    faint: "rgba(255, 255, 255, 0.34)",
    gold: "#f0c35a",
    teal: "#27c7bd",
    navy: "#020a16",
    panel: "rgba(3, 17, 34, 0.56)",
    line: "rgba(179, 229, 232, 0.18)",
    lineStrong: "rgba(179, 229, 232, 0.3)"
  },
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
} as const;

export const layout = {
  videoWidth: 1080,
  videoHeight: 1920,
  safeMarginX: 80,
  headerTop: 75,
  headerLeft: 80,
  progressTopGap: 25,
  cardLeft: 58,
  cardTop: 395,
  cardWidth: 964,
  cardHeight: 1160,
  cardPaddingX: 30,
  cardPaddingTop: 30,
  yearRight: 86,
  yearBottom: 162,
  sourceLeft: 78,
  sourceBottom: 72
} as const;

export const chartLayout = {
  width: 904,
  height: 1042,
  left: 30,
  rankWidth: 56,
  labelWidth: 250,
  barWidth: 420,
  valueWidth: 102,
  axisTop: 80,
  rowTop: 100,
  rowGap: 8,
  rowHeight: 40,
  barHeight: 20,
  maxAxisValue: 80000,
  missingValue: 4200
} as const;
