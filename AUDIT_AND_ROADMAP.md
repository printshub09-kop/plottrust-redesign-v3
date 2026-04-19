# PlotTrust — Audit, Redesign & 4-Week Roadmap

Prepared for: **Sagar, Nashik**  
Scope: full audit of the current plottrust.in, redesigned UI/UX (B2C + B2B),
feature upgrades, bug list, tech architecture, and a 4-week implementation plan.

---

## 1. Current site — audit (findings)

The audit is based on the current homepage source (`17 april updated plotrust 4 pm/index.html`)
in your workspace. Live production access was blocked by the egress proxy, but
your source is the canonical truth anyway.

### 1.1 UI / UX issues

| # | Finding | Severity |
|---|---------|----------|
| 1 | Hero headline *"Build your dream home in 5 minutes"* conflates the tool (UDCPR calculator) with the real user intent ("check a plot before I pay"). | High |
| 2 | Navigation is **hidden below 500px** (`display:none` on mobile). Users on 4G cannot reach any other page. | Critical |
| 3 | Aggressive red **"⚠️ UNVERIFIED INFORMATION"** disclaimer bar sits above the fold. It screams distrust and signals "do not use". Reference disclaimers belong at the footer, tool output, and value cards — not as a landing banner. | High |
| 4 | The **revenue model is exposed on the public homepage** (₹500 / ₹4,999 / ₹8,999 cards in bold). A buyer-facing landing should lead with value; pricing lives on `/pricing` or in-flow. | High |
| 5 | Emoji icons (📜 🗺️ 💰) on primary tool cards feel casual, not professional. This is a trust product. | Medium |
| 6 | "Sign in — coming soon" button on the top-right. Either remove or let users actually register. Dead buttons erode trust. | Medium |
| 7 | No **plot listings** anywhere on the page. The only merchandised thing is the UDCPR calculator. A "PlotTrust" brand without plot cards is a paradox. | Critical |
| 8 | No **WhatsApp CTA** despite 85%+ of Maharashtra plot enquiries happening on WhatsApp. | High |
| 9 | No price-comparison layer (Govt / Market / Loan-eligible) — the single strongest moat you have over 99acres / Magicbricks. | High |
| 10 | Type scale is flat; there is no clear visual hierarchy between H1, subhead, body, and captions. | Medium |
| 11 | No dark contrast check — the navy/cobalt palette is close to WCAG AA on white but fails on the light-sage accent tiles. | Medium |
| 12 | Marathi text is unsupported — no Devanagari font loaded, so any मराठी content renders in the fallback (ugly Times). | High for your target audience |

### 1.2 Performance hints

- Multiple Google Fonts families loaded (DM Sans, DM Serif Display) without
  `font-display: swap` → FOIT on slow connections.
- No image strategy — any future photo upload will ship at full bytes.
- Zero code-splitting: everything is inline `<style>` + `<script>`. Works today
  because the site is small, but doesn't scale.
- No `<link rel="preconnect">` to the font CDN; each request re-does DNS+TLS.

### 1.3 Bugs (functional)

| # | Bug | Where |
|---|-----|-------|
| B1 | Hamburger menu toggle is defined in JS but nav element is **removed** from the DOM at `<500px`, so hamburger points to nothing. | `index.html` — media query |
| B2 | `#featured-projects` anchor scroll lands in the middle of the Services section because the CTA band height is counted in the offset calculation. | nav scroll behavior |
| B3 | `min-h-screen` on the hero + `<body> overflow-x:hidden` causes a 2-pixel horizontal scrollbar on Safari iOS due to inner gradient overflow. | CSS |
| B4 | Date "17 April" is hard-coded in testimonial footer; not localized. | content |
| B5 | RERA number sample "P51700000000" is synthetic — Google may flag it as misleading. | content |
| B6 | No `alt` text on SVG icons / hero illustration. Breaks screen reader + image SEO. | accessibility |
| B7 | "Sign-in — coming soon" button has no `aria-disabled`; keyboard users can focus but nothing happens. | a11y |

### 1.4 SEO gaps

- No JSON-LD (`RealEstateAgent` / `Place` / `Product`) — you lose the rich-card
  eligibility that competitors get.
- No `<h2>/<h3>` hierarchy — search engines can't outline the page.
- Only 1 page indexed (the root). No village-specific landing pages, which is
  exactly the long-tail you own (44,000+ villages).
- No `hreflang` / `lang` variants for Marathi.
- No `sitemap.xml` / `robots.txt` generation.

---

## 2. Redesigned UX

### 2.1 Positioning shift

Old: *"Build your dream home in 5 minutes"* (a tool)  
New: **"Find verified plots with 7/12, Zone & Ready Reckoner — in one place"** (a marketplace with tools baked in)

This lets you:
- keep all your existing tools (UDCPR, Zone, RR, 7/12) visible, but as **strips** under the hero, not as the hero
- start merchandising **plot inventory** — the thing buyers actually search for
- sell **title reports / expert calls / bulk lookups** as services layered on top

### 2.2 Information architecture

```
/                   Home (hero + search + tools + featured plots + CTA)
/search             Filterable grid of plots (zone/landType/area/price)
/plots/[id]         Plot detail (map, key facts, value comparison, owner card)
/tools/712          7/12 extract fetcher
/tools/zone         DP/TP zone check
/tools/ready-reckoner ASR estimator
/tools/udcpr        UDCPR calc (kept from current site, restyled)
/services           Title report, expert call, bulk lookup
/dashboard          B2B Pro dashboard (auth)
/guide              Marathi + English learn section (long-tail SEO)
/pricing            Plans
```

Every `/village/<name>` can be generated statically — that's 44,000+ pages of
long-tail SEO (one per village). This is your moat vs 99acres.

### 2.3 Design system

| Dimension        | Decision                                                        |
|------------------|-----------------------------------------------------------------|
| Palette          | Blue `#0F4C81` (trust), green `#047857` (verified), saffron `#F97316` (CTA) |
| Zone semantics   | Green = buildable, Yellow = agri/conditional, Red = reserved    |
| Type             | Inter (body), Plus Jakarta Sans (display), JetBrains Mono (Gat/Survey/CTS) |
| Marathi          | Noto Sans Devanagari, always preloaded                          |
| Cards            | 1px border, 12px radius, never drop-shadow as primary visual    |
| Icons            | `lucide-react` (line, 1.5px stroke) — no emoji in product chrome |
| Spacing          | 4-pt grid                                                        |
| Motion           | `prefers-reduced-motion: reduce` respected, no parallax         |

### 2.4 Key components

- **`VillageSearch`** — combo box with selector (Village / Gat / RERA / CTS). One-field UX is the single biggest conversion lever.
- **`PlotCard`** — Zone-first layout: `[ZoneBadge] Village · Gat/Survey` → `LandType · Area` → `Govt ₹ / Market ₹ delta` → `Book / WhatsApp`.
- **`PriceComparator`** — always shows Ready Reckoner vs Market side-by-side with a `+/- %` delta pill. This is the *differentiator*.
- **`ZoneBadge`** — one component, three colors, one source of truth.
- **`WhatsAppCTA`** — float + inline + button variants. Saffron, not green (WhatsApp green fights the brand green; saffron keeps Indian-ness without confusion).
- **`TrustStrip`** — three micro-credibility blocks: "Village-level coverage", "iGR + Mahabhumi sources", "No brokerage, ever".

### 2.5 Wireframes shipped

Open any of these in a browser tab to review visually:

| # | File | Purpose |
|---|------|---------|
| 1 | `wireframes/01-desktop-home.svg`  | Desktop homepage (1440×2600) |
| 2 | `wireframes/02-mobile-home.svg`   | Mobile homepage (390×1900)   |
| 3 | `wireframes/03-plot-detail.svg`   | Plot detail with map + value tiles (1440×2000) |
| 4 | `wireframes/04-b2b-dashboard.svg` | Pro dashboard (1440×1200)    |

Also: `index.html` is a **working HTML prototype** (no build step).

---

## 3. Feature improvements (your list, fully addressed)

### 3.1 Auto-detect map type

- `lib/utils.ts → detectMapKind(filename, width?, height?)`
- Classifies uploads into `village_map | layout_plan | building_plan | satellite | unknown`
- Heuristic: filename regex first (`village|layout|building|plan|satellite|google`), then aspect-ratio fallback (≥1.6 wide + >2MP → likely satellite; square + <1MP → building plan).
- Extensible: add a model call in `classifyMapWithLLM()` when user uploads an unlabelled image.

### 3.2 Auto-rename files

- `lib/utils.ts → renameUpload(original, { village, gat?, survey?, cts?, kind })`
- Produces deterministic filenames like  
  `Gangapur_Gat142-2A_Survey58_LayoutPlan_2026-04-18.pdf`
- Strips unsafe chars, collapses whitespace, encodes slash in Gat `142/2-A` → `142-2A`
- Same logic on server + client → identical key in S3.

### 3.3 Preview before saving

- New listing and bulk lookup both go through a **staging step**:
  - Parse + detect → show normalized preview (village chips, Gat Number, detected zone) with `Edit | Save | Discard`
  - "Save" writes to DB; anything else is a no-op.
- For 7/12 fetches, the Satbara is rendered in-app (html), and user clicks **Save to case** to persist — so rate-limited users don't accidentally burn credits.

### 3.4 Search + filter

- Dedicated `/search` page with left rail (DP Zone, Land type, Area, Max price).
- `GET /api/plots?cat=village&q=Gangapur&zone=green&landType=NA&maxPriceLakh=50` — all params zod-validated.
- Server component + query cache = no client-side refetch storm.
- Future: MapMyIndia Leaflet layer with polygon highlights (one `<Plot>` per village).

### 3.5 Upload → process → output pipeline

```
Client upload
  → S3 presigned PUT (content-length limit, MIME allow-list)
  → server-side lambda: detectMapKind + renameUpload
  → thumbnail + OCR (for 7/12 scans)
  → emit webhook "plot.image.ready"
  → listing drafts get auto-attached
```

Everything is one-way idempotent: re-uploading the same file is a no-op on the
database side (`imageHash` column).

---

## 4. Bug-fix list (from §1.3)

| # | Fix |
|---|-----|
| B1 | Restore nav on mobile via hamburger overlay (done in `components/Navbar.tsx`). |
| B2 | Use CSS `scroll-margin-top: 72px;` on every major `<section>`. |
| B3 | Wrap hero with `overflow: clip` (not `hidden`) and drop the inner gradient's negative margin. |
| B4 | Render dates with `Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' })` — no more hard-coded strings. |
| B5 | Use an anonymized RERA pattern like `P12345/MAH/XXXX` in samples, or just real project numbers you own. |
| B6 | All icons get `aria-hidden="true"` if decorative; all images get `alt` derived from village+Gat. |
| B7 | Remove dead "Sign-in coming soon" button; replace with actual `/signin` route or hide completely. |

---

## 5. Technical upgrade

### 5.1 Stack choice (rationale)

| Layer        | Choice                  | Why                                                                      |
|--------------|-------------------------|--------------------------------------------------------------------------|
| Framework    | Next.js 15 App Router   | File-based routing, server components = small JS, ISR for 44k village pages |
| DB           | PostgreSQL + PostGIS    | Native polygon queries = "plots inside this village boundary" in one SQL |
| ORM          | Prisma                  | Typed schema, generated client, migrate dev & deploy flows built-in      |
| Cache        | Redis (Upstash)         | Sub-10ms Satbara cache hits; rate-limiter primitive included             |
| Queue        | BullMQ on Redis         | Upload pipeline + bulk CSV lookups as background jobs                    |
| Storage      | S3 / R2                 | Cheap, CDN-fronted, presigned uploads                                    |
| Auth         | NextAuth + phone OTP    | Indian users want phone, not email                                       |
| Payments     | Razorpay                | INR-first, UPI + cards + netbanking                                      |
| Observability| Sentry + Axiom          | Errors + structured logs; cheap at your stage                            |
| Hosting      | Vercel (frontend) + Neon/Supabase (DB) | zero-ops to start; migrate to Hetzner only when traffic warrants |

### 5.2 Database structure

Key tables (see `nextjs/prisma/schema.prisma`):

- `District → Taluka → Village` (with PostGIS `MultiPolygon` boundary + LGD codes)
- `Plot` (FK to Village; Gat / Survey / CTS; areaSqm; dpZone; landType; reckonerRate)
- `ReadyReckonerRate` (village × year × landType → ratePerSqm) — the ASR table you **own**
- `Transaction` (from IGR data feeds — for market-rate trend lines)
- `Lookup` (audit + billing for every 7/12 fetch)
- `Case` (B2B workflow: "Gangapur 142/2-A due-diligence" — status → CLOSED)
- `PlotImage` with `kind` enum matching `detectMapKind()` output

Indexes cover the 3 hot paths: `(villageId, landType, dpZone)`, `(gatNumber)`,
`(reraNumber)`.

### 5.3 API architecture

- Route handlers (`app/api/*/route.ts`) keep the frontend + backend co-located; no separate Node server until you need one.
- Each handler: **Zod validate → Redis check → Prisma → Zod response type**.
- Response shape is uniform: `{ ok: true, data, meta }` or `{ ok: false, error, issues }`. This predictability is worth more than clever typing.
- External scrapers (Mahabhumi, IGR) run as **cron jobs** on a separate worker (BullMQ). Don't couple fetches to user requests.

### 5.4 Scalability notes

- Static village pages (44k) should be built with Next.js **ISR** + stale-while-revalidate. Full regen nightly from the ASR delta.
- CDN-cache GETs on `/api/ready-reckoner` for 24h (rate rarely changes mid-year).
- Rate-limit `/api/712` at 60 requests/min per user and 1,000/day per org.
- Move heavy PDF generation (title reports) behind the queue; stream to S3; email when ready.
- Backpressure: if Mahabhumi is down, return `{ ok: false, error: 'upstream_unavailable', retryAt }` instead of blocking.

---

## 6. Conversion optimization

### 6.1 Trust signals

- Badge on every card: "Source: Mahabhumi · Verified 2 Apr" (with live date).
- Ready Reckoner vs Market delta shown in ₹ lakhs, not just %.
- "No brokerage, ever" footer line is repeated in the `/pricing` page.
- Real testimonials with **Marathi names in Devanagari** (not translated) — the local cue.

### 6.2 WhatsApp + order flow

```
Plot card  → [ Enquire (₹0) ]  [ WhatsApp Owner ]
             │                  │
             ▼                  ▼
          Lead form           wa.me/91… prefilled with
          (name, phone)         "Namaskar, I'm interested in
                                 {village} {Gat} plot…"
```

- Lead → dashboard (Sagar's team inbox).
- WhatsApp CTA is floating bottom-right on every mobile viewport.
- One-click **"Book Expert Call — ₹500"** → Razorpay inline → Google Calendar event + WhatsApp confirmation.

### 6.3 Simple trust copy

Replace the red disclaimer banner with a quiet, italic line under every value:

> *Government reference only. Please verify at Talathi / उपनिबंधक before any transaction.*

Same information. Zero dread.

---

## 7. Four-week implementation plan

| Week | Milestone | Deliverables |
|------|-----------|--------------|
| **W1** | **Foundation** | Next.js scaffold deployed to Vercel staging. Postgres+PostGIS live on Neon. Prisma migrations + seed (Nashik 10 villages, 50 plots). Navbar / Footer / Hero / PlotCard / ZoneBadge live. Lighthouse ≥ 90 on home. |
| **W2** | **Listings + Tools** | `/search`, `/plots/[id]`, `/tools/712`, `/tools/zone` — all wired to stub APIs. Real ASR data for Nashik district. Upload → detect → rename → preview pipeline for images. |
| **W3** | **B2B Pro + billing** | NextAuth with phone OTP. `/dashboard` with KPIs + quick 7/12 + recent lookups. Razorpay credits top-up. Rate-limit + audit log. Bulk CSV (up to 500 rows). |
| **W4** | **SEO + polish** | 44k village static pages via ISR. JSON-LD on all detail pages. `sitemap.xml` + `robots.txt`. Marathi translations for top 20 routes. A/B test hero copy ("Find verified plots" vs "Check any plot in 1.4s"). Sentry + Axiom wired. |

### Stretch (Month 2)

- MahaRERA project detail pages (`/rera/[number]`)
- Map layer: MapMyIndia + village polygon overlay (react-leaflet)
- Title report generator (PDF, advocate-signed)
- Partner mode for banks (SBI / HDFC valuation tie-in)

---

## 8. Deliverables in this folder

| Path | What |
|------|------|
| `index.html` | Working single-file HTML prototype of new homepage |
| `wireframes/01-desktop-home.svg`   | Figma-style desktop home wireframe |
| `wireframes/02-mobile-home.svg`    | Mobile home wireframe |
| `wireframes/03-plot-detail.svg`    | Plot detail wireframe |
| `wireframes/04-b2b-dashboard.svg`  | B2B dashboard wireframe |
| `nextjs/`                          | Production-ready Next.js starter (app, components, api, prisma) |
| `nextjs/README.md`                 | Setup + run + deploy instructions |
| `AUDIT_AND_ROADMAP.md`             | This file |

---

## 9. Practical business notes

- **Don't launch pricing on the homepage.** Let a buyer feel the product first. Expose ₹500 / ₹4,999 only after an intent signal (viewed 3 plots, clicked "Title report").
- **Village pages are the moat.** Someone Googling *"Gangapur Nashik 7/12 rate"* should land on `/villages/gangapur-nashik` — a page that competitors literally cannot replicate because they don't have village-level data.
- **B2B is where the margin is.** A single builder running 50 lookups/month at 1 credit each = ₹5,000+ recurring. Design the `/dashboard` experience with retention in mind (saved searches, team seats, weekly digest email).
- **WhatsApp > email** for Maharashtra plot buyers. Every touch point should have a WhatsApp fallback, including payment receipts.
- **Marathi is not optional.** You already use terms like satbara, gaav, ferfar — surface those in headings, not just microcopy. Buyers scan for them.

---

## 10. Word of the Day

**Verisimilitude** *(noun, /ˌverɪsɪˈmɪlɪtjuːd/)* — the appearance of being true or real.

_Simple Marathi meaning:_ **खरेपणाचा भास** — एखादी गोष्ट खरी वाटावी असा देखावा. Trust products like PlotTrust are sold on verisimilitude as much as on truth: the 1.4-second fetch *feels* real, the ZoneBadge *feels* authoritative, the Ready Reckoner line *feels* official — because each one is rendered with the care of the real thing.

_Example:_ "Adding the Mahabhumi source timestamp on every plot card gives the listing **verisimilitude** that no competitor can copy overnight."

— Keep this word in mind when you're building trust UI. It is the whole game.
