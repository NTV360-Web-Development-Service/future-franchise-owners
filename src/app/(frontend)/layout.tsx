import React from 'react'
import '../globals.css'
import { Navbar } from '@/components'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers.js'
import config from '@/payload.config'
import type { Media } from '@/types/payload'
import Marquee from 'react-fast-marquee'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

function TickerBar({
  text,
  bg = '#004AAD',
  color = '#ffffff',
  speed = 40,
  fontSizeClass = 'text-sm',
}: {
  text: string
  bg?: string
  color?: string
  speed?: number // pixels per second
  fontSizeClass?: string
}) {
  return (
    <div className="w-full" style={{ backgroundColor: bg, color }}>
      <Marquee gradient={false} speed={speed} pauseOnHover={true}>
        <span className={`py-2 ${fontSizeClass} mx-8`}>{text}</span>
        <span className={`py-2 ${fontSizeClass} mx-8`}>{text}</span>
        <span className={`py-2 ${fontSizeClass} mx-8`}>{text}</span>
      </Marquee>
    </div>
  )
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  await payload.auth({ headers })

  const {
    docs: [page],
  } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'landing-page' } },
  })

  let logoUrl: string | null = null
  let logoAlt: string | null = null
  let logoWidth: number | undefined
  let logoHeight: number | undefined

  const hero = page?.layout?.find((b) => b.blockType === 'hero')
  const heroImage = hero?.image as Media | null
  if (heroImage && typeof heroImage === 'object') {
    logoUrl = heroImage.url ?? null
    logoAlt = heroImage.alt ?? null
    logoWidth = heroImage.width ?? undefined
    logoHeight = heroImage.height ?? undefined
  }

  return (
    <html lang="en">
      <body>
        <TickerBar
          text="Find your perfect franchise • New arrivals • Low investment options • Financing available • Speak to a consultant now"
          bg="#004AAD"
          color="#ffffff"
          speed={30}
          fontSizeClass="text-sm"
        />
        <Navbar logoUrl={logoUrl ?? undefined} logoAlt={logoAlt ?? undefined} logoWidth={logoWidth} logoHeight={logoHeight} />
        <main>{children}</main>
      </body>
    </html>
  )
}
