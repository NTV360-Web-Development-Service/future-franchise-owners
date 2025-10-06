'use client'

import React from 'react'
import { Input, Button } from '@/components'

type FiltersSidebarProps = {
  categories: string[]
  selectedCategories: string[]
  onToggleCategory: (cat: string) => void
  search: string
  onSearchChange: (v: string) => void
  maxCash: string
  onMaxCashChange: (v: string) => void
  sortBy: string
  onSortByChange: (v: string) => void
  isOpen?: boolean
  onClose?: () => void
  showInlineDesktop?: boolean
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

export default function FiltersSidebar({
  categories,
  selectedCategories,
  onToggleCategory,
  search,
  onSearchChange,
  maxCash,
  onMaxCashChange,
  sortBy,
  onSortByChange,
  isOpen = false,
  onClose,
  showInlineDesktop = true,
  collapsed = false,
  onToggleCollapsed,
}: FiltersSidebarProps) {
  const content = (
    <div className="w-full max-w-[280px] rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="text-base font-semibold mb-4">Filter</h3>

      <div className="space-y-3">
        <details className="rounded-lg border p-3" open>
          <summary className="cursor-pointer select-none text-sm font-medium">Search</summary>
          <div className="mt-3">
            <Input
              placeholder="Search by name, category..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </details>

        <details className="rounded-lg border p-3" open>
          <summary className="cursor-pointer select-none text-sm font-medium">Category</summary>
          <div className="mt-3 space-y-2">
            {categories.map((cat) => {
              const checked = selectedCategories.includes(cat)
              return (
                <label key={cat} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border"
                    checked={checked}
                    onChange={() => onToggleCategory(cat)}
                  />
                  <span>{cat}</span>
                </label>
              )
            })}
          </div>
        </details>

        <details className="rounded-lg border p-3">
          <summary className="cursor-pointer select-none text-sm font-medium">Max Cash</summary>
          <div className="mt-3">
            <Input
              type="number"
              placeholder="e.g. 50000"
              value={maxCash}
              onChange={(e) => onMaxCashChange(e.target.value)}
            />
          </div>
        </details>

        <details className="rounded-lg border p-3" open>
          <summary className="cursor-pointer select-none text-sm font-medium">Sort By</summary>
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={sortBy === 'relevance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortByChange('relevance')}
              >
                Relevance
              </Button>
              <Button
                variant={sortBy === 'best' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortByChange('best')}
              >
                Best Score
              </Button>
              <Button
                variant={sortBy === 'cash' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortByChange('cash')}
              >
                Cash Required
              </Button>
            </div>
          </div>
        </details>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop: sticky sidebar (optional, with minimize) */}
      {showInlineDesktop && (
        <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          {collapsed ? (
            <div className="w-full max-w-[280px]">
              <Button variant="outline" size="sm" onClick={onToggleCollapsed}>
                Show Filters
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-[280px]">
              <div className="flex items-center justify-end mb-2">
                <Button variant="outline" size="sm" onClick={onToggleCollapsed}>
                  Minimize
                </Button>
              </div>
              {content}
            </div>
          )}
        </div>
      )}

      {/* Overlay panel with animation (all breakpoints) */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 transition-opacity duration-200"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[85vw] max-w-[360px] bg-background p-4 shadow-xl transform transition-transform duration-300 ease-out translate-x-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold">Filter</h3>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  )
}