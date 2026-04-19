/**
 * GET  /api/plots       → list plots (with SearchFilters)
 * POST /api/plots       → create listing (auth required — TODO)
 *
 * Scaffold only. Swap SAMPLE_PLOTS for a Prisma query once the DB is live.
 * Expected prisma query (see prisma/schema.prisma):
 *   prisma.plot.findMany({
 *     where: { village: { name: { contains: q, mode: 'insensitive' } }, dpZone: filters.zone },
 *     include: { village: true },
 *     take: 24, skip: cursor,
 *   })
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SAMPLE_PLOTS } from '@/lib/sample-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FiltersSchema = z.object({
  cat: z.enum(['village', 'gat', 'rera', 'cts']).default('village'),
  q: z.string().trim().min(1).max(120).optional(),
  zone: z.enum(['green', 'yellow', 'red']).optional(),
  landType: z.enum(['NA', 'AGRI', 'AGRI_NA_POTENTIAL', 'MIXED', 'RESERVED']).optional(),
  maxPriceLakh: z.coerce.number().int().positive().max(100000).optional(),
  minAreaSqft: z.coerce.number().int().positive().max(10_000_000).optional(),
  page: z.coerce.number().int().min(1).max(500).default(1),
  pageSize: z.coerce.number().int().min(1).max(60).default(24),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const raw: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { raw[k] = v; });
  const parsed = FiltersSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_filters', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const f = parsed.data;

  // In-memory filtering (replace with Prisma).
  let rows = SAMPLE_PLOTS.slice();
  if (f.q) {
    const needle = f.q.toLowerCase();
    rows = rows.filter(p => {
      const hay = [
        p.village.name, p.village.taluka, p.village.district,
        p.gatNumber ?? '', p.surveyNumber ?? '', p.ctsNumber ?? '',
        p.reraNumber ?? '',
      ].join(' ').toLowerCase();
      return hay.includes(needle);
    });
  }
  if (f.zone) rows = rows.filter(p => p.dpZone === f.zone);
  if (f.landType) rows = rows.filter(p => p.landType === f.landType);
  if (f.minAreaSqft) rows = rows.filter(p => p.areaSqft >= f.minAreaSqft!);
  if (f.maxPriceLakh) {
    rows = rows.filter(p => {
      const rate = p.askMarketRate ?? p.readyReckonerRate;
      return (p.areaSqm * rate) / 1e5 <= f.maxPriceLakh!;
    });
  }

  const total = rows.length;
  const start = (f.page - 1) * f.pageSize;
  const paged = rows.slice(start, start + f.pageSize);

  return NextResponse.json({
    ok: true,
    filters: f,
    total,
    page: f.page,
    pageSize: f.pageSize,
    data: paged,
  }, {
    headers: {
      // 60s edge cache; dashboard/browse are latency-sensitive, not real-time.
      'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
    },
  });
}

const CreatePlotSchema = z.object({
  villageId: z.string().cuid(),
  gatNumber: z.string().max(24).optional(),
  surveyNumber: z.string().max(24).optional(),
  ctsNumber: z.string().max(24).optional(),
  reraNumber: z.string().max(32).optional(),
  areaSqm: z.number().positive().max(10_000_000),
  landType: z.enum(['NA', 'AGRI', 'AGRI_NA_POTENTIAL', 'MIXED', 'RESERVED']),
  dpZone: z.enum(['green', 'yellow', 'red']),
  readyReckonerRate: z.number().int().nonnegative(),
  askMarketRate: z.number().int().nonnegative().optional(),
  reservation: z.string().max(80).optional(),
  fsiAllowed: z.number().min(0).max(6).optional(),
  tdrAllowed: z.number().min(0).max(6).optional(),
  frontRoadMeters: z.number().int().min(0).max(120).optional(),
});

export async function POST(req: NextRequest) {
  // TODO: auth — require a verified Broker/Builder/Owner role from session.
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const parsed = CreatePlotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  // TODO: insert with prisma.plot.create({ data: { ...parsed.data, slug, createdById } })
  return NextResponse.json(
    { ok: true, draftId: 'stub_' + Date.now(), received: parsed.data },
    { status: 201 },
  );
}
