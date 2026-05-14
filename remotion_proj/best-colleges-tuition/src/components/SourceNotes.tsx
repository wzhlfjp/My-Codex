import { layout, theme } from "../styles/localTheme";

export const SourceNotes = () => {
  return (
    <footer
      style={{
        position: "absolute",
        left: layout.sourceLeft,
        bottom: layout.sourceBottom,
        width: 590,
        color: "rgba(255, 255, 255, 0.52)",
        fontSize: 19,
        lineHeight: 1.34,
        fontWeight: 620
      }}
    >
      <div>
        <span style={{ color: theme.colors.gold, fontWeight: 760 }}>Source:</span>{" "}
        U.S. News &amp; World Report; tuition &amp; fees shown where available.
      </div>
      <div style={{ marginTop: 7 }}>
        Methodology changed over time; compare historical ranks with caution.
      </div>
    </footer>
  );
};
