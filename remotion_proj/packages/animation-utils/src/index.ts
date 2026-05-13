import { Easing, interpolate, spring } from "remotion";

export const softEase = Easing.bezier(0.16, 1, 0.3, 1);

export const fadeIn = (frame: number, start: number, duration: number): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: softEase
  });

export const springIn = ({
  frame,
  fps,
  delay = 0,
  damping = 18
}: {
  frame: number;
  fps: number;
  delay?: number;
  damping?: number;
}): number =>
  spring({
    frame: frame - delay,
    fps,
    config: {
      damping
    }
  });
