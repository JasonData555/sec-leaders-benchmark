# Deploy Runbook — Hitch Intelligence

Production target: **intelligence.hitchpartners.com** on Vercel. Code is deploy-ready
(`next build` passes). The steps below require your accounts and are not automated.

## 1. Push the repo
This folder is now its own git repo with `origin =
github.com/JasonData555/sec-leaders-benchmark` and an initial commit on `main`.

```bash
cd ~/Desktop/SecLeadershipBenchmark
git push -u origin main      # authenticate with GitHub when prompted
```

## 2. Import to Vercel
- New Project → import `JasonData555/sec-leaders-benchmark`.
- Framework preset: **Next.js** · Root: `/` · Build: `next build` · Output: `.next` ·
  **Node 20.x** (Project Settings → General).
- Don't deploy yet — set env vars first (step 4).

## 3. Provision Vercel KV (session logging)
- Vercel → Storage → create a **KV** (Upstash Redis) database, connect it to this project.
  Vercel auto-injects `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`,
  `KV_REST_API_READ_ONLY_TOKEN`. (Until this exists, `/api/log` returns 500 and is ignored —
  auth still works.)

## 4. Environment variables (Project → Settings → Environment Variables)
Set for **Production** (and Preview if you want previews to work):

| Key | Value |
|---|---|
| `NEXTAUTH_URL` | `https://intelligence.hitchpartners.com` |
| `NEXTAUTH_SECRET` | `hap/MB5z2C2qiRz1RcCbFmvYo1BF0nfuhHF9aoGI3/8=` (or generate a fresh one) |
| `LINKEDIN_CLIENT_ID` | `785pajhuxz4z9g` |
| `LINKEDIN_CLIENT_SECRET` | *(your LinkedIn primary secret — rotate the one shared in chat)* |
| `NEXTAUTH_ACCESS_CODE` | *(choose the shared access code)* |
| `KV_*` (4 keys) | auto-added by step 3 |

## 5. Deploy
```bash
vercel --prod        # or click Deploy in the dashboard
```

## 6. DNS (Squarespace — manages the apex)
Add **only** this record (does not touch apex/www):

| Type | Host | Value |
|---|---|---|
| CNAME | `intelligence` | `cname.vercel-dns.com` |

Then in Vercel → Project → Domains, add `intelligence.hitchpartners.com`.

## 7. LinkedIn Developer Portal
App → Auth → add Authorized redirect URLs:
- `https://intelligence.hitchpartners.com/api/auth/callback/linkedin`
- `http://localhost:3000/api/auth/callback/linkedin` (local dev)

Ensure the app has the **Sign In with LinkedIn using OpenID Connect** product enabled
(scopes: `openid profile email`).

## 8. Smoke test (production)
- Visit the domain → auth screen. **Continue with LinkedIn** → round-trip → `/benchmark`.
- **Access code** path → `/benchmark`. Refresh persists (~8h). Logout/expiry → redirect to `/`.
- Filter (Role/Size/Region→City/Industry/Structure), n-counter, floor warning, candidate compare.
- **Export PDF** downloads `hitch-benchmark-<date>.pdf` (cover strip + zones).
- Confirm a KV `sessions` entry was appended (Vercel KV data browser).
- Mobile/tablet layout sanity (responsive polish is a separate pass).

## Notes
- **Rotate the LinkedIn client secret** that was shared in chat.
- `.env.local` is gitignored and never committed; `.env.local.example` documents the keys.
- PDF route is configured for `maxDuration: 60` (`vercel.json`) and uses `@sparticuz/chromium`
  on Vercel (env-switched in `lib/pdf.ts`).
