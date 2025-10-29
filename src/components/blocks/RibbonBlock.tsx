'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import Marquee from 'react-fast-marquee'

/**
 * Props interface for the RibbonBlock component
 */
interface RibbonBlockProps {
  /** Block configuration from Payload CMS */
  block: {
    /** Text content to display in the ribbon */
    text: string
    /** Background color (hex code) */
    backgroundColor: string
    /** Text color (hex code) */
    textColor: string
    /** Font size in pixels */
    fontSize?: number | null
    /** Font weight (CSS font-weight value) */
    fontWeight?: string | null
    /** Whether the text should scroll/animate */
    isMoving?: boolean | null
    /** Animation speed (only applies when isMoving is true) */
    speed?: number | null
    /** Text alignment when static (only applies when isMoving is false) */
    textAlign?: 'left' | 'center' | 'right' | null
    /** Optional link configuration */
    link?: {
      /** URL to navigate to when clicked */
      url: string
      /** Whether to open link in new tab */
      openInNewTab?: boolean | null
    }
    /** Whether the ribbon can be dismissed by users */
    dismissible?: boolean | null
    /** Optional anchor ID for fragment navigation */
    anchorId?: string | null
    /** Unique identifier for the block */
    id?: string | null
    /** Optional block name for admin reference */
    blockName?: string | null
  }
}

/**
 * RibbonBlock - A highly customizable announcement banner component
 *
 * Features:
 * - Scrolling marquee text animation (optional)
 * - Custom hex color pickers for text and background
 * - Adjustable font size and weight
 * - Configurable animation speed
 * - Text alignment options for static ribbons
 * - Optional click-through links
 * - Dismissible functionality with close button
 * - Responsive design
 * - Smooth animations
 *
 * @param props - Component props
 * @returns JSX element containing the ribbon banner or null if dismissed
 */
export default function RibbonBlock({ block }: RibbonBlockProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  /**
   * Handle ribbon dismissal
   * Sets the ribbon as not visible, effectively removing it from the DOM
   */
  const handleDismiss = () => {
    setIsVisible(false)
  }

  // Extract configuration with defaults
  const fontSize = block.fontSize ?? 14
  const fontWeight = block.fontWeight ?? '400'
  const isMoving = block.isMoving ?? true
  const speed = block.speed ?? 30
  const textAlign = block.textAlign ?? 'center'

  // Inline styles for custom colors and typography
  const ribbonStyle: React.CSSProperties = {
    backgroundColor: block.backgroundColor,
    color: block.textColor,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
  }

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
  }

  const ribbonContent = (
    <div
      className="relative w-full overflow-hidden flex items-center py-2"
      style={ribbonStyle}
      {...(block.anchorId && { id: block.anchorId })}
    >
      {isMoving ? (
        <Marquee
          gradient={false}
          speed={speed}
          pauseOnHover={true}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <span className="mr-16 whitespace-nowrap" style={textStyle}>
            {block.text}
          </span>
        </Marquee>
      ) : (
        <div
          className={`w-full px-4 ${
            textAlign === 'left'
              ? 'text-left'
              : textAlign === 'right'
                ? 'text-right'
                : 'text-center'
          }`}
          style={textStyle}
        >
          {block.text}
        </div>
      )}

      {(block.dismissible ?? true) && (
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity z-10"
          style={{ color: block.textColor }}
          aria-label="Dismiss ribbon"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )

  if (block.link) {
    const openInNewTab = block.link.openInNewTab ?? false
    return (
      <a
        href={block.link.url}
        target={openInNewTab ? '_blank' : '_self'}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {ribbonContent}
      </a>
    )
  }

  return ribbonContent
}
