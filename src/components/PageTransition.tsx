'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Check if browser supports View Transitions API
    if ('startViewTransition' in document) {
      if (prevPathname.current !== pathname) {
        setIsTransitioning(true)

        // @ts-ignore - View Transitions API is not in TypeScript yet
        const transition = document.startViewTransition(() => {
          prevPathname.current = pathname
        })

        transition.finished.finally(() => {
          setIsTransitioning(false)
        })
      }
    }
  }, [pathname])

  return (
    <>
      {/* Loading bar at top */}
      {isTransitioning && (
        <div
          className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-50"
          style={{
            animation: 'loading-bar 0.4s ease-in-out',
          }}
        />
      )}
      {children}
      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
