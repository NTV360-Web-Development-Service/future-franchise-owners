import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import FranchiseFiltersGrid from '@/app/(frontend)/franchises/FranchiseFiltersGrid'
import FranchiseGrid from '@/components/franchise/FranchiseGrid'
import type { Franchise } from '@/components/franchise/FranchiseCard'

/**
 * Props for the FranchiseGridBlock component.
 *
 * Represents block configuration authored in Payload CMS used to
 * drive server-side franchise fetching and filtering.
 */
type FranchiseGridBlockProps = {
  /** Block configuration from Payload CMS */
  block: {
    /** Block type identifier */
    blockType: 'franchiseGrid'
    /** Optional section heading */
    heading?: string | null
    /** Display mode: automatic filters or manual selection */
    displayMode?: 'automatic' | 'manual' | null
    /** Manually selected franchises (manual mode only) */
    selectedFranchises?: Array<string | { id: string; [key: string]: any }> | null
    /** Whether to show filter controls (automatic mode only) */
    showFilters?: boolean | null
    /** Whether to show filter tabs (Top Pick, Sponsored, Featured) */
    showTabs?: boolean | null
    /** Filter to only featured franchises (automatic mode only) */
    onlyFeatured?: boolean | null
    /** Filter to only sponsored franchises (automatic mode only) */
    onlySponsored?: boolean | null
    /** Filter to only top pick franchises (automatic mode only) */
    onlyTopPick?: boolean | null
    /** Industry filter (automatic mode only) */
    industry?: string | { id: string; [key: string]: any } | null
    /** Maximum number of franchises to display (automatic mode only) */
    limit?: number | null
    /** Unique identifier for the block */
    id?: string | null
    /** Optional block name for admin reference */
    blockName?: string | null
  }
}

/**
 * Server component that fetches and displays franchise data.
 *
 * Applies filters coming from the CMS block config and maps Payload
 * documents into lightweight `Franchise` view models consumed by cards.
 *
 * @param props - Component props containing the block configuration.
 * @returns JSX element rendering either the filterable grid or simple grid.
 */
export default async function FranchiseGridBlock({ block }: FranchiseGridBlockProps) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let docs: any[] = []

  // Manual mode: fetch specific franchises by ID
  if (
    block.displayMode === 'manual' &&
    block.selectedFranchises &&
    block.selectedFranchises.length > 0
  ) {
    const franchiseIds = block.selectedFranchises.map((f) => (typeof f === 'string' ? f : f.id))

    // Fetch all selected franchises
    const { docs: fetchedDocs } = await payload.find({
      collection: 'franchises',
      where: {
        id: { in: franchiseIds },
      },
      depth: 2,
      limit: franchiseIds.length,
    })

    // Preserve the order from selectedFranchises
    const docsMap = new Map(fetchedDocs.map((doc) => [doc.id, doc]))
    docs = franchiseIds.map((id) => docsMap.get(id)).filter(Boolean)
  }
  // Automatic mode: use filter-based query
  else {
    const where: any = {}
    if (block.onlyFeatured) where.isFeatured = { equals: true }
    if (block.onlySponsored) where.isSponsored = { equals: true }
    if (block.onlyTopPick) where.isTopPick = { equals: true }

    // Industry filter (relationship)
    if (block.industry) {
      const industryId = typeof block.industry === 'string' ? block.industry : block.industry.id
      if (industryId) {
        where.industry = { equals: industryId }
      }
    }

    const result = await payload.find({
      collection: 'franchises',
      where: Object.keys(where).length ? where : undefined,
      sort: '-updatedAt',
      limit: block.limit ?? 100, // Default to 100 instead of Payload's default 10
      depth: 2,
    })

    docs = result.docs
  }

  /**
   * Format a number as currency string
   * @param n - Number to format
   * @returns Formatted currency string or empty string if invalid
   */
  const formatCurrency = (n?: number | null): string => {
    if (typeof n !== 'number' || Number.isNaN(n)) return ''
    return `$${n.toLocaleString('en-US')}`
  }

  /**
   * Extract plain text from Payload's rich text format
   * @param rich - Rich text object from Payload CMS
   * @returns Plain text string
   */
  const extractPlainText = (rich?: any): string => {
    const root = rich?.root
    if (!root || !Array.isArray(root.children)) return ''
    for (const node of root.children) {
      if (node?.type === 'paragraph' && Array.isArray(node.children)) {
        const text = node.children
          .map((c: any) => c?.text)
          .filter(Boolean)
          .join(' ')
        if (text) return text
      }
    }
    return ''
  }

  const baseFranchises: (Franchise & { href?: string })[] = (docs || []).map((doc: any) => {
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

    // Assigned agent info (requires relationship population)
    const agent = typeof doc?.assignedAgent === 'object' ? doc.assignedAgent : undefined
    const agentName = agent?.name ?? undefined
    const agentTitle = agent?.title ?? undefined
    const agentPhotoUrl = agent?.photo?.url ?? undefined

    // Extract industry name from relationship
    const industry = typeof doc?.industry === 'object' ? doc.industry : undefined
    const categoryName = industry?.name ?? 'Uncategorized'
    const categoryIcon = industry?.icon ?? undefined

    // Extract tag names and colors from relationships
    const tags = Array.isArray(doc.tags)
      ? doc.tags
          .map((t: any) => {
            if (typeof t === 'object' && t.name) {
              return {
                name: t.name,
                color: t.color || undefined,
                textColor: t.textColor || undefined,
              }
            }
            return null
          })
          .filter(Boolean)
      : []

    return {
      name: doc.businessName || 'Untitled Franchise',
      category: categoryName,
      categoryIcon,
      description: extractPlainText(doc.description) || 'View details for this franchise',
      cashRequired,
      tags,
      isFeatured: !!doc.isFeatured,
      isSponsored: !!doc.isSponsored,
      isTopPick: !!doc.isTopPick,
      useMainContact: !!doc.useMainContact,
      imageUrl: doc?.logo?.url ?? undefined,
      imageAlt: doc?.logo?.alt ?? undefined,
      agentName,
      agentTitle,
      agentPhotoUrl,
      href: `/franchises/${doc.id}`,
    }
  })

  // Use only real franchise data from Payload CMS
  const franchises = baseFranchises

  // Render with or without filters based on showFilters setting (works for both modes)
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {block.showFilters ? (
        <FranchiseFiltersGrid
          franchises={franchises}
          heading={block.heading ?? 'Browse Franchises'}
          showTabs={block.showTabs ?? true}
        />
      ) : (
        <FranchiseGrid
          franchises={franchises}
          heading={block.heading ?? 'Franchise Opportunities'}
        />
      )}
    </section>
  )
}
