'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Media } from '@/types/payload'

/**
 * Props interface for the NavbarBlock component
 */
interface NavbarBlockProps {
  /** Block configuration from Payload CMS */
  block: {
    /** Optional anchor ID for fragment navigation */
    anchorId?: string | null
    /** Unique identifier for the block */
    id?: string | null
    /** Optional block name for admin reference */
    blockName?: string | null
    /** Block type identifier */
    blockType: 'navbar'
    /** Logo configuration */
    logo?: {
      /** Logo image from media collection or URL */
      image?: string | Media | null
      /** Fallback text if no image is provided */
      text?: string | null
    } | null
    /** Array of navigation menu links */
    navigationLinks: Array<{
      /** Display text for the link */
      label: string
      /** URL path or external link */
      url: string
      /** Optional unique identifier */
      id?: string | null
    }>
    /** Call-to-action button configuration */
    ctaButton: {
      /** Button text */
      label: string
      /** Button URL */
      url: string
      /** Whether to open link in new tab */
      openInNewTab?: boolean | null
    }
  }
}

/**
 * NavbarBlock - A responsive navigation header component
 *
 * Features:
 * - Responsive design with mobile hamburger menu
 * - Logo support (image or text fallback)
 * - Dynamic navigation links from CMS
 * - Call-to-action button
 * - Sticky positioning
 * - Mobile menu with overlay
 *
 * @param props - Component props
 * @returns JSX element containing the navigation header
 */
export default function NavbarBlock({ block }: NavbarBlockProps) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  /**
   * Check if a link is active based on current pathname
   */
  const isActive = (url: string) => {
    // Homepage check
    if (url === '/' && pathname === '/') return true
    // Other pages - exact match or starts with the URL
    if (url !== '/' && pathname.startsWith(url)) return true
    return false
  }

  /**
   * Close mobile menu when navigating
   * Listens for hash changes to automatically close the mobile menu
   */
  React.useEffect(() => {
    const handleRouteChange = () => setOpen(false)
    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])

  /**
   * Extract and process logo information from block data
   * Handles both Media objects and direct URL strings
   */
  let logoUrl: string | null = null
  let logoAlt: string | null = null
  let logoWidth = 32
  let logoHeight = 32

  if (block.logo?.image && typeof block.logo.image === 'object') {
    const logoImage = block.logo.image as Media
    logoUrl = logoImage.url ?? null
    logoAlt = logoImage.alt ?? null
    logoWidth = logoImage.width ?? 32
    logoHeight = logoImage.height ?? 32
  }

  const logoText = block.logo?.text || 'FFO'

  return (
    <header
      className="sticky top-0 z-50 border-b bg-white"
      {...(block.anchorId && { id: block.anchorId })}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 font-semibold">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={logoAlt ?? 'Site logo'}
                width={logoWidth}
                height={logoHeight}
                className="h-10 w-auto rounded"
                priority
              />
            ) : (
              <span className="inline-block rounded bg-black px-2 py-1 text-xs font-bold text-white">
                {logoText}
              </span>
            )}
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {block.navigationLinks.map((link) => (
              <Link
                key={link.id || link.url}
                href={link.url}
                className={`text-sm font-medium transition-colors hover:text-black ${
                  isActive(link.url)
                    ? 'text-black font-semibold border-b-2 border-primary'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={block.ctaButton.url}
              target={block.ctaButton.openInNewTab ? '_blank' : undefined}
              rel={block.ctaButton.openInNewTab ? 'noopener noreferrer' : undefined}
              className="cursor-pointer"
            >
              <Button>{block.ctaButton.label}</Button>
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-2 pb-4 pt-2">
              {block.navigationLinks.map((link) => (
                <Link
                  key={link.id || link.url}
                  href={link.url}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-black ${
                    isActive(link.url)
                      ? 'bg-primary/10 text-black font-semibold border-l-4 border-primary'
                      : 'text-gray-700'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={block.ctaButton.url}
                target={block.ctaButton.openInNewTab ? '_blank' : undefined}
                rel={block.ctaButton.openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              >
                <Button className="w-full">{block.ctaButton.label}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
