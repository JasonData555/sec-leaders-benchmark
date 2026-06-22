import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

/**
 * Session-level usage logging (CLAUDE.md §9). Append-only — never logs filter
 * interactions. Best-effort: failures return 500 but never block the user, and
 * the caller (NextAuth signIn callback) fires this without awaiting the result.
 */
export async function POST(request: Request) {
  try {
    const { provider, name, title, company, sessionId } = await request.json();
    const entry = {
      timestamp: new Date().toISOString(),
      provider: provider ?? null,
      name: name ?? null,
      title: title ?? null,
      company: company ?? null,
      sessionId: sessionId ?? null,
    };
    await kv.rpush("sessions", JSON.stringify(entry));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
