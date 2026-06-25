"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  // Already authenticated → go straight to the tool (CLAUDE §3 gate).
  useEffect(() => {
    if (status === "authenticated") router.replace("/benchmark");
  }, [status, router]);

  const submitCode = async () => {
    if (!code.trim()) return;
    setError(false);
    const res = await signIn("credentials", {
      code,
      redirect: false,
    });
    if (res?.ok) router.replace("/benchmark");
    else setError(true);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        background: "var(--ink-deep)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hitch-logo-white.png" alt="Hitch Partners" style={{ height: 48 }} />

        <p
          style={{
            marginTop: 24,
            fontWeight: 300,
            fontSize: 12,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          The Security Leadership Benchmark
        </p>

        <p
          style={{
            marginTop: 32,
            fontWeight: 300,
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
          }}
        >
          Compensation and governance data for 1,464 security leadership
          profiles. Access provided by Hitch Partners.
        </p>

        <button
          type="button"
          onClick={() => signIn("linkedin", { callbackUrl: "/benchmark" })}
          style={{
            marginTop: 32,
            width: "100%",
            background: "var(--hitch-blue)",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: 2,
            padding: "10px 24px",
            cursor: "pointer",
          }}
        >
          Continue with LinkedIn
        </button>

        <div
          style={{
            marginTop: 24,
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span
            style={{
              fontWeight: 300,
              fontSize: 11,
              color: "var(--text-tertiary)",
            }}
          >
            or
          </span>
          <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitCode();
          }}
          placeholder="Enter access code"
          style={{
            marginTop: 16,
            width: "100%",
            background: "var(--ink-surface)",
            border: `1px solid ${error ? "var(--border-active)" : "var(--border)"}`,
            borderRadius: 2,
            padding: "8px 12px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 12,
            color: "var(--text-primary)",
          }}
        />

        <button
          type="button"
          onClick={submitCode}
          style={{
            marginTop: 8,
            width: "100%",
            background: "var(--chip-bg)",
            color: "var(--champagne)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: 11,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            border: "1px solid var(--border-active)",
            borderRadius: 2,
            padding: "8px 24px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>

        {error && (
          <p
            style={{
              marginTop: 8,
              fontWeight: 300,
              fontSize: 11,
              color: "var(--text-secondary)",
            }}
          >
            That access code is not valid. Check the code and try again.
          </p>
        )}

        <p
          style={{
            marginTop: 48,
            fontWeight: 300,
            fontSize: 10.5,
            lineHeight: 1.7,
            color: "var(--text-tertiary)",
          }}
        >
          This benchmark reflects 1,464 security leadership profiles across
          North America and Europe, collected across the 2025–2026 survey
          period. Compensation figures are reported and normalized in USD.
          Published by Hitch Partners.
        </p>
      </div>
    </main>
  );
}
