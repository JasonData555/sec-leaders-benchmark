import type { NextAuthOptions } from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { upsertAuthLog } from "./airtable";

const EIGHT_HOURS = 8 * 60 * 60;

/** Best-effort session log — never throws, never blocks auth (Task B). */
async function logSession(entry: {
  provider: string;
  name: string | null;
  title: string | null;
  company: string | null;
  sessionId: string;
}) {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    await fetch(`${base}/api/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    // logging is best-effort; swallow all failures
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      // LinkedIn moved to OIDC; v4 needs these for the modern flow.
      authorization: { params: { scope: "openid profile email" } },
      issuer: "https://www.linkedin.com/oauth",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      client: { token_endpoint_auth_method: "client_secret_post" },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? null,
          email: profile.email ?? null,
          image: profile.picture ?? null,
        };
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Access Code",
      credentials: { code: { label: "Access code", type: "password" } },
      authorize(credentials) {
        const expected = process.env.NEXTAUTH_ACCESS_CODE;
        if (expected && credentials?.code === expected) {
          return { id: "access-code", name: "Access Code User" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: EIGHT_HOURS },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      // Session-level logging only — fire-and-forget (Task B).
      await logSession({
        provider: account?.provider ?? "unknown",
        name: user?.name ?? null,
        title: null,
        company: null,
        sessionId: crypto.randomUUID(),
      });
      // LinkedIn logins also upsert into the Airtable "Auth Log" table.
      // Fields beyond ID/name/email aren't available via OIDC (see lib/airtable.ts).
      if (account?.provider === "linkedin" && user?.id) {
        await upsertAuthLog({
          linkedInId: user.id,
          fullName: user.name ?? null,
          email: user.email ?? null,
          title: null,
          company: null,
          linkedInUrl: null,
        });
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) token.provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      (session as { provider?: string }).provider = token.provider as
        | string
        | undefined;
      return session;
    },
  },
};
