# progress.md — Hitch Intelligence: Security Leadership Benchmark

> Living working-log. Update this as we build. Most-recent-first within each section.
> Authoritative build rules live in **CLAUDE.md**; the design system in **DESIGN.md**.
> This file is the *state of play* — what's done, what's pending, and how to verify.

_Last updated: 2026-06-24 · branch `main` · dark-theme CISO pass._

---

## 1. Where we are right now

The tool is feature-complete through Phases 1–3 (build, data layer, export/auth) and is
deployable on Vercel. Active workstream is a **dark-theme + CISO-focus pass**. That pass is
**done and being pushed**.

**Live state of the app:**
- Single-page, no-scroll benchmark tool, auth-gated (LinkedIn OAuth + shared access code).
- **Dark enterprise theme** (Hitch navy/gold; cobalt data accent).
- **CISO-only dataset** — `data/allsec-benchmark.json`, **957 records**, all filtering client-side.
- PDF export via Puppeteer at `/export`.

---

## 2. Recently completed (newest first)

### Dark-theme CISO pass — (this change)
- **Data scoped to CISO.** `lib/scripts/csv-to-json.ts` now filters
  `Role_Bucket === "CISO"`; regenerated JSON from `AllSecBenchmark-highcon - CISO.csv`
  → **957 records** (406 Baseline + 551 High Consequence). That CSV is the single source.
- **Total Comp math fixed.** Headline Total is now the **sum of the base/bonus/equity
  averages** (`totalCompAvg` in `lib/metrics.ts`), not the mean of the Total Comp column.
  Verified to the dollar: Baseline **$734,041**, High Consequence **$1,006,851**;
  components Base $318K/$389K · Bonus $109K/$122K · Equity $308K/$495K.
- **Headline figures forced white** (`--text-primary`): Total Comp number, the P25/P50/P75
  distribution labels, and the Team Size median (were gold/cobalt). Donut segments stay
  colored (graphical, not figures). `BigStat` % was already white.
- **Location filter pulled from the menu** (UI only) — `LocationFilter` component and all
  `REGIONS`/`region`/`city`/`resolveLocation` plumbing left intact for later.
- **Role dropdown removed** from the panel (tool is CISO-only now). `RoleFilter.tsx` and
  its `lib/filters.ts` role logic kept in place — **Role will be re-added later.**
- **Industry Tier promoted to primary control** — moved to top of the panel and enlarged
  via a new `size="lg"` prop on `components/ui/Chip.tsx` (font 12→15, padding bumped).
  Company Size and other chips unchanged.

---

## 3. Known issues / risks / open questions

| # | Item | Severity | Notes |
|---|------|----------|-------|
| A | **No live browser screenshot** of the dark-theme CISO pass. Verified via typecheck + direct data computation + clean `/benchmark` compile. | Med | Confirm white figures, enlarged Industry Tier pills, and no-scroll 100vh in-browser before client demo. |
| B | **Comp headline shows averages (mean)**, while CLAUDE.md/DESIGN.md guardrail says "median never mean." | Med | Intentional for this dataset (client target table is averages). Reconcile the guardrail copy or confirm intent with stakeholders. |
| C | Mobile/tablet responsive layouts **not re-verified** after pill enlargement. | Low | Larger Industry Tier pills may reflow the chip row. |
| D | Dead `RoleFilter`/`LocationFilter` files retained intentionally. | Low | Will be wired back when Role returns; no action now. |

---

## 4. Best next moves (prioritized)

1. **Visual QA pass in a real browser** (risk A/C). Log in via access code, walk all zones
   at 1280px + a short 1280×720, confirm white figures + enlarged tier pills, then check
   tablet/mobile. Capture screenshots for the client.
2. **Generate a sample PDF export** end-to-end — confirms the dark theme + CISO numbers +
   white figures render in Puppeteer (zones are shared, so it should inherit).
3. **Resolve the mean-vs-median guardrail** (risk B) with Brett/Michael.
4. **Smoke test on Vercel** after this push auto-deploys — verify auth, export, and DNS at
   intelligence.hitchpartners.com.

---

## 5. How to verify locally (recipes that work)

**Run dev server / typecheck:**
```
npm run dev          # Next 14 App Router (port 3000, or 3001 if taken)
npx tsc --noEmit     # typecheck, fast
```

**Auth-gated routes need a session.** `/benchmark` and `/export` 307-redirect when
unauthed. Authenticate via the access-code (credentials) provider:
```
JAR=/tmp/jar; rm -f $JAR
CODE=$(grep '^NEXTAUTH_ACCESS_CODE=' .env.local | cut -d= -f2- | tr -d '"')
CSRF=$(curl -s -c $JAR localhost:3000/api/auth/csrf | sed -E 's/.*"csrfToken":"([^"]+)".*/\1/')
curl -s -b $JAR -c $JAR -o /dev/null -X POST \
  localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "csrfToken=$CSRF" --data-urlencode "code=$CODE" --data-urlencode "json=true"
curl -s -b $JAR localhost:3000/api/auth/session   # should show a user
```

**Math probe (no auth needed):** confirm per-tier averages against the target table:
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

## 6. Architecture quick-map (what lives where)

- **Tokens / theme:** `styles/globals.css` (`:root` custom properties — change values here,
  never hardcode hex in components). Spec mirror: `DESIGN.md` §2/§3.
- **Filter state + derived flags:** `app/benchmark/FilterContext.tsx`
  (`nCount`, `noResults`, `lowSample`, `floorWarning`, `candidate`).
- **Filtering / location floor / URL encode-decode:** `lib/filters.ts`
  (`applyFilters`, `resolveLocation`, `encodeFilters`/`decodeFilters` use `~` delimiter,
  `REGIONS`, `ELIGIBLE_CITIES`, `FLOOR=20`). Location + Role logic retained but not in UI.
- **Metrics:** `lib/metrics.ts` — percentiles, component means, `totalCompAvg`, D&O
  classify, board/severance/vesting rates. All display-rule logic lives here.
- **Filter panel:** `components/layout/PeerGroupPanel.tsx` (Industry Tier + Company Size).
- **Chip:** `components/ui/Chip.tsx` (`size="md"|"lg"`).
- **Zones:** `components/zones/{Compensation,Governance,FunctionalScope}Zone.tsx`.
  Charts rendered inline (the `components/charts/*` files are empty stubs).
- **Empty-state wrapper:** `components/layout/ZoneStack.tsx` (branches on `noResults`;
  used by both `app/benchmark/page.tsx` and `app/export/page.tsx`).
- **Data:** `data/allsec-benchmark.json` — 957 CISO records. Source CSV:
  `AllSecBenchmark-highcon - CISO.csv` (all roles; conversion filters to CISO).
- **Auth:** `app/api/auth/[...nextauth]/route.ts` + `lib/auth.ts` (LinkedIn + access code, JWT).
- **Export:** `app/export/page.tsx` (render target) + `app/api/export/route.ts` (Puppeteer).

---

## 7. Guardrails (from CLAUDE.md — don't violate)

- No Tailwind. CSS custom properties only. Never hardcode hex in components.
- Static JSON only — no DB, no API for filtering. One dataset, one product.
- Single-page, no-scroll desktop. No tabs/modals/nav. Three chart types only.
- `$XXXK` rounding; whole-number %; nulls excluded, never imputed 0. (Comp headline shows
  averages for this dataset — see risk B.)
- Surgical changes, minimal diffs. Ask before assuming. Commit/push only when asked.
