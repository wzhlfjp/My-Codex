import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  END_YEAR,
  getRankingForYear,
  RankingEntry,
  START_YEAR
} from "../data/collegeTuitionRankings";

export type AnimatedRankingEntry = RankingEntry & {
  animatedIndex: number;
  animatedVisualValue: number;
};

const transitionFrames = 18;

export const useInterpolatedCollegeRankings = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const yearIndex = Math.min(END_YEAR - START_YEAR, Math.floor(frame / fps));
  const year = START_YEAR + yearIndex;
  const frameInYear = frame - yearIndex * fps;
  const transitionProgress = interpolate(
    frameInYear,
    [0, transitionFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const previousYear = Math.max(START_YEAR, year - 1);
  const currentRanking = getRankingForYear(year);
  const previousRanking = getRankingForYear(previousYear);
  const previousByKey = new Map(
    previousRanking.entries.map((entry, index) => [entry.key, { entry, index }])
  );
  const progress = frame / Math.max(1, durationInFrames - 1);

  const entries = currentRanking.entries.map((entry, index) => {
    const previous = previousByKey.get(entry.key);
    const previousIndex = previous?.index ?? index + 2;
    const previousVisual = previous?.entry.visualValue ?? entry.visualValue;

    return {
      ...entry,
      animatedIndex: interpolate(
        transitionProgress,
        [0, 1],
        [previousIndex, index],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      ),
      animatedVisualValue: interpolate(
        transitionProgress,
        [0, 1],
        [previousVisual, entry.visualValue],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    };
  });

  return {
    entries,
    year,
    progress
  };
};
