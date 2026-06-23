"use client";

import { allRecords } from "@/lib/data";
import { useFilters } from "@/app/benchmark/FilterContext";
import Chip from "@/components/ui/Chip";
import FloorWarning from "@/components/ui/FloorWarning";
import {
  REGIONS,
  ELIGIBLE_CITIES,
  FLOOR,
  applyFilters,
  regionForCity,
  type RegionName,
} from "@/lib/filters";

const groupLabel: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};

const CISO_ONLY_TOOLTIP = "City-level data available for CISO only";

export default function LocationFilter() {
  const { filterState, setFilter, floorWarning } = useFilters();

  // City-level data is available only when the peer group is CISO-only (§6).
  const cisoContext =
    filterState.roles.length === 1 && filterState.roles[0] === "CISO";

  const selectedRegion = filterState.region as RegionName | null;

  // Tier-2 cities: eligible cities within the selected region.
  const cities = selectedRegion
    ? (REGIONS[selectedRegion] as readonly string[]).filter((c) =>
        ELIGIBLE_CITIES.includes(c)
      )
    : [];

  const handleRegion = (region: string) => {
    // Selecting/clearing a region resets any city selection (two-tier reset).
    setFilter("region", region);
    setFilter("city", null);
  };

  const warningRegion =
    filterState.region ??
    (filterState.city ? regionForCity(filterState.city) : null) ??
    "region";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={groupLabel}>Location</span>

      {/* Tier 1 — region */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {(Object.keys(REGIONS) as RegionName[]).map((region) => (
          <Chip
            key={region}
            label={region}
            state={filterState.region === region ? "active" : "resting"}
            onClick={() => handleRegion(region)}
          />
        ))}
      </div>

      {/* Tier 2 — city (only after a region is chosen) */}
      {cities.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {cities.map((city) => {
            const isActive = filterState.city === city;
            const cityN = applyFilters(allRecords, {
              ...filterState,
              city,
            }).length;
            const belowFloor = cityN < FLOOR;
            const disabled = !isActive && (!cisoContext || belowFloor);
            const title = !cisoContext
              ? CISO_ONLY_TOOLTIP
              : belowFloor
              ? "Fewer than 20 profiles — broaden other filters"
              : undefined;
            return (
              <Chip
                key={city}
                label={city}
                state={isActive ? "active" : disabled ? "disabled" : "resting"}
                onClick={() => setFilter("city", city)}
                title={title}
              />
            );
          })}
        </div>
      )}

      {floorWarning && <FloorWarning region={String(warningRegion)} />}
    </div>
  );
}
