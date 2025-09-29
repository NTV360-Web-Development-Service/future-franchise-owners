"use client"

import { useMemo, useState } from 'react'
import { Input, Button, Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components'

export type Franchise = {
  name: string
  category: string
  description: string
  cashRequired: string // e.g. "$50,000"
  tags: string[] // e.g. ['Low Cost', 'Best Score 88']
}

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

export default function FranchiseFiltersGrid({ franchises }: { franchises: Franchise[] }) {
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
  }, [franchises, search, category, maxCash, sortBy])

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">Browse Franchises</h2>
        <span className="text-sm text-gray-600">Showing {filtered.length} of {franchises.length} franchises</span>
      </div>

      {/* Filters: standardized with shadcn Input and Button */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <Input placeholder="Search by name, category..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button key={cat} variant={category === cat ? 'default' : 'outline'} size="sm" onClick={() => setCategory(cat)}>
                {cat}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Cash</label>
          <Input type="number" placeholder="e.g. 50000" value={maxCash} onChange={(e) => setMaxCash(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <div className="flex gap-2">
            <Button variant={sortBy === 'relevance' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('relevance')}>Relevance</Button>
            <Button variant={sortBy === 'best' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('best')}>Best Score</Button>
            <Button variant={sortBy === 'cash' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('cash')}>Cash Required</Button>
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((f) => (
          <Card key={f.name}>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <span>{f.name}</span>
                <Badge variant="secondary">{extractBestScore(f.tags) ? `Best Score ${extractBestScore(f.tags)}` : 'Franchise'}</Badge>
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