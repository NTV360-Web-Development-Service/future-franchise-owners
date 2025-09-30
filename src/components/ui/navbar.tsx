'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from './button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

interface NavbarProps {
  logoUrl?: string | null
  logoAlt?: string | null
  logoWidth?: number
  logoHeight?: number
}

export function Navbar({ logoUrl, logoAlt, logoWidth = 32, logoHeight = 32 }: NavbarProps) {
  const [open, setOpen] = React.useState(false)

  // Close mobile menu when navigating
  React.useEffect(() => {
    const handleRouteChange = () => setOpen(false)
    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
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
                FFO
              </span>
            )}
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-black"
              >
                {link.label}
              </Link>
            ))}
            <Button>{'Apply Now'}</Button>
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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button className="w-full" onClick={() => setOpen(false)}>
                {'Apply Now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
