import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Fetches the global site settings from Payload CMS
 * @returns Site settings including navbar and footer configuration
 */
export async function getSiteSettings() {
  const payload = await getPayload({ config })

  try {
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 2, // Populate relationship fields (navbarPages, footerPages, etc.)
    })

    return settings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    // Return default settings if fetch fails
    return null
  }
}
