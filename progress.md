# progress.md — Hitch Intelligence: Security Leadership Benchmark

> Living working-log. Most-recent-first. Build rules in **CLAUDE.md**, design in **DESIGN.md**.
> This file is the *state of play* — what's done, pending, and how to verify.

_Last updated: 2026-06-24 · branch `main` · dark-theme CISO pass + UI polish._

---

## 1. Where we are right now

Feature-complete through Phases 1–3 (build, data, export/auth) and deployed on Vercel
(push to `main` auto-deploys). Live app:

- Single-page, no-scroll benchmark tool, auth-gated (LinkedIn OAuth + shared access code).
- **Dark enterprise theme** (Hitch navy/gold; cobalt data accent).
- **CISO-only dataset** — `data/allsec-benchmark.json`, **957 records**, filtering client-side.
- PDF export via Puppeteer at `/export`.

---

## 2. Recently completed (newest first)

### UI polish — white logo, bolder comp bar, donut palette — (this change, commit `3aacead`)
- **White logo on the dark theme.** Added `public/hitch-logo-white.png`; repointed all three
  `<img>` refs (header, auth screen, export cover strip) from `hitch-logo.png` → white version.
- **Compensation distribution bar enlarged.** Track 5px→10px (radius 3→5), marker pins
  17→24px, percentile labels 14→16px, floor/ceiling 10.5→12px. Edits inline in
  `components/zones/CompensationZone.tsx`.
- **Board Access donut recolored** (gold+cobalt+neutral, replacing the all-bronze ramp that
  washed out): Quarterly `--champagne` · Semi-Ann. `#E6C36B` · Annually `#4F9BF5` ·
  Per Request `--data-cobalt` · None `rgba(247,249,252,0.14)`. In `GovernanceZone.tsx`.
- `npm run build` clean; pushed to `main`.

### Dark-theme CISO pass
- **Data scoped to CISO.** `csv-to-json.ts` filters `Role_Bucket === "CISO"` from
  `AllSecBenchmark-highcon - CISO.csv` → **957 records** (406 Baseline + 551 High Consequence).
- **Total Comp math** = sum of base/bonus/equity averages (`totalCompAvg`), not mean of the
  Total Comp column. Baseline **$734,041** · High Consequence **$1,006,851**.
- **Headline figures forced white** (`--text-primary`): Total Comp, P25/P50/P75 labels,
  Team Size median. Donut segments stay colored (graphical, not figures).
- **Location filter + Role dropdown pulled from UI** (components/plumbing retained for later).
- **Industry Tier promoted** to top primary control via new `size="lg"` on `Chip.tsx`.

---

## 3. Known issues / risks

| # | Item | Sev | Notes |
|---|------|-----|-------|
| A | No live browser screenshot of dark-theme/UI-polish pass; verified via build + data probe. | Med | Confirm white logo, thicker bar alignment, donut legibility, no-scroll 100vh before demo. |
| B | Comp headline shows **averages (mean)** vs the legacy "median never mean" guardrail. | Med | Intentional for this dataset. Reconcile copy / confirm with stakeholders. |
| C | Mobile/tablet not re-verified after pill + bar enlargement. | Low | May reflow chip row / bar labels. |
| D | Dead `RoleFilter`/`LocationFilter` files retained intentionally. | Low | Re-wire when Role returns. |

---

## 4. Best next moves

1. **Visual QA in a real browser** (risk A/C): log in via access code, walk all zones at
   1280px + 1280×720, confirm white logo/figures, enlarged tier pills, thicker bar, donut
   colors; then tablet/mobile. Capture client screenshots.
2. **Sample PDF export** end-to-end — confirms dark theme + white logo + CISO numbers in Puppeteer.
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
- Single-page no-scroll desktop. No tabs/modals/nav. Three chart types only.
- `$XXXK` rounding; whole-number %; nulls excluded never imputed 0. (Headline shows averages — risk B.)
- Surgical changes, minimal diffs. Ask before assuming. Commit/push only when asked.
