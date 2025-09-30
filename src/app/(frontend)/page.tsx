import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import type { Page } from '@/types/payload'
import { HeroBlock, RibbonBlock, NavbarBlock, FranchiseGridBlock } from '@/app/(frontend)/components/blocks'
import FranchiseCard, { type Franchise } from '@/app/(frontend)/components/FranchiseCard'

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
      default:
        return null
    }
  }

  

  return (
    <div>
      <h1 className="sr-only">{page.title}</h1>
      {page.layout?.map((block) => renderBlock(block))}

      {/* Featured franchises section */}

      {/* Top Picks section removed in favor of CMS-driven franchiseGrid block */}

      {/* <pre>{JSON.stringify(page.layout, null, 2)}</pre> */}
    </div>
  )
}
