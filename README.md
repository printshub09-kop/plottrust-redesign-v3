# PlotTrust — Next.js starter

Production scaffold for the redesigned [plottrust.in](https://plottrust.in): a Maharashtra-first
plot discovery + land-records platform.

- Search plots by **Village / Gat / Survey / CTS / RERA**
- Every listing shows **DP Zone, Land type, Ready Reckoner vs Market value**
- B2B dashboard for **builders, lawyers, agents** (7/12 fetches, case tracking, billing)
- Tools: **7/12 extract, Zone check, UDCPR calculator, Ready Reckoner estimator**

## Stack

| Layer     | Tech                                           |
|-----------|------------------------------------------------|
| Framework | Next.js 15 (App Router), React 19, TypeScript  |
| Styles    | Tailwind 3.4 (custom tokens)                   |
| ORM       | Prisma 5.22 + PostgreSQL 16 + PostGIS          |
| Cache     | Redis 7 (Satbara + ASR lookups)                |
| Auth      | NextAuth (planned — email + phone OTP)         |
| Payments  | Razorpay (INR first-party)                     |
| Maps      | Leaflet + MapMyIndia / Mapbox                  |
| i18n      | Inter + Noto Sans Devanagari (Marathi fallback)|

## Getting started

```bash
# 1. install
pnpm i                         # or: npm i / yarn

# 2. env
cp .env.example .env.local
# fill DATABASE_URL, REDIS_URL, AUTH_SECRET, etc.

# 3. db
createdb plottrust
psql plottrust -c 'CREATE EXTENSION IF NOT EXISTS postgis;'
pnpm prisma migrate dev
pnpm tsx prisma/seed.ts        # seed a few Nashik villages + plots

# 4. run
pnpm dev
# → http://localhost:3000
```

## Project layout

```
nextjs/
├── app/
│   ├── layout.tsx          Root layout (JSON-LD, fonts, Navbar/Footer)
│   ├── page.tsx            Home (hero + tools strip + featured plots + CTA)
│   ├── search/page.tsx     Listings with filter rail
│   ├── plots/[id]/page.tsx Plot detail (Key facts, value comparison, map)
│   ├── dashboard/page.tsx  B2B Pro dashboard (KPIs, quick 7/12)
│   └── api/
│       ├── plots/route.ts         GET list / POST create
│       ├── 712/route.ts           POST Satbara fetch (Redis-cached)
│       └── ready-reckoner/route.ts GET ASR rate by village+year+landType
├── components/
│   ├── Navbar.tsx, Footer.tsx, WhatsAppCTA.tsx
│   ├── VillageSearch.tsx   Client combobox (village | gat | rera | cts)
│   ├── PlotCard.tsx        Zone-first card for listings
│   ├── ZoneBadge.tsx       Green/Yellow/Red pill
│   ├── PriceComparator.tsx Govt vs Market
│   └── TrustStrip.tsx
├── lib/
│   ├── types.ts            Domain types (Plot, Village, SearchFilters…)
│   ├── utils.ts            formatINR, detectMapKind, renameUpload, waLink
│   └── sample-data.ts      3 Nashik plots for first-run
├── prisma/
│   └── schema.prisma       District → Taluka → Village → Plot + ASR + Cases
├── next.config.js          Security headers + redirects + image remotePatterns
├── tailwind.config.ts      Brand / verified / accent / zone tokens
└── globals.css             Base + components (.btn-primary, .btn-wa, .card…)
```

## Design tokens

| Token        | Hex       | Use                                |
|--------------|-----------|------------------------------------|
| brand-600    | `#0F4C81` | Primary blue (trust / gov)         |
| brand-800    | `#0A2647` | Hero gradients                     |
| verified-600 | `#047857` | Green = Clean / NA / Verified      |
| accent-500   | `#F97316` | WhatsApp + paid CTAs (saffron)     |
| zone-red     | `#DC2626` | Red zone (reserved, no-build)      |
| zone-yellow  | `#F59E0B` | Yellow zone (agriculture)          |
| zone-green   | `#16A34A` | Green zone (residential)           |
| ink          | `#0F172A` | Primary text                       |
| muted        | `#64748B` | Secondary text                     |
| line         | `#E2E8F0` | Borders + dividers                 |

Fonts: **Inter** (body), **Plus Jakarta Sans** (display), **JetBrains Mono** (Gat/Survey
numbers), **Noto Sans Devanagari** (Marathi fallback).

## API routes

| Method | Path                      | Purpose                                 |
|--------|---------------------------|-----------------------------------------|
| GET    | `/api/plots`              | List / search with `SearchFilters`      |
| POST   | `/api/plots`              | Create listing (auth-required)          |
| POST   | `/api/712`                | Fetch Satbara (village + Gat/Survey)    |
| GET    | `/api/ready-reckoner`     | ASR rate by village + year + land type  |

All routes return `{ ok, data }` on success or `{ error, issues }` on validation
failure (HTTP 422). Cache hints are set via `Cache-Control`.

## Security baseline

- HSTS, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(self)`
- Zod validation on every request body + search param
- Rate limiting hook points in `/api/712` and `/api/plots POST` (wire to Upstash
  or Redis `INCR` + TTL)
- Secrets read from env only; never checked in (`.env*` is git-ignored).

## Roadmap

See `../AUDIT_AND_ROADMAP.md` for the full audit of the current site, the design
rationale, feature list, bug list, and the 4-week implementation plan.

## Disclaimer (public-facing)

> All 7/12, Ready Reckoner & Zone data is shown for ready reference only.  
> Please verify at Talathi / Sub-Registrar / Planning Authority before any
> transaction. PlotTrust is not a broker.  
> सर्व माहिती फक्त संदर्भासाठी आहे. व्यवहारापूर्वी तलाठी / उपनिबंधक कार्यालयात पडताळणी करावी.
