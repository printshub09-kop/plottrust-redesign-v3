/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.plottrust.in' },
      { protocol: 'https', hostname: 'cdn.plottrust.in' },
      { protocol: 'https', hostname: 'mahabhulekh.mahabhumi.gov.in' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/712', destination: '/tools/712', permanent: true },
      { source: '/zone', destination: '/tools/zone', permanent: true },
    ];
  },
  experimental: { optimizePackageImports: ['lucide-react'] },
};

module.exports = nextConfig;
