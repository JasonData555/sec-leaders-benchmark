import data from "@/data/allsec-benchmark.json";

/** One record from the benchmark dataset. Shape inferred from the JSON —
 *  every field is a string (raw CSV value; blanks are ""). */
export type BenchmarkRecord = (typeof data)[number];

/** All 957 records. Loaded once at module init; never re-fetched. */
export const allRecords: BenchmarkRecord[] = data;
