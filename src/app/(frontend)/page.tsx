import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
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
  TeamSectionBlock,
} from '@/components/blocks'
import type { AboutTeaserBlockProps } from '@/components/blocks/AboutTeaserBlock'
import type { CallToActionBlockProps } from '@/components/blocks/CallToActionBlock'

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
      default:
        return null
    }
  }

  return (
    <div>
      <h1 className="sr-only">{page.title}</h1>
      {page.layout?.map((block, index) => renderBlock(block, index))}
    </div>
  )
}
