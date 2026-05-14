import { Composition } from "remotion";
import { BestCollegesTuition } from "./BestCollegesComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="BestCollegesTuition"
      component={BestCollegesTuition}
      durationInFrames={1290}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
