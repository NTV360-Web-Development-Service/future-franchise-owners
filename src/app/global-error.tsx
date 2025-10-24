'use client'

/**
 * Global Error Handler Component
 *
 * This component handles errors that occur at the root layout level.
 * It must define its own <html> and <body> tags since it replaces
 * the root layout when an error occurs.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
 */

import { useEffect } from 'react'

/**
 * Global error component props
 *
 * @interface GlobalErrorProps
 * @property {Error & { digest?: string }} error - The error object with optional digest
 * @property {() => void} reset - Function to reset the error boundary and retry
 */
interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Root-level error boundary component
 *
 * @param {GlobalErrorProps} props - Component props
 * @returns {JSX.Element} Full page error UI with reset functionality
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Application Error</h2>
            <p className="mb-6 text-gray-600">
              A critical error occurred. Please refresh the page or contact support if the problem
              persists.
            </p>
            {error.digest && <p className="mb-6 text-sm text-gray-500">Error ID: {error.digest}</p>}
            <button
              onClick={reset}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
