export default function ToolHeader() {
  return (
    <header
      style={{
        background: "var(--ink-deep)",
        padding: "17px 30px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      {/* Wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hitch-logo-white.png" alt="Hitch Partners" style={{ height: 28 }} />
        <span
          style={{ width: 1, height: 13, background: "var(--border)" }}
          aria-hidden
        />
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 11.5,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          The Security Leadership Benchmark
        </span>
      </div>

      {/* Metadata */}
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: "var(--text-tertiary)",
        }}
      >
        1,464 profiles · 2025–2026
      </span>
    </header>
  );
}
