/**
 * Utility functions for franchise data processing and manipulation
 */

/**
 * Parses a currency string and extracts the numeric value
 * 
 * @param input - Currency string (e.g., "$50,000", "€100.000", "¥1,000,000")
 * @returns The numeric value extracted from the currency string
 * 
 * @example
 * ```typescript
 * parseCurrencyToNumber("$50,000") // returns 50000
 * parseCurrencyToNumber("€100.50") // returns 100.50
 * parseCurrencyToNumber("invalid") // returns 0
 * ```
 */
export function parseCurrencyToNumber(input: string): number {
  const clean = input.replace(/[^0-9.]/g, '')
  return Number(clean || '0')
}

/**
 * Extracts the best score value from franchise tags
 * 
 * Searches through an array of tags to find one that matches the pattern
 * "Best Score X" where X is a numeric value, and returns that numeric value.
 * 
 * @param tags - Array of tag strings to search through
 * @returns The numeric score if found, null if no "Best Score" tag exists
 * 
 * @example
 * ```typescript
 * extractBestScore(["Low Cost", "Best Score 88", "Popular"]) // returns 88
 * extractBestScore(["Low Cost", "Popular"]) // returns null
 * extractBestScore(["Best Score 95", "Best Score 80"]) // returns 95 (first match)
 * ```
 */
export function extractBestScore(tags: string[]): number | null {
  const tag = tags.find(t => /^Best Score\s*/i.test(t))
  if (!tag) return null
  const match = tag.match(/(\d+)/)
  return match ? Number(match[1]) : null
}