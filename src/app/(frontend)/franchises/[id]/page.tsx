import { getPayload } from 'payload'
import React from 'react'
import { LucideIcon } from '@/components/ui/lucide-icon'

import config from '@/payload.config'

/**
 * FranchiseDetailPage - Individual franchise detail page component
 *
 * This server-side component fetches and displays detailed information
 * for a specific franchise based on the provided ID parameter. It handles
 * data fetching, error states, and renders franchise details including
 * business information, description, and metadata.
 *
 * Features:
 * - Server-side data fetching from Payload CMS
 * - Dynamic routing with franchise ID parameter
 * - Error handling for non-existent franchises
 * - Rich text content display (with fallback)
 * - Franchise metadata display
 * - Responsive layout
 *
 * @param params - Route parameters containing franchise ID
 * @returns JSX element containing franchise details or error message
 */
export default async function FranchiseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.findByID({
    collection: 'franchises',
    id,
    depth: 2, // Increased to populate industry and tags relationships
  })

  const franchise = result || null

  if (!franchise) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl sm:text-3xl font-semibold">Franchise not found</h1>
        <p className="text-muted-foreground mt-2">No franchise exists with ID: {id}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl sm:text-3xl font-semibold">{franchise.businessName}</h1>
      {franchise.description && (
        <div className="prose max-w-none mt-6">
          {/* Payload richText renders as JSON; render minimal fallback */}
          <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded">
            {JSON.stringify(franchise.description, null, 2)}
          </pre>
        </div>
      )}
      <div className="mt-6 text-sm grid gap-2">
        <div className="flex items-center gap-2">
          <strong>Industry:</strong>
          {typeof franchise.industry === 'object' && franchise.industry ? (
            <span className="flex items-center gap-1.5">
              {franchise.industry.icon && <LucideIcon name={franchise.industry.icon} size={16} />}
              {franchise.industry.name}
            </span>
          ) : (
            '—'
          )}
        </div>
        <div>
          <strong>Status:</strong> {franchise.status || '—'}
        </div>
        <div>
          <strong>Flags:</strong>{' '}
          {[
            franchise.isFeatured && 'Featured',
            franchise.isSponsored && 'Sponsored',
            franchise.isTopPick && 'Top Pick',
          ]
            .filter(Boolean)
            .join(', ') || '—'}
        </div>
      </div>
    </div>
  )
}
