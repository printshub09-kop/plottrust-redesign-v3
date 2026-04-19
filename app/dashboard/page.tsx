/**
 * B2B Professional Dashboard — for builders, lawyers, agents.
 * Simplified scaffold; role-based variants (Builder / Lawyer / Agent) are TODO.
 */
export const metadata = { title: 'Dashboard — PlotTrust Pro' };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <div>
          <p className="label">Pro dashboard</p>
          <h1 className="font-display text-3xl font-extrabold text-ink">Welcome back, Sagar</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-verified-600">
            Credits: 420 · Top up
          </span>
          <button className="btn-primary">+ New Lookup</button>
        </div>
      </header>

      {/* KPI cards */}
      <section className="grid gap-4 md:grid-cols-4">
        <Kpi label="Lookups this month" value="184" trend="▲ 23% vs last month" />
        <Kpi label="Cases in progress"  value="12"  trend="3 awaiting Tahsildar" />
        <Kpi label="Avg response time"  value="1.4s" trend="✓ 99.2% uptime" />
        <Kpi label="Month-to-date bill" value="₹8,420" trend="Auto-debit on 30 Apr" emphasis />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Quick lookup */}
        <div className="rounded-xl border border-line bg-white p-6">
          <p className="label">Quick 7/12 lookup</p>
          <h2 className="mt-2 font-display text-xl font-extrabold text-ink">
            Fetch Satbara in 1.4 seconds
          </h2>
          <form className="mt-4 grid grid-cols-2 gap-3">
            <Field label="District" value="Nashik ▾" />
            <Field label="Taluka"   value="Nashik Tal ▾" />
            <Field label="Village (गाव)" value="Gangapur ▾" />
            <Field label="Gat / Survey No." value="142/2-A" mono />
            <button type="button" className="btn-primary col-span-1">🔍 Fetch 7/12 (1 credit)</button>
            <button type="button" className="btn-outline col-span-1">Bulk (CSV)</button>
          </form>
          <p className="mt-3 text-xs text-muted">💡 1 credit = 1 lookup. Bulk discount 30% at 500+.</p>
        </div>

        {/* Recent */}
        <div className="rounded-xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="label">Recent lookups</p>
            <a className="text-xs font-bold text-brand-600">View all →</a>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {RECENT.map(r => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-5 place-items-center rounded text-[10px] font-bold ${
                      r.status === 'Clean' ? 'bg-emerald-50 text-verified-600' :
                      r.status === 'Blocked' ? 'bg-rose-50 text-zone-red' :
                      'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {r.status === 'Clean' ? '✓' : r.status === 'Blocked' ? '✗' : '⚠'}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{r.label}</p>
                    <p className="text-xs text-muted">{r.sub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`rounded px-2 py-0.5 font-bold ${
                      r.status === 'Clean' ? 'bg-emerald-50 text-verified-600' :
                      r.status === 'Blocked' ? 'bg-rose-50 text-zone-red' :
                      'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="text-muted">{r.t}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

const RECENT = [
  { id: 1, label: 'Gangapur · Gat 142/2-A',   sub: '7/12 fetched · 17 Apr, 14:28',        status: 'Clean',         t: '1.4s' },
  { id: 2, label: 'Shirwade · Gat 77/1',      sub: 'Ferfar pending · 17 Apr, 12:10',      status: 'Review ferfar', t: '1.9s' },
  { id: 3, label: 'Makhmalabad · Svy 214',    sub: 'DP reservation (School) · 16 Apr',    status: 'Blocked',       t: '2.1s' },
  { id: 4, label: 'Ashoka Marg · CTS 9812',   sub: 'Property Card · 15 Apr',              status: 'Clean',         t: '1.3s' },
];

function Kpi({ label, value, trend, emphasis }: { label: string; value: string; trend: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-xl p-5 ${emphasis ? 'bg-brand-600 text-white' : 'border border-line bg-white'}`}>
      <p className={`label ${emphasis ? '!text-sky-200' : ''}`}>{label}</p>
      <p className={`mt-2 font-display text-3xl font-extrabold ${emphasis ? 'text-white' : 'text-ink'}`}>
        {value}
      </p>
      <p className={`mt-2 text-xs ${emphasis ? 'text-sky-100' : 'text-muted'}`}>{trend}</p>
    </div>
  );
}
function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="label">{label}</span>
      <span className={`rounded-md border border-line bg-slate-50 px-3 py-2.5 text-sm text-ink ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </label>
  );
}
