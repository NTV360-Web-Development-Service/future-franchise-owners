import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Future Franchise Owners',
  description: 'Discover your next franchise opportunity',
}

interface RootLayoutProps {
  children: React.ReactNode
}

/**
 * RootLayout - Minimal root layout for Next.js requirement
 * 
 * This layout only provides metadata and passes children through.
 * Individual route groups and pages handle their own HTML structure.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return children
}