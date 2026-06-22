"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/**
 * Returns an opacity/transition style that pulses on each `key` change to read
 * as "data updating" (§8): fade out 80ms → fade in 120ms. No-ops on first
 * render and when prefers-reduced-motion is set.
 */
export function useZoneFade(key: unknown): CSSProperties {
  const [opacity, setOpacity] = useState(1);
  const [duration, setDuration] = useState(120);
  const first = useRef(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;
    setDuration(80);
    setOpacity(0);
    const t = setTimeout(() => {
      setDuration(120);
      setOpacity(1);
    }, 80);
    return () => clearTimeout(t);
  }, [key, reduced]);

  if (reduced) return { opacity: 1 };
  return { opacity, transition: `opacity ${duration}ms ease` };
}
