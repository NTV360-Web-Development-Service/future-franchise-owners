import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import { fileURLToPath } from 'url'

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

  return {
    title: page.title || 'Future Franchise Owners',
    description: page.title || 'Find your perfect franchise opportunity',
  }
}
