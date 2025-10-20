import { config as dotenvConfig } from 'dotenv'
import { getPayload } from 'payload'
import { v7 as uuidv7 } from 'uuid'

/**
 * Database seed script for Future Franchise Owners.
 *
 * - Uses UUIDv7 for primary `id` values across all collections
 * - Creates an admin user, sample agents, franchises, and a landing page
 * - Safe to run repeatedly; will re-use the admin user if it already exists
 */

// Load environment variables
dotenvConfig()

/**
 * Run database seeding.
 *
 * Ensures `PAYLOAD_SECRET` is set, initializes Payload with the local config,
 * and populates the database with representative content for development.
 */
const seed = async () => {
  // Ensure the Payload secret exists for local runs; config reads from env
  process.env.PAYLOAD_SECRET =
    process.env.PAYLOAD_SECRET || process.env.NEXT_PUBLIC_PAYLOAD_SECRET || 'dev-secret'

  // Import config AFTER setting env so buildConfig sees the secret
  const payloadConfig = (await import('./payload.config')).default
  const payload = await getPayload({ config: payloadConfig })

  try {
    console.log('🌱 Starting database seeding...')

    /**
     * Create or re-use the seeded admin user.
     * Identified by email `admin@example.com`.
     */
    let user
    try {
      const existingUsers = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: 'admin@example.com',
          },
        },
      })

      if (existingUsers.docs.length > 0) {
        user = existingUsers.docs[0]
        console.log('✅ Using existing admin user')
      } else {
        user = await payload.create({
          collection: 'users',
          data: {
            id: uuidv7(),
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
          },
        })
        console.log('✅ Created admin user')
      }
    } catch (userError) {
      console.log('⚠️ User creation failed, continuing with seeding...')
      // Continue with seeding even if user creation fails
    }

    /**
     * Create sample agents used to associate franchises.
     */
    const agent1 = await payload.create({
      collection: 'agents',
      data: {
        id: uuidv7(),
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        title: 'Senior Franchise Consultant',
        bio: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            direction: null,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                direction: null,
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'John has over 10 years of experience helping entrepreneurs find the perfect franchise opportunity.',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
        specialties: [{ category: 'Fitness' }, { category: 'Health and Wellness' }],
        isActive: true,
      },
    })

    const agent2 = await payload.create({
      collection: 'agents',
      data: {
        id: uuidv7(),
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '(555) 987-6543',
        title: 'Franchise Development Specialist',
        bio: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            direction: null,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                direction: null,
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Sarah specializes in food service and retail franchise opportunities.',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
        specialties: [{ category: 'Food and Beverage' }, { category: 'Home Services' }],
        isActive: true,
      },
    })
    console.log('✅ Created test agents')

    /**
     * Create industries for franchise categorization
     */
    const industryFitness = await payload.create({
      collection: 'industries',
      data: {
        id: uuidv7(),
        name: 'Fitness',
        slug: 'fitness',
        icon: 'Dumbbell',
        description: 'Gym, fitness centers, and wellness businesses',
      },
    })

    const industryFood = await payload.create({
      collection: 'industries',
      data: {
        id: uuidv7(),
        name: 'Food and Beverage',
        slug: 'food-and-beverage',
        icon: 'Coffee',
        description: 'Restaurants, cafes, and food service businesses',
      },
    })

    const industryRetail = await payload.create({
      collection: 'industries',
      data: {
        id: uuidv7(),
        name: 'Retail',
        slug: 'retail',
        icon: 'Store',
        description: 'Retail stores and shops',
      },
    })
    console.log('✅ Created industries')

    /**
     * Create tags for franchise filtering
     */
    const tagLowCost = await payload.create({
      collection: 'tags',
      data: {
        id: uuidv7(),
        name: 'Low Cost',
        slug: 'low-cost',
        type: 'investment',
        description: 'Franchise opportunities with lower initial investment',
      },
    })

    const tagFinancing = await payload.create({
      collection: 'tags',
      data: {
        id: uuidv7(),
        name: 'Financing Available',
        slug: 'financing-available',
        type: 'investment',
        description: 'Franchise offers financing options',
      },
    })

    const tagHomeBased = await payload.create({
      collection: 'tags',
      data: {
        id: uuidv7(),
        name: 'Home Based',
        slug: 'home-based',
        type: 'location',
        description: 'Can be operated from home',
      },
    })

    const tagHighROI = await payload.create({
      collection: 'tags',
      data: {
        id: uuidv7(),
        name: 'High ROI',
        slug: 'high-roi',
        type: 'feature',
        description: 'High return on investment potential',
      },
    })

    const tagQuickStart = await payload.create({
      collection: 'tags',
      data: {
        id: uuidv7(),
        name: 'Quick Start',
        slug: 'quick-start',
        type: 'feature',
        description: 'Can be launched quickly',
      },
    })

    const tagHighDemand = await payload.create({
      collection: 'tags',
      data: {
        id: uuidv7(),
        name: 'High Demand',
        slug: 'high-demand',
        type: 'feature',
        description: 'High market demand',
      },
    })

    const tagRecessionProof = await payload.create({
      collection: 'tags',
      data: {
        id: uuidv7(),
        name: 'Recession Proof',
        slug: 'recession-proof',
        type: 'feature',
        description: 'Resilient in economic downturns',
      },
    })
    console.log('✅ Created tags')

    /**
     * Create sample franchises across categories with investment ranges and tags.
     */
    const franchise1 = await payload.create({
      collection: 'franchises',
      data: {
        id: uuidv7(),
        businessName: 'FitLife Gym',
        status: 'published',
        description: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            direction: null,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                direction: null,
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'A modern fitness franchise offering state-of-the-art equipment and personal training services.',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
        investment: {
          min: 150000,
          max: 300000,
        },
        industry: industryFitness.id,
        tags: [tagLowCost.id, tagFinancing.id],
        assignedAgent: agent1.id,
        isFeatured: true,
        isTopPick: true,
      },
    })

    const franchise2 = await payload.create({
      collection: 'franchises',
      data: {
        id: uuidv7(),
        businessName: 'Healthy Bites Cafe',
        status: 'published',
        description: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            direction: null,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                direction: null,
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'A health-focused cafe franchise serving organic smoothies, salads, and wraps.',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
        investment: {
          min: 75000,
          max: 150000,
        },
        industry: industryFood.id,
        tags: [tagHomeBased.id, tagQuickStart.id],
        assignedAgent: agent2.id,
        isFeatured: true,
        isSponsored: true,
      },
    })

    const franchise3 = await payload.create({
      collection: 'franchises',
      data: {
        id: uuidv7(),
        businessName: 'Senior Care Plus',
        status: 'published',
        description: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            direction: null,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                direction: null,
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Comprehensive senior care services including home health and companionship.',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
        investment: {
          min: 50000,
          max: 100000,
        },
        industry: industryRetail.id, // Using retail as fallback since we don't have a health category
        tags: [tagHighDemand.id, tagRecessionProof.id],
        assignedAgent: agent1.id,
        isTopPick: true,
      },
    })
    console.log('✅ Created test franchises')

    /**
     * Create a sample landing page with Ribbon, Navbar, and Hero blocks.
     * Displays a featured grid of franchises with filters.
     */
    const landingPage = await payload.create({
      collection: 'pages',
      data: {
        id: uuidv7(),
        title: 'Future Franchise Owners',
        slug: 'landing-page',
        layout: [
          {
            blockType: 'ribbon',
            text: 'Special Offer: 50% Off Franchise Fees This Month!',
            backgroundColor: 'blue',
            textColor: 'white',
            link: {
              url: '/opportunities',
              openInNewTab: false,
            },
            dismissible: true,
          },
          {
            blockType: 'navbar',
            logo: {
              text: 'FFO',
            },
            navigationLinks: [
              { label: 'Home', url: '/' },
              { label: 'Opportunities', url: '/opportunities' },
              { label: 'About', url: '/about' },
              { label: 'Contact', url: '/contact' },
            ],
            ctaButton: {
              label: 'Apply Now',
              url: '/apply',
              openInNewTab: false,
            },
          },
          {
            blockType: 'hero',
            heading: 'Find Your Perfect Franchise Opportunity',
            subheading: {
              root: {
                type: 'root',
                format: '',
                indent: 0,
                direction: null,
                version: 1,
                children: [
                  {
                    type: 'paragraph',
                    format: '',
                    indent: 0,
                    direction: null,
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: 'Discover top-rated franchise opportunities across multiple industries. From fitness to food service, find the business that matches your passion and investment goals.',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        version: 1,
                      },
                    ],
                  },
                ],
              },
            },
            cta_buttons: [
              {
                label: 'Browse Opportunities',
                url: '/opportunities',
                style: 'primary',
              },
              {
                label: 'Learn More',
                url: '/about',
                style: 'secondary',
              },
            ],
            tags: [
              { label: 'Low Investment' },
              { label: 'Financing Available' },
              { label: 'Proven Success' },
              { label: 'Full Support' },
            ],
          },
          {
            blockType: 'franchiseGrid',
            heading: 'Featured Franchise Opportunities',
            displayMode: 'automatic',
            showFilters: true,
            onlyFeatured: true,
            limit: 6,
          },
        ],
      },
    })
    console.log('✅ Created landing page')

    console.log('🎉 Database seeding completed successfully!')
    console.log(`Created:
    - 1 admin user
    - 2 agents
    - 3 franchises
    - 1 landing page`)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

seed()
