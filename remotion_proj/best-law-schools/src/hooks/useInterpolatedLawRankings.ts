import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  END_YEAR,
  getRankingForYear,
  RankingEntry,
  RankingMovement,
  START_YEAR,
  YEAR_DURATION_SECONDS,
  YEARLY_RANKINGS
} from "../data/lawSchoolRankings";

export type AnimatedRankingEntry = RankingEntry & {
  animatedIndex: number;
  movement: RankingMovement;
};

const introFrames = 60;
const transitionFrames = 22;

const getPreviousVerifiedRanking = (year: number) => {
  return [...YEARLY_RANKINGS]
    .reverse()
    .find((ranking) => ranking.year < year && ranking.entries.length > 0);
};

const getMovement = (
  entry: RankingEntry,
  previousEntry: RankingEntry | undefined
): RankingMovement => {
  if (!previousEntry) {
    return { kind: "new", delta: null, previousRank: null };
  }

  const delta = previousEntry.rank - entry.rank;
  if (delta > 0) {
    return { kind: "up", delta, previousRank: previousEntry.rank };
  }
  if (delta < 0) {
    return { kind: "down", delta, previousRank: previousEntry.rank };
  }
  return { kind: "same", delta: 0, previousRank: previousEntry.rank };
};

const getCallout = (
  entries: RankingEntry[],
  previousEntries: RankingEntry[],
  statusNote: string | null
) => {
  if (entries.length === 0) {
    return statusNote ?? "No verified ranking table for this year.";
  }

  const previousByKey = new Map(previousEntries.map((entry) => [entry.key, entry]));
  const leaders = entries.filter((entry) => entry.rank === 1);
  if (leaders.length > 1) {
    return `Tie at #1: ${leaders.map((entry) => entry.name).join(" + ")}`;
  }

  const leader = leaders[0];
  const previousLeader = leader ? previousByKey.get(leader.key) : undefined;
  if (leader && previousLeader && previousLeader.rank !== 1) {
    return `${leader.name} rises to #1`;
  }

  const movers = entries
    .map((entry) => ({ entry, movement: getMovement(entry, previousByKey.get(entry.key)) }))
    .filter((item) => item.movement.delta !== null);
  const biggestRise = movers.reduce<(typeof movers)[number] | null>(
    (best, item) =>
      item.movement.delta !== null && item.movement.delta > (best?.movement.delta ?? 0)
        ? item
        : best,
    null
  );
  if (biggestRise && (biggestRise.movement.delta ?? 0) >= 3) {
    return `Biggest rise: ${biggestRise.entry.name} +${biggestRise.movement.delta}`;
  }

  const newTopTen = entries.find(
    (entry) => entry.rank <= 10 && !previousByKey.has(entry.key)
  );
  if (newTopTen) {
    return `New in top 10: ${newTopTen.name}`;
  }

  const biggestDrop = movers.reduce<(typeof movers)[number] | null>(
    (best, item) =>
      item.movement.delta !== null && item.movement.delta < (best?.movement.delta ?? 0)
        ? item
        : best,
    null
  );
  if (biggestDrop && (biggestDrop.movement.delta ?? 0) <= -3) {
    return `Biggest drop: ${biggestDrop.entry.name} ${biggestDrop.movement.delta}`;
  }

  return "Top schools trade places at the margin.";
};

export const useInterpolatedLawRankings = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const yearFrames = fps * YEAR_DURATION_SECONDS;
  const timelineFrame = Math.max(0, frame - introFrames);
  const yearIndex = Math.min(END_YEAR - START_YEAR, Math.floor(timelineFrame / yearFrames));
  const year = START_YEAR + yearIndex;
  const frameInYear = timelineFrame - yearIndex * yearFrames;
  const transitionProgress = interpolate(
    frameInYear,
    [0, transitionFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const currentRanking = getRankingForYear(year);
  const previousRanking = getPreviousVerifiedRanking(year) ?? getRankingForYear(START_YEAR);
  const previousByKey = new Map(
    previousRanking.entries.map((entry, index) => [entry.key, { entry, index }])
  );
  const progress = frame / Math.max(1, durationInFrames - 1);

  const entries = currentRanking.entries.map((entry, index) => {
    const previous = previousByKey.get(entry.key);
    const previousIndex = previous?.index ?? index + 1.5;

    return {
      ...entry,
      animatedIndex: interpolate(
        transitionProgress,
        [0, 1],
        [previousIndex, index],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      ),
      movement: getMovement(entry, previous?.entry)
    };
  });

  return {
    entries,
    progress,
    year,
    hasData: currentRanking.entries.length > 0,
    statusNote: currentRanking.statusNote,
    callout: getCallout(
      currentRanking.entries,
      previousRanking.entries,
      currentRanking.statusNote
    )
  };
};
