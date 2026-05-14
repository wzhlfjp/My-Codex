import { theme } from "../styles/localTheme";

export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div
      style={{
        height: 14,
        width: "100%",
        borderRadius: 999,
        border: `1px solid ${theme.colors.lineStrong}`,
        backgroundColor: "rgba(255, 255, 255, 0.11)",
        boxShadow: "inset 0 1px 10px rgba(0, 0, 0, 0.18)",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          height: "100%",
          borderRadius: 999,
          background:
            "linear-gradient(90deg, #f0c35a 0%, #27c7bd 58%, #78b8ff 100%)",
          boxShadow: "0 0 30px rgba(39, 199, 189, 0.62)"
        }}
      />
    </div>
  );
};
