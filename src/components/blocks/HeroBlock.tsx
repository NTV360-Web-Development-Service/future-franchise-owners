import { Button, Badge } from '@/components'

/**
 * Props interface for the HeroBlock component
 */
interface HeroBlockComponentProps {
  /** Block configuration from Payload CMS */
  block: {
    /** Block type identifier */
    blockType: 'hero'
    /** Main heading text */
    heading: string
    /** Rich text subheading from Payload CMS */
    subheading: any // Rich text from Payload
    /** Hero background image */
    image?:
      | {
          /** Image URL */
          url?: string | null
          /** Image alt text for accessibility */
          alt?: string
          /** Additional Media fields from Payload */
          [key: string]: any
        }
      | string
      | null
    /** Whether to render the dark overlay */
    showOverlay?: boolean | null
    /** Whether to apply blur to the overlay */
    backgroundBlur?: boolean | null
    /** Call-to-action buttons array */
    cta_buttons?:
      | {
          /** Button text */
          label: string
          /** Button URL */
          url: string
          /** Button style variant */
          style?: 'primary' | 'secondary'
        }[]
      | null
    /** Feature tags/badges to display */
    tags?:
      | {
          /** Tag text */
          label: string
        }[]
      | null
    /** Unique identifier for the block */
    id?: string | null
    /** Optional block name for admin reference */
    blockName?: string | null
  }
}

/**
 * HeroBlock - A prominent hero section component for landing pages
 *
 * Features:
 * - Large heading and subheading text
 * - Background image support with overlay
 * - Multiple call-to-action buttons
 * - Feature tags/badges
 * - Rich text content parsing
 * - Responsive design
 * - Accessibility support
 *
 * @param props - Component props
 * @returns JSX element containing the hero section
 */
export default function HeroBlock({ block }: HeroBlockComponentProps) {
  /**
   * Extract plain text content from Payload's rich text format
   * Recursively processes the rich text structure to extract readable text
   *
   * @param richText - Rich text object from Payload CMS
   * @returns Plain text string
   */
  const getTextFromRichText = (richText: any): string => {
    if (!richText?.root?.children) return ''

    return richText.root.children
      .map((child: any) => {
        if (child.children) {
          return child.children
            .filter((item: any) => item.type === 'text')
            .map((item: any) => item.text)
            .join('')
        }
        return ''
      })
      .join(' ')
  }

  const subheadingText = getTextFromRichText(block.subheading)

  let backgroundImageUrl = '/images/hero-bg.avif'
  if (typeof block.image === 'string' && block.image.trim().length > 0) {
    backgroundImageUrl = block.image
  } else if (block.image && typeof block.image === 'object') {
    backgroundImageUrl = block.image.url ?? backgroundImageUrl
  }

  const showOverlay = block.showOverlay ?? true
  const backgroundBlur = block.backgroundBlur ?? true
  const overlayClasses = backgroundBlur
    ? 'absolute inset-0 bg-black/70 backdrop-blur-md'
    : 'absolute inset-0 bg-black/60'

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif",
        backgroundImage: `url(${backgroundImageUrl})`,
      }}
      aria-label="Hero"
    >
      {/* Brand gradient overlay for readability */}
      {showOverlay && <div className={overlayClasses} />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow / tagline placeholder (optional) */}
          {/* <p className="text-sm font-medium text-blue-200">Discover the best franchises</p> */}

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md text-balance">
            {block.heading}
          </h1>

          {subheadingText && (
            <p className="mt-6 text-lg sm:text-xl text-white/80">{subheadingText}</p>
          )}

          {/* CTAs */}
          {block.cta_buttons && block.cta_buttons.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {block.cta_buttons.map((button, index) => (
                <Button
                  key={index}
                  asChild
                  size="lg"
                  className={`px-8 ${
                    button.style === 'secondary'
                      ? 'bg-white text-[#004AAD] hover:bg-white/90'
                      : 'bg-[#004AAD] text-white hover:bg-[#003a89]'
                  }`}
                >
                  <a href={button.url}>{button.label}</a>
                </Button>
              ))}
            </div>
          )}

          {/* Tags / badges */}
          {block.tags && block.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {block.tags.map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-white/10 text-white border-white/30"
                  variant="outline"
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
