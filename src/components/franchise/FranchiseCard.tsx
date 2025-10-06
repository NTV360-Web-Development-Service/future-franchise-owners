import Image from 'next/image'
import Link from 'next/link'
import { Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components'
import { extractBestScore } from '@/lib/franchise'

/**
 * Franchise data passed to card views.
 *
 * Represents the subset of franchise fields used for listing cards,
 * including optional agent info when a consultant is assigned.
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
  /** If true, force use main contact and hide agent display */
  useMainContact?: boolean
  /** URL for franchise logo/image */
  imageUrl?: string
  /** Alt text for franchise image */
  imageAlt?: string
  /** Assigned agent display name */
  agentName?: string
  /** Assigned agent title */
  agentTitle?: string
  /** Assigned agent photo URL */
  agentPhotoUrl?: string
}

/**
 * Props for the FranchiseCard component.
 *
 * @property franchise - Franchise data to render. May include `href` for linking.
 * @property variant - Visual variant for card styling.
 */
interface FranchiseCardProps {
  /** Franchise data with optional href for linking */
  franchise: Franchise & { href?: string }
  /** Visual variant of the card */
  variant?: 'default' | 'featured' | 'grid'
}

/**
 * FranchiseCard component.
 *
 * Renders a franchise listing card with logo, name, category, summary,
 * cash requirements, tags, and optional assigned agent details.
 *
 * @param props - Component props containing franchise data and optional variant.
 * @returns JSX element containing the franchise card.
 */
export default function FranchiseCard({ franchise, variant = 'default' }: FranchiseCardProps) {
  const bestScore = extractBestScore(franchise.tags)

  /**
   * Wrapper that conditionally renders a Next.js Link when `href` is present.
   *
   * @param props.children - Card content to wrap.
   */
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (franchise.href) {
      return <Link href={franchise.href}>{children}</Link>
    }
    return <>{children}</>
  }

  return (
    <Card className="h-full flex flex-col">
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
      
      <CardContent className="pt-4 flex-1">
        <p
          className="text-sm text-muted-foreground"
          style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {franchise.description}
        </p>
        {/* Assigned Agent display below description */}
        {franchise.agentName && !franchise.useMainContact && (
          <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
            {franchise.agentPhotoUrl ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={franchise.agentPhotoUrl}
                  alt={`${franchise.agentName} photo`}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-[10px] font-medium text-gray-600">
                  {franchise.agentName?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="font-medium">{franchise.agentName}</span>
            {franchise.agentTitle && <span className="text-muted-foreground">{franchise.agentTitle}</span>}
          </div>
        )}
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