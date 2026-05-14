import { AnimatedRankingEntry } from "../hooks/useInterpolatedCollegeRankings";
import { chartLayout, layout, theme } from "../styles/localTheme";
import { RankingRow } from "./RankingRow";

const axisX = chartLayout.left + chartLayout.rankWidth + chartLayout.labelWidth;
const ticks = [40000, 50000, 60000, 70000, 80000];

const tickX = (value: number) =>
  axisX + (value / chartLayout.maxAxisValue) * chartLayout.barWidth;

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
          color: "rgba(255, 253, 246, 0.84)",
          fontSize: 23,
          lineHeight: 1.25,
          fontWeight: 760,
          marginBottom: 8, 
          marginLeft: 20
        }}
      >
        College rankings shift slowly &mdash; but competition at the top is intense.
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
          Bar length: Tuition &amp; Fees
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
              ${Math.round(tick / 1000)}k
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
