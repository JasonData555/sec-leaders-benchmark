DESIGN.md — Hitch Intelligence Design System
Scope: This document governs the visual design, component architecture, copy voice, and interaction patterns for all Hitch Intelligence products. It is the authoritative reference for any AI-assisted build session. Follow it exactly. Do not substitute defaults.
________________


1. Identity
Firm: Hitch Partners
Product family: Hitch Intelligence
Current products: The Security Leadership Benchmark
Future products: Meridian (career intelligence), Proof (governance ledger), The Signal (market intelligence feed), Argus Digest (newsletter)
Positioning: Premium executive intelligence. The design should feel like it was commissioned by a private bank or a top-tier search firm — not built by a startup. Every element earns its place. Nothing decorates.
Audience: CISOs, board members, General Counsel, CFOs, and the Hitch partners who serve them. These are sophisticated readers who will notice if something looks templated.
________________


2. Color Palette — Parchment & Bronze
The locked six-token system. Use only these values. Do not introduce additional colors without explicit approval. (v1.1 — light theme; replaces the original dark "Ink & Champagne" ground. Token *names* are unchanged so all component code stays valid.)
--ink-deep:       #F2EFE7   /* Framing surface — header, footer, left panel */
--ink:            #E9E6DC   /* Primary page background */
--ink-surface:    #F8F6F0   /* Card and block surfaces — sits above --ink */
--champagne:      #8C6D3F   /* Primary accent — data highlights, active states, CTAs (bronze) */
--champagne-mid:  #B39A6A   /* Secondary data — donut segments, chart fills, muted accents */
--text-primary:   #1F232C   /* Primary type — warm near-black ink */
--hitch-blue:     #2F80ED   /* Brand blue — authentication screen LinkedIn button ONLY */


Derived values (do not hardcode — compute from tokens)
--text-secondary:  rgba(31, 35, 44, 0.64);   /* Secondary labels, metadata */
--text-tertiary:   rgba(31, 35, 44, 0.50);   /* Placeholder, disabled, micro-labels */
--border:          rgba(60, 50, 30, 0.20);   /* All dividers and outlines */
--border-active:   rgba(140, 109, 63, 0.55); /* Active chip borders, focused inputs */
--chip-bg:         rgba(60, 50, 30, 0.05);   /* Resting chip backgrounds */
--chip-active:     rgba(140, 109, 63, 0.16); /* Selected chip backgrounds */
--bar-bg:          rgba(60, 50, 30, 0.11);   /* Chart track backgrounds */
--accent-glow:     rgba(140, 109, 63, 0.07); /* Candidate band, subtle highlights */


Usage rules
* --champagne is the only accent color. It marks exactly one thing at a time: the primary data value, the active state, the selected chip. Never use it decoratively.
* --hitch-blue appears in exactly one place: the LinkedIn button on the authentication screen. It does not appear anywhere inside the tool. It is a brand connection point, not a design system color.
* --champagne-mid appears only in charts (donut segments, distribution fills) where multiple tones are needed for hierarchy. Never use it for interactive states.
* Black (#000) and pure white (#FFF) do not appear anywhere in the UI.
* No gradients between colors except the distribution bar fill (see Components).
* No shadows with color tints — box shadows use rgba(0,0,0,n) only.
________________


3. Typography
Three typeface roles. All loaded from Google Fonts. No substitutions.
Display — Cormorant Garamond
Used for: product wordmark, large data numbers, section headings, PDF cover titles.
Import: Cormorant Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400
Scale:
--type-display-xl:  font-size: 48px; font-weight: 300; letter-spacing: -0.01em;
--type-display-lg:  font-size: 32px; font-weight: 400; letter-spacing: -0.01em;
--type-display-md:  font-size: 28px; font-weight: 400; letter-spacing:  0.00em;
--type-number-xl:   font-size: 30px; font-weight: 400; letter-spacing: -0.01em;  /* Comp values */
--type-number-lg:   font-size: 22px; font-weight: 400; letter-spacing: -0.01em;  /* Governance big pcts */
--type-wordmark:    font-size: 17px; font-weight: 500; letter-spacing:  0.20em; text-transform: uppercase;


Cormorant Garamond is the personality of the system. Use it sparingly — only for numbers and headlines that need to carry authority. Everything else is DM Sans.
Body — DM Sans
Used for: all UI copy, filter labels, chip text, governance sublabels, methodology text, button labels.
Import: DM Sans:wght@300;400;500
Scale:
--type-body-md:     font-size: 12px; font-weight: 300; line-height: 1.6;
--type-body-sm:     font-size: 12px; font-weight: 300; line-height: 1.5;
--type-label:       font-size: 11px;  font-weight: 400; letter-spacing: 0.10em; text-transform: uppercase;
--type-label-sm:    font-size: 11px;   font-weight: 400; letter-spacing: 0.10em; text-transform: uppercase;
--type-button:      font-size: 11px;  font-weight: 400; letter-spacing: 0.10em; text-transform: uppercase;


Data / Mono — IBM Plex Mono
Used for: zone labels, hex values, n= counters, percentages, ranges, filter metadata, timestamps, methodology footnote labels.
Import: IBM Plex Mono:wght@300;400
Scale:
--type-mono-md:     font-size: 11px;  font-weight: 400; letter-spacing: 0.06em;
--type-mono-sm:     font-size: 10.5px; font-weight: 400; letter-spacing: 0.04em;
--type-mono-xs:     font-size: 10.5px; font-weight: 300; letter-spacing: 0.04em;
--type-zone-label:  font-size: 11px; font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase;

Minimum legible size: no UI text falls below 10.5px (v1.1 legibility pass). Earlier sub-9px micro-labels were the primary readability complaint and have been retired.


IBM Plex Mono on data values signals precision. The n = 247 counter, the P50 · $525K marker label, the 47% in a donut legend — all mono. Never use a proportional face for a number that represents a data point.
Typography rules
* Never bold a data value. Weight hierarchy in Cormorant Garamond comes from size, not weight.
* Sentence case for all copy. Exception: zone labels and filter labels use ALL CAPS in IBM Plex Mono only.
* No text decoration (underline, strikethrough) except hyperlinks in methodology text.
* Line height: body text 1.6, display text 1.0–1.1, mono labels 1.0.
________________


4. Spacing System
Base unit: 4px. All spacing values are multiples of 4.
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-7:  28px
--space-8:  32px
--space-10: 40px
--space-12: 48px


Layout-specific:
--panel-padding:     24px 20px    /* Left peer group panel inner padding */
--zone-padding:      20px 26px    /* Right content zone inner padding */
--header-padding:    17px 30px    /* Tool header */
--footer-padding:    10px 30px    /* Tool footer */
--card-padding:      12px 14px    /* Governance block inner padding */
--chip-padding:       3px  9px    /* Filter chip */
--button-padding:     6px 16px    /* Primary button */


________________


5. Border & Radius
--radius-tool:   10px   /* Outer tool container */
--radius-card:    3px   /* Governance blocks, surface cards */
--radius-chip:    2px   /* Filter chips, buttons */
--radius-bar:     2px   /* Chart tracks and fills */
--radius-dot:    50%    /* Legend dots, status indicators */


--border-width:   1px   /* All borders — never 2px except focus rings */
--border:         1px solid rgba(184, 168, 130, 0.13)
--border-active:  1px solid rgba(184, 168, 130, 0.40)


No border-radius above 10px anywhere in the system. This is a data tool, not a consumer app.
________________


6. Layout — Single Page, No Scroll
Desktop (≥1280px) — canonical layout
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER  — wordmark left · metadata + export button right     17px  │
├──────────────────┬──────────────────────────────────────────────────┤
│                  │                                                  │
│  PEER GROUP      │  ZONE 1: COMPENSATION          flex: 1.4        │
│  BUILDER         │  comp stats · distribution bar                  │
│  236px fixed     │                                                  │
│                  ├──────────────────────────────────────────────────┤
│  Role            │                                                  │
│  Company Size    │  ZONE 2: GOVERNANCE & PROTECTION  flex: 1.2     │
│  Industry        │  4 governance blocks side by side               │
│  Location        │                                                  │
│  Structure       ├──────────────────────────────────────────────────┤
│                  │                                                  │
│  n = 247         │  ZONE 3: FUNCTIONAL SCOPE         flex: 1.0     │
│                  │  function bars · team size                      │
│  [+ Compare]     │                                                  │
│                  ├──────────────────────────────────────────────────┤
│                  │  CANDIDATE BAND  (conditional — shows when       │
│                  │  comparison profile is active)                  │
├──────────────────┴──────────────────────────────────────────────────┤
│  FOOTER  — methodology text left · "Hitch Partners" right     10px  │
└─────────────────────────────────────────────────────────────────────┘


Viewport constraint: The tool fills 100vh with no overflow. Zone flex values (1.4 / 1.2 / 1.0) create proportional height distribution. On shorter viewports (768px height) zones compress proportionally — content never clips.
Left panel: width: 236px; flex-shrink: 0. Fixed width. Scrolls independently if filter content exceeds height.
Right content: flex: 1. Three zones separated by 1px solid var(--border) dividers. No outer padding — zones own their own padding.
Tablet (768px–1279px)
Left panel collapses to a horizontal filter bar across the top. Zones stack vertically and scroll. The tool is no longer no-scroll on tablet — that is acceptable and expected.
┌────────────────────────────────────────┐
│ HEADER                                 │
├────────────────────────────────────────┤
│ FILTER BAR (horizontal scrollable)     │
├────────────────────────────────────────┤
│ ZONE 1: COMPENSATION                   │
├────────────────────────────────────────┤
│ ZONE 2: GOVERNANCE                     │
├────────────────────────────────────────┤
│ ZONE 3: FUNCTIONAL SCOPE               │
├────────────────────────────────────────┤
│ FOOTER                                 │
└────────────────────────────────────────┘


Mobile (< 768px)
Governance blocks stack 2×2. Function bars reduce to top 5. Comp stats stack vertically. Filter panel opens as a bottom sheet on tap. Everything scrolls.
________________


7. Components
7.1 Wordmark
HITCH  ·  The Security Leadership Benchmark


* "HITCH" in Cormorant Garamond 500, 17px, letter-spacing 0.20em, uppercase, --text-primary
* Rule: 1px vertical line, 13px tall, --border color
* Product name in DM Sans 300, 10.5px, letter-spacing 0.10em, uppercase, --text-secondary
* Each product in the Hitch Intelligence family gets its own product name string here — the firm name never changes
7.2 Filter Chips
Three states: resting, active, disabled.
/* Resting */
color: var(--text-secondary);
background: var(--chip-bg);
border: 1px solid var(--border);


/* Active */
color: var(--champagne);
background: var(--chip-active);
border: 1px solid var(--border-active);


/* Disabled / out of scope */
color: var(--text-tertiary);
background: transparent;
border: 1px solid var(--border);


Font: DM Sans 300, 12px. Padding: 3px 9px. Border-radius: 2px. No transition longer than 120ms.
Chips never wrap beyond two rows. If a filter category would require more than two rows of chips, convert to a compact select or search input.
7.3 Data Numbers (Comp Values)
$525K


* Dollar sign + value in Cormorant Garamond 400, 30px, --text-primary for supporting values
* Primary total comp value uses --champagne
* K / M suffix as <sup> in Cormorant Garamond, 16px, opacity 0.70
* Range below in IBM Plex Mono 10.5px, --text-tertiary (accent color at 0.55 opacity for primary value range)
Never abbreviate values differently within the same view — if base is $300K, bonus must also be $68K, not $68,000.
7.4 Distribution Bar
A single horizontal track showing the full comp distribution with P25 / P50 / P75 markers.
/* Track */
height: 5px;
background: var(--bar-bg);
border-radius: 3px;


/* Fill — bell gradient centered at median */
background: linear-gradient(90deg,
  transparent 0%,
  var(--bar-bg) 8%,
  var(--champagne-mid) 35%,
  var(--champagne) 48%,
  var(--champagne) 52%,
  var(--champagne-mid) 65%,
  var(--bar-bg) 92%,
  transparent 100%);
opacity: 0.8;


/* Marker pin */
width: 1.5px;
height: 17px;
background: var(--champagne);
position: absolute;
top: -6px;


/* Marker label */
font-family: 'IBM Plex Mono';
font-size: 10.5px;
color: var(--champagne);
transform: translateX(-50%);
white-space: nowrap;


Floor and ceiling labels in IBM Plex Mono 10.5px --text-tertiary at track ends.
7.5 Zone Labels
COMPENSATION


IBM Plex Mono 400, 11px, letter-spacing 0.18em, all-caps, --text-tertiary. Always left-aligned, always paired with an optional right-aligned zone toggle in DM Sans 11px.
Zone labels identify data categories, not sections of a page. They are never headlines.
7.6 Governance Blocks
Four equal-width cards inside the Governance zone. Each card:
* Background: --ink-surface
* Border: 1px solid var(--border)
* Border-radius: 3px
* Padding: 12px 14px
Card layout (top to bottom):
1. Category label — DM Sans 400, 11px, letter-spacing 0.10em, uppercase, --text-tertiary
2. Primary stat — Cormorant Garamond 400, 32px, --text-primary (% suffix <sup> 17px, opacity 0.70)
3. Sublabel — DM Sans 300, 10.5px, --text-tertiary
4. Optional: mini bar stack or donut (Board Access card only)
Board Access card uses a donut chart (48×48px SVG, stroke-width 9) with a five-segment legend. Donut colors use the bronze family: --champagne, --champagne-mid, then rgba(140,109,63,·) at 0.55 / 0.35 / 0.18 for the dimmer segments.
7.7 Mini Bar Stack (D&O breakdown)
Full D&O    ████░░░░░░  16%
Indemnified ████████░░  46%
Neither     ███████░░░  38%


* Label: DM Sans 10.5px, --text-tertiary, fixed 80px width
* Track: 2.5px height, --bar-bg, border-radius 2px
* Fill: --bar-fill (--champagne)
* Percentage: IBM Plex Mono 10.5px, --text-tertiary, right-aligned, fixed 34px width
7.8 Horizontal Function Bars
Incident Response   ████████████████████  88%
Security Operations ███████████████████   83%


* Label: DM Sans 300, 12.5px, --text-secondary, fixed 170px width
* Track: 2.5px height, --bar-bg
* Fill: --champagne
* Percentage: IBM Plex Mono 10.5px, --text-tertiary, 34px right-aligned
Always sorted descending by frequency. Never sorted alphabetically.
7.9 n= Counter
n = 1,180


IBM Plex Mono 400, 11px, --champagne, letter-spacing 0.06em. Lives in the peer group panel header, right-aligned. Updates live as filters change.
When n drops below the floor (20), the counter turns --text-tertiary and a sublabel appears in the panel: "Small sample — broaden your filters." in DM Sans 300 11px. (City-level floor expansion uses the separate FloorWarning copy in §10.)
7.10 Candidate Comparison Band
Appears below Functional Scope when a comparison profile is active. Dismissed via an × control.
CANDIDATE PROFILE  |  $610K Total Comp · D&O Included · Quarterly Board Access       ↑ 72nd percentile


* Background: var(--accent-glow) — subtly warmer than the zone backgrounds
* Top border: 1px solid rgba(140, 109, 63, 0.30) — slightly stronger than standard --border
* "CANDIDATE PROFILE" label: IBM Plex Mono 10.5px, --champagne, letter-spacing 0.12em
* Separator rule: 1px vertical, 12px tall, --border
* Profile summary: Cormorant Garamond 400, 15px, --text-primary
* Percentile: IBM Plex Mono 11px, --champagne, right-aligned
7.11 Export Button
[ Export PDF ]


DM Sans 400, 11px, letter-spacing 0.10em, uppercase. Color: --champagne. Border: 1px solid var(--border-active). Background: --chip-bg. Border-radius: 2px. Padding: 6px 16px. Hover: background shifts to --chip-active.
No filled buttons anywhere in the system. All buttons are outline style.
7.12 Footer / Methodology
Left: methodology text in DM Sans 300, 10.5px, --text-tertiary, line-height 1.7, max-width 660px.
Right: "Hitch Partners" in Cormorant Garamond 400, 12px, --text-tertiary, letter-spacing 0.16em, uppercase.
Locked methodology copy:
This benchmark reflects 2,000+ security leadership profiles across North America and Europe, collected across the 2025–2026 survey period. Compensation figures are reported and normalized in USD. Peer group filters dynamically adjust to available data — combinations yielding fewer than 20 matching profiles automatically broaden to the next geographic level to preserve statistical reliability. Published by Hitch Partners.
Update year ranges on each annual data upload. The "2,000+" figure updates to reflect the actual record count rounded down to the nearest hundred.
________________


8. Motion & Interaction
Principle: Motion should feel like data updating, not animation performing.
Transitions
/* Filter state changes (chip active/inactive) */
transition: background 120ms ease, border-color 120ms ease, color 120ms ease;


/* Zone content update on filter change */
transition: opacity 200ms ease;
/* Fade out (80ms) → data updates → fade in (120ms) */


/* n= counter update */
transition: color 150ms ease;


/* Distribution bar fill on load */
transition: opacity 300ms ease;
/* Appears after 100ms delay — data before decoration */


What does not animate
* Layout shifts
* Panel width
* Font sizes
* Border-radius
* Anything in the PDF export
Reduced motion
All transitions disabled when prefers-reduced-motion: reduce is set. The tool is fully usable without any animation.
________________


9. Data Presentation Rules
These are non-negotiable for any intelligence product in the Hitch family.
1. Always show median, never mean unless explicitly labeled. Mean comp is misleading for right-skewed distributions.
2. P25 / P50 / P75 are the standard range markers. Never show min/max as primary range indicators — outliers distort the picture.
3. The n= count is always visible when data is filtered. Users must always know how many records back a statistic.
4. n < 20 triggers graceful degradation, never an error state. The tool broadens scope silently and notes it.
5. All compensation in USD. Currency conversion is handled in the dataset, not the UI.
6. Percentages round to whole numbers in display. Never show 47.3% — show 47%.
7. Dollar values round to nearest $1K in display. Never show $524,823 — show $525K.
8. Null/missing data is not shown as zero. Bonus null rate (19%) and equity null rate (38%) are reflected in n counts, not imputed as 0.
9. Synthetic records are never distinguished in the UI. The Record_Type field exists in the dataset for internal validation only.
________________


10. Copy Voice
Audience: Senior executives who are time-constrained and data-literate. They do not need explanations. They need precision.
Rules:
* Sentence case everywhere except zone labels (COMPENSATION, GOVERNANCE, etc.)
* Active voice. "Broaden your filters" not "Filters should be broadened."
* Specific over clever. "47% present to the board quarterly" not "Nearly half have board access."
* No filler words: "simply," "easily," "powerful," "robust."
* No hedging in UI copy: "may," "might," "could" are for methodology text only.
* Error states explain what happened and what to do — they never apologize.
Empty state (no filters selected):
Showing all 1,180 CISO profiles. Use the peer group builder to narrow your view.
Floor warning (n < 20 for city-level):
Showing [Region] data — narrow other filters to enable city-level view.
No results (impossible filter combination):
No profiles match this combination. Remove a filter to see results.
Loading:
Updating… (IBM Plex Mono, --text-tertiary — appears only if update takes > 300ms)
________________


11. Authentication UI
LinkedIn OAuth (primary path)
Landing page before auth: minimal. --ink-deep (parchment) background. Centered wordmark. Single sentence of context. One button.
                   HITCH  ·  Intelligence




          The Security Leadership Benchmark




    Compensation and governance data for 2,000+ security
    leadership profiles. Access provided by Hitch Partners.




              [ Continue with LinkedIn ]




              Or enter an access code below
              [                         ]


* Wordmark: standard system wordmark, centered, 48px top margin
* Context sentence: DM Sans 300, 12px, --text-secondary, centered, max-width 360px
* LinkedIn button: DM Sans 400, 11px, letter-spacing 0.08em. Background: #2F80ED (--hitch-blue). Color: #FFFFFF. Border-radius: 2px. Padding: 10px 24px. No LinkedIn logo — the label is sufficient. This is the only element in the entire system that uses --hitch-blue and the only filled element that is not champagne.
* Access code input: DM Sans 300, 12px. Background: --ink-surface. Border: --border. Border-radius: 2px. Padding: 8px 12px. --text-primary input text. Placeholder in --text-tertiary.
* Footer: methodology text, centered, --text-tertiary
The LinkedIn button is the only filled element in the entire system. It is filled specifically here because it is the primary conversion action on a single-purpose screen.
Session logging
Log on each authenticated session: LinkedIn name, title, company (from OAuth), timestamp, IP (hashed), session duration. Store in Vercel edge config or a lightweight append-only log. Do not store comp searches individually — log only session-level activity.
________________


12. PDF Export
The export renders a snapshot of the current peer group view as a single Letter-portrait PDF.
Structure:
1. Cover strip (top 80px): Hitch wordmark left, "The Security Leadership Benchmark" center, date + peer group summary right. Background: --ink-deep. Champagne rule below strip.
2. Peer group definition (below cover strip): Role | Size | Industry | Location | Structure | n= in a single compact row. DM Sans 9px, --text-secondary.
3. Compensation section: Four stat blocks + distribution bar. Same layout as on-screen.
4. Governance section: Four governance blocks. Same layout as on-screen.
5. Functional scope section: Function bars + team size. Same layout as on-screen.
6. Candidate comparison (conditional): appears if a profile was active at export time.
7. Footer: Methodology copy. "Prepared by Hitch Partners" + date.
PDF typography: Identical to screen. Cormorant Garamond + DM Sans + IBM Plex Mono all embed correctly in PDF via html-to-pdf rendering (Puppeteer / @sparticuz/chromium).
PDF color: The export renders in the same light Parchment & Bronze theme as the screen (v1.1). The parchment ground prints cleanly and remains the premium deliverable. Do not introduce a separate dark variant for PDF.
________________


13. Future Products — Extension Pattern
Each new Hitch Intelligence product inherits this full design system and adds one product-specific token: its accent modifier.
The six core tokens never change. The product name in the wordmark changes. Optional: a product-specific secondary accent can be introduced for a second data series (e.g. Meridian showing current comp vs. target comp) — but it must be derived from the champagne family, not introduced from outside the palette.
Extension checklist for new products:
* [ ] Update wordmark product name string
* [ ] Update methodology footer copy
* [ ] Update n= floor if dataset size differs
* [ ] Define zone structure (may differ from 3-zone benchmark layout)
* [ ] Confirm PDF cover strip copy
* [ ] Add product to this document's identity section
________________


14. Implementation Notes for Claude Code
When using this design system in a Claude Code session:
1. Import all three fonts from Google Fonts at the top of the layout. Do not use system fonts.
2. Define all tokens as CSS custom properties on :root. Reference tokens everywhere — never hardcode hex values in component styles.
3. The tool container is not a full-page scroll document. Use height: 100vh; overflow: hidden on the outer container and manage internal zone sizing with flexbox.
4. Left panel is 236px fixed width. Do not make it resizable in v1.
5. Data is loaded as static JSON from /data/allsec-benchmark.json. Client-side filtering only. No API calls for filter operations.
6. LinkedIn OAuth via NextAuth.js with the LinkedIn provider. Session stored as JWT. No database required for stateless auth.
7. PDF export via Puppeteer (server-side rendering of a dedicated /export route that accepts query params matching the current peer group state).
8. Recharts for all data visualization. Do not introduce a second charting library.
9. Tailwind is not used in this system. All styles are CSS custom properties + standard CSS. The design system's precision requires it.
10. No console.log in production. No debug overlays. No TODO comments in committed code.
________________


Last updated: June 2026 · Hitch Partners
 Design system version: 1.0
 Products covered: The Security Leadership Benchmark