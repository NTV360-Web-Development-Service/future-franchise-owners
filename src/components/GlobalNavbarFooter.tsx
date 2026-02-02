'use client'

import { usePathname } from 'next/navigation'
import NavbarBlock from '@/components/blocks/NavbarBlock'
import FooterBlock from '@/components/blocks/FooterBlock'
import { shouldShowOnPage } from '@/lib/shouldShowOnPage'
import type { SiteSetting } from '@/payload-types'

interface GlobalNavbarFooterProps {
  siteSettings: SiteSetting | null
  position: 'navbar' | 'footer'
}

/**
 * Client component that handles navbar/footer visibility based on current route
 * This allows proper visibility updates during client-side navigation
 */
export function GlobalNavbarFooter({ siteSettings, position }: GlobalNavbarFooterProps) {
  const pathname = usePathname()

  // Extract the slug from pathname (remove leading slash)
  const currentSlug = pathname === '/' ? 'homepage' : pathname.slice(1).split('/')[0]

  if (position === 'navbar') {
    // Check if navbar should be visible on this page
    const showNavbar =
      siteSettings?.navbarPublished !== false &&
      siteSettings?.navbar &&
      shouldShowOnPage(
        siteSettings?.navbarVisibility as 'all' | 'include' | 'exclude' | undefined,
        siteSettings?.navbarPages || undefined,
        currentSlug,
      )

    return (
      <>
        {showNavbar && siteSettings?.navbar && (
          <NavbarBlock
            block={{
              blockType: 'navbar',
              logo: {
                image: siteSettings.navbar.logo || null,
                text: siteSettings.navbar.logoText || 'FFO',
              },
              navigationLinks: siteSettings.navbar.links || [],
              ctaButton: {
                label: siteSettings.navbar.ctaButton?.label || 'Get Started',
                url: siteSettings.navbar.ctaButton?.url || '/contact',
                openInNewTab: false,
              },
            }}
          />
        )}
      </>
    )
  }

  // Footer position
  const showFooter =
    siteSettings?.footerPublished !== false &&
    siteSettings?.footer &&
    shouldShowOnPage(
      siteSettings?.footerVisibility as 'all' | 'include' | 'exclude' | undefined,
      siteSettings?.footerPages || undefined,
      currentSlug,
    )

  return (
    <>
      {showFooter && siteSettings?.footer && (
        <FooterBlock
          block={{
            blockType: 'footer',
            logo: siteSettings.footer.logo || null,
            companyName: siteSettings.footer.companyName || 'Future Franchise Owners',
            tagline: siteSettings.footer.tagline || 'Your partner in franchise success',
            copyrightText: siteSettings.footer.copyrightText || null,
            showSocialLinks: siteSettings.footer.showSocialLinks ?? true,
            socialLinks: siteSettings.footer.socialLinks || [],
            footerColumns: siteSettings.footer.footerColumns || [],
            bottomLinks: siteSettings.footer.bottomLinks || [],
            backgroundColor: siteSettings.footer.backgroundColor || '#0F172A',
            useGradient: siteSettings.footer.useGradient ?? false,
            gradientFrom: siteSettings.footer.gradientFrom || '#0F172A',
            gradientTo: siteSettings.footer.gradientTo || '#1E3A5F',
            gradientDirection: siteSettings.footer.gradientDirection || 'to-b',
            textColor: siteSettings.footer.textColor || '#F1F5F9',
            backgroundImage: siteSettings.footer.backgroundImage || null,
            backgroundBlur: siteSettings.footer.backgroundBlur ?? 0,
            overlayColor: siteSettings.footer.overlayColor || '#000000',
            overlayOpacity: siteSettings.footer.overlayOpacity ?? 0.6,
          }}
        />
      )}
    </>
  )
}
