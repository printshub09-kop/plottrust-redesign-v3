import PlotCard from '@/components/PlotCard';
import { SAMPLE_PLOTS } from '@/lib/sample-data';
import type { SearchFilters } from '@/lib/types';

export const metadata = { title: 'Search plots — PlotTrust' };

interface Props {
  searchParams: Promise<{ cat?: string; q?: string; zone?: string; landType?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filters: SearchFilters = {
    cat: (sp.cat as SearchFilters['cat']) ?? 'village',
    q: sp.q,
  };
  const results = SAMPLE_PLOTS; // TODO: replace with prisma query

  return (
    <div className="mx-auto max-w-7xl gap-6 px-6 py-8 lg:grid lg:grid-cols-[280px_1fr]">
      {/* Filters rail */}
      <aside className="mb-6 rounded-xl border border-line bg-white p-5 lg:sticky lg:top-20 lg:self-start">
        <h2 className="font-display text-base font-extrabold text-ink">Filter results</h2>

        <Fieldset legend="DP Zone">
          {['Green', 'Yellow', 'Red'].map(z => (
            <Check key={z} label={z} />
          ))}
        </Fieldset>
        <Fieldset legend="Land type">
          {['NA', 'Agriculture', 'Agri → NA potential', 'Mixed'].map(t => (
            <Check key={t} label={t} />
          ))}
        </Fieldset>
        <Fieldset legend="Area">
          {['< 1,500 sq.ft', '1,500 – 3,000', '3,000 – 1 Acre', '> 1 Acre'].map(a => (
            <Check key={a} label={a} />
          ))}
        </Fieldset>
        <Fieldset legend="Max price">
          {['₹ 25 L', '₹ 50 L', '₹ 1 Cr', '₹ 3 Cr+'].map(p => (
            <Check key={p} label={p} />
          ))}
        </Fieldset>
      </aside>

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {filters.cat ?? 'Village'}
            </p>
            <h1 className="font-display text-2xl font-extrabold text-ink">
              {filters.q ? <>Results for &ldquo;{filters.q}&rdquo;</> : 'All verified plots'}
            </h1>
            <p className="text-sm text-muted">
              {results.length} matching plot{results.length !== 1 && 's'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-outline !py-1.5 !px-3 !text-xs">Sort: Newest</button>
            <button className="btn-outline !py-1.5 !px-3 !text-xs">View: Grid</button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map(p => <PlotCard key={p.id} plot={p} />)}
        </div>
      </section>
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-5 border-t border-line pt-4">
      <legend className="label">{legend}</legend>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </fieldset>
  );
}
function Check({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
      <input type="checkbox" className="accent-brand-600" /> {label}
    </label>
  );
}
