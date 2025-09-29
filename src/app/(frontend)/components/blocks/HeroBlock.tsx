import { Button, Badge } from '@/components'

interface HeroBlockComponentProps {
  block: {
    blockType: 'hero'
    heading: string
    subheading: any // Rich text from Payload
    image?: {
      url?: string | null
      alt?: string
      [key: string]: any // Additional Media fields from Payload
    } | string | null
    cta_buttons?: {
      label: string
      url: string
      style?: 'primary' | 'secondary'
    }[] | null
    tags?: {
      label: string
    }[] | null
    id?: string | null
    blockName?: string | null
  }
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

  return (
    <section 
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ 
        fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif",
        backgroundImage: "url('/images/hero-bg.avif')"
      }}
      aria-label="Hero"
    >
      {/* Brand gradient overlay for readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow / tagline placeholder (optional) */}
          {/* <p className="text-sm font-medium text-blue-200">Discover the best franchises</p> */}

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
            {block.heading}
          </h1>
          
          {subheadingText && (
            <p className="mt-6 text-lg sm:text-xl text-white/80">
              {subheadingText}
            </p>
          )}

          {/* CTAs */}
          {block.cta_buttons && block.cta_buttons.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {block.cta_buttons.map((button, index) => (
                <Button 
                  key={index}
                  asChild 
                  size="lg"
                  className={`px-8 ${
                    button.style === 'secondary' 
                      ? 'bg-white text-[#004AAD] hover:bg-white/90' 
                      : 'bg-[#004AAD] text-white hover:bg-[#003a89]'
                  }`}
                >
                  <a href={button.url}>
                    {button.label}
                  </a>
                </Button>
              ))}
            </div>
          )}

          {/* Tags / badges */}
          {block.tags && block.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {block.tags.map((tag, index) => (
                <Badge 
                  key={index}
                  className="bg-white/10 text-white border-white/30" 
                  variant="outline"
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}