import Link from 'next/link';
import VillageSearch from '@/components/VillageSearch';
import PlotCard from '@/components/PlotCard';
import TrustStrip from '@/components/TrustStrip';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import { SAMPLE_PLOTS } from '@/lib/sample-data';
import { FileText, Map as MapIcon, IndianRupee, Ruler } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-800 to-brand-600 text-white">
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:grid md:grid-cols-[1.15fr_1fr] md:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-sky-100">
              <span className="size-1.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              Built for Maharashtra · Nashik · Pune · Kolhapur
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-balance md:text-5xl">
              Find verified plots with{' '}
              <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
                7/12, Zone &amp; Ready Reckoner
              </span>{' '}
              — in one place
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
              Search by village, Gat Number, Survey Number, or RERA project. Every listing shows land type,
              DP zone, and government value vs market — before you enquire.
            </p>

            <div className="mt-7"><VillageSearch /></div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['NA Plots', 'Agriculture', 'RERA Verified', 'Under ₹50L', 'School Reserved'].map((c, i) => (
                <button
                  key={c}
                  className={`rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:bg-white/15 ${
                    i === 0 ? 'bg-white !text-brand-600 border-white' : 'text-sky-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-7"><TrustStrip /></div>
          </div>

          {/* Stats card */}
          <aside className="mt-10 md:mt-0 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4">
              <Stat n="44,142" l="Villages mapped" />
              <Stat n="9,809"  l="RERA projects" />
              <Stat n="1.2M+"  l="7/12 records" />
              <Stat n="₹2.8 Cr" l="Median Nashik plot" />
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/5 bg-black/25 px-3.5 py-2.5 text-xs text-slate-300">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-dot-pulse" />
              <span>
                <b className="text-white">Live:</b> New 7/12 fetched for{' '}
                <b className="text-white font-mono">Gat 142/2, Shirwade</b>
              </span>
            </div>
          </aside>
        </div>
      </section>

      {/* ── TOOLS STRIP ── */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Tool icon={<FileText size={20} />} title="7/12 Extract"   sub="Satbara in seconds by village + Gat No." href="/tools/712" />
          <Tool icon={<MapIcon size={20} />}  title="DP / TP Zone"   sub="Red, Yellow, Green — reservation check." href="/tools/zone" />
          <Tool icon={<IndianRupee size={20} />} title="Ready Reckoner" sub="ASR rate + stamp duty estimator."    href="/tools/ready-reckoner" />
          <Tool icon={<Ruler size={20} />}    title="UDCPR Calc"     sub="Setback, FSI, buildable area instantly." href="/tools/udcpr" />
        </div>
      </section>

      {/* ── FEATURED PLOTS ── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className="label text-brand-600">Featured Listings</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">
              Verified plots with <span className="text-brand-600">govt &amp; market value</span>
            </h2>
            <p className="mt-2 text-slate-500">
              Every card shows village, Gat / Survey Number, land type, and DP zone — no hidden surprises.
            </p>
          </div>
          <Link href="/search" className="btn-outline">Browse all 840+ plots →</Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_PLOTS.map(p => <PlotCard key={p.id} plot={p} />)}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 to-brand-600 text-white">
        <div className="relative mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">
            Check any plot —{' '}
            <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
              it&apos;s free
            </span>{' '}
            to start
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-300">
            7/12, Zone, Ready Reckoner — at no cost. Pay only when you need expert help.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-accent">Start Free Search</Link>
            <WhatsAppCTA phone="+919999999999" variant="button" label="Ask on WhatsApp" />
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-lg bg-white/5 p-4">
      <div className="font-display text-2xl font-extrabold leading-none text-white">{n}</div>
      <div className="mt-1 text-xs text-slate-300">{l}</div>
    </div>
  );
}

function Tool({
  icon, title, sub, href,
}: { icon: React.ReactNode; title: string; sub: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3.5 bg-white p-5 transition hover:bg-brand-50"
    >
      <span className="grid size-10 place-items-center rounded-[10px] bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div>
        <h3 className="font-display text-[15px] font-bold text-ink">{title}</h3>
        <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{sub}</p>
      </div>
    </Link>
  );
}
