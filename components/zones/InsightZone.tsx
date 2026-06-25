"use client";

/** Full-width "Key Insight" band — static editorial prose that reads the
 *  High Consequence vs. Baseline Risk story the tier scatter illustrates, for
 *  non-technical stakeholders. No data binding (figures are quoted verbatim).
 *  Sits below the benchmark panel; the panel (flex:1) absorbs the height so the
 *  no-scroll desktop is preserved. Dashboard only — not rendered on /export. */
export default function InsightZone() {
  return (
    <section className="insight-band" style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
      <span
        style={{
          flexShrink: 0,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--champagne)",
        }}
      >
        Key Insight
      </span>
      <p
        style={{
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 12.5,
          lineHeight: 1.55,
          color: "var(--text-secondary)",
        }}
      >
        Security leaders operating in High Consequence environments (industries where a breach carries
        regulatory, financial, or reputational catastrophe) command compensation that is structurally
        higher, not just marginally so. The median CISO in a High Consequence organization earns $895K
        in total compensation, compared to $530K for their Baseline Risk counterpart; a 69% premium
        that reflects the market&apos;s clear-eyed pricing of consequence. Perhaps more revealing is
        where the two populations meet: the bottom quartile of High Consequence ($730K) sits nearly
        level with the top quartile of Baseline Risk ($772K), which means a highly compensated Baseline
        CISO and an entry-level High Consequence CISO are earning almost the same dollar figure for
        fundamentally different mandates. Above $1M, the story sharpens further. High Consequence
        organizations show a dense and sustained concentration of profiles at that level, not a handful
        of anomalies pulling an average upward, but a genuine structural band of the market where
        premium compensation is the expectation, not the exception.
      </p>
    </section>
  );
}
