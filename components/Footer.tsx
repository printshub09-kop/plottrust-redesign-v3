import Link from 'next/link';

const GOV_LINKS = [
  { href: 'https://bhulekh.mahabhumi.gov.in',           label: 'Mahabhulekh' },
  { href: 'https://mahabhunakasha.mahabhumi.gov.in',     label: 'Bhunaksha' },
  { href: 'https://maharera.maharashtra.gov.in',         label: 'MahaRERA' },
  { href: 'https://igrmaharashtra.gov.in',               label: 'IGR Maharashtra' },
  { href: 'https://dtp.maharashtra.gov.in/acts-rules/',  label: 'UDCPR 2020' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A1B2E] text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-extrabold text-white">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-xs text-white">PT</span>
            PlotTrust
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            Maharashtra&apos;s trust layer for land — verified village data, 7/12, DP / TP zones, RERA and Ready Reckoner
            in one searchable platform.
          </p>
          <address className="mt-4 not-italic text-sm text-slate-300 space-y-1.5">
            <div>📍 College Road, Nashik — 422005</div>
            <a href="tel:+919999999999" className="block hover:text-white">📞 +91 99999 99999</a>
            <a href="mailto:hello@plottrust.in" className="block hover:text-white">✉ hello@plottrust.in</a>
          </address>
        </div>

        <FootCol title="Platform">
          <FootLink href="/search">Find Plots</FootLink>
          <FootLink href="/tools/712">7/12 Lookup</FootLink>
          <FootLink href="/tools/zone">Zone Checker</FootLink>
          <FootLink href="/tools/ready-reckoner">Ready Reckoner</FootLink>
          <FootLink href="/tools/udcpr">UDCPR Calculator</FootLink>
        </FootCol>

        <FootCol title="Services">
          <FootLink href="/services/due-diligence">Title Due Diligence</FootLink>
          <FootLink href="/services/na-conversion">NA Conversion</FootLink>
          <FootLink href="/services/valuation">Market Valuation</FootLink>
          <FootLink href="/services/rera">RERA Registration</FootLink>
          <FootLink href="/dashboard">For Professionals</FootLink>
        </FootCol>

        <FootCol title="Company">
          <FootLink href="/about">About PlotTrust</FootLink>
          <FootLink href="/partners">Partner with us</FootLink>
          <FootLink href="/blog">Land Records Blog</FootLink>
          <FootLink href="/privacy">Privacy</FootLink>
          <FootLink href="/terms">Terms</FootLink>
        </FootCol>
      </div>

      <div className="mx-auto max-w-7xl border-t border-white/5 px-6 py-4 text-xs text-slate-500 flex flex-wrap gap-3 justify-between">
        <span>© 2026 PlotTrust · Nashik, Maharashtra · CIN: U72XXXMH2024PTCXXXXXX</span>
        <span>Made with care for Maharashtra&apos;s land ecosystem</span>
      </div>

      <div className="mx-auto max-w-7xl border-t border-white/5 px-6 py-4 text-xs text-slate-400 flex flex-wrap items-center gap-3">
        <span>🏛 Official sources:</span>
        {GOV_LINKS.map(g => (
          <a
            key={g.href}
            href={g.href}
            target="_blank"
            rel="noopener"
            className="hover:text-white"
          >
            {g.label}
          </a>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-10 pt-3">
        <div className="rounded-lg border border-rose-700/30 bg-rose-900/20 px-4 py-3 text-xs leading-relaxed text-rose-200">
          <b>Disclaimer:</b> PlotTrust.in is a discovery &amp; analysis platform. Official documents must be verified from
          government sources. We are not a registered broker and do not charge brokerage on listings.{' '}
          <span className="mr">सरकारी अधिकृत दस्तऐवज हेच अंतिम मानले जातील.</span>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="mb-3 text-xs font-bold uppercase tracking-widest text-white">{title}</h5>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}
function FootLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[13.5px] text-slate-400 hover:text-white">
        {children}
      </Link>
    </li>
  );
}
