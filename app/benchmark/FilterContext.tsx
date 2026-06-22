"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { allRecords, type BenchmarkRecord } from "@/lib/data";
import {
  resolveLocation,
  EMPTY_FILTERS,
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
  type CompMetrics,
  type BoardMetrics,
  type DOMetrics,
  type FunctionMetric,
  type TeamMetrics,
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

/** A user-entered profile compared against the current peer group (§7.10). */
export interface CandidateProfile {
  totalComp: number; // USD
  doStatus: "D&O Policy" | "Indemnified" | "Neither";
  board: "Quarterly" | "Semi-Annual" | "Per Request" | "Annual" | "None";
}

const ARRAY_KEYS = ["roles", "sizes", "industries", "structures"] as const;
type ArrayKey = (typeof ARRAY_KEYS)[number];

interface FilterContextValue {
  filterState: FilterState;
  filteredRecords: BenchmarkRecord[];
  metrics: Metrics;
  nCount: number;
  floorWarning: boolean;
  /** Toggle a value for array filters; set/toggle for region & city. */
  setFilter: (key: keyof FilterState, value: string | null) => void;
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

  const value: FilterContextValue = {
    filterState,
    filteredRecords,
    metrics,
    nCount: filteredRecords.length,
    floorWarning,
    setFilter,
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
