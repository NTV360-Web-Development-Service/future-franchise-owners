import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface CSVRow {
  Franchise: string
  Industry: string
  'Investment Range': string
  Database: string
  'Short Description': string
  'Long Description': string
}

function parseCSV(text: string): CSVRow[] {
  const lines = text.split('\n')
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)
    const row: Record<string, string> = {}

    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || ''
    })

    rows.push(row as unknown as CSVRow)
  }

  return rows
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

function parseInvestmentRange(range: string): { min: number; max: number } {
  // Handle formats like "$91,195 - $166,012" or "$30,000"
  const numbers = range.match(/[\d,]+/g) || []
  const parsed = numbers.map((n) => parseInt(n.replace(/,/g, ''), 10))

  if (parsed.length >= 2) {
    return { min: parsed[0], max: parsed[1] }
  } else if (parsed.length === 1) {
    return { min: parsed[0], max: parsed[0] }
  }

  return { min: 0, max: 0 }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const text = await file.text()
    const rows = parseCSV(text)

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No data found in CSV' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const errors: Array<{ row: number; businessName: string; error: string }> = []
    let created = 0

    // Get or create industries
    const industryCache = new Map<string, string>()

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNum = i + 2 // Account for header row and 0-index

      try {
        const businessName = row.Franchise?.trim()
        if (!businessName) {
          errors.push({ row: rowNum, businessName: 'Unknown', error: 'Missing franchise name' })
          continue
        }

        // Parse industries (comma-separated)
        const industryNames =
          row.Industry?.split(',')
            .map((s) => s.trim())
            .filter(Boolean) || []
        const industryIds: string[] = []

        for (const industryName of industryNames) {
          if (industryCache.has(industryName)) {
            industryIds.push(industryCache.get(industryName)!)
          } else {
            // Try to find existing industry
            const existing = await payload.find({
              collection: 'industries',
              where: { name: { equals: industryName } },
              limit: 1,
            })

            if (existing.docs.length > 0) {
              industryCache.set(industryName, existing.docs[0].id)
              industryIds.push(existing.docs[0].id)
            } else {
              // Create new industry with slug
              const slug = industryName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
              const newIndustry = await payload.create({
                collection: 'industries',
                data: { name: industryName, slug },
              })
              industryCache.set(industryName, newIndustry.id)
              industryIds.push(newIndustry.id)
            }
          }
        }

        // Parse investment range
        const investment = parseInvestmentRange(row['Investment Range'] || '')

        // Determine flags based on Database column
        const dbValue = row.Database?.toLowerCase() || ''
        const isTopPick = dbValue.includes('top pick')
        const isFeatured = dbValue.includes('featured')
        const isSponsored = dbValue.includes('sponsored')

        // Create franchise
        await payload.create({
          collection: 'franchises',
          data: {
            businessName,
            shortDescription: row['Short Description'] || '',
            description: row['Long Description']
              ? ({
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'paragraph',
                        version: 1,
                        children: [{ type: 'text', text: row['Long Description'], version: 1 }],
                      },
                    ],
                    direction: 'ltr' as const,
                    format: '' as const,
                    indent: 0,
                    version: 1,
                  },
                } as any)
              : undefined,
            industry: industryIds.length > 0 ? industryIds : undefined,
            investment: {
              min: investment.min,
              max: investment.max,
            },
            isTopPick,
            isFeatured,
            isSponsored,
            status: 'published',
          },
        })

        created++
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        errors.push({
          row: rowNum,
          businessName: row.Franchise || 'Unknown',
          error: errorMessage,
        })
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      created,
      errors,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
