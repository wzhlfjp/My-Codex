import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";

export const CenteredTitle = ({
  children,
  style
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        textAlign: "center",
        ...style
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 92,
          fontWeight: 800,
          lineHeight: 1
        }}
      >
        {children}
      </h1>
    </AbsoluteFill>
  );
};
