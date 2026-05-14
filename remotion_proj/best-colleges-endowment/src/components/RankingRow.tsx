import { formatCompactCurrency } from "@remotion-proj/shared";
import { AnimatedRankingEntry } from "../hooks/useInterpolatedEndowmentRankings";
import { chartLayout, theme } from "../styles/localTheme";

const axisX = chartLayout.left + chartLayout.rankWidth + chartLayout.labelWidth;

const valueToWidth = (value: number) => {
  const min = Math.log10(chartLayout.minAxisValue);
  const max = Math.log10(chartLayout.maxAxisValue);
  const scaled = (Math.log10(Math.max(value, chartLayout.minAxisValue)) - min) / (max - min);
  return Math.max(24, Math.min(chartLayout.barWidth, scaled * chartLayout.barWidth));
};

export const RankingRow = ({
  entry
}: {
  entry: AnimatedRankingEntry;
}) => {
  const y =
    chartLayout.rowTop +
    entry.animatedIndex * (chartLayout.rowHeight + chartLayout.rowGap);
  const width = entry.hasEndowment
    ? valueToWidth(entry.animatedVisualValue)
    : chartLayout.missingBarWidth;
  const valueLabel =
    entry.endowment === null ? "N/A" : formatCompactCurrency(entry.endowment.value);
  const stats = [
    entry.acceptanceRate === null ? null : `Adm. ${entry.acceptanceRate}%`,
    entry.graduationRate === null ? null : `Grad. ${entry.graduationRate}%`
  ].filter(Boolean);

  return (
    <div
      style={{
        position: "absolute",
        left: chartLayout.left,
        top: y,
        width:
          chartLayout.rankWidth +
          chartLayout.labelWidth +
          chartLayout.barWidth +
          chartLayout.valueWidth,
        height: chartLayout.rowHeight,
        display: "flex",
        alignItems: "center",
        filter:
          entry.rank === 1 ? "drop-shadow(0 0 10px rgba(240, 195, 90, 0.18))" : undefined
      }}
    >
      <div
        style={{
          width: chartLayout.rankWidth,
          paddingRight: 12,
          color: theme.colors.gold,
          fontSize: 22,
          fontWeight: 950,
          textAlign: "right",
          textShadow: "0 3px 10px rgba(0, 0, 0, 0.45)"
        }}
      >
        #{entry.rank}
      </div>
      <div
        style={{
          width: chartLayout.labelWidth,
          paddingRight: 18,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 0
        }}
      >
        <div
          style={{
            color: "#fffefa",
            fontSize: 22,
            fontWeight: 860,
            lineHeight: 1.02,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textShadow: "0 3px 10px rgba(0, 0, 0, 0.45)"
          }}
        >
          {entry.name}
        </div>
        <div
          style={{
            marginTop: 4,
            color: "rgba(255, 255, 255, 0.68)",
            fontSize: 15,
            fontWeight: 730,
            lineHeight: 1
          }}
        >
          {stats.length > 0 ? stats.join("   ") : "N/A"}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          width: chartLayout.barWidth,
          height: chartLayout.rowHeight,
          display: "flex",
          alignItems: "center"
        }}
      >
        <div
          style={{
            width,
            height: chartLayout.barHeight,
            borderRadius: 999,
            background: entry.hasEndowment ? entry.color : "rgba(255, 253, 246, 0.16)",
            boxShadow: entry.hasEndowment
              ? "0 8px 16px rgba(0, 9, 20, 0.28)"
              : "none"
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: chartLayout.rankWidth + chartLayout.labelWidth + width + 14,
          top: 5,
          color: entry.hasEndowment ? "#fffdf6" : "rgba(255, 255, 255, 0.48)",
          fontSize: 20,
          fontWeight: 920,
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 3px 10px rgba(0, 0, 0, 0.5)"
        }}
      >
        {valueLabel}
      </div>
      <div
        style={{
          position: "absolute",
          left: axisX - chartLayout.left,
          right: 0,
          bottom: -4,
          height: 1,
          background: "rgba(255, 255, 255, 0.04)"
        }}
      />
    </div>
  );
};
