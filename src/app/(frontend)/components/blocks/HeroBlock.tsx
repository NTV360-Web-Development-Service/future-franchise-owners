import Image from 'next/image'
import { Button } from '@/components/ui/button'
import type { Page, Media } from '@/types/payload'
import type { HeroBlockProps } from '@/types/ui'

interface HeroBlockComponentProps {
  block: Page['layout'][0]
}

export default function HeroBlock({ block }: HeroBlockComponentProps) {
  // Extract text content from the rich text subheading
  const getTextFromRichText = (richText: any): string => {
    if (!richText?.root?.children) return ''
    
    return richText.root.children
      .map((child: any) => {
        if (child.children) {
          return child.children
            .filter((item: any) => item.type === 'text')
            .map((item: any) => item.text)
            .join('')
        }
        return ''
      })
      .join(' ')
  }

  const subheadingText = getTextFromRichText(block.subheading)
  const image = block.image as Media

  return (
    <section 
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden"
      style={{ fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {block.heading}
              </h1>
              
              {subheadingText && (
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  {subheadingText}
                </p>
              )}
            </div>
            
            {block.cta_button && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <a href={block.cta_button.url}>
                    {block.cta_button.label}
                  </a>
                </Button>
              </div>
            )}
          </div>
          
          {/* Image */}
          {image && (
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
                <Image
                  src={image.url || ''}
                  alt={image.alt || 'Hero image'}
                  width={image.width || 600}
                  height={image.height || 400}
                  className="w-full h-auto rounded-xl object-cover"
                  priority
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-60 -z-10" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-200 rounded-full opacity-40 -z-10" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}