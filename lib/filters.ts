import type { BenchmarkRecord } from "@/lib/data";

/** Active peer-group filters. All additive (AND) logic. (CLAUDE.md §5) */
export interface FilterState {
  roles: string[];
  sizes: string[];
  industryTier: string[];
  region: string | null; // §6 region group key (e.g. "West Coast") or null
  city: string | null; // specific city, or null (falls back to region)
}

/** Region → member cities. The region tier filters by City membership
 *  (user-confirmed; supersedes §5's Global Region check). (CLAUDE.md §6) */
export const REGIONS = {
  "West Coast": ["Bay Area", "Los Angeles", "Seattle", "San Diego", "Portland"],
  Northeast: ["NYC Metro", "Boston", "Philadelphia", "DMV", "Baltimore", "Richmond"],
  "South / Southeast": [
    "Dallas",
    "Houston",
    "Atlanta",
    "Miami",
    "Charlotte",
    "Nashville",
    "Raleigh - Durham",
  ],
  Midwest: ["Chicago", "Minneapolis", "Kansas City", "Columbus", "Des Moines"],
  "Mountain / Southwest": ["Denver", "Salt Lake City", "Las Vegas", "Phoenix", "Austin"],
  "Other US": ["Bentonville", "Greensboro", "Charleston", "Chattanooga", "Tulsa"],
  Remote: ["Remote"],
  London: ["London"],
  "Europe & EMEA": ["Helsinki", "Tel Aviv", "Dubai", "Amsterdam", "Berlin"],
} as const;

export type RegionName = keyof typeof REGIONS;

/** Cities eligible for tier-2 display (n≥20 in the full unfiltered dataset). */
export const ELIGIBLE_CITIES = [
  "Bay Area",
  "NYC Metro",
  "Seattle",
  "Chicago",
  "London",
  "DMV",
  "Los Angeles",
  "Boston",
  "Denver",
  "Austin",
  "Salt Lake City",
  "Atlanta",
  "Dallas",
  "Miami",
  "Kansas City",
  "Minneapolis",
  "Houston",
  "Phoenix",
  "San Diego",
  "Raleigh - Durham",
  "Remote",
  "Charlotte",
  "Philadelphia",
  "Nashville",
];

/** Company size buckets, smallest → largest (exact CSV values, §5). */
export const SIZE_ORDER = [
  "< 250 employees",
  "250 - 499 employees",
  "500 - 999 employees",
  "1000 - 4999 employees",
  "5000 - 9,999 employees",
  "10,000 - 25,000 employees",
  "25,000+ employees",
] as const;

/** Minimum matching profiles for a city-level view (§6). */
export const FLOOR = 20;

export const EMPTY_FILTERS: FilterState = {
  roles: [],
  sizes: [],
  industryTier: [],
  region: null,
  city: null,
};

/** Delimiter for multi-value params. Not a comma — several filter values
 *  (e.g. "10,000 - 25,000 employees") contain commas. (§10) */
const DELIM = "~";

/** Serialize filter state to URL query params (arrays DELIM-joined, §10). */
export function encodeFilters(filters: FilterState): string {
  const p = new URLSearchParams();
  if (filters.roles.length) p.set("roles", filters.roles.join(DELIM));
  if (filters.sizes.length) p.set("sizes", filters.sizes.join(DELIM));
  if (filters.industryTier.length) p.set("industryTier", filters.industryTier.join(DELIM));
  if (filters.region) p.set("region", filters.region);
  if (filters.city) p.set("city", filters.city);
  return p.toString();
}

/** Parse filter state back from URL query params. */
export function decodeFilters(params: URLSearchParams): FilterState {
  const list = (key: string) =>
    params.get(key)?.split(DELIM).filter(Boolean) ?? [];
  return {
    roles: list("roles"),
    sizes: list("sizes"),
    industryTier: list("industryTier"),
    region: params.get("region") || null,
    city: params.get("city") || null,
  };
}

/** The region group a city belongs to, or null. */
export function regionForCity(city: string): RegionName | null {
  for (const region of Object.keys(REGIONS) as RegionName[]) {
    if ((REGIONS[region] as readonly string[]).includes(city)) return region;
  }
  return null;
}

/** Additive AND filtering. A record must pass every active filter. (§5) */
export function applyFilters(
  records: BenchmarkRecord[],
  filters: FilterState
): BenchmarkRecord[] {
  return records.filter((r) => {
    if (filters.roles.length && !filters.roles.includes(r["Role_Bucket"])) return false;
    if (filters.sizes.length && !filters.sizes.includes(r["Current Company Size"]))
      return false;
    if (filters.industryTier.length && !filters.industryTier.includes(r["Industry Tier"]))
      return false;
    // Location — city takes precedence over region (§6).
    if (filters.city) {
      if (r["City"] !== filters.city) return false;
    } else if (filters.region) {
      const cities = REGIONS[filters.region as RegionName] as readonly string[] | undefined;
      if (!cities || !cities.includes(r["City"])) return false;
    }
    return true;
  });
}

/**
 * Applies all filters, then enforces the §6 city floor: if a city is selected
 * and the result drops below FLOOR, auto-expand to region scope and flag it.
 */
export function resolveLocation(
  records: BenchmarkRecord[],
  filters: FilterState
): { records: BenchmarkRecord[]; floorWarning: boolean } {
  const filtered = applyFilters(records, filters);
  if (filters.city && filtered.length < FLOOR) {
    const expanded = applyFilters(records, { ...filters, city: null });
    return { records: expanded, floorWarning: true };
  }
  return { records: filtered, floorWarning: false };
}
