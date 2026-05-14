import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Header } from "./components/Header";
import { RankingChart } from "./components/RankingChart";
import { SourceNotes } from "./components/SourceNotes";
import { YearDisplay } from "./components/YearDisplay";
import { useInterpolatedCollegeRankings } from "./hooks/useInterpolatedCollegeRankings";
import { theme } from "./styles/localTheme";

export const BestCollegesTuition = () => {
  const frame = useCurrentFrame();
  const { entries, progress, year } = useInterpolatedCollegeRankings();
  const drift = interpolate(frame, [0, 1290], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        background:
          `radial-gradient(circle at ${16 + drift * 6}% ${8 + drift * 4}%, rgba(240, 195, 90, ${0.23 - drift * 0.05}), transparent 29%), ` +
          `radial-gradient(circle at ${80 - drift * 9}% ${70 - drift * 8}%, rgba(39, 199, 189, ${0.22 + drift * 0.08}), transparent 32%), ` +
          "linear-gradient(145deg, #0d294f 0%, #071f3d 52%, #020a16 100%)",
        color: theme.colors.ink,
        fontFamily: theme.fontFamily,
        overflow: "hidden"
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4, 19, 39, 0.02), rgba(4, 19, 39, 0.64)), repeating-linear-gradient(90deg, rgba(255,255,255,0.026) 0 1px, transparent 1px 96px)",
          mixBlendMode: "soft-light"
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 180px rgba(0, 0, 0, 0.28)"
        }}
      />
      <Header progress={progress} />
      <RankingChart entries={entries} />
      <YearDisplay year={year} />
      <SourceNotes />
    </AbsoluteFill>
  );
};
