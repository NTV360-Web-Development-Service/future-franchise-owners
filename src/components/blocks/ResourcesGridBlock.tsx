'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ResourcePopup } from '@/components/ui/resource-popup'

interface ResourceCard {
  image?: { url?: string | null; alt?: string | null } | string | null
  imageLink?: string | null
  imageLinkOpenInNewTab?: boolean | null
  title?: string | null
  content?: string | null
  buttonText?: string | null
  buttonAction?: 'link' | 'popup' | null
  buttonUrl?: string | null
  buttonOpenInNewTab?: boolean | null
  popupHeading?: string | null
  popupSubmitText?: string | null
  popupSuccessMessage?: string | null
  popupDownloadUrl?: string | null
}

export interface ResourcesGridBlockProps {
  block: {
    blockType: 'resourcesGrid'
    published?: boolean | null
    anchorId?: string | null
    heading?: string | null
    subheading?: string | null
    columns?: '2' | '3' | '4' | null
    resources?: ResourceCard[] | null
    backgroundColor?: string | null
    cardBackgroundColor?: string | null
    textColor?: string | null
    buttonStyle?: 'primary' | 'secondary' | 'outline' | null
  }
}

export default function ResourcesGridBlock({ block }: ResourcesGridBlockProps) {
  const [activePopup, setActivePopup] = useState<number | null>(null)

  if (block.published === false) return null

  const {
    heading,
    subheading,
    columns = '3',
    resources = [],
    backgroundColor = '#ffffff',
    cardBackgroundColor = '#ffffff',
    textColor = '#1f2937',
    buttonStyle = 'primary',
    anchorId,
  } = block

  const columnClasses: Record<string, string> = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  const getButtonVariant = () => {
    switch (buttonStyle) {
      case 'secondary':
        return 'secondary'
      case 'outline':
        return 'outline'
      default:
        return 'default'
    }
  }

  const getImageUrl = (image: ResourceCard['image']): string | null => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url ?? null
  }

  const getImageAlt = (image: ResourceCard['image'], title?: string | null): string => {
    if (!image) return title || 'Resource image'
    if (typeof image === 'string') return title || 'Resource image'
    return image.alt || title || 'Resource image'
  }

  return (
    <section
      className="py-16 md:py-24"
      style={{
        backgroundColor: backgroundColor || '#ffffff',
        fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif",
      }}
      {...(anchorId && { id: anchorId })}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: textColor || '#1f2937' }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                className="text-lg max-w-2xl mx-auto opacity-80"
                style={{ color: textColor || '#1f2937' }}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Resources Grid */}
        {resources && resources.length > 0 && (
          <div className={`grid ${columnClasses[columns || '3']} gap-8`}>
            {resources.map((resource, index) => {
              const imageUrl = getImageUrl(resource.image)
              const hasContent = resource.title || resource.content || resource.buttonText

              return (
                <div
                  key={index}
                  className="flex flex-col rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  style={{ backgroundColor: cardBackgroundColor || '#ffffff' }}
                >
                  {/* Image */}
                  {imageUrl && (
                    <div className="relative aspect-[4/5] w-full">
                      {resource.imageLink ? (
                        <a
                          href={resource.imageLink}
                          target={resource.imageLinkOpenInNewTab ? '_blank' : '_self'}
                          rel={resource.imageLinkOpenInNewTab ? 'noopener noreferrer' : undefined}
                          className="block w-full h-full"
                        >
                          <Image
                            src={imageUrl}
                            alt={getImageAlt(resource.image, resource.title)}
                            fill
                            className="object-cover hover:opacity-90 transition-opacity"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </a>
                      ) : (
                        <Image
                          src={imageUrl}
                          alt={getImageAlt(resource.image, resource.title)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                    </div>
                  )}

                  {/* Content */}
                  {hasContent && (
                    <div className="flex flex-col flex-grow p-6 text-center">
                      {resource.title && (
                        <h3
                          className="text-lg font-semibold mb-3"
                          style={{ color: textColor || '#1f2937' }}
                        >
                          {resource.title}
                        </h3>
                      )}

                      {resource.content && (
                        <p
                          className="text-sm leading-relaxed mb-4 flex-grow opacity-80"
                          style={{ color: textColor || '#1f2937' }}
                        >
                          {resource.content}
                        </p>
                      )}

                      {resource.buttonText &&
                        (resource.buttonUrl || resource.buttonAction === 'popup') && (
                          <div className="mt-auto pt-2">
                            {resource.buttonAction === 'popup' ? (
                              <Button
                                variant={getButtonVariant()}
                                className="px-6"
                                onClick={() => setActivePopup(index)}
                              >
                                {resource.buttonText}
                              </Button>
                            ) : (
                              <Button asChild variant={getButtonVariant()} className="px-6">
                                <a
                                  href={resource.buttonUrl!}
                                  target={resource.buttonOpenInNewTab ? '_blank' : '_self'}
                                  rel={
                                    resource.buttonOpenInNewTab ? 'noopener noreferrer' : undefined
                                  }
                                >
                                  {resource.buttonText}
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Popups */}
        {resources?.map(
          (resource, index) =>
            resource.buttonAction === 'popup' && (
              <ResourcePopup
                key={`popup-${index}`}
                isOpen={activePopup === index}
                onClose={() => setActivePopup(null)}
                heading={resource.popupHeading || undefined}
                submitText={resource.popupSubmitText || undefined}
                successMessage={resource.popupSuccessMessage || undefined}
                downloadUrl={resource.popupDownloadUrl || undefined}
              />
            ),
        )}
      </div>
    </section>
  )
}
