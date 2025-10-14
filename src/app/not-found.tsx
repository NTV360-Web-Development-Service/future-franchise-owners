'use client'

import { Button } from '@/components/ui'
import './globals.css'

/**
 * NotFound - Under Construction Page Component
 *
 * This component serves as the global 404 page replacement, displaying
 * an "Under Construction" message instead of a traditional not found page.
 * It provides a professional and branded experience when users navigate
 * to non-existent pages while the site is being developed.
 *
 * Features:
 * - Modern, clean design with construction theme
 * - Responsive layout that works on all devices
 * - Professional messaging that maintains brand trust
 * - Clear navigation back to home page
 * - Construction-themed visual elements
 * - Consistent with application design system
 *
 * @returns JSX element containing the under construction page
 */
export default function NotFound() {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Construction Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-12 h-12 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                {/* Animated construction particles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl font-bold text-gray-900 mb-4 font-sans">Under Construction</h1>

            {/* Subheading */}
            <h2 className="text-xl text-gray-700 mb-8 font-medium">
              We're Building Something Amazing
            </h2>

            {/* Description */}
            <div className="space-y-4 mb-10 text-gray-600">
              <p className="text-lg leading-relaxed">
                Our franchise discovery platform is currently under development. We're working hard
                to bring you the best experience for finding your perfect franchise opportunity.
              </p>
              <p className="text-base">
                Check back soon to explore exciting franchise possibilities and take the first step
                toward business ownership.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => (window.location.href = '/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Return Home
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors"
                asChild
              >
                <a href="mailto:info@futurefranchiseowners.com">Contact Us</a>
              </Button>
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Expected launch: Coming Soon • Follow us for updates
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
