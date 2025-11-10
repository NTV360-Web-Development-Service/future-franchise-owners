'use client'

import React from 'react'
import Link from 'next/link'
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
    textColor?: string | null
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
  const {
    companyName = 'Future Franchise Owners',
    tagline = 'Your partner in franchise success',
    copyrightText,
    showSocialLinks = true,
    socialLinks = [],
    footerColumns = [],
    bottomLinks = [],
    backgroundColor = '#0F172A',
    textColor = '#F1F5F9',
  } = block

  const currentYear = new Date().getFullYear()
  const copyright = copyrightText || `© ${currentYear} ${companyName}. All rights reserved.`

  const footerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || '#0F172A',
    color: textColor || '#F1F5F9',
    fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif",
  }

  return (
    <footer style={footerStyle} className="w-full">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-bold mb-3">{companyName}</h3>
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
                          className="text-sm opacity-70 hover:opacity-100 transition-opacity inline-block"
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
      <div className="border-t border-white/10" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
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
                    className="text-sm opacity-60 hover:opacity-100 transition-opacity"
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
