/**
 * One-time data conversion — NOT part of the build.
 * Reads AllSecBenchmark-CISO-NextGen.csv from the project root and writes
 * data/allsec-benchmark.json. The new CSV uses different field names for
 * compensation columns; they are remapped to the names the app expects.
 *
 * Run manually:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' lib/scripts/csv-to-json.ts
 *   (or: npx tsx lib/scripts/csv-to-json.ts)
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");
const INPUT = join(ROOT, "AllSecBenchmark-highcon - CISO.csv");
const OUTPUT = join(ROOT, "data", "allsec-benchmark.json");

/** src = column name in the CSV; dest = field name written to JSON. */
const KEEP: { src: string; dest: string }[] = [
  { src: "Role_Bucket",            dest: "Role_Bucket" },
  { src: "Current Company Size",   dest: "Current Company Size" },
  { src: "Industry Tier",          dest: "Industry Tier" },
  { src: "City",                   dest: "City" },
  { src: "Global Region",          dest: "Global Region" },
  // Compensation — CSV uses raw field names; app expects -Converted names
  { src: "Annual Base",            dest: "Base-Converted" },
  { src: "Annual Bonus",           dest: "Bonus-Converted" },
  { src: "Est Annual Equity",      dest: "Equity-Converted" },
  { src: "Total Compensation",     dest: "Total Comp-Converted" },
  {
    src:  "How often do you present to the Board of Directors?",
    dest: "How often do you present to the Board of Directors?",
  },
  {
    src:  "Are you currently included in the following?",
    dest: "Are you currently included in the following?",
  },
  {
    src:  "Have you pre-negotiated a severance agreement as part of your employment?",
    dest: "Have you pre-negotiated a severance agreement as part of your employment?",
  },
  {
    src:  "Do you have a negotiated accelerated vesting clause / early termination agreement?",
    dest: "Do you have a negotiated accelerated vesting clause / early termination agreement?",
  },
  {
    src:  "Which of the following functions fall under your direct responsibility and decision-making authority?",
    dest: "Which of the following functions fall under your direct responsibility and decision-making authority?",
  },
  { src: "Team Size", dest: "Team Size" },
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
  const keepIdx = KEEP.map(({ src, dest }) => {
    const idx = headers.indexOf(src);
    if (idx === -1) throw new Error(`KEEP column not found in CSV: ${src}`);
    return { dest, idx };
  });
  const records = dataRows.map((cells) => {
    const obj: Record<string, string> = {};
    for (const { dest, idx } of keepIdx) {
      obj[dest] = cells[idx] ?? "";
    }
    return obj;
  });

  writeFileSync(OUTPUT, JSON.stringify(records));
  console.log(
    `Wrote ${records.length} records (${KEEP.length} fields) to ${OUTPUT}`
  );
}

main();
