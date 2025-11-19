import { getPayload } from 'payload'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LucideIcon } from '@/components/ui/lucide-icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import {
  DollarSign,
  TrendingUp,
  Award,
  Star,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from 'lucide-react'

import config from '@/payload.config'

/**
 * Extract plain text from Payload's Lexical rich text format
 */
function extractPlainText(richText: any): string {
  if (!richText || !richText.root || !richText.root.children) return ''

  const extractFromNode = (node: any): string => {
    if (node.text) return node.text

    if (Array.isArray(node.children)) {
      return node.children.map((child: any) => extractFromNode(child)).join(' ')
    }

    return ''
  }

  return richText.root.children.map((child: any) => extractFromNode(child)).join('\n\n')
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number | null | undefined): string {
  if (typeof amount !== 'number') return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * FranchiseDetailPage - Beautiful franchise detail page
 */
export default async function FranchiseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const franchise = await payload.findByID({
    collection: 'franchises',
    id,
    depth: 2,
  })

  if (!franchise) {
    notFound()
  }

  // Extract data
  const industries = Array.isArray(franchise.industry) ? franchise.industry : []
  const industry = industries.length > 0 && typeof industries[0] === 'object' ? industries[0] : null
  const agent = typeof franchise.assignedAgent === 'object' ? franchise.assignedAgent : null
  const logo = typeof franchise.logo === 'object' ? franchise.logo : null
  const agentPhoto = agent && typeof agent.photo === 'object' ? agent.photo : null
  const tags = Array.isArray(franchise.tags) ? franchise.tags : []

  // Investment range
  const minInvestment = franchise.investment?.min
  const maxInvestment = franchise.investment?.max
  const investmentRange =
    minInvestment && maxInvestment
      ? `${formatCurrency(minInvestment)} - ${formatCurrency(maxInvestment)}`
      : minInvestment
        ? `Starting at ${formatCurrency(minInvestment)}`
        : maxInvestment
          ? `Up to ${formatCurrency(maxInvestment)}`
          : 'Contact for details'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header/Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/franchises"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Franchises
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            {logo?.url && (
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-xl p-4 flex items-center justify-center">
                  <Image
                    src={logo.url}
                    alt={logo.alt || franchise.businessName}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Title and badges */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {franchise.isTopPick && (
                  <Badge className="bg-red-600 text-white border-red-600">
                    <Award className="w-3 h-3 mr-1" />
                    Top Pick
                  </Badge>
                )}
                {franchise.isSponsored && (
                  <Badge className="bg-orange-500 text-white border-orange-500">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Sponsored
                  </Badge>
                )}
                {franchise.isFeatured && (
                  <Badge className="bg-green-600 text-white border-green-600">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{franchise.businessName}</h1>

              {industries.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {industries.map((ind: any, idx: number) => (
                    <Badge
                      key={idx}
                      className="text-base px-3 py-1"
                      style={
                        ind.color
                          ? {
                              backgroundColor: ind.color,
                              color: ind.textColor || '#ffffff',
                              borderColor: ind.color,
                            }
                          : {
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            }
                      }
                    >
                      {ind.icon && <LucideIcon name={ind.icon} size={16} className="mr-1.5" />}
                      {ind.name}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
                  <Mail className="w-4 h-4 mr-2" />
                  Request Information
                </Button>
                <Button
                  size="lg"
                  className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-slate-900 transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Investment Card */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Initial Investment</h2>
                    <p className="text-3xl font-bold text-slate-900">{investmentRange}</p>
                    <p className="text-sm text-gray-600 mt-1">Cash required to get started</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Franchise</h2>
                {franchise.description ? (
                  <RichTextRenderer
                    content={franchise.description}
                    className="text-gray-700 leading-relaxed"
                  />
                ) : (
                  <p className="text-gray-700">No description available.</p>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            {tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: any) => {
                      const tagData = typeof tag === 'object' ? tag : null
                      if (!tagData) return null

                      return (
                        <Badge
                          key={tagData.id}
                          variant="outline"
                          className="text-sm px-3 py-1"
                          style={{
                            backgroundColor: tagData.color || '#f3f4f6',
                            color: tagData.textColor || '#374151',
                            borderColor: tagData.color || '#e5e7eb',
                          }}
                        >
                          {tagData.name}
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Contact Card */}
            {agent && !franchise.useMainContact && (
              <Card className="border-2 border-slate-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Your Franchise Consultant
                  </h3>

                  <div className="flex items-start gap-4 mb-4">
                    {agentPhoto?.url && (
                      <Image
                        src={agentPhoto.url}
                        alt={agent.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                      {agent.title && <p className="text-sm text-gray-600">{agent.title}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {agent.email && (
                      <a
                        href={`mailto:${agent.email}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-slate-900 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {agent.email}
                      </a>
                    )}
                    {agent.phone && (
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-slate-900 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {agent.phone}
                      </a>
                    )}
                  </div>

                  <Button className="w-full mt-4 bg-slate-900 hover:bg-slate-800">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact {agent.name}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Industry</p>
                      <p className="text-gray-600">{industry?.name || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Status</p>
                      <p className="text-gray-600 capitalize">{franchise.status || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Connect with us today to learn more about this franchise opportunity.
                </p>
                <Button className="w-full bg-white text-slate-900 hover:bg-gray-100">
                  Request Free Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
