import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppCTA from '@/components/WhatsAppCTA';

export const metadata: Metadata = {
  metadataBase: new URL('https://plottrust.in'),
  title: {
    default: 'PlotTrust — Verified plots, 7/12 lookup & UDCPR tools for Maharashtra',
    template: '%s | PlotTrust',
  },
  description:
    'Search NA plots across 44,000+ Maharashtra villages with verified 7/12, Zone, and Ready Reckoner data. Built for buyers, builders, and legal teams in Nashik, Kolhapur & Pune.',
  openGraph: {
    type: 'website',
    url: 'https://plottrust.in',
    siteName: 'PlotTrust',
    images: [{ url: '/og-cover.jpg', width: 1200, height: 630, alt: 'PlotTrust' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://plottrust.in' },
};

export const viewport: Viewport = {
  themeColor: '#0F4C81',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'PlotTrust',
  url: 'https://plottrust.in',
  areaServed: [{ '@type': 'State', name: 'Maharashtra' }],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-99999-99999',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Marathi', 'Hindi'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+Devanagari:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppCTA phone="+919999999999" />
      </body>
    </html>
  );
}
