import React from 'react'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

import { Button } from '@/components'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import type { Media } from '@/types/payload'

/**
 * Configuration for a call-to-action button
 */
interface CTAConfig {
  /** Button text */
  label: string
  /** Button URL */
  url: string
  /** Button style variant */
  style?: 'primary' | 'secondary' | 'outline' | 'ghost'
  /** Whether to open link in new tab */
  openInNewTab?: boolean | null
}

/**
 * Configuration for a highlight/feature item
 * @interface HighlightItem
 */
interface HighlightItem {
  /** Highlight title */
  title?: string | null
  /** Highlight description */
  description?: string | null
  /** Unique identifier */
  id?: string | null
}

/**
 * Props interface for the AboutTeaserBlock component
 * @interface AboutTeaserBlockProps
 */
export interface AboutTeaserBlockProps {
  /** Block configuration from Payload CMS */
  block: {
    blockType: 'aboutTeaser'
    eyebrow?: string | null
    heading?: string | null
    description?: any
    highlights?: HighlightItem[] | null
    ctas?: CTAConfig[] | null
    image?: string | Media | null
    showSideCard?: boolean | null
    sideCardEyebrow?: string | null
    sideCardHeading?: string | null
    sideCardDescription?: string | null
    anchorId?: string | null
    id?: string | null
    blockName?: string | null
  }
}

/**
 * Resolves button style to shadcn/ui button variant
 *
 * Maps CMS button style values to the corresponding shadcn/ui button variants.
 *
 * @param style - The button style from CMS ('primary', 'secondary', 'outline', 'ghost')
 * @returns The corresponding button variant for shadcn/ui
 */
const resolveVariant = (style?: CTAConfig['style']) => {
  switch (style) {
    case 'secondary':
      return 'secondary' as const
    case 'outline':
      return 'outline' as const
    case 'ghost':
      return 'ghost' as const
    default:
      return 'default' as const
  }
}

/**
 * AboutTeaserBlock - A two-column about/feature section component
 *
 * Features:
 * - Two-column responsive layout (text + image)
 * - Eyebrow text, heading, and description
 * - Highlight items with checkmark icons
 * - Multiple CTA buttons with different styles
 * - Image support with fallback content card
 * - Gradient background effects
 * - Responsive design
 * - Accessibility support
 *
 * Layout:
 * - Left column: Text content with highlights and CTAs
 * - Right column: Image or decorative content card
 *
 * @param {AboutTeaserBlockProps} props - Component props
 * @returns {React.ReactElement} Rendered about teaser section
 */
const AboutTeaserBlock: React.FC<AboutTeaserBlockProps> = ({ block }) => {
  const {
    eyebrow = 'About Future Franchise Owners',
    heading = 'Seasoned franchise experts guiding your journey',
    description = 'We combine decades of franchise ownership, coaching, and operations experience to help entrepreneurs make confident, informed decisions. From fit assessments to long-term growth planning, our consultants stay by your side at every stage.',
    highlights = [],
    ctas = [],
    image,
    showSideCard = true,
    sideCardEyebrow,
    sideCardHeading,
    sideCardDescription,
  } = block

  let imageUrl: string | null = null
  let imageAlt: string | null = null
  let imageWidth = 640
  let imageHeight = 640

  if (typeof image === 'string') {
    imageUrl = image
  } else if (image && typeof image === 'object') {
    const media = image as Media
    imageUrl = media.url ?? null
    imageAlt = media.alt ?? null
    imageWidth = media.width ?? imageWidth
    imageHeight = media.height ?? imageHeight
  }

  const highlightItems = (highlights || []).filter(
    (item) => item && (item.title || item.description),
  )
  const ctaList = (ctas || []).filter((cta) => cta && cta.label && cta.url)
  const altText: string = imageAlt ?? heading ?? 'Future Franchise Owners consultants'

  return (
    <section className="bg-slate-50 py-16" {...(block.anchorId && { id: block.anchorId })}>
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
          showSideCard
            ? 'grid gap-12 lg:grid-cols-[minmax(0,_1fr)_minmax(320px,_420px)] lg:items-center lg:gap-16'
            : ''
        }`}
      >
        <div>
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#004AAD]">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {heading}
          </h2>

          {description && (
            <div className="mt-6 text-lg text-gray-600">
              <RichTextRenderer content={description} />
            </div>
          )}

          {highlightItems.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {highlightItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00A1E4]"
                    aria-hidden="true"
                  />
                  <div>
                    {item.title && <p className="font-semibold text-gray-900">{item.title}</p>}
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {ctaList.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {ctaList.map((cta, index) => (
                <Button
                  key={`${cta.label}-${index}`}
                  asChild
                  size="lg"
                  variant={resolveVariant(cta.style)}
                  className={index === 0 ? 'shadow-sm' : undefined}
                >
                  <a
                    href={cta.url}
                    target={cta.openInNewTab ? '_blank' : '_self'}
                    rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
                  >
                    {cta.label}
                  </a>
                </Button>
              ))}
            </div>
          )}
        </div>

        {showSideCard && (
          <div className="relative">
            <div
              className="absolute -inset-x-6 -inset-y-8 rounded-3xl bg-[#004AAD]/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#004AAD] via-[#00264D] to-[#001633] p-6 text-white shadow-xl">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={altText}
                  width={imageWidth}
                  height={imageHeight}
                  className="aspect-square w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full flex-col justify-between rounded-2xl bg-white/5 p-6">
                  <div>
                    {sideCardEyebrow && (
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
                        {sideCardEyebrow}
                      </p>
                    )}
                    {sideCardHeading && (
                      <p className="mt-4 text-2xl font-semibold">{sideCardHeading}</p>
                    )}
                  </div>
                  {sideCardDescription && (
                    <p className="text-sm text-white/70">{sideCardDescription}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AboutTeaserBlock
