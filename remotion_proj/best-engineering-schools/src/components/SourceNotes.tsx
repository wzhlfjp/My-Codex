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
        fontSize: 18,
        lineHeight: 1.32,
        fontWeight: 620
      }}
    >
      <div>
        <span style={{ color: theme.colors.gold, fontWeight: 760 }}>Sources:</span>{" "}
        U.S. News; archived and public U.S. News-derived ranking tables.
      </div>
      <div style={{ marginTop: 7 }}>
        Movement compares with the previous verified ranking year.
      </div>
    </footer>
  );
};
