"use client";

import type { CSSProperties } from "react";

export type ChipState = "resting" | "active" | "disabled";

const stateStyles: Record<ChipState, CSSProperties> = {
  resting: {
    color: "var(--text-secondary)",
    background: "var(--chip-bg)",
    border: "1px solid var(--border)",
  },
  active: {
    color: "var(--data-cobalt)",
    background: "var(--data-cobalt-mid)",
    border: "1px solid var(--data-cobalt-border)",
  },
  disabled: {
    color: "var(--text-tertiary)",
    background: "transparent",
    border: "1px solid var(--border)",
  },
};

export default function Chip({
  label,
  state = "resting",
  onClick,
  title,
  size = "md",
}: {
  label: string;
  state?: ChipState;
  onClick?: () => void;
  title?: string;
  size?: "md" | "lg";
}) {
  const disabled = state === "disabled";
  const lg = size === "lg";
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        fontSize: lg ? 15 : 12,
        lineHeight: 1.3,
        padding: lg ? "7px 14px" : "3px 9px",
        borderRadius: 2,
        whiteSpace: "nowrap",
        cursor: disabled ? "default" : "pointer",
        transition:
          "background 120ms ease, border-color 120ms ease, color 120ms ease",
        ...stateStyles[state],
      }}
    >
      {label}
    </button>
  );
}
