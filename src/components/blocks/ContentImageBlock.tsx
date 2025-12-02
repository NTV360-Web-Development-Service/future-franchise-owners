import React from 'react'
import Image from 'next/image'

/**
 * ContentImageBlock - Content on left, image on right layout
 */
type ContentImageBlockProps = {
  block: {
    blockType: 'contentImage'
    heading?: string | null
    content?: string | null
    image?: { url?: string; alt?: string } | string | null
    imagePosition?: 'left' | 'right' | null
    buttonText?: string | null
    buttonLink?: string | null
    anchorId?: string | null
    published?: boolean | null
  }
}

export default function ContentImageBlock({ block }: ContentImageBlockProps) {
  const imageUrl = typeof block.image === 'object' && block.image?.url ? block.image.url : undefined
  const imageAlt =
    typeof block.image === 'object' && block.image?.alt ? block.image.alt : 'Content image'
  const imagePosition = block.imagePosition || 'right'

  const contentSection = (
    <div>
      {block.heading && (
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{block.heading}</h2>
      )}
      {block.content && (
        <div className="text-lg text-gray-600 mb-8 whitespace-pre-line">{block.content}</div>
      )}
      {block.buttonText && block.buttonLink && (
        <a
          href={block.buttonLink}
          className="inline-block px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          {block.buttonText}
        </a>
      )}
    </div>
  )

  const imageSection = imageUrl ? (
    <div className="relative w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
      <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
    </div>
  ) : null

  return (
    <section
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
      {...(block.anchorId && { id: block.anchorId })}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {imagePosition === 'left' ? (
          <>
            {imageSection}
            {contentSection}
          </>
        ) : (
          <>
            {contentSection}
            {imageSection}
          </>
        )}
      </div>
    </section>
  )
}
