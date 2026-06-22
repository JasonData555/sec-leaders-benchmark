"use client";

import { FLOOR } from "@/lib/filters";

/** Live peer-group size counter (§7.9). Champagne at/above the floor,
 *  text-tertiary below it. */
export default function NCounter({ n }: { n: number }) {
  const below = n < FLOOR;
  return (
    <span
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 400,
        fontSize: 9,
        letterSpacing: "0.06em",
        color: below ? "var(--text-tertiary)" : "var(--champagne)",
        transition: "color 150ms ease",
      }}
    >
      n = {n.toLocaleString()}
    </span>
  );
}
