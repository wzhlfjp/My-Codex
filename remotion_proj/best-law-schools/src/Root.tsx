import { Composition } from "remotion";
import { BestLawSchools } from "./BestLawSchoolsComposition";
import { END_YEAR, START_YEAR, YEAR_DURATION_SECONDS } from "./data/lawSchoolRankings";

export const RemotionRoot = () => {
  const fps = 60;

  return (
    <Composition
      id="BestLawSchools"
      component={BestLawSchools}
      durationInFrames={(END_YEAR - START_YEAR + 1) * YEAR_DURATION_SECONDS * fps + 120}
      fps={fps}
      width={1080}
      height={1920}
    />
  );
};
