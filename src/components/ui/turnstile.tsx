'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact'
        },
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  className?: string
}

export function Turnstile({
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
  className,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const isRenderedRef = useRef(false)

  // Store callbacks in refs to avoid re-rendering the widget
  const onVerifyRef = useRef(onVerify)
  const onErrorRef = useRef(onError)
  const onExpireRef = useRef(onExpire)

  // Update refs when callbacks change (without triggering re-render)
  useEffect(() => {
    onVerifyRef.current = onVerify
    onErrorRef.current = onError
    onExpireRef.current = onExpire
  }, [onVerify, onError, onExpire])

  // Stable callback wrappers
  const handleVerify = useCallback((token: string) => {
    onVerifyRef.current(token)
  }, [])

  const handleError = useCallback(() => {
    onErrorRef.current?.()
  }, [])

  const handleExpire = useCallback(() => {
    onExpireRef.current?.()
  }, [])

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

    if (!siteKey) {
      console.error('Turnstile site key not configured')
      return
    }

    // Load Turnstile script if not already loaded
    const loadScript = () => {
      if (document.getElementById('turnstile-script')) {
        if (window.turnstile) {
          setIsLoaded(true)
        }
        return
      }

      const script = document.createElement('script')
      script.id = 'turnstile-script'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'
      script.async = true
      script.defer = true

      window.onTurnstileLoad = () => {
        setIsLoaded(true)
      }

      document.head.appendChild(script)
    }

    loadScript()

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch (e) {
          // Widget might already be removed
        }
      }
      isRenderedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.turnstile) return

    // Only render once
    if (isRenderedRef.current) return

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!siteKey) return

    // Render widget only once
    isRenderedRef.current = true
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: handleVerify,
      'error-callback': handleError,
      'expired-callback': handleExpire,
      theme,
      size,
    })
  }, [isLoaded, handleVerify, handleError, handleExpire, theme, size])

  return <div ref={containerRef} className={className} />
}

/**
 * Verify Turnstile token on the server
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.error('Turnstile secret key not configured')
    return false
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification failed:', error)
    return false
  }
}
