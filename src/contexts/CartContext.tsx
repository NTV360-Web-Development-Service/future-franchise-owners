'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  category: string
  cashRequired: string
  image?: string
  slug?: string
}

export type ListType = 'wishlist' | 'cart'

interface CartContextType {
  wishlistItems: CartItem[]
  cartItems: CartItem[]
  addToWishlist: (item: CartItem) => void
  addToCart: (item: CartItem) => void
  removeFromWishlist: (id: string) => void
  removeFromCart: (id: string) => void
  moveToCart: (id: string) => void
  moveToWishlist: (id: string) => void
  clearWishlist: () => void
  clearCart: () => void
  isInWishlist: (id: string) => boolean
  isInCart: (id: string) => boolean
  wishlistCount: number
  cartCount: number
  totalCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<CartItem[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load both lists from localStorage on mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('franchise-wishlist')
    const storedCart = localStorage.getItem('franchise-cart')

    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist))
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage', e)
      }
    }

    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e)
      }
    }

    setIsHydrated(true)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('franchise-wishlist', JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, isHydrated])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('franchise-cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isHydrated])

  const addToWishlist = (item: CartItem) => {
    setWishlistItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
    // Remove from cart if it exists there
    setCartItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
    // Remove from wishlist if it exists there
    setWishlistItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const moveToCart = (id: string) => {
    const item = wishlistItems.find((i) => i.id === id)
    if (item) {
      addToCart(item)
    }
  }

  const moveToWishlist = (id: string) => {
    const item = cartItems.find((i) => i.id === id)
    if (item) {
      addToWishlist(item)
    }
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const clearCart = () => {
    setCartItems([])
  }

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id)
  }

  const isInCart = (id: string) => {
    return cartItems.some((item) => item.id === id)
  }

  return (
    <CartContext.Provider
      value={{
        wishlistItems,
        cartItems,
        addToWishlist,
        addToCart,
        removeFromWishlist,
        removeFromCart,
        moveToCart,
        moveToWishlist,
        clearWishlist,
        clearCart,
        isInWishlist,
        isInCart,
        wishlistCount: wishlistItems.length,
        cartCount: cartItems.length,
        totalCount: wishlistItems.length + cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
