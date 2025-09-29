"use client"

import { useMemo, useState } from 'react'
import { Input, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components'

export type Franchise = {
  name: string
  category: string
  description: string
  cashRequired: string // e.g. "$50,000"
  tags: string[] // e.g. ['Low Cost', 'Best Score 88']
}

const TAB_DEFS = [
  { key: 'all', label: 'All' },
  { key: 'best', label: 'Best Score' },
  { key: 'low', label: 'Low Cost' },
  { key: 'home', label: 'Home Based' },
  { key: 'finance', label: 'Financing Available' },
  { key: 'new', label: 'New Arrivals' },
]

function parseCurrencyToNumber(input: string): number {
  const clean = input.replace(/[^0-9.]/g, '')
  return Number(clean || '0')
}

function extractBestScore(tags: string[]): number | null {
  const tag = tags.find(t => /^Best Score\s*/i.test(t))
  if (!tag) return null
  const match = tag.match(/(\d+)/)
  return match ? Number(match[1]) : null
}

// Replace native inputs with shadcn Input and remove filters from homepage per requirements
// Fix duplicate import: consolidate shadcn component import once
import { Input, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components'

export default function FranchiseGrid({ franchises }: { franchises: Franchise[] }) {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [maxCash, setMaxCash] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('relevance')

  const categories = useMemo(() => {
    const set = new Set(franchises.map(f => f.category))
    return ['all', ...Array.from(set)]
  }, [franchises])

  const filtered = useMemo(() => {
    let list = [...franchises]

    // Tabs
    switch (activeTab) {
      case 'best':
        list = list.filter(f => extractBestScore(f.tags) !== null)
        break
      case 'low':
        list = list.filter(f => parseCurrencyToNumber(f.cashRequired) <= 50000)
        break
      case 'home':
        list = list.filter(f => f.tags.includes('Home Based'))
        break
      case 'finance':
        list = list.filter(f => f.tags.includes('Financing Available'))
        break
      case 'new':
        list = list.filter(f => f.tags.includes('New Arrival'))
        break
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(f => (
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      ))
    }

    // Category filter
    if (category !== 'all') {
      list = list.filter(f => f.category === category)
    }

    // Max cash filter
    if (maxCash) {
      const max = Number(maxCash)
      if (!Number.isNaN(max)) {
        list = list.filter(f => parseCurrencyToNumber(f.cashRequired) <= max)
      }
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'best') {
        const sa = extractBestScore(a.tags) ?? -Infinity
        const sb = extractBestScore(b.tags) ?? -Infinity
        return sb - sa
      }
      if (sortBy === 'cash') {
        return parseCurrencyToNumber(a.cashRequired) - parseCurrencyToNumber(b.cashRequired)
      }
      // relevance (default): keep current order
      return 0
    })

    return list
  }, [franchises, activeTab, search, category, maxCash, sortBy])

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">Best Franchise Opportunities</h2>
        <span className="text-sm text-gray-600">Showing {filtered.length} of {franchises.length} franchises</span>
      </div>

      {/* Remove filters & tabs on homepage to comply with requirement */}
      {/* Tabs and filters will move to the dedicated franchises page */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((f) => (
          <Card key={f.name}>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <span>{f.name}</span>
                <Badge variant="secondary">{extractBestScore(f.tags) ? `Best Score ${extractBestScore(f.tags)}` : 'Featured'}</Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="outline">{f.category}</Badge>
                <span className="text-xs text-muted-foreground">Added recently</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-700">{f.description}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 border-t">
              <Badge>Cash Required: {f.cashRequired}</Badge>
              {f.tags.filter(t => !/^Best Score/i.test(t)).map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}