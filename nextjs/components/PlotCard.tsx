import Link from 'next/link';
import { Heart, MapPin, ArrowRight } from 'lucide-react';
import type { Plot } from '@/lib/types';
import ZoneBadge from './ZoneBadge';
import PriceComparator from './PriceComparator';
import { cn } from '@/lib/utils';

interface Props { plot: Plot; className?: string; }

/**
 * The canonical PlotTrust listing card.
 * Priority of information: Zone → Village → Gat/Survey → Land type → Govt vs Market → Area.
 */
export default function PlotCard({ plot, className }: Props) {
  const detailLabel =
    plot.reservation === 'school'
      ? 'School Res.'
      : plot.landType === 'NA'
        ? 'R-1'
        : 'Agri+NA';

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-line bg-white',
        'transition hover:-translate-y-1 hover:shadow-lift hover:border-slate-300',
        className,
      )}
    >
      {/* Image / map */}
      <div className="relative h-44 bg-slate-200 overflow-hidden">
        {plot.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={plot.images[0]}
            alt={`${plot.village.name} Gat ${plot.gatNumber ?? plot.surveyNumber}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-slate-500 font-display text-sm">
            Plot / Village Map
          </div>
        )}

        <ZoneBadge zone={plot.dpZone} detail={detailLabel} className="absolute left-3 top-3 shadow" />

        <button
          type="button"
          aria-label="Save plot"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/95 text-muted shadow transition hover:scale-110 hover:text-zone-red"
        >
          <Heart size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div>
          <h3 className="font-display text-lg font-extrabold text-ink leading-tight">
            {plot.village.name}
          </h3>
          <p className="flex items-center gap-1 text-xs text-muted mt-0.5">
            <MapPin size={12} />
            {plot.village.taluka} Tal, {plot.village.district} Dist.
          </p>
        </div>

        {/* Identifier row — monospaced */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-slate-100 px-2.5 py-2 text-[12px]">
          {plot.gatNumber && (
            <>
              <span className="label !text-[10px]">Gat</span>
              <span className="mono font-semibold text-ink">{plot.gatNumber}</span>
            </>
          )}
          {plot.surveyNumber && (
            <>
              <span className="text-line">·</span>
              <span className="label !text-[10px]">Survey</span>
              <span className="mono font-semibold text-ink">{plot.surveyNumber}</span>
            </>
          )}
          {plot.ctsNumber && (
            <>
              <span className="text-line">·</span>
              <span className="label !text-[10px]">CTS</span>
              <span className="mono font-semibold text-ink">{plot.ctsNumber}</span>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {plot.landType === 'NA' && (
            <span className="rounded bg-verified-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-verified-600">
              NA
            </span>
          )}
          {plot.landType === 'AGRI_NA_POTENTIAL' && (
            <span className="rounded bg-yellow-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-yellow-800">
              Agri + NA-potential
            </span>
          )}
          {plot.reraNumber && (
            <span className="rounded bg-brand-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-600">
              RERA {plot.reraNumber}
            </span>
          )}
          {plot.reservation === 'school' && (
            <span className="rounded bg-brand-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-600">
              DP Reserved · School
            </span>
          )}
        </div>

        <PriceComparator
          areaSqm={plot.areaSqm}
          readyReckonerRate={plot.readyReckonerRate}
          askMarketRate={plot.askMarketRate}
        />

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="text-[12px] text-muted">
            <strong className="text-ink">{plot.areaSqft.toLocaleString('en-IN')}</strong> sq.ft ·{' '}
            {plot.areaSqm.toLocaleString('en-IN')} sq.m
          </div>
          <Link
            href={`/plots/${plot.slug}`}
            className="btn-primary !py-1.5 !px-3 !text-[13px]"
          >
            View <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
