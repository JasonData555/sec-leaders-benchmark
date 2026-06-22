"use client";

import { useState } from "react";
import { useFilters, type CandidateProfile } from "@/app/benchmark/FilterContext";
import Chip from "@/components/ui/Chip";

type DOStatus = CandidateProfile["doStatus"];
type BoardAccess = CandidateProfile["board"];

const DO_OPTIONS: DOStatus[] = ["D&O Policy", "Indemnified", "Neither"];
const BOARD_OPTIONS: BoardAccess[] = [
  "Quarterly",
  "Semi-Annual",
  "Per Request",
  "Annual",
  "None",
];

const groupLabel: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 9,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};

/** Parse "$525K" / "525" / "525000" → dollars. */
function parseCompInput(raw: string): number | null {
  const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return null;
  return /k/i.test(raw) || n < 10000 ? Math.round(n * 1000) : Math.round(n);
}

export default function CompareForm({ onClose }: { onClose: () => void }) {
  const { setCandidate } = useFilters();
  const [comp, setComp] = useState("");
  const [doStatus, setDoStatus] = useState<DOStatus | null>(null);
  const [board, setBoard] = useState<BoardAccess | null>(null);

  const totalComp = parseCompInput(comp);
  const canApply = totalComp !== null && totalComp > 0;

  const apply = () => {
    if (!canApply) return;
    setCandidate({
      totalComp,
      doStatus: doStatus ?? "Neither",
      board: board ?? "None",
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "14px 12px",
        background: "var(--ink-surface)",
        border: "1px solid var(--border)",
        borderRadius: 3,
      }}
    >
      {/* Close X */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close comparison form"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "none",
          border: "none",
          color: "var(--text-tertiary)",
          fontSize: 13,
          lineHeight: 1,
          cursor: "pointer",
          padding: 2,
        }}
      >
        ×
      </button>

      <span style={groupLabel}>Compare a Profile</span>

      <input
        type="text"
        value={comp}
        onChange={(e) => setComp(e.target.value)}
        placeholder="$000K"
        style={{
          width: "100%",
          background: "var(--ink)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          padding: "6px 10px",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 11,
          color: "var(--text-primary)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={groupLabel}>D&amp;O Coverage</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {DO_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              state={doStatus === opt ? "active" : "resting"}
              onClick={() => setDoStatus(doStatus === opt ? null : opt)}
            />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={groupLabel}>Board Access</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {BOARD_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              state={board === opt ? "active" : "resting"}
              onClick={() => setBoard(board === opt ? null : opt)}
            />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          type="button"
          onClick={apply}
          disabled={!canApply}
          style={{
            flex: 1,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: 10,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: canApply ? "var(--champagne)" : "var(--text-tertiary)",
            border: `1px solid ${
              canApply ? "var(--border-active)" : "var(--border)"
            }`,
            background: "var(--chip-bg)",
            padding: "6px 14px",
            borderRadius: 2,
            cursor: canApply ? "pointer" : "default",
          }}
        >
          Apply
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: 10,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            border: "1px solid var(--border)",
            background: "transparent",
            padding: "6px 14px",
            borderRadius: 2,
            cursor: "pointer",
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
