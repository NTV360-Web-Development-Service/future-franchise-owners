/**
 * @fileoverview FranchiseCard Component
 *
 * A reusable card component for displaying franchise business information
 * in grid layouts, featured sections, and listing pages. Supports multiple
 * variants and includes agent assignment display capabilities.
 *
 * @module Components/Franchise/FranchiseCard
 * @version 1.0.0
 */

import Image from 'next/image'
import Link from 'next/link'
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  LucideIcon,
} from '@/components'
import { extractBestScore } from '@/lib/franchise'

/**
 * Franchise data interface for card display
 *
 * Represents the subset of franchise fields used for listing cards,
 * including optional agent info when a consultant is assigned.
 * This interface defines the minimum required data for rendering
 * a franchise card component.
 *
 * @interface Franchise
 */
export type Franchise = {
  /** Franchise business name */
  name: string
  /** Business category (e.g., "Food and Beverage") */
  category: string
  /** Optional Lucide icon name for the category */
  categoryIcon?: string
  /** Franchise description */
  description: string
  /** Required cash investment (formatted string) */
  cashRequired: string // e.g. "$50,000"
  /** Array of feature tags with optional colors */
  tags: Array<{ name: string; color?: string; textColor?: string }> // e.g. [{name: 'Low Cost', color: '#004AAD', textColor: '#ffffff'}]
  /** Optional link to franchise detail page */
  href?: string
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
  /** Date when franchise was last updated */
  updatedAt?: string
  /** Date when franchise was created */
  createdAt?: string
}

/**
 * Props interface for the FranchiseCard component
 *
 * Defines the required and optional properties for rendering a franchise card.
 * Extends the base Franchise interface with optional href for navigation.
 *
 * @interface FranchiseCardProps
 * @property {Franchise & { href?: string }} franchise - Franchise data to render with optional navigation link
 * @property {'default' | 'featured' | 'grid'} [variant='default'] - Visual variant for card styling
 */
interface FranchiseCardProps {
  /** Franchise data with optional href for linking */
  franchise: Franchise & { href?: string }
  /** Visual variant of the card */
  variant?: 'default' | 'featured' | 'grid'
}

/**
 * FranchiseCard Component
 *
 * A comprehensive card component for displaying franchise business information.
 * Renders franchise details including logo, business name, category, description,
 * investment requirements, feature tags, and assigned agent information.
 *
 * Features:
 * - Responsive image display with fallback
 * - Conditional navigation linking
 * - Multiple visual variants
 * - Agent assignment display
 * - Feature badges (sponsored, featured, best score)
 * - Investment and tag information
 * - Accessible markup structure
 *
 * @param {FranchiseCardProps} props - Component props containing franchise data and styling options
 * @returns {JSX.Element} Rendered franchise card component
 *
 * @example
 * ```tsx
 * <FranchiseCard
 *   franchise={{
 *     name: "Example Franchise",
 *     category: "Food and Beverage",
 *     description: "A great franchise opportunity",
 *     cashRequired: "$50,000",
 *     tags: ["Low Cost", "Best Score 88"],
 *     href: "/franchises/example-franchise"
 *   }}
 *   variant="featured"
 * />
 * ```
 */
export default function FranchiseCard({ franchise, variant = 'default' }: FranchiseCardProps) {
  // Extract tag names for best score calculation
  const tagNames = franchise.tags.map((t) => t.name)
  const bestScore = extractBestScore(tagNames)

  // Limit number of visible tags
  const MAX_VISIBLE_TAGS = 3
  const filteredTags = franchise.tags.filter((t) => !/^Best Score/i.test(t.name))
  const visibleTags = filteredTags.slice(0, MAX_VISIBLE_TAGS)
  const remainingCount = filteredTags.length - MAX_VISIBLE_TAGS

  /**
   * Conditional Link Wrapper Component
   *
   * Wraps content in a Next.js Link component when href is provided,
   * otherwise renders content directly. Enables conditional navigation
   * without duplicating card content.
   *
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Card content to wrap
   * @returns {JSX.Element} Wrapped or unwrapped content
   */
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (franchise.href) {
      return <Link href={franchise.href}>{children}</Link>
    }
    return <>{children}</>
  }

  return (
    <Card className="h-full flex flex-col px-4">
      {/* Image: prefer franchise logo, fallback to sample */}
      <Wrapper>
        <div className="relative w-full aspect-[16/9] border rounded-md overflow-hidden">
          <Image
            src={franchise.imageUrl || '/images/free-nature-images.jpg'}
            alt={franchise.imageAlt || `${franchise.name} logo`}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
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
            {franchise.isTopPick && (
              <Badge className="flex items-center gap-1 bg-red-600 text-white hover:bg-red-700 border-red-600">
                <LucideIcon name="Flame" size={12} />
                Top Pick
              </Badge>
            )}
            {franchise.isSponsored && (
              <Badge className="flex items-center gap-1 bg-amber-500 text-white hover:bg-amber-600 border-amber-500">
                <LucideIcon name="Sparkles" size={12} />
                Sponsored
              </Badge>
            )}
            {(franchise.isFeatured || variant === 'featured') && (
              <Badge className="flex items-center gap-1 bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600">
                <LucideIcon name="Star" size={12} />
                Featured
              </Badge>
            )}
            {bestScore && <Badge variant="secondary">{`Best Score ${bestScore}`}</Badge>}
          </div>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1.5">
            {franchise.categoryIcon && <LucideIcon name={franchise.categoryIcon} size={14} />}
            {franchise.category}
          </Badge>
          {variant === 'featured' && (
            <span className="text-xs text-muted-foreground">Added recently</span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 flex-1">
        <div>
          <p
            className="text-sm text-muted-foreground inline"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {franchise.description}
          </p>
          {franchise.href && (
            <Link
              href={franchise.href}
              className="text-sm text-slate-700 hover:text-slate-900 font-medium ml-1 inline-block"
            >
              See more
            </Link>
          )}
        </div>
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
            {franchise.agentTitle && (
              <span className="text-muted-foreground">{franchise.agentTitle}</span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-t">
        <Badge>Cash Required: {franchise.cashRequired}</Badge>
        {visibleTags.map((tag) => (
          <Badge
            key={tag.name}
            variant="outline"
            style={
              tag.color
                ? {
                    backgroundColor: tag.color,
                    color: tag.textColor || '#ffffff',
                    borderColor: tag.color,
                  }
                : undefined
            }
          >
            {tag.name}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            +{remainingCount} more
          </Badge>
        )}
      </CardFooter>
    </Card>
  )
}
