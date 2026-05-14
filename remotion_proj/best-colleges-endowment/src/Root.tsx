import { Composition } from "remotion";
import { BestCollegesEndowment } from "./BestCollegesEndowmentComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="BestCollegesEndowment"
      component={BestCollegesEndowment}
      durationInFrames={1290}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
