export default function ToolFooter() {
  return (
    <footer
      style={{
        background: "var(--ink-deep)",
        padding: "10px 30px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexShrink: 0,
      }}
    >
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 10.5,
          lineHeight: 1.7,
          color: "var(--text-tertiary)",
          maxWidth: 660,
        }}
      >
        This benchmark reflects 1,464 security leadership profiles across North
        America and Europe, collected across the 2025–2026 survey period.
        Compensation figures are reported and normalized in USD. Peer group
        filters dynamically adjust to available data — combinations yielding
        fewer than 20 matching profiles automatically broaden to the next
        geographic level to preserve statistical reliability. Published by Hitch
        Partners.
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
