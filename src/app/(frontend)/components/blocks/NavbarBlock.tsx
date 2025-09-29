'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Media } from '@/types/payload'

interface NavbarBlockProps {
  block: {
    id?: string | null
    blockName?: string | null
    blockType: 'navbar'
    logo?: {
      image?: string | Media | null
      text?: string | null
    } | null
    navigationLinks: Array<{
      label: string
      url: string
      id?: string | null
    }>
    ctaButton: {
      label: string
      url: string
      openInNewTab?: boolean | null
    }
  }
}

export function NavbarBlock({ block }: NavbarBlockProps) {
  const [open, setOpen] = React.useState(false)

  // Close mobile menu when navigating
  React.useEffect(() => {
    const handleRouteChange = () => setOpen(false)
    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])

  // Extract logo information
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
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
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
                className="text-sm font-medium text-gray-700 transition-colors hover:text-black"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={block.ctaButton.url}
              target={block.ctaButton.openInNewTab ? '_blank' : undefined}
              rel={block.ctaButton.openInNewTab ? 'noopener noreferrer' : undefined}
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
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
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