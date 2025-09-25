// Hero block component types
export interface HeroBlockProps {
  heading: string
  subheading: any // Rich text from Payload
  image: any // Media from Payload
  cta_button: {
    label: string
    url: string
  }
}