import { cn } from '@/lib/utils';
import type { DpZone } from '@/lib/types';

const STYLES: Record<DpZone, { bg: string; text: string; label: string }> = {
  green:  { bg: 'bg-zone-green',  text: 'text-white',   label: 'Green Zone' },
  yellow: { bg: 'bg-zone-yellow', text: 'text-slate-900', label: 'Yellow Zone' },
  red:    { bg: 'bg-zone-red',    text: 'text-white',   label: 'Red Zone' },
};

interface Props {
  zone: DpZone;
  detail?: string;       // e.g. "R-1" or "School Res."
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * DP / TP zone pill — semantic colors that match Maharashtra zoning convention.
 * Green = residential / buildable, Yellow = agri / mixed, Red = reserved / no-build.
 */
export default function ZoneBadge({ zone, detail, className, size = 'md' }: Props) {
  const s = STYLES[zone];
  return (
    <span
      role="status"
      aria-label={`${s.label}${detail ? ` · ${detail}` : ''}`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-bold tracking-wide',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        s.bg, s.text,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" aria-hidden />
      {s.label}{detail ? <span className="font-semibold opacity-90">· {detail}</span> : null}
    </span>
  );
}
