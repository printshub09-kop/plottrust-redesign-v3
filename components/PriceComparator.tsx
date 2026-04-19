import { formatINR, priceDelta } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  areaSqm: number;
  readyReckonerRate: number;   // ₹ / sqm
  askMarketRate?: number;
  variant?: 'card' | 'detail';
}

/**
 * Shows government ASR vs market value side-by-side, plus the delta badge.
 * A deviation over ±30% is a signal for deeper due-diligence.
 */
export default function PriceComparator({
  areaSqm, readyReckonerRate, askMarketRate, variant = 'card',
}: Props) {
  const asrTotal = areaSqm * readyReckonerRate;
  const mktTotal = askMarketRate ? areaSqm * askMarketRate : undefined;
  const delta = mktTotal ? priceDelta(mktTotal, asrTotal) : 0;
  const deltaPositive = delta >= 0;

  return (
    <div
      className={
        variant === 'detail'
          ? 'grid grid-cols-2 gap-3'
          : 'grid grid-cols-2 gap-2 p-3 rounded-lg bg-gradient-to-b from-slate-50 to-white border border-line'
      }
    >
      <div className="flex flex-col gap-0.5 pr-2 border-r border-dashed border-line">
        <span className="label">Govt (ASR)</span>
        <span className="font-display font-bold text-[15px] text-ink">
          {formatINR(asrTotal)}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="label">Market</span>
        {mktTotal ? (
          <>
            <span className="font-display font-bold text-[15px] text-verified-600">
              {formatINR(mktTotal)}
            </span>
            <span
              className={`inline-flex items-center self-start gap-1 rounded-full px-1.5 py-px text-[10px] font-bold
              ${deltaPositive ? 'bg-verified-50 text-verified-600' : 'bg-rose-50 text-rose-600'}`}
            >
              {deltaPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {deltaPositive ? '+' : ''}{delta.toFixed(0)}%
            </span>
          </>
        ) : (
          <span className="font-display font-bold text-[15px] text-slate-400">Restricted</span>
        )}
      </div>
    </div>
  );
}
