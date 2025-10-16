import type { Page } from '@/payload-types'

/**
 * Helper function to check if navbar/footer should be visible on a specific page
 *
 * @param visibility - The visibility setting ('all', 'include', 'exclude')
 * @param selectedPages - Array of page IDs or Page objects that are included or excluded
 * @param currentPageSlug - The slug of the current page being rendered
 * @returns boolean - Whether the navbar/footer should be visible
 */
export function shouldShowOnPage(
  visibility: 'all' | 'include' | 'exclude' | undefined,
  selectedPages: (string | Page)[] | undefined,
  currentPageSlug: string | undefined,
): boolean {
  // If no visibility setting or set to 'all', show on all pages
  if (!visibility || visibility === 'all') {
    return true
  }

  // If no current page slug, default to showing
  if (!currentPageSlug) {
    return true
  }

  // If no pages are selected, follow the default behavior
  if (!selectedPages || selectedPages.length === 0) {
    // If include mode with no pages selected, hide everywhere
    if (visibility === 'include') return false
    // If exclude mode with no pages selected, show everywhere
    if (visibility === 'exclude') return true
    return true
  }

  // Normalize selectedPages to array of slugs
  const pageSlugs = selectedPages.map((page) => {
    if (typeof page === 'string') return page
    // If it's a Page object, extract the slug
    return page.slug
  })

  // Check based on visibility mode
  if (visibility === 'include') {
    // Show only on selected pages
    return pageSlugs.includes(currentPageSlug)
  }

  if (visibility === 'exclude') {
    // Hide on selected pages
    return !pageSlugs.includes(currentPageSlug)
  }

  return true
}
