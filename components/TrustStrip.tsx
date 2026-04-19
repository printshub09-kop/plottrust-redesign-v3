import { ShieldCheck, MapPin, Database } from 'lucide-react';

/**
 * The thin trust bar directly below the hero — renders on every public page.
 * Keeps the site grounded in verifiable facts (village-level, gov sources, no brokerage).
 */
export default function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center gap-5 text-[13px] text-slate-400">
      <span className="inline-flex items-center gap-1.5">
        <MapPin size={14} className="text-emerald-400" />
        Village-level data
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Database size={14} className="text-sky-300" />
        iGR + Mahabhumi sources
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck size={14} className="text-amber-300" />
        No brokerage on listings
      </span>
    </div>
  );
}
