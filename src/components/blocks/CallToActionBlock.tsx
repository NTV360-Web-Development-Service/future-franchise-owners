import React from 'react'

import { Button } from '@/components'
import type { Media } from '@/types/payload'

/**
 * Configuration for a call-to-action button
 * @interface CTAButtonConfig
 */
type CTAButtonConfig = {
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
 * Props interface for the CallToActionBlock component
 * @interface CallToActionBlockProps
 */
export interface CallToActionBlockProps {
  /** Block configuration from Payload CMS */
  block: {
    blockType: 'callToAction'
    eyebrow?: string | null
    heading?: string | null
    description?: string | null
    alignment?: 'left' | 'center'
    backgroundStyle?: 'color' | 'gradient' | 'image'
    backgroundColor?: string | null
    backgroundGradient?: string | null
    backgroundImage?: string | Media | null
    overlayColor?: string | null
    overlayOpacity?: number | null
    ctas?: CTAButtonConfig[] | null
    smallPrint?: string | null
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
const resolveVariant = (style?: CTAButtonConfig['style']) => {
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
 * Clamps overlay opacity value to a safe range (0-0.95)
 *
 * @param {number | null | undefined} value - The opacity value to clamp
 * @returns {number} Clamped opacity value between 0 and 0.95
 */
const clampOverlay = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0.45
  }

  return Math.min(Math.max(value, 0), 0.95)
}

/**
 * CallToActionBlock - A versatile call-to-action section component
 *
 * Features:
 * - Flexible background options: solid color, gradient, or image
 * - Customizable overlay with adjustable opacity
 * - Multiple CTA buttons with different styles
 * - Optional eyebrow text and small print
 * - Left or center text alignment
 * - Responsive design
 * - Accessibility support
 *
 * Background styles:
 * - Color: Solid background color
 * - Gradient: Linear gradient with customizable stops
 * - Image: Background image with optional overlay
 *
 * @param {CallToActionBlockProps} props - Component props
 * @returns {React.ReactElement} Rendered call-to-action section
 */
export default function CallToActionBlock({ block }: CallToActionBlockProps) {
  const {
    eyebrow,
    heading = 'Ready to explore your franchise future?',
    description = 'Schedule a strategy call with our consultants to uncover opportunities that match your goals, capital, and timeline.',
    alignment = 'center',
    backgroundStyle = 'gradient',
    backgroundColor = '#004AAD',
    backgroundGradient = 'linear-gradient(135deg, #004AAD 0%, #001C40 50%, #000814 100%)',
    backgroundImage,
    overlayColor = '#000000',
    overlayOpacity,
    ctas = [],
    smallPrint,
  } = block

  let backgroundImageUrl: string | null = null
  if (typeof backgroundImage === 'string') {
    backgroundImageUrl = backgroundImage
  } else if (backgroundImage && typeof backgroundImage === 'object') {
    const media = backgroundImage as Media
    backgroundImageUrl = media.url ?? null
  }

  const sectionStyle: React.CSSProperties = {
    fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif",
  }

  if (backgroundStyle === 'color') {
    sectionStyle.backgroundColor = backgroundColor || '#004AAD'
  } else if (backgroundStyle === 'gradient') {
    sectionStyle.backgroundImage =
      backgroundGradient || 'linear-gradient(135deg, #004AAD 0%, #001C40 50%, #000814 100%)'
  } else if (backgroundStyle === 'image' && backgroundImageUrl) {
    sectionStyle.backgroundImage = `url(${backgroundImageUrl})`
    sectionStyle.backgroundSize = 'cover'
    sectionStyle.backgroundPosition = 'center'
  } else {
    sectionStyle.backgroundColor = backgroundColor || '#004AAD'
  }

  const overlayValue = clampOverlay(overlayOpacity)
  const showOverlay = backgroundStyle === 'gradient' || backgroundStyle === 'image'
  const overlayStyles: React.CSSProperties = {
    backgroundColor: overlayColor || '#000000',
    opacity: overlayValue,
  }

  const textAlignment = alignment === 'left' ? 'text-left items-start' : 'text-center items-center'
  const containerAlignment =
    alignment === 'left' ? 'md:items-center md:text-left' : 'md:items-center md:text-center'

  const validCTAs = (ctas || []).filter((cta) => cta && cta.label && cta.url)

  return (
    <section className="relative overflow-hidden" style={sectionStyle} aria-label="Call to action">
      {showOverlay && <div className="absolute inset-0" style={overlayStyles} aria-hidden="true" />}

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div
            className={`mx-auto flex max-w-3xl flex-col gap-6 ${textAlignment} ${containerAlignment}`}
          >
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                {eyebrow}
              </p>
            )}

            {heading && (
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {heading}
              </h2>
            )}

            {description && <p className="text-lg text-white/85">{description}</p>}

            {validCTAs.length > 0 && (
              <div
                className={`mt-4 flex flex-wrap gap-3 ${alignment === 'left' ? 'justify-start' : 'justify-center'}`}
              >
                {validCTAs.map((cta, index) => (
                  <Button
                    key={`${cta.label}-${index}`}
                    asChild
                    size="lg"
                    variant={resolveVariant(cta.style)}
                    className={cta.style ? undefined : 'bg-white text-[#004AAD] hover:bg-white/90'}
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

            {smallPrint && <p className="text-sm text-white/70">{smallPrint}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
