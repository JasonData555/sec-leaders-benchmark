"use client";

/** Shown under the location filter when a city selection auto-expands to its
 *  region because the city-level n fell below the floor (§6/§10). */
export default function FloorWarning({ region }: { region: string }) {
  return (
    <span
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        fontSize: 10.5,
        fontStyle: "italic",
        lineHeight: 1.5,
        color: "var(--text-tertiary)",
      }}
    >
      Showing {region} data — narrow other filters to enable city-level view.
    </span>
  );
}
