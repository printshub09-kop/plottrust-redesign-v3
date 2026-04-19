import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware className merger. Standard shadcn helper. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Format ₹ in Indian lakh/crore style. */
export function formatINR(
  amount: number,
  opts: { compact?: boolean } = { compact: true },
): string {
  if (!Number.isFinite(amount)) return '—';
  if (opts.compact) {
    if (amount >= 1e7) return `₹${(amount / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
    if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(2).replace(/\.?0+$/, '')} L`;
    if (amount >= 1e3) return `₹${(amount / 1e3).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** 1 sqm = 10.7639 sqft */
export const sqmToSqft = (sqm: number) => sqm * 10.7639;
export const sqftToSqm = (sqft: number) => sqft / 10.7639;

/** 1 guntha = 101.17 sqm in Maharashtra */
export const sqmToGuntha = (sqm: number) => sqm / 101.17;

/** Build safe WhatsApp link — e.g. for "Ask about this plot". */
export function waLink(
  phoneE164: string,
  message: string,
): string {
  const digits = phoneE164.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Slugify village / gat combo for URLs. */
export function plotSlug(village: string, gat?: string | null, cts?: string | null): string {
  const parts = [village, gat ?? cts ?? '']
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return parts;
}

/** Derive % delta — useful for the price comparator. */
export function priceDelta(market: number, asr: number): number {
  if (!asr) return 0;
  return ((market - asr) / asr) * 100;
}

/**
 * Auto-detect map type from an uploaded image filename / metadata.
 * Keep heuristic — OCR / CV can refine later.
 */
export type MapKind = 'village_map' | 'layout_plan' | 'building_plan' | 'satellite' | 'unknown';
export function detectMapKind(
  filename: string,
  width?: number,
  height?: number,
): MapKind {
  const f = filename.toLowerCase();
  if (/(village|gaon|gaothan|bhunaksha)/.test(f)) return 'village_map';
  if (/(layout|plot[- ]?plan|tp[- ]?scheme|tp\d+)/.test(f)) return 'layout_plan';
  if (/(floor|elevation|building[- ]?plan|architect|section)/.test(f)) return 'building_plan';
  if (/(sat|google|earth|esri|bing)/.test(f)) return 'satellite';
  // Aspect-ratio fallback — building plans tend to be near-square
  if (width && height) {
    const ar = width / height;
    if (ar > 0.9 && ar < 1.2) return 'building_plan';
  }
  return 'unknown';
}

/**
 * Auto-rename upload based on village + gat + survey.
 * Example: "Gangapur_Gat142-2A_Survey58_LayoutPlan_2026-04-18.pdf"
 */
export function renameUpload(
  original: string,
  meta: { village: string; gat?: string | null; survey?: string | null; cts?: string | null; kind: MapKind },
): string {
  const ext = original.includes('.') ? original.slice(original.lastIndexOf('.')) : '';
  const parts = [
    meta.village,
    meta.gat  ? `Gat${meta.gat}` : null,
    meta.survey ? `Survey${meta.survey}` : null,
    meta.cts  ? `CTS${meta.cts}` : null,
    meta.kind !== 'unknown' ? meta.kind.replace('_', '') : null,
    new Date().toISOString().slice(0, 10),
  ]
    .filter(Boolean)
    .map(s => String(s).replace(/[^A-Za-z0-9-]+/g, ''))
    .join('_');
  return `${parts}${ext}`;
}
