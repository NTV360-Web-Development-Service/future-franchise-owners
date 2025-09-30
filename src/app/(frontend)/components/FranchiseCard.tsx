import Image from 'next/image'
import Link from 'next/link'
import { Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components'
import { extractBestScore } from '../utils/franchiseUtils'

export type Franchise = {
  name: string
  category: string
  description: string
  cashRequired: string // e.g. "$50,000"
  tags: string[] // e.g. ['Low Cost', 'Best Score 88']
  isFeatured?: boolean
  isSponsored?: boolean
  isTopPick?: boolean
  imageUrl?: string
  imageAlt?: string
}

interface FranchiseCardProps {
  franchise: Franchise & { href?: string }
  variant?: 'default' | 'featured' | 'grid'
}

export default function FranchiseCard({ franchise, variant = 'default' }: FranchiseCardProps) {
  const bestScore = extractBestScore(franchise.tags)

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