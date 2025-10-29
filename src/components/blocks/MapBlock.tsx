import React from 'react'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'

/**
 * Props interface for the MapBlock component
 *
 * @interface MapBlockProps
 * @property {Object} block - Configuration object for the map block
 * @property {string} [block.heading] - Optional heading text displayed above the map
 * @property {string} [block.description] - Optional description text displayed below the heading
 * @property {string} block.mapUrl - Required URL for the map embed (e.g., Google Maps embed URL)
 * @property {number} [block.height=400] - Optional height of the map iframe in pixels
 * @property {boolean} [block.showViewButton=false] - Whether to show the "View Full Map" button
 * @property {string} [block.buttonText="View Full Map"] - Custom text for the view button
 */
interface MapBlockProps {
  block: {
    heading?: string | null
    description?: string | null
    mapUrl?: string | null
    height?: number | null
    showViewButton?: boolean | null
    buttonText?: string | null
    anchorId?: string | null
    id?: string | null
    blockName?: string | null
    blockType?: string
  }
}

/**
 * Extracts the full map URL from a Google Maps embed URL
 *
 * @param {string} embedUrl - The Google Maps embed URL
 * @returns {string} The full map URL for opening in a new tab
 *
 * @example
 * ```typescript
 * const fullUrl = getFullMapUrl('https://www.google.com/maps/d/u/0/embed?mid=123&ehbc=2E312F')
 * // Returns: 'https://www.google.com/maps/d/viewer?mid=123'
 * ```
 */
const getFullMapUrl = (embedUrl: string): string => {
  try {
    const url = new URL(embedUrl)
    const mid = url.searchParams.get('mid')
    if (mid) {
      return `https://www.google.com/maps/d/viewer?mid=${mid}`
    }
  } catch (error) {
    console.warn('Could not parse map URL:', error)
  }
  return embedUrl
}

/**
 * MapBlock Component
 *
 * A reusable block component for embedding Google Maps or other map services
 * into pages via Payload CMS. This component provides a responsive iframe
 * container with optional heading, description, and call-to-action button
 * for customizing the map display behavior and content.
 *
 * Features:
 * - Responsive iframe container with configurable height
 * - Optional heading and description text
 * - Configurable "View Full Map" button with custom text
 * - Accessibility features including proper iframe titles
 * - Error handling for missing or invalid map URLs
 * - Mobile-responsive design with proper aspect ratios
 * - Automatic extraction of full map URL from embed URL
 *
 * @component
 * @param {MapBlockProps} props - The component props
 * @param {Object} props.block - Configuration object from Payload CMS
 * @returns {React.ReactElement} The rendered MapBlock component
 *
 * @example
 * ```tsx
 * <MapBlock
 *   block={{
 *     heading: "Find Us",
 *     description: "Visit our locations",
 *     mapUrl: "https://www.google.com/maps/embed?...",
 *     height: 400,
 *     showViewButton: true,
 *     buttonText: "View Full Map"
 *   }}
 * />
 * ```
 *
 * @example
 * // Minimal usage with just map URL
 * ```tsx
 * <MapBlock
 *   block={{
 *     mapUrl: "https://www.google.com/maps/embed?..."
 *   }}
 * />
 * ```
 */
export const MapBlock: React.FC<MapBlockProps> = ({ block }) => {
  // Handle null values from CMS and provide defaults
  const heading = block.heading || 'Find Franchise Opportunities Near You'
  const description =
    block.description ||
    'Explore our network of franchise locations and discover opportunities in your area.'
  const mapUrl =
    block.mapUrl ||
    'https://www.google.com/maps/d/u/0/embed?mid=1WvsN2zVD73ijJA6Kmyrv72IN36qRZxo&ehbc=2E312F'
  const height = block.height || 450
  const showViewButton = block.showViewButton ?? true
  const buttonText = block.buttonText || 'View Full Directory'

  // Early return for missing map URL with user-friendly error message
  if (!mapUrl) {
    return (
      <div className="w-full py-16 text-center">
        <p className="text-gray-500">Map URL not configured</p>
      </div>
    )
  }

  const fullMapUrl = getFullMapUrl(mapUrl)

  return (
    <section className="bg-gray-50 py-16" {...(block.anchorId && { id: block.anchorId })}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-[#004AAD] mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">{heading}</h2>
          </div>
          {description && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>}
        </div>

        {/* Map Container */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <iframe
                src={mapUrl}
                width="100%"
                height={height}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={heading || 'Interactive Map'}
                className="w-full"
              />
            </div>

            {/* View Full Map Button */}
            {showViewButton && fullMapUrl && (
              <div className="p-6 bg-white border-t">
                <div className="text-center">
                  <Button
                    asChild
                    className="bg-[#004AAD] hover:bg-[#003A8C] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    <a
                      href={fullMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${buttonText} - Opens in new tab`}
                    >
                      {buttonText}
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MapBlock
