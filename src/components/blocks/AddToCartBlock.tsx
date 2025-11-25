'use client'

import { AddToCartButton } from '@/components/cart/AddToCartButton'
import type { CartItem, ListType } from '@/contexts/CartContext'

interface AddToCartBlockProps {
  block: {
    blockType: 'addToCart'
    franchise: {
      id: string
      name: string
      category: string
      cashRequired: string
      image?: string
      slug?: string
    }
    listType?: ListType
    buttonText?: string
    buttonVariant?: 'default' | 'outline' | 'ghost'
    buttonSize?: 'default' | 'sm' | 'lg'
    alignment?: 'left' | 'center' | 'right'
    published?: boolean
  }
}

export default function AddToCartBlock({ block }: AddToCartBlockProps) {
  if (block.published === false) return null

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const cartItem: CartItem = {
    id: block.franchise.id,
    name: block.franchise.name,
    category: block.franchise.category,
    cashRequired: block.franchise.cashRequired,
    image: block.franchise.image,
    slug: block.franchise.slug,
  }

  return (
    <div className={`flex ${alignmentClasses[block.alignment || 'center']} py-4`}>
      <AddToCartButton
        franchise={cartItem}
        listType={block.listType || 'wishlist'}
        variant={block.buttonVariant}
        size={block.buttonSize}
      />
    </div>
  )
}
