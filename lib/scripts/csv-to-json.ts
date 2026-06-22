/**
 * One-time data conversion — NOT part of the build.
 * Reads AllSecBenchmark_2000_Final.csv from the project root and writes
 * data/allsec-benchmark.json, preserving every field name and value exactly
 * as a string (blank cells become "").
 *
 * Run manually:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' lib/scripts/csv-to-json.ts
 *   (or: npx tsx lib/scripts/csv-to-json.ts)
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");
const INPUT = join(ROOT, "AllSecBenchmark_2000_Final.csv");
const OUTPUT = join(ROOT, "data", "allsec-benchmark.json");

/** Only the columns the tool actually reads are emitted — the unused free-text
 *  survey columns are the bulk of the file (~72% smaller after trimming). */
const KEEP = [
  "Role_Bucket",
  "Current Company Size",
  "Industry",
  "Company Structure",
  "City",
  "Base-Converted",
  "Bonus-Converted",
  "Equity-Converted",
  "Total Comp-Converted",
  "How often do you present to the Board of Directors?",
  "Are you currently included in the following?",
  "Have you pre-negotiated a severance agreement as part of your employment?",
  "Do you have a negotiated accelerated vesting clause / early termination agreement?",
  "Which of the following functions fall under your direct responsibility and decision-making authority?",
  "Team Size",
];

/** Quote-aware CSV parser. Handles quoted fields, escaped "" quotes, and
 *  commas / newlines inside quotes. Returns an array of rows (arrays of cells). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++; // skip the escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // ignore — handle CRLF via the \n branch
    } else {
      field += ch;
    }
  }

  // flush trailing field/row (file may not end with a newline)
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function main() {
  const raw = readFileSync(INPUT, "utf8");
  const rows = parseCsv(raw).filter((r) => r.length > 1 || r[0] !== "");

  const [headers, ...dataRows] = rows;
  const keepIdx = KEEP.map((name) => {
    const idx = headers.indexOf(name);
    if (idx === -1) throw new Error(`KEEP column not found in CSV: ${name}`);
    return { name, idx };
  });
  const records = dataRows.map((cells) => {
    const obj: Record<string, string> = {};
    for (const { name, idx } of keepIdx) {
      obj[name] = cells[idx] ?? "";
    }
    return obj;
  });

  writeFileSync(OUTPUT, JSON.stringify(records));
  console.log(
    `Wrote ${records.length} records (${KEEP.length} fields) to ${OUTPUT}`
  );
}

main();
