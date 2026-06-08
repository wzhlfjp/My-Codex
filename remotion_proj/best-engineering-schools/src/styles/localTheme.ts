export const theme = {
  colors: {
    ink: "#f9fbff",
    muted: "rgba(255, 255, 255, 0.62)",
    faint: "rgba(255, 255, 255, 0.36)",
    gold: "#f0c35a",
    teal: "#27c7bd",
    coral: "#e65d4f",
    navy: "#020a16",
    panel: "rgba(3, 17, 34, 0.58)",
    line: "rgba(179, 229, 232, 0.18)",
    lineStrong: "rgba(179, 229, 232, 0.31)"
  },
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
} as const;

export const layout = {
  videoWidth: 1080,
  videoHeight: 1920,
  safeMarginX: 78,
  headerTop: 72,
  headerLeft: 78,
  progressTopGap: 24,
  cardLeft: 54,
  cardTop: 380,
  cardWidth: 972,
  cardHeight: 1280,
  cardPaddingX: 28,
  cardPaddingTop: 50,
  yearRight: 82,
  yearBottom: 58,
  sourceLeft: 78,
  sourceBottom: 70
} as const;

export const chartLayout = {
  width: 916,
  height: 1060,
  left: 60,
  rankWidth: 100,
  labelWidth: 620,
  movementWidth: 136,
  axisTop: 82,
  rowTop: 60,
  rowGap: 8,
  rowHeight: 36
} as const;
