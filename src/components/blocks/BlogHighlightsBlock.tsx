/**
 * @fileoverview BlogHighlightsBlock Component
 *
 * A dynamic blog highlights section that fetches and displays recent blog posts
 * from RSS feeds. Features responsive card layouts, configurable metadata display,
 * and performance optimizations for content delivery.
 *
 * @module Components/Blocks/BlogHighlightsBlock
 * @version 1.0.0
 * @author Franchise Site Development Team
 */

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel'
import { Calendar, Clock, ExternalLink } from 'lucide-react'
import Parser from 'rss-parser'

/**
 * Blog post data structure for RSS feed content
 *
 * Represents a single blog post with all necessary metadata
 * for display in the highlights section.
 *
 * @interface BlogPost
 */
interface BlogPost {
  /** Blog post title */
  title: string
  /** Post description or excerpt */
  description: string
  /** Direct link to the full blog post */
  link: string
  /** Publication date in ISO string format */
  pubDate: string
  /** Post author name */
  author: string
  /** Optional featured image URL */
  image?: string
}

/**
 * Configuration props for the BlogHighlightsBlock component
 *
 * Defines the block configuration structure as provided by Payload CMS
 * for customizing the blog highlights display behavior and content.
 *
 * @interface BlogHighlightsBlockProps
 */
interface BlogHighlightsBlockProps {
  /** Block configuration from Payload CMS */
  block: {
    /** Block type identifier */
    blockType: 'blogHighlights'
    /** Section heading */
    heading?: string | null
    /** Section subheading */
    subheading?: string | null
    /** RSS feed URL */
    feedUrl?: string | null
    /** Maximum number of posts to display */
    limit?: number | null
    /** Show author information */
    showAuthor?: boolean | null
    /** Show publication date */
    showDate?: boolean | null
    /** Show read time estimate */
    showReadTime?: boolean | null
    /** URL for "View All Posts" button */
    viewAllLink?: string | null
    /** Show "View All Posts" button */
    showViewAllButton?: boolean | null
    /** Optional anchor ID for fragment navigation */
    anchorId?: string | null
    /** Unique identifier for the block */
    id?: string | null
    /** Optional block name for admin reference */
    blockName?: string | null
  }
}

/**
 * Fetches blog posts from RSS feed using rss-parser
 * @param feedUrl - RSS feed URL
 * @param limit - Maximum number of posts to fetch
 * @returns Promise resolving to array of blog posts
 */
async function fetchBlogPosts(feedUrl: string, limit: number = 6): Promise<BlogPost[]> {
  try {
    const parser = new Parser({
      customFields: {
        item: ['content:encoded', 'media:content', 'enclosure'],
      },
    })

    const feed = await parser.parseURL(feedUrl)

    const posts: BlogPost[] = feed.items.slice(0, limit).map((item) => {
      // Extract image from various possible sources
      let image: string | undefined

      // Try media:content first
      if (item['media:content']) {
        image = item['media:content'].$ ? item['media:content'].$.url : undefined
      }

      // Try enclosure
      if (!image && item.enclosure && item.enclosure.type?.startsWith('image/')) {
        image = item.enclosure.url
      }

      // Try to extract image from content
      if (!image && item['content:encoded']) {
        const imgMatch = item['content:encoded'].match(/<img[^>]+src="([^"]+)"/i)
        if (imgMatch) {
          image = imgMatch[1]
        }
      }

      // Clean up description (remove HTML tags)
      const cleanDescription = (item.contentSnippet || item.content || '')
        .replace(/<[^>]*>/g, '')
        .trim()

      return {
        title: item.title || 'Untitled',
        description: cleanDescription,
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || '',
        author: item.creator || 'Unknown Author',
        image,
      }
    })

    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

/**
 * Format date string to readable format
 * @param dateString - Date string from RSS feed
 * @returns Formatted date string
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Recent'
  }
}

/**
 * Estimate reading time based on content length
 * @param content - Content text
 * @returns Estimated reading time in minutes
 */
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

/**
 * BlogHighlightsBlock Component
 *
 * An async server component that fetches and displays recent blog posts from RSS feeds.
 * Provides a responsive, card-based layout with configurable metadata display options.
 *
 * Key Features:
 * - RSS feed integration with rss-parser
 * - Responsive grid layout (1-3 columns based on screen size)
 * - Configurable post limits and metadata display
 * - Image extraction from multiple RSS sources
 * - Reading time estimation
 * - Hover animations and transitions
 * - Error handling with graceful fallbacks
 * - SEO-friendly markup structure
 * - Accessibility considerations
 *
 * Performance Optimizations:
 * - Server-side rendering for better SEO
 * - Image lazy loading
 * - Efficient RSS parsing with custom field extraction
 * - Content truncation for consistent layouts
 *
 * @param {BlogHighlightsBlockProps} props - Component configuration from Payload CMS
 * @param {Object} props.block - Block configuration object
 * @returns {Promise<JSX.Element>} Rendered blog highlights section
 *
 * @example
 * ```tsx
 * <BlogHighlightsBlock
 *   block={{
 *     blockType: 'blogHighlights',
 *     heading: 'Latest Insights',
 *     feedUrl: 'https://example.com/feed',
 *     limit: 6,
 *     showAuthor: true,
 *     showDate: true,
 *     showReadTime: true
 *   }}
 * />
 * ```
 */
export default async function BlogHighlightsBlock({ block }: BlogHighlightsBlockProps) {
  const {
    heading = 'Latest Blog Posts',
    subheading = 'Stay updated with the latest franchise insights and business tips',
    feedUrl = 'https://quantumbc.substack.com/feed',
    limit = 6,
    showAuthor = true,
    showDate = true,
    showReadTime = true,
    viewAllLink = 'https://quantumbc.substack.com',
    showViewAllButton = true,
  } = block

  // Fetch blog posts from RSS feed
  const posts = feedUrl ? await fetchBlogPosts(feedUrl, limit || 6) : []

  if (posts.length === 0) {
    return (
      <section {...(block.anchorId && { id: block.anchorId })}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">{heading}</h2>
            {subheading && <p className="text-lg text-slate-800/90 mb-8">{subheading}</p>}
            <p className="text-slate-800/90">No blog posts available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section {...(block.anchorId && { id: block.anchorId })}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">{heading}</h2>
          {subheading && (
            <p className="text-lg text-slate-800/90 max-w-3xl mx-auto">{subheading}</p>
          )}
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {posts.map((post, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="group hover:shadow-xl transition-all duration-300 bg-slate-50 hover:!bg-blue-50 border-0 h-full flex flex-col">
                  {post.image && (
                    <div className="aspect-video overflow-hidden relative">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex flex-col flex-1">
                    <CardHeader className="pb-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#004AAD] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        {showDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.pubDate)}</span>
                          </div>
                        )}

                        {showReadTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{estimateReadTime(post.description)}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 flex flex-col flex-1">
                      <p className="text-gray-600 line-clamp-3 mb-4 flex-1">{post.description}</p>

                      <div className="flex items-center justify-between mt-auto">
                        {showAuthor && (
                          <Badge variant="secondary" className="text-xs">
                            {post.author}
                          </Badge>
                        )}

                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#004AAD] hover:text-[#003a89] font-medium text-sm transition-colors"
                        >
                          Read More
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots />
        </Carousel>

        {showViewAllButton && viewAllLink && (
          <div className="text-center mt-12">
            <a
              href={viewAllLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#004AAD] text-white px-6 py-3 rounded-lg hover:bg-[#003a89] transition-colors font-medium"
            >
              View All Posts
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
