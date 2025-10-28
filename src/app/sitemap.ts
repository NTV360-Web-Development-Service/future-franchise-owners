import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Dynamic sitemap generation
 * Automatically includes all pages and franchises
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futurefranchiseowners.com'
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

  // Map pages to sitemap entries
  const pageEntries: MetadataRoute.Sitemap = pages.docs.map((page) => ({
    url: page.slug === 'homepage' ? baseUrl : `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: 'weekly',
    priority: page.slug === 'homepage' ? 1.0 : 0.8,
  }))

  // Map franchises to sitemap entries
  const franchiseEntries: MetadataRoute.Sitemap = franchises.docs.map((franchise) => ({
    url: `${baseUrl}/franchises/${franchise.id}`,
    lastModified: new Date(franchise.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...pageEntries, ...franchiseEntries]
}
