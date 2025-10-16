import React from 'react'
import Link from 'next/link'

export interface FooterBlockProps {
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
          icon?: string | null
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
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 transition-opacity"
                    aria-label={social.platform}
                  >
                    {social.icon ? (
                      <span className="text-xl">{social.icon}</span>
                    ) : (
                      <span className="text-sm font-medium">{social.platform}</span>
                    )}
                  </a>
                ))}
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
