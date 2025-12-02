import React from 'react'

/**
 * GridCardsBlock - 3-column grid of cards with title and content
 */
type GridCardsBlockProps = {
  block: {
    blockType: 'gridCards'
    cards?: Array<{
      title?: string | null
      content?: string | null
      backgroundColor?: string | null
      textColor?: string | null
      id?: string | null
    }> | null
    buttonText?: string | null
    buttonLink?: string | null
    anchorId?: string | null
    published?: boolean | null
  }
}

export default function GridCardsBlock({ block }: GridCardsBlockProps) {
  const cards = block.cards || []

  return (
    <section
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
      {...(block.anchorId && { id: block.anchorId })}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={card.id || index}
            className="rounded-lg p-8 shadow-md"
            style={{
              backgroundColor: card.backgroundColor || '#1e3a5f',
              color: card.textColor || '#ffffff',
            }}
          >
            {card.title && (
              <h3 className="text-xl font-bold mb-4" style={{ color: card.textColor || '#ffffff' }}>
                {card.title}
              </h3>
            )}
            {card.content && (
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: card.textColor || '#ffffff' }}
              >
                {card.content}
              </p>
            )}
          </div>
        ))}
      </div>

      {block.buttonText && block.buttonLink && (
        <div className="text-center">
          <a
            href={block.buttonLink}
            className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            {block.buttonText}
          </a>
        </div>
      )}
    </section>
  )
}
