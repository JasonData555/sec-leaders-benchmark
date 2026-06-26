"use client";

/** "Key Insight" block — static editorial prose that reads the High Consequence
 *  vs. Baseline Risk story the tier scatter illustrates, for non-technical
 *  stakeholders. No data binding (figures are quoted verbatim). Sits between the
 *  comp tiles and the benchmark panel; the panel (flex:1) absorbs the remaining
 *  height so the no-scroll desktop is preserved. Dashboard only — not on /export. */

const bulletStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 300,
  fontSize: 11,
  lineHeight: 1.4,
  color: "var(--text-dim)",
};

export default function InsightZone() {
  return (
    <section
      className="insight-top"
      style={{ display: "flex", gap: 18, alignItems: "flex-start" }}
    >
      <span
        style={{
          flexShrink: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--champagne)",
          marginTop: 2,
        }}
      >
        Key Insight
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={bulletStyle}>
          — Above <strong>$1.5M</strong>, High Consequence sustains a dense, visible concentration of
          profiles — a structural tier of the market, not an outlier band. Organizations competing for
          security leaders in regulated, high-exposure environments should model <strong>$1.5M+</strong>{" "}
          as a realistic planning anchor for top-quartile talent
        </p>
        <p style={bulletStyle}>
          — High Consequence organizations price security leadership differently from day one — the
          floor of this market (<strong>P10: $450K</strong>) already exceeds the Baseline median, and
          the median reaches <strong>$895K</strong>, a <strong>69% premium</strong> reflecting the
          market&apos;s direct valuation of organizational risk
        </p>
        <p style={bulletStyle}>
          — The Baseline Risk market is predictable in its middle: the typical CISO earns between{" "}
          <strong>$390K–$772K</strong> with a median of <strong>$530K</strong> — a range driven by
          company size, industry, and program maturity
        </p>
      </div>
    </section>
  );
}
