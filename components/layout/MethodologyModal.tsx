"use client";

import { useEffect, useRef, useState } from "react";

/** Header "METHODOLOGY" link + the modal it opens. Self-contained: owns its own
 *  open state so ToolHeader (a server component) only renders one child and never
 *  learns about modal state. No portal — the page is a flat 100vh stacking context;
 *  the backdrop is fixed to the viewport at zIndex 200 (above the max existing 60).
 *  Does NOT touch body overflow (the page is already overflow:hidden). */
export default function MethodologyModal() {
  const [open, setOpen] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setLinkHover(true)}
        onMouseLeave={() => setLinkHover(false)}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: linkHover ? "var(--champagne)" : "var(--scatter-slate)",
          transition: "color 120ms ease",
        }}
      >
        Methodology
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(13,17,23,0.82)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Methodology"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 560,
              maxHeight: "calc(100vh - 48px)",
              overflowY: "auto",
              background: "var(--ink-surface)",
              border: "1px solid var(--border)",
              borderTop: "2px solid var(--champagne)",
              borderRadius: 4,
              padding: "36px 40px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Close */}
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              onMouseEnter={() => setCloseHover(true)}
              onMouseLeave={() => setCloseHover(false)}
              aria-label="Close methodology"
              style={{
                position: "absolute",
                top: 18,
                right: 20,
                border: "none",
                background: "transparent",
                padding: 4,
                cursor: "pointer",
                lineHeight: 1,
                fontSize: 20,
                color: closeHover ? "var(--text-primary)" : "var(--scatter-slate)",
                transition: "color 120ms ease",
              }}
            >
              ×
            </button>

            {/* Header */}
            <span
              style={{
                display: "block",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--champagne)",
              }}
            >
              Hitch Partners
            </span>
            <h2
              style={{
                margin: "6px 0 0",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26,
                fontWeight: 500,
                color: "var(--text-primary)",
              }}
            >
              Methodology
            </h2>
            <div
              style={{
                height: 1,
                width: "100%",
                background: "var(--border)",
                margin: "16px 0",
              }}
            />

            {/* Body */}
            {BODY.map((p, i) => (
              <p
                key={i}
                style={{
                  margin: i === 0 ? 0 : "16px 0 0",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12.5,
                  lineHeight: 1.75,
                  color: "var(--text-dim)",
                }}
              >
                {p}
              </p>
            ))}

            {/* Footer */}
            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: "1px solid var(--border)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "var(--scatter-slate)",
                opacity: 0.6,
              }}
            >
              2025–2026 Survey Period · Last Updated March 2026 · North America &amp; Europe
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const BODY = [
  "The Security Leadership Benchmark draws on proprietary survey data collected directly from verified security executives across North America and Europe. Participants are identified and recruited through Hitch Partners' retained search network, a practitioner-sourced sample that reflects active, senior-level security leadership, not self-selected or panel-recruited respondents.",
  "Compensation figures are reported by participants and normalized to USD. Peer group filters adjust dynamically to available data; combinations yielding fewer than 20 matching profiles automatically broaden to preserve statistical reliability.",
  "The Baseline Risk and High Consequence segmentation reflects a proprietary framework developed by Hitch Partners to classify organizations by the structural severity of a potential security failure, incorporating regulatory exposure, attack surface complexity, and breach consequence magnitude. This classification is applied at the organizational level prior to analysis and serves as the primary lens through which compensation and governance patterns are interpreted.",
  "All figures represent the 2025–2026 survey period. Data is refreshed on an annual cadence. Published by Hitch Partners.",
];
