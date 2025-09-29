export function parseCurrencyToNumber(input: string): number {
  const clean = input.replace(/[^0-9.]/g, '')
  return Number(clean || '0')
}

export function extractBestScore(tags: string[]): number | null {
  const tag = tags.find(t => /^Best Score\s*/i.test(t))
  if (!tag) return null
  const match = tag.match(/(\d+)/)
  return match ? Number(match[1]) : null
}