'use client'

import { useState } from 'react'
import { useCart, type CartItem } from '@/contexts/CartContext'
import { X, Trash2, ShoppingCart, Heart, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { RequestInfoModal } from './RequestInfoModal'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    wishlistItems,
    cartItems,
    removeFromWishlist,
    removeFromCart,
    moveToCart,
    moveToWishlist,
    clearWishlist,
    clearCart,
  } = useCart()

  const [activeTab, setActiveTab] = useState<'wishlist' | 'cart'>('cart')
  const [showRequestModal, setShowRequestModal] = useState(false)

  if (!isOpen) return null

  const currentItems = activeTab === 'wishlist' ? wishlistItems : cartItems
  const removeItem = activeTab === 'wishlist' ? removeFromWishlist : removeFromCart
  const clearItems = activeTab === 'wishlist' ? clearWishlist : clearCart
  const moveItem = activeTab === 'wishlist' ? moveToCart : moveToWishlist

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Saved Franchises</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-t">
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === 'wishlist'
                  ? 'text-[#004AAD] border-b-2 border-[#004AAD] bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              Wishlist ({wishlistItems.length})
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === 'cart'
                  ? 'text-[#004AAD] border-b-2 border-[#004AAD] bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Cart ({cartItems.length})
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {activeTab === 'wishlist' ? (
                <>
                  <Heart className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Your wishlist is empty</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Save franchises you&apos;re interested in for later
                  </p>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Add franchises you&apos;re ready to pursue
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow"
                >
                  {item.image && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                    <p className="text-sm font-medium text-[#004AAD] mt-1">{item.cashRequired}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {item.slug && (
                        <Link
                          href={`/franchises/${item.slug}`}
                          className="text-xs text-blue-600 hover:underline"
                          onClick={onClose}
                        >
                          View Details
                        </Link>
                      )}
                      <button
                        onClick={() => moveItem(item.id)}
                        className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                        title={activeTab === 'wishlist' ? 'Move to Cart' : 'Move to Wishlist'}
                      >
                        {activeTab === 'wishlist' ? (
                          <>
                            <ArrowRight className="w-3 h-3" />
                            Move to Cart
                          </>
                        ) : (
                          <>
                            <ArrowLeft className="w-3 h-3" />
                            Move to Wishlist
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors self-start"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {currentItems.length > 0 && (
          <div className="border-t p-4 space-y-3">
            {/* Request Info button only for Cart tab */}
            {activeTab === 'cart' && (
              <Button
                onClick={() => setShowRequestModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Request Information for All ({cartItems.length})
              </Button>
            )}
            <Button onClick={clearItems} variant="outline" className="w-full">
              Clear {activeTab === 'wishlist' ? 'Wishlist' : 'Cart'}
            </Button>
            <Button onClick={onClose} className="w-full bg-[#004AAD] hover:bg-[#003A8C]">
              Continue Browsing
            </Button>
          </div>
        )}
      </div>

      {/* Request Info Modal */}
      <RequestInfoModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        franchises={cartItems}
        onSuccess={() => {
          // Clear cart after successful submission
          clearCart()
        }}
      />
    </>
  )
}
