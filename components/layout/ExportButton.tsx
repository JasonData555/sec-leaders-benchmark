"use client";

import { useState } from "react";
import { useFilters } from "@/app/benchmark/FilterContext";
import { encodeFilters } from "@/lib/filters";

export default function ExportButton() {
  const { filterState } = useFilters();
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const params = encodeFilters(filterState);
      const res = await fetch(`/api/export${params ? `?${params}` : ""}`);
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hitch-benchmark-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={busy}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 400,
        fontSize: 10,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: "var(--champagne)",
        border: "1px solid rgba(184, 168, 130, 0.30)",
        background: "var(--chip-bg)",
        padding: "6px 16px",
        borderRadius: 2,
        cursor: busy ? "default" : "pointer",
        opacity: busy ? 0.6 : 1,
      }}
    >
      {busy ? "Exporting…" : "Export PDF"}
    </button>
  );
}
