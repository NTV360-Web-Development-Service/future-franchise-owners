'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import Marquee from 'react-fast-marquee'

interface RibbonBlockProps {
  block: {
    text: string
    backgroundColor: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange'
    textColor: 'white' | 'black'
    link?: {
      url: string
      openInNewTab?: boolean | null
    }
    dismissible?: boolean | null
    id?: string | null
    blockName?: string | null
  }
}

const backgroundColorClasses = {
  blue: 'bg-blue-600',
  red: 'bg-red-600',
  green: 'bg-green-600',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-600',
  orange: 'bg-orange-600',
}

const textColorClasses = {
  white: 'text-white',
  black: 'text-black',
}

export function RibbonBlock({ block }: RibbonBlockProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

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