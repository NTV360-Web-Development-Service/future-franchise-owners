'use client'

import { AddToCartButton } from '@/components/cart/AddToCartButton'
import type { CartItem, ListType } from '@/contexts/CartContext'
import type { Franchise, Media } from '@/payload-types'

interface AddToCartBlockProps {
  block: {
    blockType: 'addToCart'
    franchise: string | Franchise
    listType?: ListType | null
    buttonText?: string | null
    buttonVariant?: 'default' | 'outline' | 'ghost' | null
    buttonSize?: 'default' | 'sm' | 'lg' | null
    alignment?: 'left' | 'center' | 'right' | null
    published?: boolean | null
  }
}

export default function AddToCartBlock({ block }: AddToCartBlockProps) {
  if (block.published === false) return null

  // Handle case where franchise is just an ID string
  if (typeof block.franchise === 'string') {
    console.warn('AddToCartBlock: franchise not populated, skipping render')
    return null
  }

  const franchise = block.franchise

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  // Extract industry name for category
  const category =
    franchise.industry && Array.isArray(franchise.industry) && franchise.industry.length > 0
      ? typeof franchise.industry[0] === 'string'
        ? franchise.industry[0]
        : franchise.industry[0]?.name || 'Franchise'
      : 'Franchise'

  // Extract image URL from logo
  const image =
    franchise.logo && typeof franchise.logo === 'object'
      ? (franchise.logo as Media).url || undefined
      : undefined

  // Format investment as cash required
  const cashRequired = franchise.investment?.min
    ? `$${franchise.investment.min.toLocaleString()}${franchise.investment.max ? ` - $${franchise.investment.max.toLocaleString()}` : '+'}`
    : 'Contact for details'

  const cartItem: CartItem = {
    id: franchise.id,
    name: franchise.businessName,
    category,
    cashRequired,
    image,
    slug: franchise.slug || undefined,
  }

  return (
    <div className={`flex ${alignmentClasses[block.alignment || 'center']} py-4`}>
      <AddToCartButton
        franchise={cartItem}
        listType={block.listType || 'wishlist'}
        variant={block.buttonVariant || undefined}
        size={block.buttonSize || undefined}
      />
    </div>
  )
}
