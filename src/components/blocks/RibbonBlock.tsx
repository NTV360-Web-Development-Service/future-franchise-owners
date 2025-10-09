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
    /** Background color theme */
    backgroundColor: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange'
    /** Text color for contrast */
    textColor: 'white' | 'black'
    /** Optional link configuration */
    link?: {
      /** URL to navigate to when clicked */
      url: string
      /** Whether to open link in new tab */
      openInNewTab?: boolean | null
    }
    /** Whether the ribbon can be dismissed by users */
    dismissible?: boolean | null
    /** Unique identifier for the block */
    id?: string | null
    /** Optional block name for admin reference */
    blockName?: string | null
  }
}

/**
 * CSS class mappings for background colors
 */
const backgroundColorClasses = {
  blue: 'bg-blue-600',
  red: 'bg-red-600',
  green: 'bg-green-600',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-600',
  orange: 'bg-orange-600',
}

/**
 * CSS class mappings for text colors
 */
const textColorClasses = {
  white: 'text-white',
  black: 'text-black',
}

/**
 * RibbonBlock - A dismissible announcement banner component
 * 
 * Features:
 * - Scrolling marquee text animation
 * - Customizable background and text colors
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

  const ribbonContent = (
    <div 
      className={`
        relative w-full h-10 overflow-hidden flex items-center
        ${backgroundColorClasses[block.backgroundColor]}
        ${textColorClasses[block.textColor]}
      `}
    >
      <Marquee gradient={false} speed={30} pauseOnHover={true} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <span className="text-sm mr-16 whitespace-nowrap">{block.text}</span>
      </Marquee>
      
      {(block.dismissible ?? true) && (
        <button
          onClick={handleDismiss}
          className={`
            absolute right-4 top-1/2 transform -translate-y-1/2
            ${textColorClasses[block.textColor]}
            hover:opacity-70 transition-opacity z-10
          `}
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