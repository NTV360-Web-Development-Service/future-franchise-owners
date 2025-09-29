import Image from 'next/image'
import { Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components'
import { extractBestScore } from '../utils/franchiseUtils'

export type Franchise = {
  name: string
  category: string
  description: string
  cashRequired: string // e.g. "$50,000"
  tags: string[] // e.g. ['Low Cost', 'Best Score 88']
}

interface FranchiseCardProps {
  franchise: Franchise
  variant?: 'default' | 'featured' | 'grid'
}

export default function FranchiseCard({ franchise, variant = 'default' }: FranchiseCardProps) {
  const bestScore = extractBestScore(franchise.tags)
  
  // Determine badge text based on variant and best score
  const getBadgeText = () => {
    if (bestScore) return `Best Score ${bestScore}`
    if (variant === 'featured') return 'Featured'
    return 'Franchise'
  }

  return (
    <Card>
      {/* Sample image */}
      <div className="relative w-full aspect-[16/9]">
        <Image 
          src="/images/free-nature-images.jpg" 
          alt={`${franchise.name} cover`} 
          fill 
          priority 
          className="object-cover rounded-t-md" 
        />
      </div>
      
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <span>{franchise.name}</span>
          <Badge variant="secondary">{getBadgeText()}</Badge>
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