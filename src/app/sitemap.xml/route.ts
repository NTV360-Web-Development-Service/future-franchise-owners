import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Force dynamic rendering - sitemap needs database access
export const dynamic = 'force-dynamic'

/**
 * Dynamic sitemap generation as route handler
 * Automatically includes all pages and franchises
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futurefranchiseowners.com'

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Fetch all pages
    const pages = await payload.find({
      collection: 'pages',
      limit: 1000,
    })

    // Fetch all franchises
    const franchises = await payload.find({
      collection: 'franchises',
      limit: 1000,
    })

    // Build XML sitemap
    const urls: string[] = []

    // Add pages
    for (const page of pages.docs) {
      const url = page.slug === 'homepage' ? baseUrl : `${baseUrl}/${page.slug}`
      const lastmod = new Date(page.updatedAt).toISOString()
      urls.push(`
    <url>
      <loc>${url}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page.slug === 'homepage' ? '1.0' : '0.8'}</priority>
    </url>`)
    }

    // Add franchises
    for (const franchise of franchises.docs) {
      const url = `${baseUrl}/franchises/${franchise.id}`
      const lastmod = new Date(franchise.updatedAt).toISOString()
      urls.push(`
    <url>
      <loc>${url}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>`)
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // Return a basic sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }
}
