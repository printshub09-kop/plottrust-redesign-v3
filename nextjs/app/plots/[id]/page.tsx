import { notFound } from 'next/navigation';
import ZoneBadge from '@/components/ZoneBadge';
import PriceComparator from '@/components/PriceComparator';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { SAMPLE_PLOTS } from '@/lib/sample-data';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const plot = SAMPLE_PLOTS.find(p => p.slug === id);
  if (!plot) return {};
  return {
    title: `${plot.village.name} · ${plot.gatNumber ? `Gat ${plot.gatNumber}` : `Survey ${plot.surveyNumber}`} — PlotTrust`,
    description: `${plot.landType} plot in ${plot.village.name}, ${plot.village.taluka}, ${plot.village.district}. Zone: ${plot.dpZone}. Area ${plot.areaSqft.toLocaleString('en-IN')} sq.ft.`,
  };
}

export default async function PlotPage({ params }: Props) {
  const { id } = await params;
  const plot = SAMPLE_PLOTS.find(p => p.slug === id);
  if (!plot) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <nav className="text-xs text-muted mb-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>Home</li><li>›</li>
          <li>Search</li><li>›</li>
          <li>{plot.village.district}</li><li>›</li>
          <li>{plot.village.name}</li><li>›</li>
          <li className="font-bold text-ink">
            {plot.gatNumber ? `Gat ${plot.gatNumber}` : `Survey ${plot.surveyNumber}`}
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
            {plot.village.name} · <span className="font-mono">
              {plot.gatNumber ? `Gat ${plot.gatNumber}` : `Survey ${plot.surveyNumber}`}
            </span>
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <ZoneBadge zone={plot.dpZone} />
            {plot.landType === 'NA' && <span className="rounded bg-verified-50 px-2 py-0.5 text-[11px] font-bold uppercase text-verified-600">NA</span>}
            {plot.reraNumber && <span className="rounded bg-brand-50 px-2 py-0.5 text-[11px] font-bold uppercase text-brand-600">RERA {plot.reraNumber}</span>}
          </div>
          <p className="mt-3 text-sm text-muted">
            📍 {plot.village.name} Village, {plot.village.taluka} Tal, {plot.village.district} Dist., Maharashtra
          </p>
        </div>
        <div className="flex flex-col gap-2 md:w-72">
          <button className="btn-primary">Book Expert Call — ₹500</button>
          <WhatsAppCTA phone="+919999999999" variant="button" label="WhatsApp Owner" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Map placeholder */}
          <div className="h-[420px] rounded-xl border border-line bg-slate-200 grid place-items-center text-muted">
            [ Map + Plot Boundary + Bhunaksha Overlay ]
          </div>

          {/* Key Facts */}
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="label">Key facts</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
              <Fact k="Village (गाव)" v={plot.village.name} />
              <Fact k="Gat Number"   v={plot.gatNumber ?? '—'} mono />
              <Fact k="Survey No."   v={plot.surveyNumber ?? '—'} mono />
              <Fact k="CTS"          v={plot.ctsNumber ?? '—'} mono />
              <Fact k="Area"         v={`${plot.areaSqm} sq.m`} sub={`${plot.areaSqft.toLocaleString('en-IN')} sq.ft`} />
              <Fact k="Land type"    v={plot.landType === 'NA' ? 'NA (Residential)' : plot.landType} />
              <Fact k="DP Zone"      v={plot.dpZone.toUpperCase()} />
              <Fact k="Front road"   v={plot.frontRoadMeters ? `${plot.frontRoadMeters} m DP Road` : '—'} />
              <Fact k="FSI"          v={plot.fsiAllowed ? plot.fsiAllowed.toString() : '—'} />
              <Fact k="TDR"          v={plot.tdrAllowed ? `+${plot.tdrAllowed}` : 'Nil'} />
              <Fact k="Reservation"  v={plot.reservation ?? 'None (free)'} />
              <Fact k="RERA"         v={plot.reraNumber ?? '—'} mono />
            </dl>
          </div>

          {/* Value comparison */}
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="label">Value comparison</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-line bg-slate-50 p-4">
                <p className="label">Govt (Ready Reckoner)</p>
                <p className="mt-1 font-display text-2xl font-extrabold text-ink">
                  ₹{((plot.areaSqm * plot.readyReckonerRate) / 1e5).toFixed(1)} L
                </p>
                <p className="mt-1 text-xs text-muted">ASR 2026 · Stamp duty ~5%</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-verified-600">Market (Live)</p>
                <p className="mt-1 font-display text-2xl font-extrabold text-verified-700">
                  {plot.askMarketRate ? `₹${((plot.areaSqm * plot.askMarketRate) / 1e5).toFixed(1)} L` : 'Restricted'}
                </p>
                <p className="mt-1 text-xs text-verified-700">12 comparable transactions</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">Loan-eligible</p>
                <p className="mt-1 font-display text-2xl font-extrabold text-ink">
                  ₹{((plot.areaSqm * plot.readyReckonerRate * 0.8) / 1e5).toFixed(1)} L
                </p>
                <p className="mt-1 text-xs text-muted">80% of ASR · SBI / HDFC standard</p>
              </div>
            </div>
            <div className="mt-4">
              <PriceComparator
                areaSqm={plot.areaSqm}
                readyReckonerRate={plot.readyReckonerRate}
                askMarketRate={plot.askMarketRate}
                variant="detail"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-line bg-white p-5">
            <p className="label">Owner / Listing</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full bg-brand-600 text-sm font-extrabold text-white">RD</div>
              <div>
                <p className="font-bold text-ink">R. L. Deshmukh</p>
                <p className="text-xs text-muted">Verified owner · Listed 8 days ago</p>
              </div>
            </div>
            <button className="btn-primary mt-4 w-full">Enquire (₹0)</button>
            <div className="mt-2"><WhatsAppCTA phone="+919999999999" variant="button" label="WhatsApp Owner" /></div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="label text-amber-700">Title Report</p>
            <p className="mt-1 font-display text-lg font-extrabold text-ink">Advocate-signed due-diligence</p>
            <p className="text-xs text-muted">30-year chain, encumbrance, litigation</p>
            <button className="btn-accent mt-3 w-full !text-xs">From ₹4,999 →</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Fact({ k, v, sub, mono }: { k: string; v: string; sub?: string; mono?: boolean }) {
  return (
    <div>
      <dt className="label">{k}</dt>
      <dd className={`mt-0.5 text-lg font-extrabold text-ink ${mono ? 'font-mono' : ''}`}>{v}</dd>
      {sub && <dd className="text-xs text-muted">{sub}</dd>}
    </div>
  );
}
