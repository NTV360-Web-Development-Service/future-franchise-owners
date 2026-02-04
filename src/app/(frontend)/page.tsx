import { headers as getHeaders, draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import type { Metadata } from 'next'

import config from '@/payload.config'
import type { Page } from '@/types/payload'
import {
  HeroBlock,
  RibbonBlock,
  NavbarBlock,
  FranchiseGridBlock,
  BlogHighlightsBlock,
  MapBlock,
  AboutTeaserBlock,
  CallToActionBlock,
  TeamSectionBlock,
  FormBuilderBlock,
  ContactInfoBlock,
  ImageCardBlock,
  ResourcesGridBlock,
} from '@/components/blocks'
import type { AboutTeaserBlockProps } from '@/components/blocks/AboutTeaserBlock'
import type { CallToActionBlockProps } from '@/components/blocks/CallToActionBlock'

// Enable dynamic rendering for this page
export const dynamic = 'force-dynamic'
// Disable client-side router cache
export const fetchCache = 'force-no-store'

/**
 * Generate metadata for the homepage
 */
export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: isDraftMode } = await draftMode()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const {
    docs: [page],
  } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'homepage',
      },
    },
    draft: isDraftMode,
  })

  // Get site settings for defaults
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futurefranchiseowners.com'

  // Use page-specific SEO fields or fall back to site defaults
  const metaTitle =
    page?.seo?.metaTitle ||
    siteSettings?.seo?.defaultTitle ||
    'Future Franchise Owners - Find Your Perfect Franchise'
  const metaDescription =
    page?.seo?.metaDescription ||
    siteSettings?.seo?.defaultDescription ||
    'Discover your next franchise opportunity with expert guidance. Browse top franchises across industries and connect with seasoned consultants.'
  const keywords = page?.seo?.keywords || siteSettings?.seo?.keywords || ''
  const ogImage =
    (typeof page?.seo?.ogImage === 'object' ? page?.seo?.ogImage?.url : null) ||
    (typeof siteSettings?.seo?.ogImage === 'object' ? siteSettings?.seo?.ogImage?.url : null)

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: baseUrl,
      siteName: siteSettings?.siteName || 'Future Franchise Owners',
      type: 'website',
      locale: 'en_US',
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      ...(siteSettings?.seo?.twitterHandle && { site: siteSettings.seo.twitterHandle }),
      ...(ogImage && { images: [ogImage] }),
    },
    alternates: {
      canonical: baseUrl,
    },
  }

  // Add keywords if provided
  if (keywords) {
    metadata.keywords = keywords.split(',').map((k) => k.trim())
  }

  // Add verification codes if provided
  if (siteSettings?.seo?.googleSiteVerification || siteSettings?.seo?.bingSiteVerification) {
    metadata.verification = {
      ...(siteSettings?.seo?.googleSiteVerification && {
        google: siteSettings.seo.googleSiteVerification,
      }),
      ...(siteSettings?.seo?.bingSiteVerification && {
        other: { 'msvalidate.01': siteSettings.seo.bingSiteVerification },
      }),
    }
  }

  // Add noindex if specified
  if (page?.seo?.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    }
  }

  return metadata
}

/**
 * HomePage - The main landing page component for the franchise website
 *
 * This server-side component fetches page data from Payload CMS and renders
 * dynamic blocks based on the page layout configuration. It supports various
 * block types including hero sections, navigation, ribbons, and franchise grids.
 *
 * Features:
 * - Server-side rendering with Payload CMS integration
 * - Dynamic block rendering based on CMS configuration
 * - User authentication context
 * - Flexible layout system
 * - SEO-friendly structure
 *
 * @returns JSX element containing the complete homepage
 */
export default async function HomePage() {
  const headers = await getHeaders()
  const { isEnabled: isDraftMode } = await draftMode()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  const {
    docs: [page],
  } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'homepage',
      },
    },
    draft: isDraftMode,
    depth: 2, // Populate relationships like franchise in addToCart block
  })

  if (!page) {
    return <div>Page not found</div>
  }

  /**
   * Render a block component based on its type
   * Maps block types to their corresponding React components
   * Only renders blocks that are marked as published
   *
   * @param block - Block data from Payload CMS
   * @returns JSX element for the block or null if type not supported or unpublished
   */
  const renderBlock = (
    block: Page['layout'][0] | AboutTeaserBlockProps['block'] | CallToActionBlockProps['block'],
    index: number,
  ) => {
    // Skip rendering if block is unpublished
    if ('published' in block && block.published === false) {
      return null
    }

    const key = 'id' in block && block.id ? block.id : `${block.blockType}-${index}`

    switch (block.blockType) {
      case 'ribbon':
        return <RibbonBlock block={block} key={key} />
      case 'navbar':
        return <NavbarBlock block={block} key={key} />
      case 'hero':
        return <HeroBlock block={block} key={key} />
      case 'franchiseGrid':
        return <FranchiseGridBlock block={block} key={key} />
      case 'blogHighlights':
        return <BlogHighlightsBlock block={block} key={key} />
      case 'map':
        return <MapBlock block={block} key={key} />
      case 'aboutTeaser':
        return <AboutTeaserBlock block={block as AboutTeaserBlockProps['block']} key={key} />
      case 'callToAction':
        return <CallToActionBlock block={block as CallToActionBlockProps['block']} key={key} />
      case 'teamSection':
        return <TeamSectionBlock block={block} key={key} />
      case 'formBuilder':
        return <FormBuilderBlock block={block} key={key} />
      case 'contactInfo':
        return <ContactInfoBlock block={block} key={key} />
      case 'imageCard':
        return <ImageCardBlock block={block} key={key} />
      case 'resourcesGrid':
        return <ResourcesGridBlock block={block} key={key} />
      default:
        return null
    }
  }

  return <div>{page.layout?.map((block, index) => renderBlock(block, index))}</div>
}
