import React from 'react'

/**
 * VideoBlock - Embedded video with optional button
 */
type VideoBlockProps = {
  block: {
    blockType: 'video'
    videoType?: 'upload' | 'link' | null
    videoFile?: { url?: string | null } | string | null
    videoUrl?: string | null
    buttonText?: string | null
    buttonLink?: string | null
    anchorId?: string | null
    published?: boolean | null
  }
}

export default function VideoBlock({ block }: VideoBlockProps) {
  // Get video URL based on type
  let videoSrc: string | undefined

  if (block.videoType === 'upload' && block.videoFile) {
    videoSrc = typeof block.videoFile === 'object' ? (block.videoFile.url ?? undefined) : undefined
  } else if (block.videoType === 'link' && block.videoUrl) {
    videoSrc = block.videoUrl
  }

  // Check if it's a YouTube URL and convert to embed format
  const getEmbedUrl = (url: string): string => {
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/
    const match = url.match(youtubeRegex)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }

    // Vimeo pattern
    const vimeoRegex = /vimeo\.com\/(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    return url
  }

  if (!videoSrc) {
    return null
  }

  const isExternalEmbed = videoSrc.includes('youtube.com') || videoSrc.includes('vimeo.com')
  const embedUrl = isExternalEmbed ? getEmbedUrl(videoSrc) : videoSrc

  return (
    <section
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
      {...(block.anchorId && { id: block.anchorId })}
    >
      <div className="max-w-4xl mx-auto">
        {/* Video Container */}
        <div
          className="relative w-full rounded-lg overflow-hidden shadow-2xl mb-8"
          style={{ paddingBottom: '56.25%' }}
        >
          {isExternalEmbed ? (
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video content"
            />
          ) : (
            <video
              src={videoSrc}
              controls
              className="absolute top-0 left-0 w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Optional Button */}
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
      </div>
    </section>
  )
}
