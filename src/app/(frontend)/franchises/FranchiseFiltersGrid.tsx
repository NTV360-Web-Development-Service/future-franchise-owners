"use client"

import { useMemo, useState } from 'react'
import { Input, Button } from '@/components'
import FranchiseCard, { type Franchise } from '../components/FranchiseCard'
import { parseCurrencyToNumber, extractBestScore } from '../utils/franchiseUtils'

export default function FranchiseFiltersGrid({ franchises }: { franchises: Franchise[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [maxCash, setMaxCash] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('relevance')

  const categories = useMemo(() => {
    const set = new Set(franchises.map((f) => f.category))
    return ['all', ...Array.from(set)]
  }, [franchises])

  const filtered = useMemo(() => {
    let list = [...franchises]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q),
      )
    }

    // Category filter
    if (category !== 'all') {
      list = list.filter((f) => f.category === category)
    }

    // Max cash filter
    if (maxCash) {
      const max = Number(maxCash)
      if (!Number.isNaN(max)) {
        list = list.filter((f) => parseCurrencyToNumber(f.cashRequired) <= max)
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
        <span className="text-sm text-gray-600">
          Showing {filtered.length} of {franchises.length} franchises
        </span>
      </div>

      {/* Filters: standardized with shadcn Input and Button */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <Input
            placeholder="Search by name, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Cash</label>
          <Input
            type="number"
            placeholder="e.g. 50000"
            value={maxCash}
            onChange={(e) => setMaxCash(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'relevance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('relevance')}
            >
              Relevance
            </Button>
            <Button
              variant={sortBy === 'best' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('best')}
            >
              Best Score
            </Button>
            <Button
              variant={sortBy === 'cash' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('cash')}
            >
              Cash Required
            </Button>
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((franchise) => (
          <FranchiseCard key={franchise.name} franchise={franchise} variant="grid" />
        ))}
      </div>
    </section>
  )
}