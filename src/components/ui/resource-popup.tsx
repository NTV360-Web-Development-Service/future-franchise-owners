'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

interface ResourcePopupProps {
  isOpen: boolean
  onClose: () => void
  heading?: string
  submitText?: string
  successMessage?: string
  downloadUrl?: string
}

export function ResourcePopup({
  isOpen,
  onClose,
  heading = 'Where Shall We Send Your Free PDF?',
  submitText = 'Send Me The PDF',
  successMessage = 'Thank you! Check your email for the download link.',
  downloadUrl,
}: ResourcePopupProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Submit to contact API with resource info
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim() || 'Unknown',
          email,
          phone: 'N/A',
          subject: 'PDF Download Request',
          message: `Requested PDF: ${downloadUrl || 'Not specified'}`,
          source: 'resource-download',
          requestedResource: downloadUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      setIsSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setFirstName('')
    setLastName('')
    setIsSuccess(false)
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-heading"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-700">{successMessage}</p>
          </div>
        ) : (
          <>
            <h2
              id="popup-heading"
              className="text-2xl font-bold text-center text-gray-900 mb-6 pr-8"
            >
              {heading}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="popup-email" className="block text-sm text-gray-600 mb-1">
                  E-mail address
                </label>
                <input
                  id="popup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#5B6DC4] hover:bg-[#4a5ab3] text-white py-3"
              >
                {isSubmitting ? 'Sending...' : submitText}
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              Privacy Policy: We hate spam and promise to keep your email address safe.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
