'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { CartDrawer } from './CartDrawer'

export function FloatingCartButton() {
  const [cartOpen, setCartOpen] = useState(false)
  const { totalCount } = useCart()

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#004AAD] hover:bg-[#003A8C] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:ring-offset-2"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
            {totalCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
