import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
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
} from '@/components/blocks'
import type { AboutTeaserBlockProps } from '@/components/blocks/AboutTeaserBlock'
import type { CallToActionBlockProps } from '@/components/blocks/CallToActionBlock'

/**
 * DynamicPage - Renders any page from Payload CMS based on slug
 *
 * This server-side component fetches page data from Payload CMS based on the
 * URL slug and renders dynamic blocks according to the page layout configuration.
 *
 * @param params - Route parameters containing the page slug
 * @returns JSX element containing the complete page
 */
export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const headers = await getHeaders()
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
        equals: slug,
      },
    },
  })

  if (!page) {
    notFound()
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
    // Skip unpublished blocks
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
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <h1 className="sr-only">{page.title}</h1>
        {page.layout?.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  )
}

/**
 * Generate static params for all pages at build time
 * This enables static generation of all CMS pages
 */
export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const pages = await payload.find({
    collection: 'pages',
    limit: 100,
  })

  return pages.docs
    .filter((page) => page.slug !== 'homepage') // Exclude homepage as it's handled by /page.tsx
    .map((page) => ({
      slug: page.slug,
    }))
}

// Force dynamic metadata generation (no caching)
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const {
    docs: [page],
  } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  // Get site settings for defaults
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://futurefranchiseowners.com'
  const pageUrl = `${baseUrl}/${slug}`

  // Use page-specific SEO fields or fall back to site defaults
  const metaTitle =
    page?.seo?.metaTitle || `${page.title} | ${siteSettings?.siteName || 'Future Franchise Owners'}`
  const metaDescription =
    page?.seo?.metaDescription ||
    siteSettings?.seo?.defaultDescription ||
    'Find your perfect franchise opportunity'
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
      url: pageUrl,
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
      canonical: pageUrl,
    },
  }

  // Add keywords if provided
  if (keywords) {
    metadata.keywords = keywords.split(',').map((k) => k.trim())
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
