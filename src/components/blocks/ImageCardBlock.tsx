'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Media } from '@/payload-types'

interface Card {
  image: string | Media
  title?: string | null
  description?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  id?: string | null
}

interface ImageCardBlockProps {
  block: {
    published?: boolean | null
    heading?: string | null
    cards?: Card[] | null
    columns?: '1' | '2' | '3' | '4' | null
    initialCardsToShow?: number | null
    cardsPerLoad?: number | null
    showMoreButtonText?: string | null
    anchorId?: string | null
    id?: string | null
    blockName?: string | null
    blockType?: string
  }
}

export const ImageCardBlock: React.FC<ImageCardBlockProps> = ({ block }) => {
  const {
    heading,
    cards,
    columns = '3',
    initialCardsToShow = 6,
    cardsPerLoad = 6,
    showMoreButtonText = 'Show More',
  } = block

  const [visibleCount, setVisibleCount] = useState(initialCardsToShow || 6)

  if (!cards || cards.length === 0) {
    return null
  }

  const getGridColumns = () => {
    switch (columns) {
      case '1':
        return 'grid-cols-1'
      case '2':
        return 'grid-cols-1 md:grid-cols-2'
      case '4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case '3':
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const visibleCards = cards.slice(0, visibleCount)
  const hasMore = visibleCount < cards.length

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + (cardsPerLoad || 6))
  }

  return (
    <section className="bg-white py-16" {...(block.anchorId && { id: block.anchorId })}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {heading && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{heading}</h2>
        )}

        <div className={`grid ${getGridColumns()} gap-6`}>
          {visibleCards.map((card, index) => {
            // Handle image being either a string (ID) or Media object
            const imageData = typeof card.image === 'string' ? null : card.image
            const imageUrl = imageData?.url

            if (!imageUrl) {
              return null
            }

            return (
              <div key={card.id || index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Image */}
                <div className="relative w-full aspect-video">
                  <Image
                    src={imageUrl}
                    alt={imageData?.alt || card.title || 'Card image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                {(card.title || card.description || card.buttonText) && (
                  <div className="p-6">
                    {card.title && (
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                    )}

                    {card.description && (
                      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{card.description}</p>
                    )}

                    {card.buttonText && card.buttonLink && (
                      <Link href={card.buttonLink}>
                        <Button className="bg-[#004AAD] hover:bg-[#003A8C] text-white">
                          {card.buttonText}
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Show More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <Button
              onClick={handleShowMore}
              className="bg-[#004AAD] hover:bg-[#003A8C] text-white px-8 py-3 text-lg"
            >
              {showMoreButtonText}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ImageCardBlock
