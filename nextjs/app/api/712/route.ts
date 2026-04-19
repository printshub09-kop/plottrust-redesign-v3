/**
 * POST /api/712 → Fetch 7/12 (Satbara) extract.
 *
 * Input: { district, taluka, village, gatNumber? | surveyNumber?, year? }
 * Flow:  validate → check Redis cache → call Mahabhulekh proxy (or MahaRERA where applicable)
 *        → persist Lookup row (audit + billing) → return structured extract.
 *
 * NOTE: This is a scaffold. The actual Mahabhulekh endpoint is captcha-protected
 *       and often requires a licensed integration partner. A realistic production
 *       path is to use a vendor (e.g. Tahsil/Karza/Signzy/KPMG LandIQ) or an
 *       internal scraper cluster with rotating captcha solvers + MIME logging.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LookupSchema = z.object({
  district: z.string().min(2).max(40),
  taluka: z.string().min(2).max(40),
  village: z.string().min(2).max(60),
  gatNumber: z.string().max(24).optional(),
  surveyNumber: z.string().max(24).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
}).refine(d => d.gatNumber || d.surveyNumber, {
  message: 'Either gatNumber or surveyNumber is required',
  path: ['gatNumber'],
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const parsed = LookupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const q = parsed.data;

  // Cache key (Redis TTL ~ 24h; Ferfar updates are rarely same-day).
  const cacheKey = [
    '712', q.district, q.taluka, q.village,
    q.gatNumber ?? '_', q.surveyNumber ?? '_', q.year ?? new Date().getFullYear(),
  ].join(':').toLowerCase();

  // TODO: const cached = await redis.get(cacheKey); if (cached) return NextResponse.json(JSON.parse(cached));
  // TODO: await rateLimit(userId, 'lookup_712', 60 /*per min*/);
  // TODO: await prisma.lookup.create({ data: { userId, kind: '712', key: cacheKey } });
  // TODO: const extract = await mahabhumiClient.fetch712(q);

  const stubExtract = {
    cacheKey,
    fetchedAt: new Date().toISOString(),
    village: q.village,
    taluka: q.taluka,
    district: q.district,
    stateCode: 'MH',
    gatNumber: q.gatNumber ?? null,
    surveyNumber: q.surveyNumber ?? null,
    area: { hectares: 0.1012, guntha: 10, sqm: 1012 },
    khateDars: [
      { name: 'R. L. Deshmukh', share: '1/1', mutationRef: 'Ferfar 4521' },
    ],
    encumbrances: [],
    reservation: null as string | null,
    sourceUrl: 'https://bhulekh.mahabhumi.gov.in/',
    disclaimer: 'Ready reference only. Verify at Talathi / Sub-Registrar office before any transaction.',
  };

  return NextResponse.json(
    { ok: true, data: stubExtract, billed: 1, currency: 'credit' },
    { status: 200, headers: { 'Cache-Control': 'private, max-age=0, must-revalidate' } },
  );
}
