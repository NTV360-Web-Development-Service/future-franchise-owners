import Image from 'next/image'
import Link from 'next/link'
import { Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components'
import { extractBestScore } from '@/lib/franchise'

/**
 * Franchise data type definition
 */
export type Franchise = {
  /** Franchise business name */
  name: string
  /** Business category (e.g., "Food and Beverage") */
  category: string
  /** Franchise description */
  description: string
  /** Required cash investment (formatted string) */
  cashRequired: string // e.g. "$50,000"
  /** Array of feature tags */
  tags: string[] // e.g. ['Low Cost', 'Best Score 88']
  /** Whether franchise is marked as featured */
  isFeatured?: boolean
  /** Whether franchise is sponsored content */
  isSponsored?: boolean
  /** Whether franchise is marked as a top pick */
  isTopPick?: boolean
  /** URL for franchise logo/image */
  imageUrl?: string
  /** Alt text for franchise image */
  imageAlt?: string
}

/**
 * Props interface for the FranchiseCard component
 */
interface FranchiseCardProps {
  /** Franchise data with optional href for linking */
  franchise: Franchise & { href?: string }
  /** Visual variant of the card */
  variant?: 'default' | 'featured' | 'grid'
}

/**
 * FranchiseCard - A reusable card component for displaying franchise information
 * 
 * Features:
 * - Responsive image display with fallback
 * - Franchise name, category, and description
 * - Investment amount and feature tags
 * - Best score extraction and display
 * - Optional linking functionality
 * - Multiple visual variants
 * - Accessibility support
 * 
 * @param props - Component props
 * @returns JSX element containing the franchise card
 */
export default function FranchiseCard({ franchise, variant = 'default' }: FranchiseCardProps) {
  const bestScore = extractBestScore(franchise.tags)

  /**
   * Wrapper component that conditionally renders a Link or div
   * Provides linking functionality when href is present
   */
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (franchise.href) {
      return <Link href={franchise.href}>{children}</Link>
    }
    return <>{children}</>
  }

  return (
    <Card>
      {/* Image: prefer franchise logo, fallback to sample */}
      <Wrapper>
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={franchise.imageUrl || '/images/free-nature-images.jpg'}
            alt={franchise.imageAlt || `${franchise.name} logo`}
            fill
            priority
            className="object-contain bg-white rounded-t-md"
          />
        </div>
      </Wrapper>
      
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <span>
            {franchise.href ? (
              <Link href={franchise.href} className="hover:underline">
                {franchise.name}
              </Link>
            ) : (
              franchise.name
            )}
          </span>
          <div className="flex items-center gap-2">
            {franchise.isSponsored && (
              <Badge variant="secondary">Sponsored</Badge>
            )}
            {(franchise.isFeatured || variant === 'featured') && (
              <Badge variant="secondary">Featured</Badge>
            )}
            {bestScore && (
              <Badge variant="secondary">{`Best Score ${bestScore}`}</Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Badge variant="outline">{franchise.category}</Badge>
          {variant === 'featured' && (
            <span className="text-xs text-muted-foreground">Added recently</span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">{franchise.description}</p>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 border-t">
        <Badge>Cash Required: {franchise.cashRequired}</Badge>
        {franchise.tags.filter(t => !/^Best Score/i.test(t)).map((tag) => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </CardFooter>
    </Card>
  )
}