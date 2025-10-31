'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components'
import FranchiseCard, { type Franchise } from '@/components/franchise/FranchiseCard'
import { parseCurrencyToNumber, extractBestScore } from '@/lib/franchise'
import { Award, DollarSign, Star, ArrowUpDown } from 'lucide-react'

/**
 * Investment range configuration for filtering franchises by cash required
 */
interface InvestmentRange {
  label: string
  value: string
  min?: number
  max?: number
}

/**
 * Props for the FranchiseFiltersGrid component
 */
interface FranchiseFiltersGridProps {
  /** Array of franchise data to display and filter */
  franchises: (Franchise & { href?: string })[]
  /** Optional heading text for the grid */
  heading?: string
  /** Whether to show the heading section */
  showHeading?: boolean
  /** Whether to show filter tabs (Top Pick, Sponsored, Featured) */
  showTabs?: boolean
}

/**
 * Sort options for franchise listings
 */
type SortOption = 'alphabetical' | 'recent' | 'cash'

/**
 * Reusable expand/collapse icon component
 */
const ExpandCollapseIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <>
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`size-5 ${isExpanded ? 'hidden' : 'block'}`}
    >
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`size-5 ${isExpanded ? 'block' : 'hidden'}`}
    >
      <path
        d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </svg>
  </>
)

/**
 * Reusable checkbox component with consistent styling
 */
const FilterCheckbox = ({
  id,
  checked,
  onChange,
  label,
}: {
  id: string
  checked: boolean
  onChange: () => void
  label: string
}) => (
  <div className="flex gap-3">
    <div className="flex h-5 shrink-0 items-center">
      <div className="group grid size-4 grid-cols-1">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
        />
        <svg
          viewBox="0 0 14 14"
          fill="none"
          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-has-checked:opacity-100"
          />
        </svg>
      </div>
    </div>
    <label htmlFor={id} className="text-sm text-gray-600">
      {label}
    </label>
  </div>
)

/**
 * Collapsible filter section component
 */
const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) => (
  <div className="border-b border-gray-200 py-6">
    <h3 className="-my-3 flow-root">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <span className="ml-6 flex items-center">
          <ExpandCollapseIcon isExpanded={isOpen} />
        </span>
      </button>
    </h3>
    <div className={`${isOpen ? 'block' : 'hidden'} pt-6`}>
      <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin">{children}</div>
    </div>
  </div>
)

/**
 * Determines the appropriate grid layout based on the number of items
 */
const getGridLayout = (itemCount: number): string => {
  if (itemCount <= 1) return 'grid-cols-1'
  if (itemCount === 2) return 'sm:grid-cols-2'
  return 'sm:grid-cols-2 lg:grid-cols-3'
}

/**
 * FranchiseFiltersGrid - A comprehensive franchise listing component with filtering and sorting capabilities
 *
 * Features:
 * - Search functionality across name, category, and description
 * - Category filtering with dynamic category generation
 * - Investment range filtering with predefined ranges
 * - Tag/feature filtering with popular tags
 * - Sorting by relevance, rating, and price
 * - Responsive grid layout that adapts to content
 * - Collapsible filter sections for better UX
 *
 * @param props - Component props
 * @returns JSX element containing the franchise grid with filters
 */
export default function FranchiseFiltersGrid({
  franchises,
  heading,
  showHeading = true,
  showTabs = true,
}: FranchiseFiltersGridProps) {
  // Filter and sort state
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeTabFilter, setActiveTabFilter] = useState<string | null>(null) // For Top Pick, Sponsored, Featured
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')
  const [sortAscending, setSortAscending] = useState<boolean>(true)
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)

  // Pagination state
  const [displayLimit, setDisplayLimit] = useState(9) // Show 9 items initially
  const LOAD_MORE_COUNT = 9 // Load 9 more items each time

  // Collapsible section states
  const [categoryOpen, setCategoryOpen] = useState<boolean>(true)
  const [investmentOpen, setInvestmentOpen] = useState<boolean>(false)
  const [tagsOpen, setTagsOpen] = useState<boolean>(false)

  /**
   * Extract unique categories from franchise data (sorted alphabetically)
   * Includes all industries from franchises with multiple industries
   */
  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    franchises.forEach((franchise) => {
      // Add primary category for backward compatibility
      categorySet.add(franchise.category)
      // Add all categories from the categories array
      if (franchise.categories && franchise.categories.length > 0) {
        franchise.categories.forEach((cat) => categorySet.add(cat.name))
      }
    })
    return Array.from(categorySet).sort((a, b) => a.localeCompare(b))
  }, [franchises])

  /**
   * Extract and rank popular tags from franchise data
   * Returns the top 8 most frequently used tags (sorted alphabetically)
   */
  const popularTags = useMemo(() => {
    const tagCounts = new Map<string, number>()

    franchises.forEach((franchise) => {
      franchise.tags.forEach((tag) => {
        // Tags are now objects with name and color
        const tagName = tag.name
        tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + 1)
      })
    })

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by frequency (descending)
      .slice(0, 8) // Take top 8
      .map(([tag]) => tag)
      .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
  }, [franchises])

  /**
   * Apply all filters and sorting to the franchise list
   */
  const filteredFranchises = useMemo(() => {
    let result = [...franchises]

    // Apply tab filter first (Top Pick, Sponsored, Featured)
    if (activeTabFilter) {
      result = result.filter((franchise) => {
        // Check both boolean flags and tags for more robust filtering
        if (activeTabFilter === 'Top Pick') {
          return franchise.isTopPick || franchise.tags.some((tag) => tag.name === 'Top Pick')
        }
        if (activeTabFilter === 'Sponsored') {
          return franchise.isSponsored || franchise.tags.some((tag) => tag.name === 'Sponsored')
        }
        if (activeTabFilter === 'Featured') {
          return franchise.isFeatured || franchise.tags.some((tag) => tag.name === 'Featured')
        }
        return franchise.tags.some((tag) => tag.name === activeTabFilter)
      })
    }

    // Apply search filter
    if (search.trim()) {
      const searchQuery = search.toLowerCase()
      result = result.filter((franchise) => {
        const nameMatch = franchise.name.toLowerCase().includes(searchQuery)
        const descMatch = franchise.description.toLowerCase().includes(searchQuery)
        const categoryMatch = franchise.category.toLowerCase().includes(searchQuery)
        const categoriesMatch =
          franchise.categories?.some((cat) => cat.name.toLowerCase().includes(searchQuery)) || false
        return nameMatch || descMatch || categoryMatch || categoriesMatch
      })
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      const allowedCategories = new Set(selectedCategories)
      result = result.filter((franchise) => {
        // Check if franchise has any of the selected categories
        // Support both single category (backward compat) and multiple categories
        if (franchise.categories && franchise.categories.length > 0) {
          return franchise.categories.some((cat) => allowedCategories.has(cat.name))
        }
        return allowedCategories.has(franchise.category)
      })
    }

    // Apply investment range filter (min/max inputs)
    if (minPrice !== undefined || maxPrice !== undefined) {
      result = result.filter((franchise) => {
        const cashRequired = parseCurrencyToNumber(franchise.cashRequired)
        const meetsMin = minPrice === undefined || cashRequired >= minPrice
        const meetsMax = maxPrice === undefined || cashRequired <= maxPrice
        return meetsMin && meetsMax
      })
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      result = result.filter((franchise) =>
        selectedTags.some((tag) => franchise.tags.some((t) => t.name === tag)),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'alphabetical': {
          comparison = a.name.localeCompare(b.name)
          break
        }
        case 'recent': {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
          comparison = dateB - dateA
          break
        }
        case 'cash': {
          comparison = parseCurrencyToNumber(a.cashRequired) - parseCurrencyToNumber(b.cashRequired)
          break
        }
      }
      return sortAscending ? comparison : -comparison
    })

    return result
  }, [
    franchises,
    activeTabFilter,
    search,
    selectedCategories,
    minPrice,
    maxPrice,
    selectedTags,
    sortBy,
    sortAscending,
  ])

  /**
   * Handle category selection toggle
   */
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
    setDisplayLimit(9) // Reset pagination
  }

  /**
   * Handle tag selection toggle
   */
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    setDisplayLimit(9) // Reset pagination
  }

  /**
   * Handle tab filter click (mutually exclusive)
   */
  const handleTabClick = (tabName: string) => {
    // Toggle off if clicking the same tab, otherwise set new tab
    setActiveTabFilter((prev) => (prev === tabName ? null : tabName))
    // Reset pagination when changing filters
    setDisplayLimit(9)
  }

  /**
   * Load more franchises
   */
  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + LOAD_MORE_COUNT)
  }

  // Slice the filtered results for pagination
  const displayedFranchises = filteredFranchises.slice(0, displayLimit)
  const hasMore = displayLimit < filteredFranchises.length

  // Reset pagination when search, sort, or price filters change
  useEffect(() => {
    setDisplayLimit(9)
  }, [search, sortBy, minPrice, maxPrice])

  return (
    <div className="bg-white">
      {showHeading && (
        <div className="lg:sticky lg:top-16 lg:z-10 bg-white border-b border-gray-200 pt-6 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {heading ?? 'Browse Franchises'}
              </h1>

              {/* Filter Tabs - Only show if showTabs is true */}
              {showTabs && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleTabClick('Top Pick')}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                      activeTabFilter === 'Top Pick'
                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Top Pick</span>
                    <span className="xs:hidden">Top</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabClick('Sponsored')}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                      activeTabFilter === 'Sponsored'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                    Sponsored
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabClick('Featured')}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                      activeTabFilter === 'Featured'
                        ? 'bg-green-600 text-white border-green-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    Featured
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Results count */}
              <span className="text-sm text-gray-600">
                Showing {Math.min(displayLimit, filteredFranchises.length)} of{' '}
                {filteredFranchises.length} franchises
              </span>

              {/* Sort dropdown with direction toggle */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-[180px] text-sm font-medium text-gray-700 hover:text-gray-900">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">Alphabetically</SelectItem>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="cash">Price</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortAscending(!sortAscending)}
                  className="px-2"
                  title={sortAscending ? 'Ascending' : 'Descending'}
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>

              {/* Filter toggle button */}
              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                aria-label="Toggle filters"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path
                    d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <section aria-labelledby="products-heading" className="pt-6 pb-24">
        <h2 id="products-heading" className="sr-only">
          Franchises
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters sidebar */}
          <form
            className={`${filtersOpen ? 'block' : 'hidden'} lg:block lg:sticky lg:top-[184px] px-4 lg:self-start lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto`}
          >
            <h3 className="sr-only">Filters</h3>

            {/* Search filter (at top) */}
            <div className="border-b border-gray-200 py-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Search</h3>
              <Input
                type="text"
                placeholder="Search franchises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Industries (Categories) - collapsible */}
            <FilterSection
              title="Industries"
              isOpen={categoryOpen}
              onToggle={() => setCategoryOpen(!categoryOpen)}
            >
              {categories.map((category) => (
                <FilterCheckbox
                  key={category}
                  id={`filter-category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  label={category}
                />
              ))}
            </FilterSection>

            {/* Investment range filter (min/max inputs) */}
            <FilterSection
              title="Investment Range"
              isOpen={investmentOpen}
              onToggle={() => setInvestmentOpen(!investmentOpen)}
            >
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="min-price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Minimum Investment
                  </label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="$0"
                    value={minPrice ?? ''}
                    onChange={(e) =>
                      setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="max-price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Maximum Investment
                  </label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="No limit"
                    value={maxPrice ?? ''}
                    onChange={(e) =>
                      setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMinPrice(undefined)
                    setMaxPrice(undefined)
                  }}
                  className="w-full"
                >
                  Clear
                </Button>
              </div>
            </FilterSection>

            {/* Tags/Features filter */}
            <FilterSection
              title="Features"
              isOpen={tagsOpen}
              onToggle={() => setTagsOpen(!tagsOpen)}
            >
              {popularTags.map((tag) => (
                <FilterCheckbox
                  key={tag}
                  id={`filter-tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                  label={tag}
                />
              ))}
            </FilterSection>
          </form>

          {/* Results grid */}
          <div className="lg:col-span-3 min-h-0">
            <div
              className={`grid gap-6 ${displayedFranchises.length <= 2 ? 'justify-items-center' : 'justify-items-start'} ${getGridLayout(displayedFranchises.length)} pb-8`}
            >
              {displayedFranchises.map((franchise) => (
                <div
                  key={franchise.href ?? franchise.name}
                  className={`w-full ${displayedFranchises.length === 1 ? 'max-w-md mx-auto' : ''}`}
                >
                  <FranchiseCard franchise={franchise} variant="grid" />
                </div>
              ))}
            </div>

            {/* Load More button when more items are available */}
            {hasMore && (
              <div className="flex justify-center pb-8 pt-4">
                <Button
                  onClick={handleLoadMore}
                  className="px-8 py-3 text-base font-semibold bg-[#004AAD] hover:bg-[#003A8C] text-white"
                >
                  Load More Franchises
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
