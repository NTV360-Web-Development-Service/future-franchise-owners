import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import type { Page } from '@/types/payload'
import { HeroBlock, RibbonBlock, NavbarBlock, FranchiseGridBlock, BlogHighlightsBlock } from '@/components/blocks'

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
        equals: 'landing-page',
      },
    },
  })

  if (!page) {
    return <div>Page not found</div>
  }

  /**
   * Render a block component based on its type
   * Maps block types to their corresponding React components
   * 
   * @param block - Block data from Payload CMS
   * @returns JSX element for the block or null if type not supported
   */
  const renderBlock = (block: Page['layout'][0]) => {
    switch (block.blockType) {
      case 'ribbon':
        return <RibbonBlock block={block} key={block.id} />
      case 'navbar':
        return <NavbarBlock block={block} key={block.id} />
      case 'hero':
        return <HeroBlock block={block} key={block.id} />
      case 'franchiseGrid':
        return <FranchiseGridBlock block={block} key={block.id} />
      case 'blogHighlights':
        return <BlogHighlightsBlock block={block} key={block.id} />
      default:
        return null
    }
  }

  

  return (
    <div>
      <h1 className="sr-only">{page.title}</h1>
      {page.layout?.map((block) => renderBlock(block))}
    </div>
  )
}
