import type { Metadata } from 'next'
import { headers } from 'next/headers'
import '../globals.css'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { shouldShowOnPage } from '@/lib'
import { NavbarBlock, FooterBlock } from '@/components/blocks'

/**
 * Application metadata configuration
 * Defines default SEO and meta information for the franchise website
 */
export const metadata: Metadata = {
  title: 'Future Franchise Owners',
  description: 'Discover your next franchise opportunity',
}

/**
 * RootLayoutProps - Props interface for the root layout component
 *
 * @interface RootLayoutProps
 * @property children - React children elements to be rendered within the layout
 */
interface RootLayoutProps {
  children: React.ReactNode
}

/**
 * RootLayout - The root layout component for the entire application
 *
 * This component provides the foundational HTML structure and global styling
 * for all pages in the franchise website. It sets up the document structure,
 * applies global fonts, and ensures consistent layout across the application.
 *
 * Features:
 * - Global font configuration (Inter)
 * - HTML document structure setup
 * - Global CSS imports
 * - Consistent layout wrapper for all pages
 * - Accessibility-friendly HTML structure
 * - Global navbar and footer from CMS settings with page-specific visibility
 *
 * @param props - Component props containing children elements
 * @returns JSX element containing the complete HTML document structure
 */
export default async function RootLayout({ children }: RootLayoutProps) {
  const siteSettings = await getSiteSettings()
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'

  // Extract the slug from pathname (remove leading slash)
  const currentSlug = pathname === '/' ? 'homepage' : pathname.slice(1).split('/')[0]

  // Check if navbar should be visible on this page
  const showNavbar =
    siteSettings?.navbarPublished !== false &&
    siteSettings?.navbar &&
    shouldShowOnPage(
      siteSettings?.navbarVisibility as 'all' | 'include' | 'exclude' | undefined,
      siteSettings?.navbarPages || undefined,
      currentSlug,
    )

  // Check if footer should be visible on this page
  const showFooter =
    siteSettings?.footerPublished !== false &&
    siteSettings?.footer &&
    shouldShowOnPage(
      siteSettings?.footerVisibility as 'all' | 'include' | 'exclude' | undefined,
      siteSettings?.footerPages || undefined,
      currentSlug,
    )

  return (
    <html lang="en">
      <body className="font-sans">
        {/* Global Navbar - Conditionally rendered based on page visibility settings */}
        {showNavbar && siteSettings?.navbar && (
          <NavbarBlock
            block={{
              blockType: 'navbar',
              logo: {
                image: siteSettings.navbar.logo || null,
                text: siteSettings.navbar.logoText || 'FFO',
              },
              navigationLinks: siteSettings.navbar.links || [],
              ctaButton: {
                label: siteSettings.navbar.ctaButton?.label || 'Get Started',
                url: siteSettings.navbar.ctaButton?.url || '/contact',
                openInNewTab: false,
              },
            }}
          />
        )}

        {/* Main Content */}
        <main>{children}</main>

        {/* Global Footer - Conditionally rendered based on page visibility settings */}
        {showFooter && siteSettings?.footer && (
          <FooterBlock
            block={{
              blockType: 'footer',
              companyName: siteSettings.footer.companyName || 'Future Franchise Owners',
              tagline: siteSettings.footer.tagline || 'Your partner in franchise success',
              copyrightText: siteSettings.footer.copyrightText || null,
              showSocialLinks: siteSettings.footer.showSocialLinks ?? true,
              socialLinks: siteSettings.footer.socialLinks || [],
              footerColumns: siteSettings.footer.footerColumns || [],
              bottomLinks: siteSettings.footer.bottomLinks || [],
              backgroundColor: siteSettings.footer.backgroundColor || '#0F172A',
              textColor: siteSettings.footer.textColor || '#F1F5F9',
            }}
          />
        )}
      </body>
    </html>
  )
}
