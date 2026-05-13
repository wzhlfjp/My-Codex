import { Composition } from "remotion";
import { BestCollegesTuition } from "./Composition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="BestCollegesTuition"
      component={BestCollegesTuition}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
