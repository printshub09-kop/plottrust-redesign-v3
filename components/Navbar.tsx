'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '/search',             label: 'Find Plots' },
  { href: '/tools/712',          label: '7/12 Lookup' },
  { href: '/tools/zone',         label: 'Zone Checker' },
  { href: '/tools/ready-reckoner', label: 'Ready Reckoner' },
  { href: '/services',           label: 'Services' },
  { href: '/guide',              label: 'Guide' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-extrabold text-ink">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-verified-600 text-xs font-bold text-white">
            PT
          </span>
          PlotTrust
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1 ml-2">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className="btn-outline hidden sm:inline-flex">Login</Link>
          <Link href="/signup" className="btn-primary">Start Free</Link>
          <button
            className="inline-flex md:hidden rounded-lg border border-line p-2"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-line bg-white px-6 py-3" aria-label="Mobile menu">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-slate-100"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="block rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-slate-100">
            Login
          </Link>
        </nav>
      )}
    </header>
  );
}
