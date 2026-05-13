import { fadeIn, springIn } from "@remotion-proj/animation-utils";
import { CenteredTitle } from "@remotion-proj/remotion-components";
import { formatCurrency } from "@remotion-proj/shared";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

const tuitionPoints = [
  { label: "Public in-state", value: 11260 },
  { label: "Public out-of-state", value: 29370 },
  { label: "Private nonprofit", value: 41740 }
];

export const BestCollegesTuition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = fadeIn(frame, 0, fps);
  const lift = springIn({ frame, fps, delay: 18 });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f7f2e8",
        color: "#141414",
        fontFamily: "Inter, Arial, sans-serif"
      }}
    >
      <CenteredTitle
        style={{
          opacity: intro,
          transform: `translateY(${interpolate(lift, [0, 1], [28, 0])}px)`
        }}
      >
        Best Colleges Tuition
      </CenteredTitle>
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: 72,
          gap: 18
        }}
      >
        {tuitionPoints.map((point, index) => {
          const progress = springIn({
            frame,
            fps,
            delay: 70 + index * 12,
            damping: 20
          });

          return (
            <div
              key={point.label}
              style={{
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.82)",
                border: "2px solid rgba(20, 20, 20, 0.1)",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                opacity: progress,
                padding: "22px 28px",
                transform: `translateX(${interpolate(progress, [0, 1], [80, 0])}px)`,
                width: 720
              }}
            >
              <span style={{ fontSize: 34, fontWeight: 650 }}>{point.label}</span>
              <span style={{ fontSize: 42, fontWeight: 800 }}>
                {formatCurrency(point.value)}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
