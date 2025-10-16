import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { v7 as uuidv7 } from 'uuid'
import jwt from 'jsonwebtoken'
export const runtime = 'nodejs'

// Define valid categories based on the Franchises collection
const VALID_CATEGORIES = [
  'Fitness',
  'Food and Beverage',
  'Health and Wellness',
  'Home Services',
  'Senior Care',
  'Sports',
] as const

type ValidCategory = (typeof VALID_CATEGORIES)[number]

interface CSVRow {
  businessName: string
  description: string
  category: string
  tags: string
  minInvestment: string
  maxInvestment: string
  agentEmail: string
  isFeatured: string
  isSponsored: string
  isTopPick: string
  status: string
}

interface ImportResult {
  success: boolean
  created: number
  errors: Array<{
    row: number
    businessName: string
    error: string
  }>
}

// Security limits
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const MAX_ROWS = 500

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const config = await configPromise
    const payload = await getPayload({ config })

    // Enforce same-origin and CSRF (defense-in-depth; middleware also enforces)
    const expectedOrigin = (request as any).nextUrl?.origin || ''
    const originHeader = request.headers.get('origin') || ''
    const refererHeader = request.headers.get('referer') || ''
    const isSameOrigin =
      expectedOrigin &&
      (originHeader === expectedOrigin || refererHeader.startsWith(expectedOrigin))
    if (!isSameOrigin) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }

    // Authentication check using PayloadCMS token
    const token =
      request.cookies.get('payload-token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      console.warn('Unauthorized import attempt - missing authentication token')
      return NextResponse.json(
        {
          error: 'Authentication required. Please log in to PayloadCMS admin to import franchises.',
        },
        { status: 401 },
      )
    }

    // CSRF validation when using cookie-based auth (Authorization header is not auto-sent by browsers)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      const csrfCookie = request.cookies.get('csrf-token')?.value
      const csrfHeader = request.headers.get('x-csrf-token')
      if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 })
      }
    }

    // Verify the token and get user information using PayloadCMS Local API
    let user
    try {
      console.log('🔐 Starting authentication process...')
      console.log('🔑 Token received:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN')
      console.log('🔒 PAYLOAD_SECRET available:', !!process.env.PAYLOAD_SECRET)
      console.log('🌍 Environment:', process.env.NODE_ENV)

      if (!process.env.PAYLOAD_SECRET) {
        throw new Error('PAYLOAD_SECRET environment variable is not configured')
      }

      // Decode the JWT token to get user information
      const decoded = jwt.verify(token, process.env.PAYLOAD_SECRET) as any
      console.log('✅ JWT decoded successfully:', {
        id: decoded?.id,
        email: decoded?.email,
        collection: decoded?.collection,
      })

      if (!decoded || !decoded.id) {
        throw new Error('Invalid token structure - missing ID')
      }

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000)
      if (decoded.exp && now > decoded.exp) {
        throw new Error('Token has expired')
      }

      console.log('🔍 Looking up user with ID:', decoded.id)

      // Find the user using PayloadCMS Local API
      const userDoc = await payload.findByID({
        collection: 'users',
        id: decoded.id,
      })

      console.log(
        '👤 User lookup result:',
        userDoc ? `Found user: ${userDoc.email}` : 'User not found',
      )

      if (!userDoc) {
        throw new Error('User not found in database')
      }

      user = userDoc
      console.log('✅ Authentication successful for user:', user.email)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error'
      console.error('❌ Authentication failed:', {
        error: errorMessage,
        tokenPresent: !!token,
        secretPresent: !!process.env.PAYLOAD_SECRET,
        environment: process.env.NODE_ENV,
        isJWTError:
          errorMessage.includes('signature') ||
          errorMessage.includes('malformed') ||
          errorMessage.includes('expired'),
      })

      // Fallback: validate via PayloadCMS REST using the incoming cookie on same-origin
      try {
        const cookieHeader = request.headers.get('cookie') || ''
        const authHeader = request.headers.get('authorization') || ''
        const origin = request.nextUrl.origin
        console.log('🛟 Attempting fallback auth via /api/users/me', {
          origin,
          hasCookie: !!cookieHeader,
          hasAuth: !!authHeader,
        })

        const meRes = await fetch(`${origin}/api/users/me`, {
          headers: {
            // forward the cookie and authorization exactly as received
            cookie: cookieHeader,
            authorization: authHeader,
          },
          cache: 'no-store',
        })

        if (meRes.ok) {
          const meData = await meRes.json()
          if (meData?.user?.email) {
            user = meData.user
            console.log('✅ Fallback auth succeeded via /api/users/me:', user.email)
          } else {
            throw new Error('Fallback /api/users/me returned no user')
          }
        } else {
          throw new Error(`Fallback /api/users/me failed: ${meRes.status}`)
        }
      } catch (fallbackError) {
        const fbMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError)

        // Provide more specific error messages
        let userErrorMessage = 'Invalid authentication. Please log in again to PayloadCMS admin.'
        if (errorMessage.includes('signature')) {
          userErrorMessage =
            'Authentication token signature mismatch. Please log in again to PayloadCMS admin.'
        } else if (errorMessage.includes('expired')) {
          userErrorMessage =
            'Authentication token has expired. Please log in again to PayloadCMS admin.'
        } else if (errorMessage.includes('PAYLOAD_SECRET')) {
          userErrorMessage = 'Server configuration error. Please contact administrator.'
        }

        console.error('❌ Fallback auth failed:', fbMsg)
        return NextResponse.json({ error: userErrorMessage }, { status: 401 })
      }
    }

    // Log the import attempt for audit purposes
    console.log(`Franchise import initiated by user: ${user.email} (ID: ${user.id})`)

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Enforce file size limit
    if (typeof file.size === 'number' && file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB` },
        { status: 413 },
      )
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 })
    }

    // Read and parse CSV
    const text = await file.text()
    const lines = text.split('\n').filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV must contain at least a header and one data row' },
        { status: 400 },
      )
    }

    // Enforce row count limit
    if (lines.length - 1 > MAX_ROWS) {
      return NextResponse.json(
        { error: `Too many rows. Max ${MAX_ROWS} data rows allowed` },
        { status: 413 },
      )
    }

    // Function to parse CSV line with proper quote handling
    function parseCSVLine(line: string): string[] {
      const result: string[] = []
      let current = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }

      result.push(current.trim())
      return result
    }

    // Parse header
    const header = parseCSVLine(lines[0])
    const expectedHeaders = [
      'businessName',
      'description',
      'category',
      'tags',
      'minInvestment',
      'maxInvestment',
      'agentEmail',
      'isFeatured',
      'isSponsored',
      'isTopPick',
      'status',
    ]

    // Validate headers
    const missingHeaders = expectedHeaders.filter((h) => !header.includes(h))
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `Missing required headers: ${missingHeaders.join(', ')}` },
        { status: 400 },
      )
    }

    const result: ImportResult = {
      success: true,
      created: 0,
      errors: [],
    }

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      const rowData = parseCSVLine(lines[i])

      if (rowData.length !== header.length) {
        result.errors.push({
          row: i + 1,
          businessName: rowData[0] || 'Unknown',
          error: 'Invalid number of columns',
        })
        continue
      }

      // Create row object
      const row: CSVRow = {} as CSVRow
      header.forEach((h, index) => {
        row[h as keyof CSVRow] = rowData[index] || ''
      })

      try {
        // Validate required fields
        if (!row.businessName) {
          throw new Error('Business name is required')
        }

        if (!row.description) {
          throw new Error('Description is required')
        }

        if (!row.category || !VALID_CATEGORIES.includes(row.category as ValidCategory)) {
          throw new Error(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`)
        }

        const category: ValidCategory = row.category as ValidCategory
        // Validate investment amounts
        const minInvestment = parseFloat(row.minInvestment)
        const maxInvestment = parseFloat(row.maxInvestment)

        if (isNaN(minInvestment) || minInvestment < 0) {
          throw new Error('Min investment must be a valid positive number')
        }

        if (isNaN(maxInvestment) || maxInvestment < 0) {
          throw new Error('Max investment must be a valid positive number')
        }

        if (maxInvestment < minInvestment) {
          throw new Error('Max investment must be greater than or equal to min investment')
        }

        // Find agent by email
        let assignedAgent = null
        if (row.agentEmail) {
          const agents = await payload.find({
            collection: 'agents',
            where: {
              email: {
                equals: row.agentEmail,
              },
            },
            limit: 1,
          })

          if (agents.docs.length === 0) {
            throw new Error(`Agent with email ${row.agentEmail} not found`)
          }

          assignedAgent = agents.docs[0].id
        }

        // Parse tags - convert to array of objects with label property
        const tags = row.tags
          ? row.tags
              .split(';')
              .map((tag) => ({ label: tag.trim() }))
              .filter((tag) => tag.label)
          : []

        // Parse boolean fields
        const isFeatured = row.isFeatured?.toLowerCase() === 'true'
        const isSponsored = row.isSponsored?.toLowerCase() === 'true'
        const isTopPick = row.isTopPick?.toLowerCase() === 'true'

        // Validate status
        const validStatuses = ['draft', 'published', 'archived'] as const
        const status: 'draft' | 'published' | 'archived' =
          row.status && validStatuses.includes(row.status as any)
            ? (row.status as 'draft' | 'published' | 'archived')
            : 'draft'
        if (!validStatuses.includes(status)) {
          throw new Error(`Status must be one of: ${validStatuses.join(', ')}`)
        }

        // Create slug from business name
        const slug = row.businessName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')

        // Create franchise
        await payload.create({
          collection: 'franchises',
          data: {
            id: uuidv7(),
            businessName: row.businessName,
            slug,
            status,
            isFeatured,
            isSponsored,
            isTopPick,
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: row.description,
                        version: 1,
                      },
                    ],
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
            category,
            tags,
            investment: {
              min: minInvestment,
              max: maxInvestment,
            },
            assignedAgent,
            useMainContact: !assignedAgent,
          },
        })

        result.created++
      } catch (error) {
        result.errors.push({
          row: i + 1,
          businessName: row.businessName || 'Unknown',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    if (result.errors.length > 0) {
      result.success = false
    }

    // Log the import results for audit purposes
    console.log(
      `Franchise import completed by user: ${user.email} (ID: ${user.id}) - Created: ${result.created}, Errors: ${result.errors.length}`,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
