import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { allRecords } from "@/lib/data";
import { decodeFilters, resolveLocation } from "@/lib/filters";
import { FilterProvider } from "@/app/benchmark/FilterContext";
import ZoneStack from "@/components/layout/ZoneStack";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function ExportPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string") params.set(k, v);
  }
  const filters = decodeFilters(params);
  const { records } = resolveLocation(allRecords, filters);
  const n = records.length;

  const roleLabel = filters.roles.length ? filters.roles.join(", ") : "All roles";
  const summaryParts: string[] = [];
  if (filters.roles.length) summaryParts.push(`Role: ${filters.roles.join(", ")}`);
  if (filters.sizes.length) summaryParts.push(`Size: ${filters.sizes.join(", ")}`);
  if (filters.industryTier.length)
    summaryParts.push(`Tier: ${filters.industryTier.join(", ")}`);
  if (filters.city) summaryParts.push(`City: ${filters.city}`);
  else if (filters.region) summaryParts.push(`Region: ${filters.region}`);
  if (summaryParts.length === 0) summaryParts.push("All security leadership profiles");

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <FilterProvider initialFilters={filters}>
      <div
        className="export-ready"
        style={{ background: "var(--ink)", color: "var(--text-primary)" }}
      >
        {/* Cover strip */}
        <div
          style={{
            height: 80,
            background: "var(--ink-deep)",
            borderBottom: "1px solid var(--champagne)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 26px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hitch-logo-white.png" alt="Hitch Partners" style={{ height: 26 }} />
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: 11,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
            }}
          >
            The Security Leadership Benchmark
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              color: "var(--text-tertiary)",
              textAlign: "right",
            }}
          >
            {date} · n={n.toLocaleString()} · {roleLabel}
          </span>
        </div>

        {/* Peer group summary row */}
        <div
          style={{
            padding: "8px 26px",
            borderBottom: "1px solid var(--border)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 10.5,
            color: "var(--text-secondary)",
          }}
        >
          {summaryParts.join("  ·  ")}  ·  n = {n.toLocaleString()}
        </div>

        {/* Zones */}
        <ZoneStack withCandidate={false} showInsight={false} />

        {/* Methodology footer */}
        <div
          style={{
            background: "var(--ink-deep)",
            borderTop: "1px solid var(--border)",
            padding: "12px 26px",
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
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
            This benchmark reflects 1,464 security leadership profiles across
            North America and Europe, collected across the 2025–2026 survey
            period. Compensation figures are reported and normalized in USD. Peer
            group filters dynamically adjust to available data — combinations
            yielding fewer than 20 matching profiles automatically broaden to the
            next geographic level to preserve statistical reliability. Prepared by
            Hitch Partners · {date}.
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
        </div>
      </div>
    </FilterProvider>
  );
}
