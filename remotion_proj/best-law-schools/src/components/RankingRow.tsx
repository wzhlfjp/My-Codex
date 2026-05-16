import { AnimatedRankingEntry } from "../hooks/useInterpolatedLawRankings";
import { chartLayout, theme } from "../styles/localTheme";

const movementStyle = (entry: AnimatedRankingEntry) => {
  if (entry.movement.kind === "up") {
    return { label: `+${entry.movement.delta}`, color: theme.colors.teal };
  }
  if (entry.movement.kind === "down") {
    return { label: `${entry.movement.delta}`, color: "rgba(255, 140, 128, 0.92)" };
  }
  if (entry.movement.kind === "new") {
    return { label: "NEW", color: theme.colors.gold };
  }
  return { label: "\u2014", color: "rgba(255, 255, 255, 0.48)" };
};

const getNameFontSize = (name: string) => {
  /*
  if (name.length > 52) {
    return 15;
  }
  if (name.length > 44) {
    return 16;
  }
  if (name.length > 36) {
    return 17;
  }
  if (name.length > 28) {
    return 19;
  }
    */
  return 22;
};

export const RankingRow = ({ entry }: { entry: AnimatedRankingEntry }) => {
  const y =
    chartLayout.rowTop +
    entry.animatedIndex * (chartLayout.rowHeight + chartLayout.rowGap);
  const rankLabel = `#${entry.rank}${entry.tied ? "T" : ""}`;
  const movement = movementStyle(entry);

  return (
    <div
      style={{
        position: "absolute",
        left: chartLayout.left,
        top: y,
        width:
          chartLayout.rankWidth +
          chartLayout.labelWidth +
          chartLayout.movementWidth,
        height: chartLayout.rowHeight,
        display: "flex",
        alignItems: "center",
        filter:
          entry.rank === 1 ? "drop-shadow(0 0 10px rgba(240, 195, 90, 0.2))" : undefined
      }}
    >
      <div
        style={{
          width: chartLayout.rankWidth,
          paddingRight:37,
          color: theme.colors.gold,
          fontSize: 24,
          fontWeight: 950,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 3px 10px rgba(0, 0, 0, 0.45)"
        }}
      >
        {rankLabel}
      </div>
      <div
        style={{
          width: chartLayout.labelWidth,
          paddingRight: 22,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 0
        }}
      >
        <div
          style={{
            color: "#fffefa",
            fontSize: getNameFontSize(entry.name),
            fontWeight: 860,
            lineHeight: 1.02,
            whiteSpace: "normal",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textShadow: "0 3px 10px rgba(0, 0, 0, 0.45)"
          }}
        >
          {entry.name}
        </div>
      </div>
      <div
        style={{
          width: chartLayout.movementWidth,
          color: movement.color,
          fontSize: movement.label === "NEW" ? 22 : 24,
          lineHeight: 1,
          fontWeight: 920,
          fontVariantNumeric: "tabular-nums",
          textAlign: "right",
          textShadow: "0 3px 10px rgba(0, 0, 0, 0.5)"
        }}
      >
        {movement.label}
      </div>
      <div
        style={{
          position: "absolute",
          left: chartLayout.rankWidth,
          right: 0,
          bottom: -4,
          height: 1,
          background: "rgba(255, 255, 255, 0.04)"
        }}
      />
    </div>
  );
};
