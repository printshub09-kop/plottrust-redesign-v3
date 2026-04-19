import { waLink } from '@/lib/utils';

interface Props {
  phone: string;                    // E.164 e.g. +919999999999
  message?: string;
  variant?: 'float' | 'inline' | 'button';
  label?: string;
}

/**
 * WhatsApp deep-link CTA.
 * - `float`   : fixed bottom-right (homepage / detail pages)
 * - `inline`  : inline pill in hero / CTA bands
 * - `button`  : rectangular button for forms
 */
export default function WhatsAppCTA({
  phone, message = 'Hi PlotTrust, I want to check a plot', variant = 'float', label,
}: Props) {
  const href = waLink(phone, message);
  const icon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.88 9.88 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.22 8.22 0 0 1 12.75-10.1 8.17 8.17 0 0 1 2.41 5.83c0 4.55-3.71 8.25-8.26 8.25z" />
    </svg>
  );

  if (variant === 'float') {
    return (
      <a
        href={href}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(37,211,102,.4)] transition hover:-translate-y-0.5 hover:scale-[1.02]"
      >
        {icon}
        <span className="hidden sm:inline">{label ?? 'WhatsApp us'}</span>
      </a>
    );
  }
  if (variant === 'button') {
    return (
      <a href={href} className="btn-wa">
        {icon} {label ?? 'Chat on WhatsApp'}
      </a>
    );
  }
  return (
    <a href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-[#25D366] hover:underline">
      {icon} {label ?? 'WhatsApp'}
    </a>
  );
}
