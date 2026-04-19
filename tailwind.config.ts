import type { Config } from 'tailwindcss';

/**
 * PlotTrust design tokens — trust palette for Maharashtra land-records platform.
 * Blue (primary) + Green (verified) + Saffron (accent) + zone semantics.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Trust palette */
        brand: {
          50:  '#EEF5FB',
          100: '#D9E8F5',
          500: '#1466A5',
          600: '#0F4C81', // Primary
          700: '#0A3A66',
          800: '#0A2647',
          900: '#05162B',
        },
        verified: {
          50:  '#ECFDF5',
          500: '#059669',
          600: '#047857', // Secondary
          700: '#065F46',
        },
        accent: {
          50:  '#FFF7ED',
          500: '#F97316', // Saffron CTA
          600: '#EA580C',
        },
        /* Zone semantics */
        zone: {
          green:  '#16A34A',
          yellow: '#F59E0B',
          red:    '#DC2626',
        },
        ink:   '#0F172A',
        muted: '#64748B',
        line:  '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        marathi: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 14px rgba(15,23,42,.08)',
        lift: '0 16px 40px rgba(15,23,42,.12)',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
      keyframes: {
        pulse: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '.4', transform: 'scale(1.3)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'dot-pulse': 'pulse 1.6s infinite',
        'fade-up': 'fadeUp .6s ease forwards',
      },
    },
  },
  plugins: [],
};
export default config;
