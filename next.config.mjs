import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root warning by setting the correct tracing root
  outputFileTracingRoot: dirname,
  // Disable router cache to fix stale data during navigation
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 30, // Minimum value required by Next.js 16
    },
  },
  // Image configuration for external sources (RSS feeds, etc.)
  images: {
    formats: ['image/avif', 'image/webp'], // Use modern image formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon and small image sizes
    minimumCacheTTL: 31536000, // Cache images for 1 year (immutable URLs)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains for RSS feed images
      },
      {
        protocol: 'http',
        hostname: '**', // Allow all HTTP domains for RSS feed images
      },
    ],
  },
  // Add cache headers for static assets
  async headers() {
    return [
      {
        // Cache optimized images for 1 year
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache static assets for 1 year
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts for 1 year
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Ensure bare imports like `app/(payload)/...` resolve to `src/app`
    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      app: path.resolve(dirname, 'src/app'),
      '@': path.resolve(dirname, 'src'),
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
