import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import type { Page } from '@/types/payload'
import { HeroBlock } from '@/app/(frontend)/components/blocks'
import { Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components'

type Franchise = {
  name: string
  category: string
  description: string
  cashRequired: string
  tags: string[]
}

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
      case 'hero':
        return <HeroBlock block={block} key={block.id} />
      default:
        return null
    }
  }

  // Sample franchise data (placeholder until CMS integration)
  const featured: Franchise[] = [
    {
      name: 'Franchise Alpha',
      category: 'Automotive',
      description: 'A leading opportunity with proven success.',
      cashRequired: '$300,000',
      tags: ['Featured', 'Priority', 'Best Score 90'],
    },
    {
      name: 'Franchise Beta',
      category: 'Business Services',
      description: 'Trusted brand with nationwide presence.',
      cashRequired: '$50,000',
      tags: ['Featured', 'Priority', 'Low Cost', 'Best Score 88'],
    },
    {
      name: 'Franchise Gamma',
      category: 'Food & Beverage',
      description: 'High-growth mobile food concept.',
      cashRequired: '$100,000',
      tags: ['Featured', 'Priority', 'Home Based', 'Best Score 87'],
    },
  ]

  const topPicks: Franchise[] = [
    {
      name: 'Franchise Delta',
      category: 'Senior Care',
      description: 'Care services franchise with strong support.',
      cashRequired: '$50,000',
      tags: ['User Pick', 'New Arrival', 'Best Score 86'],
    },
    {
      name: 'Franchise Epsilon',
      category: 'Retail/Experiences',
      description: 'Experience-based retail concept with recurring revenue.',
      cashRequired: '$10,000',
      tags: ['User Pick', 'Low Cost', 'Best Score 86'],
    },
    {
      name: 'Franchise Zeta',
      category: 'Home Services',
      description: 'Essential services with strong local demand.',
      cashRequired: '$60,000',
      tags: ['User Pick', 'Home Based', 'Best Score 86'],
    },
  ]

  return (
    <div>
      <h1 className="sr-only">{page.title}</h1>
      {page.layout?.map((block) => renderBlock(block))}

      {/* Featured franchises section */}
      
      {/* Top pick franchises section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold">Top Picks</h2>
          <span className="text-sm text-muted-foreground">User-rated selections</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topPicks.map((f) => (
            <Card key={f.name}>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center justify-between">
                  <span>{f.name}</span>
                  <Badge variant="secondary">Best Score</Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline">{f.category}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 border-t">
                <Badge>Cash Required: {f.cashRequired}</Badge>
                {f.tags.filter(t => t !== 'User Pick').map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* <pre>{JSON.stringify(page.layout, null, 2)}</pre> */}
    </div>
  )
}
