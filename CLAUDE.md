CLAUDE.md — Hitch Intelligence: The Security Leadership Benchmark
This file is the authoritative build reference for all Claude Code sessions on this project. Read it fully before writing any code. Follow it exactly. When in doubt, re-read this file.
________________


1. Agent Behavior
These rules govern how you operate in every session. Non-negotiable.
Subagent Usage
* Use subagents liberally to keep the main context window clean
* Offload to subagents: research, exploration, parallel analysis, library evaluation, and any task that can be isolated
* For complex problems, throw compute at it — spawn multiple subagents working in parallel rather than solving sequentially in the main context
* One task per subagent — focused execution only; no subagent does two unrelated things
Ask, Don't Assume
* If anything is unclear — architecture, intent, requirements, field names, behavior — ask before writing a line of code
* No silent guesses. If you infer something, state the inference and confirm before acting on it
* One focused question at a time; do not bundle multiple questions into a wall of text
Simplicity First
* Implement the minimum thing that works
* No abstractions that weren't explicitly requested
* No helper utilities, no wrapper functions, no "while I'm here" refactors
* If the simple solution handles the case, ship the simple solution
Surgical Changes
* Don't touch unrelated code. If a file isn't part of the current task, leave it exactly as it is
* Changes touch only what's necessary — minimal diff, minimal blast radius
* No reformatting, no renaming, no style fixes in files you're editing for another reason
Flag Uncertainty
* If you're not confident, say so before proceeding
* Confidence without certainty causes more damage than admitting a gap
* State your uncertainty explicitly: "I'm not sure whether X or Y is correct here — which do you want?"
No Laziness
* Find root causes; no temporary fixes
* Senior developer standards throughout
* If something is wrong, fix it properly or flag it — never paper over it
Minimal Impact
* Every change should be as small as possible
* Avoid introducing bugs in adjacent code
* Test the specific change; don't assume surrounding code still works
________________


2. Project Overview
Product: Hitch Intelligence — The Security Leadership Benchmark
Purpose: Client-facing compensation and governance benchmarking tool for security leadership roles. Used by Hitch Partners in placements and provided to CISOs, boards, and executives as a premium intelligence resource.
URL: intelligence.hitchpartners.com
 Hosting: Vercel
Stack: Next.js (App Router), static JSON data, NextAuth.js, Recharts, Puppeteer for PDF
Design system: See DESIGN.md — read it before touching any UI file.
________________


3. Repository Structure
/
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, auth provider
│   ├── page.tsx                # Auth gate — redirects to /benchmark if session exists
│   ├── benchmark/
│   │   └── page.tsx            # Main tool — single page, no scroll
│   ├── export/
│   │   └── page.tsx            # PDF render target — server-side, no layout chrome
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts    # NextAuth LinkedIn + access code handler
│       ├── export/
│       │   └── route.ts        # Puppeteer PDF generation endpoint
│       └── log/
│           └── route.ts        # Session usage logging endpoint
├── components/
│   ├── layout/
│   │   ├── ToolHeader.tsx
│   │   ├── ToolFooter.tsx
│   │   └── PeerGroupPanel.tsx
│   ├── zones/
│   │   ├── CompensationZone.tsx
│   │   ├── GovernanceZone.tsx
│   │   └── FunctionalScopeZone.tsx
│   ├── charts/
│   │   ├── DistributionBar.tsx
│   │   ├── BoardDonut.tsx
│   │   └── FunctionBars.tsx
│   ├── filters/
│   │   ├── RoleFilter.tsx
│   │   ├── SizeFilter.tsx
│   │   ├── IndustryFilter.tsx
│   │   ├── LocationFilter.tsx
│   │   └── StructureFilter.tsx
│   └── ui/
│       ├── Chip.tsx
│       ├── NCounter.tsx
│       ├── CandidateBand.tsx
│       └── FloorWarning.tsx
├── lib/
│   ├── data.ts                 # Data loading, filtering, aggregation logic
│   ├── filters.ts              # Filter state types and helper functions
│   ├── metrics.ts              # Comp and governance metric calculations
│   └── pdf.ts                  # PDF generation utilities
├── data/
│   └── allsec-benchmark.json   # 2,000-record dataset — source of truth
├── public/
│   └── hitch-logo.svg          # Logo SVG — pending delivery
├── styles/
│   └── globals.css             # CSS custom properties, base reset, font imports
├── CLAUDE.md                   # This file
├── DESIGN.md                   # Design system reference
└── .env.local                  # Never commit — see Environment Variables section


________________


4. Design System
The complete design system lives in DESIGN.md. Read it before writing any UI code. Key rules summarized:
Never hardcode hex values. All colors reference CSS custom properties defined in globals.css.
/* globals.css — define these on :root */
--ink-deep:       #141820;
--ink:            #181C26;
--ink-surface:    #1E2232;
--champagne:      #B8A882;
--champagne-mid:  #8C7E62;
--text-primary:   #ECEAE6;
--hitch-blue:     #2F80ED;   /* Auth screen LinkedIn button ONLY — nowhere else */


/* Derived tokens */
--text-secondary:  rgba(236, 234, 230, 0.50);
--text-tertiary:   rgba(236, 234, 230, 0.27);
--border:          rgba(184, 168, 130, 0.13);
--border-active:   rgba(184, 168, 130, 0.40);
--chip-bg:         rgba(184, 168, 130, 0.07);
--chip-active:     rgba(184, 168, 130, 0.16);
--bar-bg:          rgba(184, 168, 130, 0.09);
--accent-glow:     rgba(184, 168, 130, 0.05);


Fonts — Google Fonts, load in layout.tsx:
* Cormorant Garamond — display, data numbers, wordmark
* DM Sans — all UI copy, labels, chips, buttons
* IBM Plex Mono — zone labels, n= counter, percentages, ranges, metadata
No Tailwind. All styles are CSS custom properties + standard CSS. No exceptions.
No shadows with color tints. Box shadows use rgba(0,0,0,n) only.
Border-radius maximum: 10px on the outer tool container, 3px on cards, 2px on chips and buttons.
________________


5. Data Layer
Source file
/data/allsec-benchmark.json — converted from AllSecBenchmark_2000_Final.csv
2,000 records, 48 fields. All filtering is client-side. No API calls for filter operations.
Key field names (exact — these are CSV column names preserved in JSON)
// Identity
'Role_Bucket'           // 'CISO' | 'Deputy CISO' | 'CIO' | 'VP Security' |
                        // 'Director Product Security' | 'Director Security Engineering' |
                        // 'Director GRC' | 'VP Business Technology'
'Record_Type'           // 'Actual' | 'Synthetic' — internal use only, never shown in UI
'Your Title'            // Specific title string
'Title-Level'           // 'CISO / Head Security Level' | 'NextGen' | 'CIO'
'Company'               // Company name string (null for Actual records)
'Gender'                // 'Male' | 'Female' | 'Prefer not to answer'


// Geography
'City'                  // See location filter config below
'Global Region'         // 'North America' | 'Europe & International'
'Location'              // Full location string e.g. 'San Francisco, CA, USA'


// Company
'Current Company Size'  // See size values below
'Industry'              // String — 38 unique values
'Company Structure'     // 'Publicly Traded Company' | 'Privately Held Company' |
                        //  'Non-Profit' | 'Government / Municipality'


// Compensation (all USD)
'Base-Converted'        // Numeric string — parse with parseFloat()
'Bonus-Converted'       // '$X,XXX' string or null
'Equity-Converted'      // '$X,XXX' string or null
'Total Comp-Converted'  // Numeric — range: $0–$2,205,000; median: $460,000


// Governance
'How often do you present to the Board of Directors?'
  // 'At least quarterly' | 'At least semi-annually' | 'At least annually' |
  // 'Per request' | 'I do not report to the Board of Directors'
'Are you currently included in the following?'
  // D&O field — values are comma-separated combinations of:
  // 'Corporate Directors & Officers (D&O) Policy'
  // 'Corporate Indemnification Policy'
  // 'Neither' | 'Not Sure'
'Have you pre-negotiated a severance agreement as part of your employment?'
  // 'Yes' | 'No'
'Do you have a negotiated accelerated vesting clause / early termination agreement?'
  // 'Yes' | 'No' | 'N/A - no equity'


// Functional scope
'Which of the following functions fall under your direct responsibility and decision-making authority?'
  // Comma-separated string of function names
'Team Size'             // Numeric


// Record metadata
'Date Received'         // 'Synthetic-2026' for synthetic records; date string for actual
'Current Tenure'        // Numeric (months)


Company size values (ordered)
const SIZE_ORDER = [
  '< 250 employees',
  '250 - 499 employees',
  '500 - 999 employees',
  '1000 - 4999 employees',
  '5000 - 9,999 employees',
  '10,000 - 25,000 employees',
  '25,000+ employees',
] as const;


Role counts in dataset
CISO                          1,180
Deputy CISO                     200
CIO                             200
VP Security                     140
Director Product Security        90
Director Security Engineering    80
Director GRC                     70
VP Business Technology           40
Total                         2,000


Data loading pattern
Load once at app initialization. Do not re-fetch on filter change.
// lib/data.ts
import data from '@/data/allsec-benchmark.json';


export type BenchmarkRecord = typeof data[0];
export const allRecords: BenchmarkRecord[] = data;


Filtering pattern
All filters are additive AND logic. A record must pass all active filters to be included.
// lib/filters.ts
export interface FilterState {
  roles: string[];
  sizes: string[];
  industries: string[];
  region: string | null;       // 'North America' | 'Europe & International' | null
  city: string | null;         // specific city or null (falls back to region)
  structures: string[];
}


export function applyFilters(
  records: BenchmarkRecord[],
  filters: FilterState
): BenchmarkRecord[] {
  return records.filter(r => {
    if (filters.roles.length && !filters.roles.includes(r['Role_Bucket'])) return false;
    if (filters.sizes.length && !filters.sizes.includes(r['Current Company Size'])) return false;
    if (filters.industries.length && !filters.industries.includes(r['Industry'])) return false;
    if (filters.structures.length && !filters.structures.includes(r['Company Structure'])) return false;
    if (filters.city) {
      if (r['City'] !== filters.city) return false;
    } else if (filters.region) {
      if (r['Global Region'] !== filters.region) return false;
    }
    return true;
  });
}


________________


6. Location Filter Architecture
Two-tier: Region → City. City level only surfaces if n ≥ 20 for the current filter combination.
Region definitions
export const REGIONS = {
  'West Coast':          ['Bay Area', 'Los Angeles', 'Seattle', 'San Diego', 'Portland'],
  'Northeast':           ['NYC Metro', 'Boston', 'Philadelphia', 'DMV', 'Baltimore', 'Richmond'],
  'South / Southeast':   ['Dallas', 'Houston', 'Atlanta', 'Miami', 'Charlotte', 'Nashville', 'Raleigh - Durham'],
  'Midwest':             ['Chicago', 'Minneapolis', 'Kansas City', 'Columbus', 'Des Moines'],
  'Mountain / Southwest':['Denver', 'Salt Lake City', 'Las Vegas', 'Phoenix', 'Austin'],
  'Other US':            ['Bentonville', 'Greensboro', 'Charleston', 'Chattanooga', 'Tulsa'],
  'Remote':              ['Remote'],
  'London':              ['London'],
  'Europe & EMEA':       ['Helsinki', 'Tel Aviv', 'Dubai', 'Amsterdam', 'Berlin'],
} as const;


// Cities eligible for tier-2 display (n≥20 in full unfiltered dataset)
export const ELIGIBLE_CITIES = [
  'Bay Area', 'NYC Metro', 'Seattle', 'Chicago', 'London', 'DMV',
  'Los Angeles', 'Boston', 'Denver', 'Austin', 'Salt Lake City', 'Atlanta',
  'Dallas', 'Miami', 'Kansas City', 'Minneapolis', 'Houston', 'Phoenix',
  'San Diego', 'Raleigh - Durham', 'Remote', 'Charlotte', 'Philadelphia', 'Nashville',
];


n=20 floor behavior
// If filtered n < 20 when city is selected → auto-expand to region
// Show FloorWarning component: "Showing [Region] data — narrow other filters for city view"
// City selector greys out but does not disappear
// For non-CISO roles, city chips are disabled with tooltip:
// "City-level data available for CISO only"


________________


7. Metrics & Calculations
All metric calculations live in lib/metrics.ts. No calculation logic in components.
// lib/metrics.ts


// Parse compensation value — handles '$X,XXX' strings and raw numbers
export function parseComp(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const str = String(value).replace(/[$,]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}


// Percentile calculation
export function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}


// Display formatting rules — non-negotiable
export function formatDollars(value: number): string {
  // Always round to nearest $1K, display as $XXXk
  return `$${Math.round(value / 1000)}K`;
}


export function formatPercent(value: number): string {
  // Always whole number — never $47.3%, always $47%
  return `${Math.round(value)}%`;
}


// D&O classification — parse comma-separated D&O field
export function classifyDO(value: string | null): 'full' | 'indemnified' | 'neither' | 'unknown' {
  if (!value) return 'unknown';
  const has_do = value.includes("Directors & Officers");
  const has_ind = value.includes("Indemnification");
  if (has_do && has_ind) return 'full';
  if (has_do) return 'full';
  if (has_ind) return 'indemnified';
  if (value === 'Neither') return 'neither';
  return 'unknown';
}


Display rules enforced in metrics layer
* Median, never mean — never show mean compensation in UI
* P25 / P50 / P75 are the standard range markers
* Percentages: round to whole numbers
* Dollar values: round to nearest $1K, display as $XXXk
* Null compensation values are excluded from calculations — never imputed as zero
* Synthetic records are included in all calculations — Record_Type is never filtered in UI
________________


8. Layout Architecture
The tool is a single-page, no-scroll experience on desktop (≥1280px).
// app/benchmark/page.tsx structure
// height: 100vh; overflow: hidden on outer container
// flexbox column: header → body → footer
// body: flexbox row: left panel (236px fixed) + right content (flex: 1)
// right content: flexbox column with 3 zones at flex ratios 1.4 / 1.2 / 1.0
// candidate band: conditional, appears between zone 3 and footer when active


Left panel: width: 236px; flex-shrink: 0; overflow-y: auto
 Right zones: separated by 1px solid var(--border) — no padding between zones, zones own their own padding (20px 26px)
Header: 17px 30px padding
Footer: 10px 30px padding
Tablet (768–1279px): Filter panel becomes horizontal scrollable bar. Zones stack, page scrolls.
Mobile (<768px): Bottom sheet filter panel. Governance blocks 2×2. Top 5 functions only.
________________


9. Authentication
NextAuth configuration
// app/api/auth/[...nextauth]/route.ts
// Provider 1: LinkedIn OAuth
// Provider 2: Credentials (access code)
// Session strategy: JWT (stateless — no database)
// Session max age: 8 hours


// LinkedIn OAuth scopes needed: openid, profile, email
// Callback URL registered in LinkedIn app: https://intelligence.hitchpartners.com/api/auth/callback/linkedin


Access code
* Single shared code stored in NEXTAUTH_ACCESS_CODE environment variable
* Displayed as a secondary option below the LinkedIn button on the auth screen
* No expiry — rotate manually when needed
Session logging
On each successful authentication, POST to /api/log:
{
  timestamp: string,         // ISO 8601
  provider: 'linkedin' | 'code',
  name: string | null,       // From LinkedIn profile
  title: string | null,      // From LinkedIn profile
  company: string | null,    // From LinkedIn profile
  sessionId: string,         // Random UUID generated at login
}


Log destination: Vercel edge config or a Vercel KV store append-only log. Session-level only — do not log individual filter interactions.
Auth screen layout
Background: var(--ink-deep) full viewport
Centered column, max-width 400px, vertically centered


  [Hitch wordmark — standard system wordmark]
  [24px gap]
  [Product name: "The Security Leadership Benchmark"]
  [16px gap]
  [Context: "Compensation and governance data for 2,000+ security
             leadership profiles. Access provided by Hitch Partners."]
  [32px gap]
  [LinkedIn button — #2F80ED background, white text, "Continue with LinkedIn"]
  [24px gap]
  [Divider with "or" label]
  [16px gap]
  [Access code input — placeholder "Enter access code"]
  [8px gap]
  [Submit button — champagne outline style]
  [48px gap]
  [Methodology footnote — centered, --text-tertiary]


________________


10. PDF Export
Generation approach
Server-side Puppeteer rendering of a dedicated /export route.
// app/api/export/route.ts
// 1. Receive GET request with peer group state as query params
// 2. Construct /export page URL with params
// 3. Launch Puppeteer (@sparticuz/chromium for Vercel)
// 4. Navigate to /export page (authenticated via session cookie)
// 5. Wait for data to render (waitForSelector on a known element)
// 6. Print to PDF — Letter, portrait, no margins
// 7. Return PDF as application/pdf response


// app/export/page.tsx
// Reads peer group state from URL params
// Renders same three zones as main tool
// No header/footer chrome from layout.tsx (layout: false)
// No candidate band in export unless explicitly included
// Includes PDF-specific cover strip and methodology footer


PDF cover strip
Background: var(--ink-deep), 80px height
Left: Hitch wordmark
Center: "The Security Leadership Benchmark"
Right: Export date + peer group summary (Role | Size | n=X)
Bottom: 1px champagne rule


Peer group state as URL params
/export?roles=CISO&sizes=1000-4999,5000-9999&industries=Technology,Healthcare&region=West+Coast&city=Bay+Area&structures=Public,Private


________________


11. Environment Variables
# .env.local — never commit this file


# NextAuth
NEXTAUTH_URL=https://intelligence.hitchpartners.com
NEXTAUTH_SECRET=                    # Generate: openssl rand -base64 32


# LinkedIn OAuth
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=


# Access code fallback
NEXTAUTH_ACCESS_CODE=               # Single shared code — rotate manually


# Vercel KV (session logging)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=


________________


12. Data Management
JSON conversion
Convert AllSecBenchmark_2000_Final.csv to JSON once at project setup:
# lib/scripts/csv-to-json.ts
# Run once: npx ts-node lib/scripts/csv-to-json.ts
# Output: /data/allsec-benchmark.json
# This script is not part of the build — run manually on data updates


Annual data update process
1. Receive new survey cohort CSV
2. Run through the Python synthesis pipeline (synth_gen_v3.py) to augment
3. Retire oldest survey cohort (survey vintage window — drop full cohort, not rolling date)
4. Run csv-to-json.ts conversion script
5. Replace /data/allsec-benchmark.json
6. Update methodology footnote year range in DESIGN.md and component
7. Redeploy to Vercel (vercel --prod)
Data vintage label
The methodology footer displays: "collected across the 2025–2026 survey period"
 Update year range on each annual refresh. Do not automate — update manually and confirm before deploy.
________________


13. Vercel & DNS Configuration
Vercel project settings
* Framework: Next.js
* Root directory: /
* Build command: next build
* Output directory: .next
* Node version: 20.x
DNS — add to hitchpartners.com DNS (Squarespace manages apex domain)
Type    Host            Value
CNAME   intelligence    cname.vercel-dns.com


This does not touch Squarespace's apex or www records.
LinkedIn OAuth redirect URI
Register in LinkedIn Developer Portal:
https://intelligence.hitchpartners.com/api/auth/callback/linkedin


Also register for local development:
http://localhost:3000/api/auth/callback/linkedin


________________


14. Build Phases
Phase 1 — Design shell (current)
Goal: Visual shell approved by Brett and Michael before any data is wired.
* [ ] Project scaffold (Next.js App Router, TypeScript, CSS custom properties)
* [ ] globals.css with full token system from DESIGN.md
* [ ] Font imports (Cormorant Garamond, DM Sans, IBM Plex Mono)
* [ ] Tool layout: header, left panel, three zones, footer
* [ ] All components with placeholder/static data
* [ ] Auth screen (static — no NextAuth yet)
* [ ] Responsive breakpoints (tablet + mobile)
* Deliverable: Full visual shell running at localhost:3000, all three zones visible with static numbers
Phase 2 — Data layer
* [ ] CSV → JSON conversion script
* [ ] Data loading and type definitions
* [ ] Filter state management
* [ ] All filter components wired to real data
* [ ] Metric calculations (percentiles, D&O classification, board access rates)
* [ ] n= counter live with floor warning logic
* [ ] Location filter two-tier logic with role-aware collapse
* [ ] Candidate comparison input and band
* [ ] All zones updating in real time on filter change
* Deliverable: Fully functional tool with real data at localhost:3000
Phase 3 — Export, auth, and polish
* [ ] NextAuth LinkedIn OAuth integration
* [ ] Access code fallback
* [ ] Session logging
* [ ] PDF export (Puppeteer, /export route)
* [ ] Micro-animations (filter transitions, zone fade on update)
* [ ] Mobile responsive final pass
* [ ] Methodology footnote final copy
* [ ] Error and empty states
* [ ] Performance audit (bundle size, JSON load time)
* [ ] Deploy to Vercel + DNS configuration
* Deliverable: Production-ready at intelligence.hitchpartners.com
________________


15. What This Product Is Not
Knowing what not to build is as important as knowing what to build.
* Not a database-backed tool. No Prisma, no PostgreSQL, no Supabase. Static JSON only.
* Not a real-time data product. Data updates once annually via manual redeploy.
* Not a public tool. Auth gate on every route. No public-facing pages except the auth screen.
* Not a multi-tenant SaaS. One dataset, one product, one Vercel project.
* Not a search tool. Filters only — no full-text search, no autocomplete on data values.
* Not a scrolling dashboard. Desktop experience is no-scroll, single page. Do not add tabs, modals, or navigation.
* Not a Tailwind project. CSS custom properties only. Do not install Tailwind.
* Not a multi-chart product. Three chart types only: distribution bar, board donut, horizontal function bars. All via Recharts.
________________


16. Extension — Future Hitch Intelligence Products
When building the next product in the Hitch Intelligence family (Meridian, Proof, The Signal, Argus Digest):
1. This CLAUDE.md is the starting template — fork it, update product-specific sections
2. DESIGN.md is inherited wholesale — only the wordmark product name string changes
3. The six core color tokens never change across products
4. --hitch-blue remains auth-screen-only across all products
5. New products may define a second data accent (must be champagne-family derived)
6. Add the new product to the Identity section of DESIGN.md
________________


Last updated: June 2026
 Product: Hitch Intelligence — The Security Leadership Benchmark v1.0
 Stack: Next.js · Vercel · NextAuth · Recharts · Puppeteer