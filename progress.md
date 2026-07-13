# progress.md — Hitch Intelligence: Security Leadership Benchmark

> Living working-log. Most-recent-first. Build rules in **CLAUDE.md**, design in **DESIGN.md**.
> This file is the *state of play* — what's done, pending, and how to verify.

_Last updated: 2026-07-10 · branch `main` · Scatter comp-view toggle + Methodology modal built locally (uncommitted); build clean, math verified._

---

## 1. Where we are right now

Feature-complete through Phases 1–3 (build, data, export/auth) and deployed on Vercel
(push to `main` auto-deploys). Live app:

- Auth-gated single-page tool (LinkedIn OAuth + access code); fully responsive (no-scroll ≥1280, stacks
  below, capped ≥1680); dark theme; PDF export via Puppeteer. **CISO dataset** (~1,464 records).
- **NEW (uncommitted):** scatter comp-view toggle (Total/Cash/Base) + Median Breakdown strip + Methodology
  modal — see §2. Build clean, math verified; visual QA (no-scroll 1280×720/800) pending on Vercel.

---

## 2. Recently completed (newest first)

### Scatter comp-view toggle + Median Breakdown + Methodology modal — (uncommitted)
- **`TierScatter` 3-way view toggle** (`Total Comp · Cash Comp · Base Only`, local state, `showToggle`
  prop). Swaps dots/percentile-lines/labels + **branched Y-axis**: Total keeps the fixed `$150K–$2.2M`
  scale and hardcoded `$1522K` p90 override **unchanged** (byte-identical default); Cash/Base scale
  dynamically (5% pad). 250ms transitions gated behind a post-mount flag (initial paint + PDF stay static).
- **`lib/metrics.ts`:** new `calcTierScatterView(records, view)`; `calcTierScatter` is now a thin `total`
  wrapper. **Cash = Base+Bonus**; percentile markers **exclude zero/null-bonus** profiles (still dotted),
  `excluded` count surfaced. `FilterContext` scatter now carries `{total,cash,base}` per tier (`TierViews`).
- **Compact fixed-height "Median Breakdown" strip** below the columns (`flex:none` → `flex:1` plot absorbs
  it, **no-scroll holds**): peer-group P50s per view. **Deviation from plan (correctness):** no summed
  "Cash Total" cell — Cash shows Base·Bonus, Base shows Base; avoids the sum-of-medians fallacy /
  mislabeling `tcP50`. Cash view adds a quiet exclusion footnote (`n = excluded`).
- **Methodology modal** (`components/layout/MethodologyModal.tsx`): header `METHODOLOGY` link → centered
  overlay (`zIndex:200`, `--ink-surface` panel + champagne top border). Self-contained client component,
  Escape/click-outside/× dismiss, **no body scroll-lock**. Handoff tokens remapped (`--slate→--scatter-slate`,
  `--ink-mid→--ink-surface`, `--text-pri→--text-primary`). Not in `/export`.
- **Export gating:** `ZoneStack` gains `showViewToggle` (→ `TierScatter showToggle`); `/export` passes
  `false` → fixed Total view, no toggle. `npm run build` clean; math probe confirms Total 406/551 unchanged,
  Cash between Base and Total, 130 zero-bonus excluded peer-wide. Plan: `read-claude-md-...-narwhal.md`.

### Airtable Auth Log + LinkedIn enrichment (investigated, paused) — (commit `e07ccf4`)
- **LinkedIn logins now upsert into an Airtable "Auth Log"** (`lib/airtable.ts` →
  `upsertAuthLog`, fire-and-forget from `signIn`; table `tbl0hdV62NZ7WNqrO` in HITCHBASE).
  Deduped by `LinkedIn ID` (OIDC `sub`), bumps `Login Count`/`Last Seen` on repeat.
  Best-effort; never blocks auth; no-op if `AIRTABLE_TOKEN`/`AIRTABLE_BASE_ID` unset.
- **Profile enrichment (`Title`/`Company`/`Headline`/`LinkedIn URL`) investigated → paused.**
  A `/v2/me` OAuth-callback call is infeasible (OIDC, not legacy `r_liteprofile`;
  `headline`/`vanityName` partner-restricted; `sub` opaque, not reversible). Columns exist but
  stay blank. Deferred path: offline **Clay** batch keyed on `Full Name` + email-domain, written
  back via Airtable MCP (**no app code**) — blocked on a company signal for personal-email logins.

### Key Insight band + footer full-width — (commits `aac76fa` ← `00818b3`)
- Full-width static **"Key Insight" prose band** (`components/zones/InsightZone.tsx`, no data binding —
  verbatim medians/quartiles, distinct from headline averages, risk B) below the panel. `.insight-band`
  is `flex:none` so the `flex:1` panel absorbs it → **no-scroll ≥1280 holds** (watch footer crowding on
  short laptops). Gated off `/export` via `showInsight={false}`. Footer prose un-capped to full width.

### Tier toggle + comp hero + header legibility — (commit `29ee376`)
- **Industry Tier → single-select segmented toggle** (`TierToggle` in `PeerGroupPanel.tsx`; `setTier` in
  `FilterContext`; active = cobalt). **Average Total Comp = hero** (gold, leftmost; Base/Bonus/Equity
  inline breakdown past a divider). Section headers `--text-tertiary` → `--text-secondary` for legibility.

### Responsive redesign + comp distribution rework — (commit `4a2a63c`)
- **Fully responsive** `@media` classes in `globals.css` (SSR-safe): ≥1680 capped/centered · ≥1280
  no-scroll · 768–1279 sticky top bar + gov 2×2 · <768 single column. `.export-ready` forces desktop PDF.
  Label overlap fixed (P25/P50/P75 → 3-column readout below a 14px bar); comp dead space reclaimed.

### UI polish + dark-theme CISO pass (commits `3aacead` ← `85242a1`)
- White logo on dark theme; Board donut gold+cobalt+neutral; Location/Role pulled from UI (plumbing kept).
- **Data scoped to CISO** (`csv-to-json.ts` filters `Role_Bucket === "CISO"`). **Total Comp** = sum of
  base/bonus/equity averages (`totalCompAvg`): Baseline **$734,041** · High Consequence **$1,006,851**.
  (Note: dataset is now ~1,464 records — header/methodology reflect this; the "957" figure is retired.)

---

## 3. Known issues / risks

| # | Item | Sev | Notes |
|---|------|-----|-------|
| A | Responsive redesign not visually QA'd — local LinkedIn auth is broken, so verify on Vercel. | Med | Sweep 1920/1280/1024/390px: capped-center, no-scroll, sticky bar + 2×2, single column. |
| B | Comp headline shows **averages (mean)** vs the legacy "median never mean" guardrail. | Med | Intentional for this dataset. Reconcile copy / confirm with stakeholders. |
| C | PDF export reflow not re-confirmed after responsive pass. | Low | `.export-ready` should force desktop grid — verify a sample export. |
| D | Dead `RoleFilter`/`LocationFilter` files retained intentionally. | Low | Re-wire when Role returns. |

---

## 4. Best next moves

1. **Commit + Visual QA** the new scatter toggle / Median Breakdown / Methodology modal on Vercel — modal
   open/dismiss, toggle animation, and **no vertical scroll at 1280×720/800** (decomp strip height risk).
2. **Visual QA** all zones across 1920/1280/1024/390px (risk A); **sample PDF export** at Letter (risk C).
3. **Resolve mean-vs-median guardrail** (risk B) with Brett/Michael; smoke-test auth/export/DNS on Vercel.

---

## 5. How to verify locally

```
npm run dev          # Next 14 App Router (3000, or 3001 if taken)
npm run build        # full typecheck + prod build
```

**Auth-gated routes** (`/benchmark`, `/export`) 307-redirect when unauthed. For a local session, POST the
shared `NEXTAUTH_ACCESS_CODE` to `/api/auth/callback/credentials` (csrf from `/api/auth/csrf`, jar-backed
curl). LinkedIn OAuth is broken locally — **verify interactive UI on Vercel** (risk A).

**Math probe** (no auth): `node -e` over `data/allsec-benchmark.json` — per-tier `totalCompAvg`
**Baseline 734041 · HC 1006851**; scatter Total 406/551; Cash markers exclude zero/null-bonus.

---

## 6. Architecture quick-map

- **Tokens/theme:** `styles/globals.css` (`:root` — never hardcode hex). Mirror: `DESIGN.md`.
- **Filter state + flags:** `app/benchmark/FilterContext.tsx`.
- **Filtering / location floor / URL encode:** `lib/filters.ts` (`~` delimiter, `FLOOR=20`).
- **Metrics:** `lib/metrics.ts` (percentiles, means, `totalCompAvg`, D&O, rates).
- **Filter panel:** `components/layout/PeerGroupPanel.tsx` (Industry Tier + Company Size). Chip: `components/ui/Chip.tsx`.
- **Zones:** `components/zones/{Compensation,Governance,FunctionalScope}Zone.tsx` — charts inline (`components/charts/*` are empty stubs).
- **Empty-state wrapper:** `components/layout/ZoneStack.tsx`.
- **Data:** `data/allsec-benchmark.json` (957 CISO). Source: `AllSecBenchmark-highcon - CISO.csv`.
- **Auth:** `app/api/auth/[...nextauth]/route.ts` + `lib/auth.ts`. **Export:** `app/export/page.tsx` + `app/api/export/route.ts`.

---

## 7. Guardrails (from CLAUDE.md)

- No Tailwind; CSS custom properties only; never hardcode hex in components.
- Static JSON only — no DB/API for filtering. One dataset, one product.
- No-scroll desktop ≥1280; responsive (stacks/scrolls) below. No tabs/modals/nav. Three chart types only.
- `$XXXK` rounding; whole-number %; nulls excluded never imputed 0. (Headline shows averages — risk B.)
- Surgical changes, minimal diffs. Ask before assuming. Commit/push only when asked.
