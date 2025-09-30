import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import FranchiseFiltersGrid from '@/app/(frontend)/franchises/FranchiseFiltersGrid'
import FranchiseGrid from '@/app/(frontend)/components/FranchiseGrid'
import type { Franchise } from '@/app/(frontend)/components/FranchiseCard'

type FranchiseGridBlockProps = {
  block: {
    blockType: 'franchiseGrid'
    heading?: string | null
    showFilters?: boolean | null
    onlyFeatured?: boolean | null
    onlySponsored?: boolean | null
    onlyTopPick?: boolean | null
    category?: 'all' | 'Fitness' | 'Food and Beverage' | 'Health and Wellness' | 'Home Services' | 'Senior Care' | 'Sports' | null
    limit?: number | null
    id?: string | null
    blockName?: string | null
  }
}

export default async function FranchiseGridBlock({ block }: FranchiseGridBlockProps) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const where: any = {}
  if (block.onlyFeatured) where.isFeatured = { equals: true }
  if (block.onlySponsored) where.isSponsored = { equals: true }
  if (block.onlyTopPick) where.isTopPick = { equals: true }
  if (block.category && block.category !== 'all') where.category = { equals: block.category }

  const { docs } = await payload.find({
    collection: 'franchises',
    where: Object.keys(where).length ? where : undefined,
    sort: '-updatedAt',
    limit: block.limit ?? undefined,
    depth: 1,
  })

  const formatCurrency = (n?: number | null): string => {
    if (typeof n !== 'number' || Number.isNaN(n)) return ''
    return `$${n.toLocaleString('en-US')}`
  }

  const extractPlainText = (rich?: any): string => {
    const root = rich?.root
    if (!root || !Array.isArray(root.children)) return ''
    for (const node of root.children) {
      if (node?.type === 'paragraph' && Array.isArray(node.children)) {
        const text = node.children.map((c: any) => c?.text).filter(Boolean).join(' ')
        if (text) return text
      }
    }
    return ''
  }

  const franchises: (Franchise & { href?: string })[] = (docs || []).map((doc: any) => {
    const min = doc?.investment?.min ?? null
    const max = doc?.investment?.max ?? null
    const cashRequired =
      min != null && max != null
        ? `${formatCurrency(min)} - ${formatCurrency(max)}`
        : min != null
        ? formatCurrency(min)
        : max != null
        ? formatCurrency(max)
        : ''

    return {
      name: doc.businessName || 'Untitled Franchise',
      category: doc.category || 'Uncategorized',
      description: extractPlainText(doc.description) || 'View details for this franchise',
      cashRequired,
      tags: Array.isArray(doc.tags) ? doc.tags.map((t: any) => t.label).filter(Boolean) : [],
      isFeatured: !!doc.isFeatured,
      isSponsored: !!doc.isSponsored,
      isTopPick: !!doc.isTopPick,
      imageUrl: doc?.logo?.url ?? undefined,
      imageAlt: doc?.logo?.alt ?? undefined,
      href: `/franchises/${doc.id}`,
    }
  })

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* If showFilters is true, show the heading here and render the filters grid */}
      {block.showFilters && block.heading && (
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold">{block.heading}</h2>
        </div>
      )}

      {block.showFilters ? (
        <FranchiseFiltersGrid franchises={franchises} />
      ) : (
        // Without filters, render the simple grid and pass the heading down
        <FranchiseGrid
          franchises={franchises}
          heading={block.heading ?? 'Franchise Opportunities'}
        />
      )}
    </section>
  )
}