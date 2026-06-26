import type { BenchmarkRecord } from "@/lib/data";

// ── Field name constants (exact CSV column names) ───────────────────────────
const F_BOARD = "How often do you present to the Board of Directors?";
const F_DO = "Are you currently included in the following?";
const F_SEVERANCE =
  "Have you pre-negotiated a severance agreement as part of your employment?";
const F_VESTING =
  "Do you have a negotiated accelerated vesting clause / early termination agreement?";
const F_FUNCTIONS =
  "Which of the following functions fall under your direct responsibility and decision-making authority?";
const F_TEAM = "Team Size";

// ── §7 verbatim helpers ─────────────────────────────────────────────────────

/** Parse a compensation value — handles "$X,XXX" strings and raw numbers. */
export function parseComp(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const str = String(value).replace(/[$,]/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

/** Percentile rank of `target` within `values` — % of values ≤ target (0 if empty). */
export function percentileRank(values: number[], target: number): number {
  if (!values.length) return 0;
  const atOrBelow = values.filter((v) => v <= target).length;
  return (atOrBelow / values.length) * 100;
}

/** Linear-interpolated percentile of a numeric array. */
export function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

/** Round to nearest $1K, display as $XXXK. */
export function formatDollars(value: number): string {
  return `$${Math.round(value / 1000)}K`;
}

/** Whole-number percent. */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Classify the comma-separated D&O field. */
export function classifyDO(
  value: string | null
): "full" | "indemnified" | "neither" | "unknown" {
  if (!value) return "unknown";
  const has_do = value.includes("Directors & Officers");
  const has_ind = value.includes("Indemnification");
  if (has_do && has_ind) return "full";
  if (has_do) return "full";
  if (has_ind) return "indemnified";
  if (value === "Neither") return "neither";
  return "unknown";
}

// ── Internal utilities ──────────────────────────────────────────────────────

/** Median over a numeric array, 0 if empty. */
function median(values: number[]): number {
  return values.length ? percentile(values, 50) : 0;
}

/** Arithmetic mean over a numeric array, 0 if empty. */
function mean(values: number[]): number {
  return values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
}

/** % of `count` over `denom`, 0 if denom is 0. */
function rate(count: number, denom: number): number {
  return denom ? (count / denom) * 100 : 0;
}

function compColumn(
  records: BenchmarkRecord[],
  field: keyof BenchmarkRecord
): { values: number[]; nullRate: number } {
  const parsed = records.map((r) => parseComp(r[field]));
  const values = parsed.filter((v): v is number => v !== null);
  const nullRate = records.length
    ? ((records.length - values.length) / records.length) * 100
    : 0;
  return { values, nullRate };
}

// ── Aggregate metrics ───────────────────────────────────────────────────────

export interface CompMetrics {
  baseP50: number;
  bonusP50: number;
  equityP50: number;
  tcP50: number;
  tcP25: number;
  tcP75: number;
  bonusNullRate: number;
  equityNullRate: number;
  baseMean: number;
  bonusMean: number;
  equityMean: number;
  tcMean: number;
  totalCompAvg: number;
}

export function calcCompMetrics(records: BenchmarkRecord[]): CompMetrics {
  const base = compColumn(records, "Base-Converted");
  const bonus = compColumn(records, "Bonus-Converted");
  const equity = compColumn(records, "Equity-Converted");
  const tc = compColumn(records, "Total Comp-Converted");
  const baseMean = mean(base.values);
  const bonusMean = mean(bonus.values);
  const equityMean = mean(equity.values);
  return {
    baseP50: median(base.values),
    bonusP50: median(bonus.values),
    equityP50: median(equity.values),
    tcP50: median(tc.values),
    tcP25: tc.values.length ? percentile(tc.values, 25) : 0,
    tcP75: tc.values.length ? percentile(tc.values, 75) : 0,
    bonusNullRate: bonus.nullRate,
    equityNullRate: equity.nullRate,
    baseMean,
    bonusMean,
    equityMean,
    tcMean: mean(tc.values),
    // Headline total = sum of the component averages (not the column mean).
    totalCompAvg: baseMean + bonusMean + equityMean,
  };
}

/** Per-tier Total-Comp distribution for the scatter plot. Read-only: reuses
 *  parseComp + percentile, no new math. Nulls excluded, never imputed. */
export interface TierScatter {
  points: number[];
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  n: number;
}

export function calcTierScatter(records: BenchmarkRecord[]): TierScatter {
  const { values } = compColumn(records, "Total Comp-Converted");
  return {
    points: values,
    p10: values.length ? percentile(values, 10) : 0,
    p25: values.length ? percentile(values, 25) : 0,
    p50: values.length ? percentile(values, 50) : 0,
    p75: values.length ? percentile(values, 75) : 0,
    p90: values.length ? percentile(values, 90) : 0,
    n: values.length,
  };
}

export interface BoardMetrics {
  quarterly: number;
  semiAnnual: number;
  perRequest: number;
  annual: number;
  none: number;
}

export function calcBoardMetrics(records: BenchmarkRecord[]): BoardMetrics {
  const answered = records.filter((r) => r[F_BOARD] !== "");
  const denom = answered.length;
  const countWhere = (val: string) =>
    answered.filter((r) => r[F_BOARD] === val).length;
  return {
    quarterly: rate(countWhere("At least quarterly"), denom),
    semiAnnual: rate(countWhere("At least semi-annually"), denom),
    perRequest: rate(countWhere("Per request"), denom),
    annual: rate(countWhere("At least annually"), denom),
    none: rate(countWhere("I do not report to the Board of Directors"), denom),
  };
}

export interface DOMetrics {
  fullDO: number;
  indemnified: number;
  neither: number;
  combined: number;
}

export function calcDOMetrics(records: BenchmarkRecord[]): DOMetrics {
  let full = 0;
  let ind = 0;
  let neither = 0;
  for (const r of records) {
    const c = classifyDO(r[F_DO] || null);
    if (c === "full") full++;
    else if (c === "indemnified") ind++;
    else if (c === "neither") neither++;
    // "unknown" excluded from the denominator
  }
  const denom = full + ind + neither;
  const fullDO = rate(full, denom);
  const indemnified = rate(ind, denom);
  return {
    fullDO,
    indemnified,
    neither: rate(neither, denom),
    combined: fullDO + indemnified,
  };
}

export interface FunctionMetric {
  name: string;
  pct: number;
}

export function calcFunctionMetrics(records: BenchmarkRecord[]): FunctionMetric[] {
  const n = records.length;
  if (!n) return [];
  const counts = new Map<string, number>();
  for (const r of records) {
    const raw = r[F_FUNCTIONS] || "";
    for (const tok of raw.split(",").map((t) => t.trim()).filter(Boolean)) {
      counts.set(tok, (counts.get(tok) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, pct: (count / n) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 10);
}

export interface TeamMetrics {
  p25: number;
  p50: number;
  p75: number;
}

export function calcTeamMetrics(records: BenchmarkRecord[]): TeamMetrics {
  const values = records
    .map((r) => {
      const v = r[F_TEAM];
      if (v === "") return null;
      const n = parseFloat(v);
      return isNaN(n) ? null : n;
    })
    .filter((v): v is number => v !== null);
  if (!values.length) return { p25: 0, p50: 0, p75: 0 };
  return {
    p25: percentile(values, 25),
    p50: percentile(values, 50),
    p75: percentile(values, 75),
  };
}

/** % "Yes" of non-blank severance answers. */
export function calcSeverance(records: BenchmarkRecord[]): number {
  const answered = records.filter(
    (r) => r[F_SEVERANCE] === "Yes" || r[F_SEVERANCE] === "No"
  );
  return rate(answered.filter((r) => r[F_SEVERANCE] === "Yes").length, answered.length);
}

/** % "Yes" of non-blank accelerated-vesting answers. */
export function calcVesting(records: BenchmarkRecord[]): number {
  const answered = records.filter(
    (r) => r[F_VESTING] === "Yes" || r[F_VESTING] === "No"
  );
  return rate(answered.filter((r) => r[F_VESTING] === "Yes").length, answered.length);
}
