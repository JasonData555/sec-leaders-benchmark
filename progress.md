# progress.md — Hitch Intelligence: Security Leadership Benchmark

> Living working-log. Most-recent-first. Build rules in **CLAUDE.md**, design in **DESIGN.md**.
> This file is the *state of play* — what's done, pending, and how to verify.

_Last updated: 2026-06-25 · branch `main` · tier toggle + comp hero + header legibility (commit `29ee376`)._

---

## 1. Where we are right now

Feature-complete through Phases 1–3 (build, data, export/auth) and deployed on Vercel
(push to `main` auto-deploys). Live app:

- Single-page benchmark tool, auth-gated (LinkedIn OAuth + shared access code).
- **Now fully responsive** — no-scroll desktop ≥1280, stacks/scrolls below, capped & centered ≥1680.
- **Dark enterprise theme** (Hitch navy/gold; cobalt data accent).
- **CISO-only dataset** — `data/allsec-benchmark.json`, **957 records**, filtering client-side.
- PDF export via Puppeteer at `/export`.

---

## 2. Recently completed (newest first)

### Key Insight band — (uncommitted)
- **Full-width "Key Insight" prose band** added below the benchmark panel (above the footer) so
  non-technical stakeholders get the High Consequence vs. Baseline Risk takeaway in plain language.
  New `components/zones/InsightZone.tsx` — static editorial copy, **no data binding** (figures quoted
  verbatim: medians/quartiles, deliberately distinct from the headline averages — risk B).
- Wired via `showInsight` prop in `components/layout/ZoneStack.tsx`; `app/export/page.tsx` passes
  `showInsight={false}` so the **PDF export is unchanged**.
- New `.insight-band` class in `globals.css` (`flex:none`) — the `flex:1` benchmark panel absorbs the
  height so the **no-scroll desktop ≥1280 is preserved** (charts shrink ~130–175px). On short laptops
  the charts get tight; trimming the copy is the fallback if it's unacceptable.
- Eyebrow reuses the `TierScatter` zone-header style (champagne accent); prose follows the
  `ToolFooter`/export-footer pattern. No new tokens. `npm run build` clean.

### Tier toggle + comp hero + header legibility — (commit `29ee376`)
- **Industry Tier → single-select segmented toggle** (`All Tiers · Baseline Risk · High
  Consequence`). New `setTier` in `FilterContext`; active segment = cobalt tint. Fixes the old
  multi-select 3-click dance and makes the "both tiers" default explicit.
  `components/layout/PeerGroupPanel.tsx` (`TierToggle`; dead `ChipGroup`/`Chip` removed).
- **Average Total Comp featured as a hero** — large gold (`--champagne`) figure, leftmost, with
  Base/Bonus/Equity as a smaller inline breakdown past a divider. Dropped the Bonus/Equity
  "% report none" sublabels + the redundant legend. `components/zones/CompensationZone.tsx`,
  `.comp-row`/`.comp-hero` in `globals.css` (+ mobile stack + `.export-ready` override).
- **Section headers brightened** `--text-tertiary` → `--text-secondary` (Compensation, Total Comp
  Distribution, Governance & Protection) for legibility; propagates to PDF export via `ZoneStack`.
- `npm run build` clean; pushed to `main`.

### Responsive redesign + comp distribution rework — (commit `4a2a63c`)
- **Fully responsive** via `@media` layout classes in `globals.css` applied to shell/body/
  sidebar/zones (SSR-safe, token-based, layout-only; colors/type stay inline). Breakpoints:
  **≥1680** capped & centered · **≥1280** signature no-scroll desktop · **768–1279** sidebar →
  sticky top bar + governance 2×2, page scrolls · **<768** single column + comp stats 2×2.
- **Label overlap fixed.** P25/P50/P75 dollar figures moved to an evenly-spaced 3-column
  readout *below* a taller (14px) bar; thin ticks still mark true positions → no collision.
  `components/zones/CompensationZone.tsx`.
- **Comp dead space reclaimed.** Distribution block now `flex:1`, vertically centered.
- **Donut hexes tokenized.** `#E6C36B`/`#4F9BF5` → `--donut-champagne-light`/`--donut-cobalt-light`.
- **PDF export protected.** `.export-ready` overrides force desktop layout at Letter width.
- `npm run build` clean; pushed to `main`.

### UI polish + dark-theme CISO pass (commits `3aacead` ← `85242a1`)
- White logo on dark theme (`hitch-logo-white.png`); Board Access donut recolored gold+cobalt+neutral.
- **Data scoped to CISO** (`csv-to-json.ts` filters `Role_Bucket === "CISO"`) → **957 records**
  (406 Baseline + 551 High Consequence). **Total Comp** = sum of base/bonus/equity averages
  (`totalCompAvg`): Baseline **$734,041** · High Consequence **$1,006,851**.
- Headline figures forced white; Location/Role pulled from UI (plumbing retained); Industry Tier
  promoted to primary control (`size="lg"` Chip).

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

1. **Visual QA on the Vercel deploy** (risk A): walk all zones across 1920/1280/1024/390px;
   confirm no label overlap, no comp dead space, sticky top bar + 2×2 governance, capped-center.
2. **Sample PDF export** end-to-end (risk C) — confirms desktop layout holds at Letter width.
3. **Resolve mean-vs-median guardrail** (risk B) with Brett/Michael.
4. **Smoke test on Vercel** after auto-deploy — auth, export, DNS at intelligence.hitchpartners.com.

---

## 5. How to verify locally

```
npm run dev          # Next 14 App Router (3000, or 3001 if taken)
npm run build        # full typecheck + prod build
```

**Auth-gated routes** (`/benchmark`, `/export`) 307-redirect when unauthed. Get a session:
```
JAR=/tmp/jar; rm -f $JAR
CODE=$(grep '^NEXTAUTH_ACCESS_CODE=' .env.local | cut -d= -f2- | tr -d '"')
CSRF=$(curl -s -c $JAR localhost:3000/api/auth/csrf | sed -E 's/.*"csrfToken":"([^"]+)".*/\1/')
curl -s -b $JAR -c $JAR -o /dev/null -X POST localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "csrfToken=$CSRF" --data-urlencode "code=$CODE" --data-urlencode "json=true"
curl -s -b $JAR localhost:3000/api/auth/session   # should show a user
```

**Math probe** (no auth): per-tier averages should match the target table:
```
node -e 'const d=require("./data/allsec-benchmark.json");
const p=v=>v?+String(v).replace(/[$,]/g,""):null;const m=a=>a.reduce((s,x)=>s+x,0)/a.length;
const t=n=>d.filter(r=>r["Industry Tier"]===n);
for(const n of ["Baseline","High Consequence"]){const rs=t(n);
const c=f=>rs.map(r=>p(r[f])).filter(Boolean);
console.log(n, Math.round(m(c("Base-Converted"))+m(c("Bonus-Converted"))+m(c("Equity-Converted"))));}'
# → Baseline 734041 · High Consequence 1006851
```

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
