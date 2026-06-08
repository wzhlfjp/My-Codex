import { AnimatedRankingEntry } from "../hooks/useInterpolatedEngineeringRankings";
import { chartLayout, layout, theme } from "../styles/localTheme";
import { RankingRow } from "./RankingRow";

export const RankingChart = ({
  entries,
  hasData,
  statusNote,
  callout
}: {
  entries: AnimatedRankingEntry[];
  hasData: boolean;
  statusNote: string | null;
  callout: string;
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
          "linear-gradient(180deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.05)), rgba(3, 17, 34, 0.5)",
        boxShadow:
          "0 30px 82px rgba(0, 8, 20, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.07)",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          color: "rgba(255, 253, 246, 0.84)",
          fontSize: 24,
          lineHeight: 1.24,
          fontWeight: 760,
          marginBottom: 8,
          marginLeft: 20
        }}
      >
        Rank movement vs. previous verified ranking year.
      </div>
      <div
        style={{
          margin: "0 20px 12px",
          minHeight: 48,
          display: "flex",
          alignItems: "center",
          color: "#fffdf6",
          fontSize: 30,
          lineHeight: 1.16,
          fontWeight: 850,
          textShadow: "0 3px 10px rgba(0, 0, 0, 0.42)"
        }}
      >
        {callout}
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
            left: chartLayout.left,
            top: 24,
            width:
              chartLayout.rankWidth +
              chartLayout.labelWidth +
              chartLayout.movementWidth,
            display: "flex",
            color: "rgba(255, 253, 246, 0.56)",
            fontSize: 15,
            fontWeight: 760,
            letterSpacing: 1.8,
            textTransform: "uppercase"
          }}
        >
          <span style={{ width: chartLayout.rankWidth, textAlign: "right", paddingRight: 12 }}>
            Rank
          </span>
          <span style={{ width: chartLayout.labelWidth, paddingLeft: 0 }}>School</span>
          <span style={{ width: chartLayout.movementWidth, textAlign: "right" }}>
            Move
          </span>
        </div>
        {hasData ? (
          entries.map((entry) => <RankingRow key={entry.key} entry={entry} />)
        ) : (
          <div
            style={{
              position: "absolute",
              inset: "210px 42px auto",
              minHeight: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "rgba(255,255,255,0.68)",
              fontSize: 34,
              lineHeight: 1.2,
              fontWeight: 820
            }}
          >
            {statusNote ?? "No verified ranking rows for this publication year."}
          </div>
        )}
      </div>
    </section>
  );
};
