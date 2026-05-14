import { layout, theme } from "../styles/localTheme";

export const SourceNotes = () => {
  return (
    <footer
      style={{
        position: "absolute",
        left: layout.sourceLeft,
        bottom: layout.sourceBottom,
        width: 500,
        color: "rgba(255, 255, 255, 0.52)",
        fontSize: 17,
        lineHeight: 1.3,
        fontWeight: 620
      }}
    >
      <div>
        <span style={{ color: theme.colors.gold, fontWeight: 760 }}>Ranking context:</span>{" "}
        U.S. News &amp; World Report. Endowment values: NACUBO, NCES/IPEDS, and university reports where available.
      </div>
      <div style={{ marginTop: 7 }}>
        Verified endowment values shown where available; missing values are marked N/A.
      </div>
      <div style={{ marginTop: 7 }}>
        U.S. News methodology changed over time; compare historical ranks with caution.
      </div>
    </footer>
  );
};
