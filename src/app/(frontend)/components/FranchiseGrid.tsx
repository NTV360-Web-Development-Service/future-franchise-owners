'use client'

import { useMemo, useState } from 'react'
import FranchiseCard, { type Franchise } from './FranchiseCard'
import { parseCurrencyToNumber, extractBestScore } from '../utils/franchiseUtils'

const TAB_DEFS = [
  { key: 'all', label: 'All' },
  { key: 'best', label: 'Best Score' },
  { key: 'low', label: 'Low Cost' },
  { key: 'home', label: 'Home Based' },
  { key: 'finance', label: 'Financing Available' },
  { key: 'new', label: 'New Arrivals' },
]

export default function FranchiseGrid({ franchises }: { franchises: Franchise[] }) {
  const [activeTab, setActiveTab] = useState<string>('all')
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

    // Tabs
    switch (activeTab) {
      case 'best':
        list = list.filter((f) => extractBestScore(f.tags) !== null)
        break
      case 'low':
        list = list.filter((f) => parseCurrencyToNumber(f.cashRequired) <= 50000)
        break
      case 'home':
        list = list.filter((f) => f.tags.includes('Home Based'))
        break
      case 'finance':
        list = list.filter((f) => f.tags.includes('Financing Available'))
        break
      case 'new':
        list = list.filter((f) => f.tags.includes('New Arrival'))
        break
    }

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
  }, [franchises, activeTab, search, category, maxCash, sortBy])

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">Best Franchise Opportunities</h2>
        <span className="text-sm text-gray-600">
          Showing {filtered.length} of {franchises.length} franchises
        </span>
      </div>

      {/* Remove filters & tabs on homepage to comply with requirement */}
      {/* Tabs and filters will move to the dedicated franchises page */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((franchise) => (
          <FranchiseCard key={franchise.name} franchise={franchise} variant="featured" />
        ))}
      </div>
    </section>
  )
}