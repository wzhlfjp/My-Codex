import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { END_YEAR } from "../data/collegeTuitionRankings";
import { layout, theme } from "../styles/localTheme";

export const YearDisplay = ({ year }: { year: number }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const finalPulse =
    year === END_YEAR
      ? interpolate(
          frame,
          [durationInFrames - 28, durationInFrames - 15, durationInFrames - 1],
          [1, 1.035, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 1;

  return (
    <div
      style={{
        position: "absolute",
        right: layout.yearRight,
        bottom: layout.yearBottom,
        textAlign: "right",
        transform: `scale(${finalPulse})`,
        transformOrigin: "80% 70%"
      }}
    >
      <div
        style={{
          color: "rgba(255, 255, 255, 0.95)",
          fontSize: 146,
          lineHeight: 0.88,
          fontWeight: 950,
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 20px 45px rgba(0, 0, 0, 0.34)"
        }}
      >
        {year}
      </div>
      <div
        style={{
          marginTop: 16,
          color: theme.colors.gold,
          fontSize: 18,
          fontWeight: 850,
          letterSpacing: 3,
          textTransform: "uppercase"
        }}
      >
        Ranking Year
      </div>
    </div>
  );
};
