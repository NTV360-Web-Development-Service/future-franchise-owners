/**
 * Schema.org structured data helpers for SEO
 * These help search engines understand your content better
 */

import type { Franchise } from '@/payload-types'

/**
 * Generate Organization schema for the site
 * Add this to your root layout or homepage
 */
export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futurefranchiseowners.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Future Franchise Owners',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'Expert franchise consulting services helping entrepreneurs find and invest in the perfect franchise opportunity.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'English',
    },
    sameAs: [
      // Add your social media profiles here
      // 'https://www.facebook.com/yourpage',
      // 'https://www.linkedin.com/company/yourcompany',
      // 'https://twitter.com/yourhandle',
    ],
  }
}

/**
 * Generate LocalBusiness schema for a franchise
 * Use this on individual franchise pages
 */
export function generateFranchiseSchema(franchise: Franchise) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futurefranchiseowners.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: franchise.businessName,
    url: `${baseUrl}/franchises/${franchise.id}`,
    image: typeof franchise.logo === 'object' ? franchise.logo?.url : undefined,
  }
}

/**
 * Generate BreadcrumbList schema
 * Helps search engines understand site structure
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate WebPage schema
 * Use this on content pages
 */
export function generateWebPageSchema(page: {
  title: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url,
    ...(page.datePublished && { datePublished: page.datePublished }),
    ...(page.dateModified && { dateModified: page.dateModified }),
  }
}

/**
 * Helper to render schema as JSON-LD script tag
 * Usage: <script {...renderSchema(generateOrganizationSchema())} />
 */
export function renderSchema(schema: object) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(schema),
    },
  }
}
