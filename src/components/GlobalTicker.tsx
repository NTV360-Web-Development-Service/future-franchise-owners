'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Marquee from 'react-fast-marquee'

type GlobalTickerProps = {
  text: string
  backgroundColor?: string | null
  textColor?: string | null
  fontSize?: number | null
  fontWeight?: string | null
  isMoving?: boolean | null
  speed?: number | null
  textAlign?: 'left' | 'center' | 'right' | null
  link?: {
    url?: string | null
    openInNewTab?: boolean | null
  } | null
  dismissible?: boolean | null
}

export default function GlobalTicker({
  text,
  backgroundColor = '#2563eb',
  textColor = '#ffffff',
  fontSize = 14,
  fontWeight = '400',
  isMoving = true,
  speed = 30,
  textAlign = 'center',
  link,
  dismissible = true,
}: GlobalTickerProps) {
  // Handle null values
  const bgColor = backgroundColor ?? '#2563eb'
  const txtColor = textColor ?? '#ffffff'
  const fSize = fontSize ?? 14
  const fWeight = fontWeight ?? '400'
  const moving = isMoving ?? true
  const spd = speed ?? 30
  const align = textAlign ?? 'center'
  const dismiss = dismissible ?? true
  const [isDismissed, setIsDismissed] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('globalTickerDismissed')
    if (dismissed === 'true') {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('globalTickerDismissed', 'true')
  }

  if (isDismissed) {
    return null
  }

  // Inline styles for custom colors and typography
  const ribbonStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: txtColor,
    fontSize: `${fSize}px`,
    fontWeight: fWeight,
  }

  const textStyle: React.CSSProperties = {
    fontSize: `${fSize}px`,
    fontWeight: fWeight,
  }

  const innerContent = (
    <div className="relative w-full overflow-hidden flex items-center py-2" style={ribbonStyle}>
      {moving ? (
        <Marquee
          gradient={false}
          speed={spd}
          pauseOnHover={true}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <span className="mr-16 whitespace-nowrap" style={textStyle}>
            {text}
          </span>
        </Marquee>
      ) : (
        <div
          className={`w-full px-4 ${
            align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center'
          }`}
          style={textStyle}
        >
          {text}
        </div>
      )}

      {dismiss && (
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity z-10 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          style={{ color: txtColor }}
          aria-label="Dismiss ticker"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )

  // If there's a link, wrap in anchor tag
  if (link?.url) {
    const openInNewTab = link.openInNewTab ?? false
    return (
      <a
        href={link.url}
        target={openInNewTab ? '_blank' : '_self'}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {innerContent}
      </a>
    )
  }

  return innerContent
}
