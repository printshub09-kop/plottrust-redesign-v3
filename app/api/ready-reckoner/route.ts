/**
 * GET /api/ready-reckoner?villageId=&year=&landType=
 *   or
 * GET /api/ready-reckoner?district=&taluka=&village=&year=&landType=
 *
 * Returns ASR (Annual Statement of Rates) for a location + land type.
 * Backed by a scraped + reviewed copy of IGR Maharashtra's annual ASR PDFs.
 *
 * Scaffold: in-memory stub. Swap for prisma.readyReckonerRate.findFirst.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  villageId: z.string().cuid().optional(),
  district: z.string().max(40).optional(),
  taluka: z.string().max(40).optional(),
  village: z.string().max(60).optional(),
  year: z.coerce.number().int().min(2010).max(2100).default(new Date().getFullYear()),
  landType: z.enum(['NA_RES', 'NA_COM', 'AGRI', 'INDUSTRIAL']).default('NA_RES'),
}).refine(
  d => d.villageId || (d.district && d.taluka && d.village),
  { message: 'villageId OR (district + taluka + village) required' },
);

// Tiny stub table. In production this is a joined query on ReadyReckonerRate.
const STUB: Record<string, number> = {
  // key: district|taluka|village|year|landType → ₹ per sq.m
  'nashik|nashik|gangapur|2026|NA_RES': 38500,
  'nashik|nashik|shirwade|2026|NA_RES': 18200,
  'nashik|nashik|makhmalabad|2026|NA_RES': 41000,
  'nashik|nashik|gangapur|2026|AGRI':   5400,
  'nashik|nashik|shirwade|2026|AGRI':   3100,
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const raw: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { raw[k] = v; });
  const parsed = QuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const q = parsed.data;

  // Build key
  const district = (q.district ?? 'nashik').toLowerCase();
  const taluka   = (q.taluka   ?? 'nashik').toLowerCase();
  const village  = (q.village  ?? 'gangapur').toLowerCase();
  const key = `${district}|${taluka}|${village}|${q.year}|${q.landType}`;
  const ratePerSqm = STUB[key];

  if (!ratePerSqm) {
    return NextResponse.json(
      {
        ok: false,
        error: 'rate_not_found',
        hint: 'Coverage limited in scaffold. Try Nashik / Gangapur / Shirwade / Makhmalabad for 2026.',
        queried: { district, taluka, village, year: q.year, landType: q.landType },
      },
      { status: 404 },
    );
  }

  const ratePerSqft = +(ratePerSqm / 10.7639).toFixed(2);

  return NextResponse.json(
    {
      ok: true,
      source: 'IGR Maharashtra · ASR ' + q.year,
      scope: { district, taluka, village, landType: q.landType, year: q.year },
      ratePerSqm,
      ratePerSqft,
      ratePerGuntha: Math.round(ratePerSqm * 101.17),
      stampDutyPct: 6,           // Urban Maharashtra: 5% + 1% metro cess (varies).
      registrationPct: 1,
      disclaimer:
        'Ready Reckoner rates are Government reference values used for stamp duty. Market rates may differ.',
    },
    { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400' } },
  );
}
