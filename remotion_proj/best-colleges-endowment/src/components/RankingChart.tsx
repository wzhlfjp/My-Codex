import { AnimatedRankingEntry } from "../hooks/useInterpolatedEndowmentRankings";
import { chartLayout, layout, theme } from "../styles/localTheme";
import { RankingRow } from "./RankingRow";

const axisX = chartLayout.left + chartLayout.rankWidth + chartLayout.labelWidth;
const ticks = [1_000_000_000, 10_000_000_000, 25_000_000_000, 50_000_000_000];

const scaleValue = (value: number) => {
  const min = Math.log10(chartLayout.minAxisValue);
  const max = Math.log10(chartLayout.maxAxisValue);
  return (Math.log10(value) - min) / (max - min);
};

const tickX = (value: number) => axisX + scaleValue(value) * chartLayout.barWidth;

export const RankingChart = ({
  entries
}: {
  entries: AnimatedRankingEntry[];
}) => {
  return (
    <section
      style={{
        position: "absolute",
        left: layout.cardLeft,
        top: layout.cardTop,
        width: layout.cardWidth,
        height: layout.cardHeight,
        padding: `${layout.cardPaddingTop}px ${layout.cardPaddingX}px`,
        borderRadius: 36,
        border: `1px solid ${theme.colors.lineStrong}`,
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.135), rgba(255, 255, 255, 0.052)), rgba(3, 17, 34, 0.48)",
        boxShadow:
          "0 30px 82px rgba(0, 8, 20, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          color: "#fffdf6",
          fontSize: 31,
          lineHeight: 1,
          fontWeight: 930,
          marginLeft: 20,
          marginBottom: 8,
          textShadow: "0 4px 14px rgba(0, 0, 0, 0.42)"
        }}
      >
        Best Colleges with Endowment
      </div>
      <div
        style={{
          color: "rgba(255, 253, 246, 0.84)",
          fontSize: 20,
          lineHeight: 1.25,
          fontWeight: 760,
          marginBottom: 8,
          marginLeft: 20
        }}
      >
        An animated ranking story showing top U.S. colleges over time, with endowment shown as the financial-resource metric.
      </div>
      <div
        style={{
          position: "relative",
          width: chartLayout.width,
          height: chartLayout.height
        }}
      >
        <div
          style={{
            position: "absolute",
            left: axisX + chartLayout.barWidth / 2,
            top: 18,
            transform: "translateX(-50%)",
            color: "#fffdf6",
            fontSize: 18,
            fontWeight: 760,
            whiteSpace: "nowrap",
            textShadow: "0 3px 10px rgba(0, 0, 0, 0.42)"
          }}
        >
          Bar length: Endowment, log scale
        </div>
        {ticks.map((tick) => (
          <div key={tick}>
            <div
              style={{
                position: "absolute",
                left: tickX(tick),
                top: chartLayout.axisTop,
                width: 1.2,
                height: 940,
                background: "rgba(255, 255, 255, 0.115)"
              }}
            />
            <div
              style={{
                position: "absolute",
                left: tickX(tick) - 28,
                top: chartLayout.axisTop - 31,
                width: 56,
                color: "rgba(255, 255, 255, 0.38)",
                fontSize: 16,
                fontWeight: 700,
                textAlign: "center"
              }}
            >
              ${tick >= 1_000_000_000 ? `${Math.round(tick / 1_000_000_000)}B` : `${Math.round(tick / 1_000_000)}M`}
            </div>
          </div>
        ))}
        {entries.map((entry) => (
          <RankingRow key={entry.key} entry={entry} />
        ))}
      </div>
    </section>
  );
};
