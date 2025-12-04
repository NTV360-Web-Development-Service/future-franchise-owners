import type { Metadata } from 'next'
import Script from 'next/script'
import '../globals.css'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { GlobalNavbarFooter } from '@/components/GlobalNavbarFooter'
import { generateOrganizationSchema } from '@/lib/schema'
import { CartProvider } from '@/contexts/CartContext'
import { FloatingCartButton } from '@/components/cart/FloatingCartButton'
import GlobalTicker from '@/components/GlobalTicker'
import { PageTransition } from '@/components/PageTransition'

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

  return (
    <html lang="en">
      <body className="font-sans">
        <CartProvider>
          <PageTransition>
            {/* Organization Schema for SEO */}
            <Script
              id="organization-schema"
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(generateOrganizationSchema()),
              }}
            />

            {/* Global Ticker - Shows above everything when enabled */}
            {siteSettings?.tickerEnabled && siteSettings?.ticker?.text && (
              <GlobalTicker
                text={siteSettings.ticker.text}
                backgroundColor={siteSettings.ticker.backgroundColor}
                textColor={siteSettings.ticker.textColor}
                fontSize={siteSettings.ticker.fontSize}
                fontWeight={siteSettings.ticker.fontWeight}
                isMoving={siteSettings.ticker.isMoving}
                speed={siteSettings.ticker.speed}
                textAlign={siteSettings.ticker.textAlign}
                link={siteSettings.ticker.link}
                dismissible={siteSettings.ticker.dismissible}
              />
            )}

            {/* Global Navbar - Client component that reacts to route changes */}
            <GlobalNavbarFooter siteSettings={siteSettings} position="navbar" />

            {/* Main Content */}
            <main>{children}</main>

            {/* Global Footer - Client component that reacts to route changes */}
            <GlobalNavbarFooter siteSettings={siteSettings} position="footer" />

            {/* Floating Cart Button - Fixed bottom right (conditionally rendered) */}
            {siteSettings?.enableCart !== false && <FloatingCartButton />}
          </PageTransition>
        </CartProvider>
      </body>
    </html>
  )
}
