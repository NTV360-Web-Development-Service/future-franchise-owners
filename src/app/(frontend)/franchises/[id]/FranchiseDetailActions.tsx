'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart, type CartItem } from '@/contexts/CartContext'
import { Heart, ShoppingCart, Mail, Calendar } from 'lucide-react'
import { RequestInfoModal } from '@/components/franchise/RequestInfoModal'

interface FranchiseDetailActionsProps {
  franchise: {
    id: string
    businessName: string
    industry?: any
    investment?: {
      min?: number | null
      max?: number | null
    }
    logo?: any
  }
}

export function FranchiseDetailActions({ franchise }: FranchiseDetailActionsProps) {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const { addToWishlist, addToCart, removeFromWishlist, removeFromCart, isInWishlist, isInCart } =
    useCart()

  // Get industry name
  const industries = Array.isArray(franchise.industry) ? franchise.industry : []
  const industry = industries.length > 0 && typeof industries[0] === 'object' ? industries[0] : null
  const industryName = industry?.name || 'Franchise'

  // Format investment
  const minInvestment = franchise.investment?.min
  const maxInvestment = franchise.investment?.max
  const cashRequired =
    minInvestment && maxInvestment
      ? `$${minInvestment.toLocaleString()} - $${maxInvestment.toLocaleString()}`
      : minInvestment
        ? `$${minInvestment.toLocaleString()}+`
        : maxInvestment
          ? `Up to $${maxInvestment.toLocaleString()}`
          : 'Contact for details'

  // Get logo URL
  const logo = typeof franchise.logo === 'object' ? franchise.logo : null
  const logoUrl = logo?.url || undefined

  const cartItem: CartItem = {
    id: franchise.id,
    name: franchise.businessName,
    category: industryName,
    cashRequired,
    image: logoUrl,
    slug: franchise.id,
  }

  const inWishlist = isInWishlist(cartItem.id)
  const inCart = isInCart(cartItem.id)

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(cartItem.id)
    } else {
      addToWishlist(cartItem)
    }
  }

  const handleCartClick = () => {
    if (inCart) {
      removeFromCart(cartItem.id)
    } else {
      addToCart(cartItem)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Wishlist Button */}
      <Button
        size="lg"
        onClick={handleWishlistClick}
        className={`cursor-pointer ${
          inWishlist
            ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
            : 'bg-red-500 hover:bg-red-600 text-white border-red-500'
        }`}
        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
        {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
      </Button>

      {/* Cart Button */}
      <Button
        size="lg"
        onClick={handleCartClick}
        className={`cursor-pointer ${
          inCart
            ? 'bg-[#004AAD] hover:bg-[#003A8C] text-white border-[#004AAD]'
            : 'bg-[#0066FF] hover:bg-[#004AAD] text-white border-[#0066FF]'
        }`}
        title={inCart ? 'Remove from Cart' : 'Add to Cart'}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {inCart ? 'In Cart' : 'Add to Cart'}
      </Button>

      {/* Request Information Button */}
      <Button
        size="lg"
        onClick={() => setShowRequestModal(true)}
        className="bg-white text-slate-900 hover:bg-gray-100"
      >
        <Mail className="w-4 h-4 mr-2" />
        Request Information
      </Button>

      {/* Request Info Modal */}
      <RequestInfoModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        franchise={{
          id: franchise.id,
          name: franchise.businessName,
          category: industryName,
          cashRequired,
        }}
      />
    </div>
  )
}
