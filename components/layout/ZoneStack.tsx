"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import CompensationZone from "@/components/zones/CompensationZone";
import GovernanceZone from "@/components/zones/GovernanceZone";
import CandidateBand from "@/components/ui/CandidateBand";

/** The three data zones — or, when no records match the active filters, a
 *  single empty state instead of misleading $0 / 0% values (DESIGN.md §10). */
export default function ZoneStack({
  withCandidate = true,
}: {
  withCandidate?: boolean;
}) {
  const { noResults } = useFilters();

  if (noResults) {
    return (
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 26px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: 26,
              lineHeight: 1.1,
              color: "var(--text-primary)",
            }}
          >
            No profiles match this combination
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
            }}
          >
            Remove a filter to see results.
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <CompensationZone />
      <GovernanceZone />
      {withCandidate && <CandidateBand />}
    </>
  );
}
