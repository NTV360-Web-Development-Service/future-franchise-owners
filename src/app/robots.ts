import { MetadataRoute } from 'next'

/**
 * Robots.txt configuration
 * Tells search engines which pages they can crawl
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futurefranchiseowners.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/import/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
