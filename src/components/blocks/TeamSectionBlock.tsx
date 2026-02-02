/**
 * @fileoverview TeamSectionBlock Component
 *
 * A flexible team section that displays team member profiles in either
 * a grid or carousel layout. Features responsive layouts, avatar fallbacks,
 * and rich text biography support.
 *
 * @module Components/Blocks/TeamSectionBlock
 * @version 1.0.0
 */

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel'
import { RichTextRenderer } from '@/components/RichTextRenderer'

/**
 * Media type from Payload CMS
 */
interface Media {
  url?: string | null
  alt?: string
  [key: string]: any
}

/**
 * Team member data structure
 *
 * @interface TeamMember
 */
interface TeamMember {
  /** Team member photo */
  photo?: (string | null) | Media
  /** Team member name (required) */
  name: string
  /** Job title or role */
  title?: string | null
  /** Location */
  location?: string | null
  /** Biography in Lexical rich text format */
  biography?: any
  /** Contact URL for the "Work with" button */
  contactUrl?: string | null
  /** Unique identifier */
  id?: string | null
}

/**
 * Configuration props for the TeamSectionBlock component
 *
 * @interface TeamSectionBlockProps
 */
interface TeamSectionBlockProps {
  /** Block configuration from Payload CMS */
  block: {
    /** Block type identifier */
    blockType: 'teamSection'
    /** Visibility toggle */
    published?: boolean | null
    /** Section heading */
    heading?: string | null
    /** Section subheading */
    subheading?: string | null
    /** Layout mode: grid or carousel */
    layoutMode?: 'grid' | 'carousel' | null
    /** Array of team members */
    teamMembers?: TeamMember[] | null
    /** Optional anchor ID for fragment navigation */
    anchorId?: string | null
    /** Unique identifier for the block */
    id?: string | null
    /** Optional block name for admin reference */
    blockName?: string | null
  }
}

/**
 * Generate initials from a name
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * TeamMemberCard Component
 *
 * Displays a single team member with photo/avatar, name, title, and biography
 *
 * @param {Object} props - Component props
 * @param {TeamMember} props.member - Team member data
 * @returns {JSX.Element} Rendered team member card
 */
function TeamMemberCard({ member }: { member: TeamMember }) {
  const photoUrl =
    typeof member.photo === 'object' && member.photo !== null ? member.photo?.url : null
  const photoAlt =
    typeof member.photo === 'object' && member.photo !== null ? member.photo?.alt : member.name

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white hover:bg-blue-50 border h-full flex flex-col">
      <CardContent className="p-6 flex flex-col items-center text-center flex-1">
        {/* Photo or Avatar */}
        <div className="mb-4 relative w-40 h-40">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={photoAlt || member.name}
              fill
              className="rounded-full object-cover"
              sizes="160px"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
              {getInitials(member.name)}
            </div>
          )}
        </div>

        {/* Content wrapper that grows to push button down */}
        <div className="flex-1 flex flex-col items-center w-full">
          {/* Name */}
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>

          {/* Title */}
          {member.title && <p className="text-base text-gray-600 mb-1">{member.title}</p>}

          {/* Location */}
          {member.location && <p className="text-sm text-gray-500 mb-3">{member.location}</p>}

          {/* Biography */}
          {member.biography && (
            <div className="text-sm text-gray-600 line-clamp-4 mb-4">
              <RichTextRenderer content={member.biography} />
            </div>
          )}
        </div>

        {/* Work With Button - Always at bottom */}
        {member.contactUrl && (
          <Link
            href={member.contactUrl}
            className="mt-4 px-4 py-2 bg-[#004AAD] text-white rounded-lg hover:bg-[#003a89] transition-colors font-medium text-sm inline-block"
          >
            Work with {member.name.split(' ')[0]}
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * TeamSectionBlock Component
 *
 * An async server component that displays team member profiles in either
 * a grid or carousel layout with responsive design and accessibility features.
 *
 * Key Features:
 * - Grid and carousel layout modes
 * - Responsive design (1-3 columns)
 * - Avatar fallback with initials
 * - Rich text biography support
 * - Hover animations
 * - Published toggle support
 *
 * @param {TeamSectionBlockProps} props - Component configuration from Payload CMS
 * @returns {Promise<JSX.Element | null>} Rendered team section or null if unpublished
 */
export default async function TeamSectionBlock({ block }: TeamSectionBlockProps) {
  const {
    published = true,
    heading = 'Meet Our Team',
    subheading,
    layoutMode = 'grid',
    teamMembers = [],
  } = block

  // Don't render if unpublished
  if (!published) {
    return null
  }

  // Handle empty state
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <section className="py-16" {...(block.anchorId && { id: block.anchorId })}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h2>
            {subheading && <p className="text-lg text-gray-600 mb-8">{subheading}</p>}
            <p className="text-gray-600">No team members to display</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16" {...(block.anchorId && { id: block.anchorId })}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h2>
          {subheading && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subheading}</p>}
        </div>

        {/* Grid Layout */}
        {layoutMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id || member.name} member={member} />
            ))}
          </div>
        )}

        {/* Carousel Layout */}
        {layoutMode === 'carousel' && (
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {teamMembers.map((member) => (
                <CarouselItem
                  key={member.id || member.name}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <TeamMemberCard member={member} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots />
          </Carousel>
        )}
      </div>
    </section>
  )
}
