'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search } from 'lucide-react';

type Cat = 'village' | 'gat' | 'rera' | 'cts';

const PLACEHOLDERS: Record<Cat, string> = {
  village: 'e.g., Gangapur, Shirwade, Makhmalabad…',
  gat:     'e.g., Gat 142/2-A or Survey 58',
  rera:    'e.g., P51600040000',
  cts:     'e.g., CTS 9812, Ashoka Marg',
};

/**
 * The hero search component. Client-side route change to `/search`.
 * Extend with debounced village autocomplete via `/api/villages/search`.
 */
export default function VillageSearch() {
  const router = useRouter();
  const [cat, setCat] = useState<Cat>('village');
  const [q, setQ] = useState('');
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    const params = new URLSearchParams({ cat, q: q.trim() });
    start(() => router.push(`/search?${params.toString()}`));
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className="grid w-full max-w-2xl grid-cols-[auto_1fr_auto] items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_20px_50px_rgba(10,38,71,.4)]"
    >
      <label className="sr-only" htmlFor="pt-cat">Search category</label>
      <select
        id="pt-cat"
        value={cat}
        onChange={e => setCat(e.target.value as Cat)}
        className="cursor-pointer appearance-none rounded-xl bg-slate-100 py-3 pl-4 pr-9 text-sm font-bold text-ink"
      >
        <option value="village">Village</option>
        <option value="gat">Gat / Survey No.</option>
        <option value="rera">RERA Project</option>
        <option value="cts">CTS No.</option>
      </select>

      <label className="sr-only" htmlFor="pt-q">Search term</label>
      <input
        id="pt-q"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder={PLACEHOLDERS[cat]}
        autoComplete="off"
        className="min-w-0 rounded-xl bg-white px-3 py-3 text-[15px] text-ink placeholder:text-muted focus:outline-none"
      />

      <button
        type="submit"
        disabled={pending || !q.trim()}
        className="btn-accent !py-3 !px-4 disabled:opacity-60"
      >
        <Search size={16} />
        <span>Search</span>
      </button>
    </form>
  );
}
