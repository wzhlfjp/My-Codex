import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Header } from "./components/Header";
import { RankingChart } from "./components/RankingChart";
import { SourceNotes } from "./components/SourceNotes";
import { YearDisplay } from "./components/YearDisplay";
import { useInterpolatedEngineeringRankings } from "./hooks/useInterpolatedEngineeringRankings";
import { theme } from "./styles/localTheme";

export const BestEngineeringSchools = () => {
  const frame = useCurrentFrame();
  const { callout, entries, hasData, progress, statusNote, year } =
    useInterpolatedEngineeringRankings();
  const drift = interpolate(frame, [0, 2340], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const introOpacity = interpolate(frame, [0, 36, 60], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        background:
          `radial-gradient(circle at ${14 + drift * 7}% ${9 + drift * 4}%, rgba(240, 195, 90, ${0.22 - drift * 0.04}), transparent 29%), ` +
          `radial-gradient(circle at ${82 - drift * 8}% ${68 - drift * 7}%, rgba(39, 199, 189, ${0.2 + drift * 0.07}), transparent 32%), ` +
          `radial-gradient(circle at ${74 - drift * 4}% ${18 + drift * 6}%, rgba(230, 93, 79, 0.16), transparent 28%), ` +
          "linear-gradient(145deg, #10284f 0%, #071f3d 52%, #020a16 100%)",
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
      <RankingChart
        entries={entries}
        hasData={hasData}
        statusNote={statusNote}
        callout={callout}
      />
      <YearDisplay year={year} />
      <SourceNotes />
      {introOpacity > 0 ? (
        <AbsoluteFill
          style={{
            opacity: introOpacity,
            background: "rgba(2, 10, 22, 0.46)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 86
          }}
        >
          <div
            style={{
              color: "#fffdf6",
              fontSize: 78,
              lineHeight: 0.98,
              fontWeight: 950,
              textShadow: "0 18px 45px rgba(0,0,0,0.38)"
            }}
          >
            U.S. News
            <br />
            Engineering Rankings
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
