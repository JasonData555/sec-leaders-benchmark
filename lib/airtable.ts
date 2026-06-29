/**
 * Airtable "Auth Log" upsert — best-effort, never throws, never blocks auth.
 *
 * Writes one row per LinkedIn member (deduped by LinkedIn ID) on every
 * successful LinkedIn login: increments Login Count and advances Last Seen on
 * repeat logins, creates a fresh row on first sight. Called fire-and-forget from
 * the NextAuth signIn callback. No data is ever returned to the client.
 */

const AIRTABLE_TABLE_ID = "tbl0hdV62NZ7WNqrO"; // "Auth Log" in HITCHBASE
const AIRTABLE_API = "https://api.airtable.com/v0";

type AuthLogEntry = {
  linkedInId: string;
  fullName: string | null;
  email: string | null;
  title: string | null;
  company: string | null;
  linkedInUrl: string | null;
};

/** Drop null/empty values so we never overwrite Airtable cells with blanks. */
function definedFields(fields: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
}

export async function upsertAuthLog(entry: AuthLogEntry): Promise<void> {
  try {
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    if (!token || !baseId) return; // not configured — skip silently

    const base = `${AIRTABLE_API}/${baseId}/${AIRTABLE_TABLE_ID}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const now = new Date().toISOString();

    // Look up an existing record by LinkedIn ID (primary field).
    const escapedId = entry.linkedInId.replace(/'/g, "\\'");
    const formula = `{LinkedIn ID}='${escapedId}'`;
    const searchUrl = `${base}?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`;
    const searchRes = await fetch(searchUrl, { headers });
    if (!searchRes.ok) {
      console.error(`Auth Log search failed: ${searchRes.status}`);
      return;
    }
    const existing = (await searchRes.json()) as {
      records?: { id: string; fields?: { "Login Count"?: number } }[];
    };
    const record = existing.records?.[0];

    if (record) {
      // Repeat login — advance Last Seen, bump count, refresh title/company.
      const count = (record.fields?.["Login Count"] ?? 0) + 1;
      const fields = definedFields({
        "Last Seen": now,
        "Login Count": count,
        Title: entry.title,
        Company: entry.company,
      });
      const res = await fetch(`${base}/${record.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ fields }),
      });
      if (!res.ok) console.error(`Auth Log update failed: ${res.status}`);
      return;
    }

    // First sight — create a new row.
    const fields = definedFields({
      "LinkedIn ID": entry.linkedInId,
      "Full Name": entry.fullName,
      Email: entry.email,
      Title: entry.title,
      Company: entry.company,
      "LinkedIn URL": entry.linkedInUrl,
      "First Seen": now,
      "Last Seen": now,
      "Login Count": 1,
    });
    const res = await fetch(base, {
      method: "POST",
      headers,
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) console.error(`Auth Log create failed: ${res.status}`);
  } catch (err) {
    // best-effort: never block or fail the auth flow
    console.error("Auth Log upsert error:", err);
  }
}
