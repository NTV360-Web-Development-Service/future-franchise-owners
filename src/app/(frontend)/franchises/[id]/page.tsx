import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export default async function FranchiseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const headers = getHeaders()
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.findByID({
    collection: 'franchises',
    id,
    depth: 1,
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
        <div><strong>Category:</strong> {franchise.category || '—'}</div>
        <div><strong>Status:</strong> {franchise.status || '—'}</div>
        <div><strong>Flags:</strong> {[franchise.isFeatured && 'Featured', franchise.isSponsored && 'Sponsored', franchise.isTopPick && 'Top Pick'].filter(Boolean).join(', ') || '—'}</div>
      </div>
    </div>
  )
}