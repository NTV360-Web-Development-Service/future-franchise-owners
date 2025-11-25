'use client'

import { useCart, CartItem, ListType } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Check } from 'lucide-react'
import { useState } from 'react'

interface AddToCartButtonProps {
  franchise: CartItem
  listType?: ListType
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function AddToCartButton({
  franchise,
  listType = 'wishlist',
  variant = 'default',
  size = 'default',
  className = '',
}: AddToCartButtonProps) {
  const { addToWishlist, addToCart, isInWishlist, isInCart } = useCart()
  const [showAdded, setShowAdded] = useState(false)

  const isWishlist = listType === 'wishlist'
  const inList = isWishlist ? isInWishlist(franchise.id) : isInCart(franchise.id)
  const Icon = isWishlist ? Heart : ShoppingCart
  const label = isWishlist ? 'Wishlist' : 'Cart'

  const handleClick = () => {
    if (!inList) {
      if (isWishlist) {
        addToWishlist(franchise)
      } else {
        addToCart(franchise)
      }
      setShowAdded(true)
      setTimeout(() => setShowAdded(false), 2000)
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant={inList ? 'outline' : variant}
      size={size}
      className={`${className} ${inList ? 'border-green-500 text-green-600' : ''}`}
      disabled={inList}
    >
      {showAdded ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Added!
        </>
      ) : inList ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          In {label}
        </>
      ) : (
        <>
          <Icon className="w-4 h-4 mr-2" />
          Add to {label}
        </>
      )}
    </Button>
  )
}
