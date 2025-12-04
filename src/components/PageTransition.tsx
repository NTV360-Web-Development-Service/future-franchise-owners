'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    // Check if browser supports View Transitions API
    if ('startViewTransition' in document) {
      if (prevPathname.current !== pathname) {
        // @ts-ignore - View Transitions API is not in TypeScript yet
        document.startViewTransition(() => {
          prevPathname.current = pathname
        })
      }
    }
  }, [pathname])

  return <>{children}</>
}
