"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { allRecords, type BenchmarkRecord } from "@/lib/data";
import {
  resolveLocation,
  EMPTY_FILTERS,
  FLOOR,
  type FilterState,
} from "@/lib/filters";
import {
  calcCompMetrics,
  calcBoardMetrics,
  calcDOMetrics,
  calcFunctionMetrics,
  calcTeamMetrics,
  calcSeverance,
  calcVesting,
  calcTierScatter,
  type CompMetrics,
  type BoardMetrics,
  type DOMetrics,
  type FunctionMetric,
  type TeamMetrics,
  type TierScatter,
} from "@/lib/metrics";

export interface Metrics {
  comp: CompMetrics;
  board: BoardMetrics;
  do: DOMetrics;
  functions: FunctionMetric[];
  team: TeamMetrics;
  severance: number;
  vesting: number;
}

/** Per-tier scatter populations — always split across both tiers regardless
 *  of the Industry Tier filter, so the Baseline-vs-HC comparison always holds. */
export interface ScatterData {
  baseline: TierScatter;
  highCon: TierScatter;
}

/** A user-entered profile compared against the current peer group (§7.10). */
export interface CandidateProfile {
  totalComp: number; // USD
  doStatus: "D&O Policy" | "Indemnified" | "Neither";
  board: "Quarterly" | "Semi-Annual" | "Per Request" | "Annual" | "None";
}

const ARRAY_KEYS = ["roles", "sizes", "industryTier"] as const;
type ArrayKey = (typeof ARRAY_KEYS)[number];

interface FilterContextValue {
  filterState: FilterState;
  filteredRecords: BenchmarkRecord[];
  metrics: Metrics;
  scatter: ScatterData;
  nCount: number;
  floorWarning: boolean;
  /** No records match the active filters — show the empty state, not $0. */
  noResults: boolean;
  /** Some records match, but fewer than the reliability floor. */
  lowSample: boolean;
  /** Toggle a value for array filters; set/toggle for region & city. */
  setFilter: (key: keyof FilterState, value: string | null) => void;
  /** Replace the roles selection with a single role, or clear it. */
  setRole: (role: string | null) => void;
  /** Single-select Industry Tier — replace with one tier, or clear (all tiers). */
  setTier: (tier: string | null) => void;
  candidate: CandidateProfile | null;
  setCandidate: (profile: CandidateProfile | null) => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

function isArrayKey(key: keyof FilterState): key is ArrayKey {
  return (ARRAY_KEYS as readonly string[]).includes(key);
}

export function FilterProvider({
  children,
  initialFilters,
}: {
  children: React.ReactNode;
  initialFilters?: FilterState;
}) {
  const [filterState, setFilterState] = useState<FilterState>(
    initialFilters ?? EMPTY_FILTERS
  );
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);

  const setFilter = (key: keyof FilterState, value: string | null) => {
    setFilterState((prev) => {
      if (isArrayKey(key)) {
        if (value === null) return prev;
        const current = prev[key];
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [key]: next };
      }
      // region | city — set, or toggle off if re-selecting the same value
      const current = prev[key] as string | null;
      return { ...prev, [key]: current === value ? null : value };
    });
  };

  const { filteredRecords, floorWarning } = useMemo(() => {
    const { records, floorWarning } = resolveLocation(allRecords, filterState);
    return { filteredRecords: records, floorWarning };
  }, [filterState]);

  const metrics = useMemo<Metrics>(
    () => ({
      comp: calcCompMetrics(filteredRecords),
      board: calcBoardMetrics(filteredRecords),
      do: calcDOMetrics(filteredRecords),
      functions: calcFunctionMetrics(filteredRecords),
      team: calcTeamMetrics(filteredRecords),
      severance: calcSeverance(filteredRecords),
      vesting: calcVesting(filteredRecords),
    }),
    [filteredRecords]
  );

  // Scatter populations split by tier, ignoring the Industry Tier filter so
  // both columns always render (all other active filters still apply).
  const scatter = useMemo<ScatterData>(() => {
    const { records } = resolveLocation(allRecords, {
      ...filterState,
      industryTier: [],
    });
    const byTier = (t: string) =>
      records.filter((r) => r["Industry Tier"] === t);
    return {
      baseline: calcTierScatter(byTier("Baseline")),
      highCon: calcTierScatter(byTier("High Consequence")),
    };
  }, [filterState]);

  const setRole = (role: string | null) => {
    setFilterState((prev) => ({ ...prev, roles: role ? [role] : [] }));
  };

  const setTier = (tier: string | null) => {
    setFilterState((prev) => ({ ...prev, industryTier: tier ? [tier] : [] }));
  };

  const nCount = filteredRecords.length;
  const value: FilterContextValue = {
    filterState,
    filteredRecords,
    metrics,
    scatter,
    nCount,
    floorWarning,
    noResults: nCount === 0,
    lowSample: nCount > 0 && nCount < FLOOR,
    setFilter,
    setRole,
    setTier,
    candidate,
    setCandidate,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within a FilterProvider");
  return ctx;
}
