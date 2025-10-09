import type { Metadata } from 'next'
import '../globals.css'

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
 * 
 * @param props - Component props containing children elements
 * @returns JSX element containing the complete HTML document structure
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
