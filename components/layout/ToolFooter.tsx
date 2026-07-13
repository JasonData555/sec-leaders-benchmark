export default function ToolFooter() {
  return (
    <footer
      className="tool-footer"
      style={{
        background: "var(--ink-deep)",
        padding: "10px 30px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 24,
        flexShrink: 0,
      }}
    >
      <p
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 10.5,
          lineHeight: 1.7,
          color: "var(--text-tertiary)",
        }}
      >
        This benchmark reflects 957 security leadership profiles across North
        America, collected across the 2025–2026 survey period. Compensation
        figures are reported and normalized in USD.
      </p>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          whiteSpace: "nowrap",
        }}
      >
        Hitch Partners
      </span>
    </footer>
  );
}
