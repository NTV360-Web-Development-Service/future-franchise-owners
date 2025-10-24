'use client'

/**
 * Global Error Boundary Component
 *
 * This component catches and handles errors that occur during rendering
 * in the application. It provides a user-friendly error message and
 * a reset button to attempt recovery.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */

import { useEffect } from 'react'

/**
 * Error component props
 *
 * @interface ErrorProps
 * @property {Error & { digest?: string }} error - The error object with optional digest
 * @property {() => void} reset - Function to reset the error boundary and retry
 */
interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary component that displays when an error occurs
 *
 * @param {ErrorProps} props - Component props
 * @returns {JSX.Element} Error UI with reset functionality
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Something went wrong!</h2>
        <p className="mb-6 text-gray-600">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        {error.digest && <p className="mb-6 text-sm text-gray-500">Error ID: {error.digest}</p>}
        <button
          onClick={reset}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
