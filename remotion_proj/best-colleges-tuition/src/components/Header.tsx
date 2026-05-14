import { layout, theme } from "../styles/localTheme";
import { ProgressBar } from "./ProgressBar";

export const Header = ({ progress }: { progress: number }) => {
  return (
    <header
      style={{
        position: "absolute",
        left: layout.headerLeft,
        right: layout.safeMarginX,
        top: layout.headerTop
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          color: "rgba(255, 255, 255, 0.68)",
          fontSize: 22,
          fontWeight: 850,
          letterSpacing: 2.9,
          textTransform: "uppercase"
        }}
      >
        <span
          style={{
            width: 58,
            height: 3,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${theme.colors.gold}, ${theme.colors.teal})`,
            boxShadow: "0 0 20px rgba(240, 195, 90, 0.3)"
          }}
        />
        BEST COLLEGES
      </div>
      <h1
        style={{
          margin: "18px 0 0",
          maxWidth: 720,
          color: "#fffdf6",
          fontSize: 72,
          lineHeight: 0.99,
          fontWeight: 950,
          letterSpacing: 0,
          textShadow: "0 10px 28px rgba(0, 0, 0, 0.24)"
        }}
      >
        America&apos;s Best
        <br />
        Colleges Over Time
      </h1>
      <p
        style={{
          margin: "18px 0 28px",
          color: theme.colors.gold,
          fontSize: 35,
          lineHeight: 1.1,
          fontWeight: 880
        }}
      >
        U.S. News Rankings &bull; 1983 &rarr; 2025
      </p>
      <ProgressBar progress={progress} />
    </header>
  );
};
