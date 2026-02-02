'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Gitlab,
  Mail,
  Globe,
  MessageCircle,
  Send,
  Slack,
} from 'lucide-react'

/**
 * X (formerly Twitter) icon component
 */
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

/**
 * Social media icon mapping
 * Maps platform names to their corresponding Lucide icon components
 * @constant
 */
const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: XIcon,
  x: XIcon,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  gitlab: Gitlab,
  mail: Mail,
  globe: Globe,
  discord: MessageCircle,
  telegram: Send,
  slack: Slack,
  whatsapp: MessageCircle,
  tiktok: MessageCircle, // Lucide doesn't have TikTok, using generic
  pinterest: Globe, // Using globe as fallback
  reddit: MessageCircle, // Using message as fallback
  twitch: MessageCircle, // Using message as fallback
}

/**
 * Props interface for the FooterBlock component
 * @interface FooterBlockProps
 */
export interface FooterBlockProps {
  /** Block configuration from Payload CMS */
  block: {
    blockType: 'footer'
    logo?: { url?: string | null } | string | null
    companyName?: string | null
    tagline?: string | null
    copyrightText?: string | null
    showSocialLinks?: boolean | null
    socialLinks?:
      | {
          platform: string
          url: string
        }[]
      | null
    footerColumns?:
      | {
          heading: string
          links: {
            label: string
            url: string
            openInNewTab?: boolean | null
          }[]
        }[]
      | null
    bottomLinks?:
      | {
          label: string
          url: string
        }[]
      | null
    backgroundColor?: string | null
    useGradient?: boolean | null
    gradientFrom?: string | null
    gradientTo?: string | null
    gradientDirection?: string | null
    textColor?: string | null
    backgroundImage?: { url?: string | null } | string | null
    backgroundBlur?: number | null
    overlayColor?: string | null
    overlayOpacity?: number | null
    id?: string | null
    blockName?: string | null
  }
}

/**
 * FooterBlock - A comprehensive footer component with multi-column layout
 *
 * Features:
 * - Company branding with name and tagline
 * - Social media links with icon support
 * - Multi-column navigation links
 * - Bottom bar with copyright and legal links
 * - Customizable colors (background and text)
 * - Responsive grid layout
 * - Accessibility support with proper ARIA labels
 *
 * Supported social platforms:
 * - Facebook, Twitter, Instagram, LinkedIn, YouTube
 * - GitHub, GitLab, Discord, Telegram, Slack
 * - WhatsApp, TikTok, Pinterest, Reddit, Twitch
 * - Email and custom URLs
 *
 * @param {FooterBlockProps} props - Component props
 * @returns {React.ReactElement} Rendered footer element
 */
export default function FooterBlock({ block }: FooterBlockProps) {
  const pathname = usePathname()

  const {
    logo,
    companyName = 'Future Franchise Owners',
    tagline = 'Your partner in franchise success',
    copyrightText,
    showSocialLinks = true,
    socialLinks = [],
    footerColumns = [],
    bottomLinks = [],
    backgroundColor = '#0F172A',
    useGradient = false,
    gradientFrom = '#0F172A',
    gradientTo = '#1E3A5F',
    gradientDirection = 'to-b',
    textColor = '#F1F5F9',
    backgroundImage,
    backgroundBlur = 0,
    overlayColor = '#000000',
    overlayOpacity = 0.6,
  } = block

  // Extract logo URL
  let logoUrl: string | null = null
  if (typeof logo === 'string') {
    logoUrl = logo
  } else if (logo && typeof logo === 'object') {
    logoUrl = logo.url ?? null
  }

  // Extract background image URL
  let backgroundImageUrl: string | null = null
  if (typeof backgroundImage === 'string') {
    backgroundImageUrl = backgroundImage
  } else if (backgroundImage && typeof backgroundImage === 'object') {
    backgroundImageUrl = backgroundImage.url ?? null
  }

  const hasBackgroundImage = !!backgroundImageUrl

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

  const currentYear = new Date().getFullYear()
  const copyright = copyrightText || `© ${currentYear} ${companyName}. All rights reserved.`

  const footerStyle: React.CSSProperties = {
    backgroundColor: hasBackgroundImage ? 'transparent' : backgroundColor || '#0F172A',
    color: textColor || '#F1F5F9',
    fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif",
  }

  // Background image styles with optional blur
  const blurAmount = backgroundBlur ?? 0
  const backgroundImageStyles: React.CSSProperties = hasBackgroundImage
    ? {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
        transform: blurAmount > 0 ? 'scale(1.1)' : undefined,
      }
    : {}

  // Overlay styles
  const overlayStyles: React.CSSProperties = {
    backgroundColor: overlayColor || '#000000',
    opacity: Math.min(Math.max(overlayOpacity ?? 0.6, 0), 0.95),
  }

  return (
    <footer style={footerStyle} className="relative w-full overflow-hidden">
      {/* Background image layer with optional blur */}
      {hasBackgroundImage && (
        <div className="absolute inset-0" style={backgroundImageStyles} aria-hidden="true" />
      )}

      {/* Overlay layer */}
      {hasBackgroundImage && (
        <div className="absolute inset-0" style={overlayStyles} aria-hidden="true" />
      )}

      {/* Solid background color layer when no image */}
      {!hasBackgroundImage && !useGradient && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: backgroundColor || '#0F172A' }}
          aria-hidden="true"
        />
      )}

      {/* Gradient background layer when no image */}
      {!hasBackgroundImage && useGradient && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${
              gradientDirection === 'to-b'
                ? '180deg'
                : gradientDirection === 'to-t'
                  ? '0deg'
                  : gradientDirection === 'to-r'
                    ? '90deg'
                    : gradientDirection === 'to-l'
                      ? '270deg'
                      : gradientDirection === 'to-br'
                        ? '135deg'
                        : gradientDirection === 'to-bl'
                          ? '225deg'
                          : '180deg'
            }, ${gradientFrom || '#0F172A'}, ${gradientTo || '#1E3A5F'})`,
          }}
          aria-hidden="true"
        />
      )}
      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName || 'Logo'}
                className="h-12 w-auto mb-4 object-contain"
              />
            ) : (
              <h3 className="text-2xl font-bold mb-3">{companyName}</h3>
            )}
            {tagline && <p className="text-sm opacity-80 mb-6 max-w-sm">{tagline}</p>}

            {/* Social Links */}
            {showSocialLinks && socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-4 mt-6">
                {socialLinks.map((social, index) => {
                  const IconComponent = SOCIAL_ICONS[social.platform.toLowerCase()] || Globe
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-70 hover:opacity-100 transition-opacity"
                      aria-label={social.platform}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer Columns */}
          {footerColumns && footerColumns.length > 0 && (
            <>
              {footerColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="lg:col-span-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-90">
                    {column.heading}
                  </h4>
                  <ul className="space-y-3">
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.url}
                          target={link.openInNewTab ? '_blank' : undefined}
                          rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                          className={`text-sm transition-opacity inline-block ${
                            isActive(link.url)
                              ? 'opacity-100 font-semibold underline underline-offset-4'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="relative z-10 border-t border-white/10"
        style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm opacity-60">{copyright}</p>

            {/* Bottom Links */}
            {bottomLinks && bottomLinks.length > 0 && (
              <div className="flex flex-wrap gap-6 justify-center md:justify-end">
                {bottomLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    className={`text-sm transition-opacity ${
                      isActive(link.url)
                        ? 'opacity-100 font-semibold underline underline-offset-4'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
