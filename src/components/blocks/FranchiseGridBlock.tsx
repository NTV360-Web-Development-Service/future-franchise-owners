import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import FranchiseFiltersGrid from '@/app/(frontend)/franchises/FranchiseFiltersGrid'
import FranchiseGrid from '@/components/franchise/FranchiseGrid'
import type { Franchise } from '@/components/franchise/FranchiseCard'

/**
 * Props interface for the FranchiseGridBlock component
 */
type FranchiseGridBlockProps = {
  /** Block configuration from Payload CMS */
  block: {
    /** Block type identifier */
    blockType: 'franchiseGrid'
    /** Optional section heading */
    heading?: string | null
    /** Whether to show filter controls */
    showFilters?: boolean | null
    /** Filter to only featured franchises */
    onlyFeatured?: boolean | null
    /** Filter to only sponsored franchises */
    onlySponsored?: boolean | null
    /** Filter to only top pick franchises */
    onlyTopPick?: boolean | null
    /** Category filter */
    category?: 'all' | 'Fitness' | 'Food and Beverage' | 'Health and Wellness' | 'Home Services' | 'Senior Care' | 'Sports' | null
    /** Maximum number of franchises to display */
    limit?: number | null
    /** Unique identifier for the block */
    id?: string | null
    /** Optional block name for admin reference */
    blockName?: string | null
  }
}

/**
 * FranchiseGridBlock - A server-side component that fetches and displays franchise data
 * 
 * Features:
 * - Server-side data fetching from Payload CMS
 * - Dynamic filtering based on block configuration
 * - Support for featured, sponsored, and top pick filters
 * - Category-based filtering
 * - Configurable display limits
 * - Rich text content parsing
 * - Currency formatting
 * - Integration with FranchiseFiltersGrid for interactive filtering
 * 
 * @param props - Component props
 * @returns JSX element containing the franchise grid
 */
export default async function FranchiseGridBlock({ block }: FranchiseGridBlockProps) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Build query filters based on block configuration
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

  // Use only real franchise data from Payload CMS
  const franchises = baseFranchises

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {block.showFilters ? (
        <FranchiseFiltersGrid
          franchises={franchises}
          heading={block.heading ?? 'Browse Franchises'}
        />
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