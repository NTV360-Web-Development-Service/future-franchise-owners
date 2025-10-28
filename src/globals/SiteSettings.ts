import { GlobalConfig } from 'payload'

/**
 * Site Settings Global
 *
 * Manages site-wide configuration including navbar and footer.
 * This is a singleton that can be accessed from any page.
 */
const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true, // Public
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Navbar',
          fields: [
            {
              name: 'navbarPublished',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from all pages)',
                position: 'sidebar',
              },
            },
            {
              name: 'navbarVisibility',
              type: 'select',
              defaultValue: 'all',
              admin: {
                description: 'Control where the navbar appears',
              },
              options: [
                {
                  label: 'Show on All Pages',
                  value: 'all',
                },
                {
                  label: 'Show on Specific Pages',
                  value: 'include',
                },
                {
                  label: 'Hide on Specific Pages',
                  value: 'exclude',
                },
              ],
            },
            {
              name: 'navbarPages',
              type: 'relationship',
              relationTo: 'pages',
              hasMany: true,
              required: false,
              admin: {
                description: 'Select pages to include or exclude based on visibility setting above',
                condition: (data, siblingData) => {
                  return siblingData?.navbarVisibility && siblingData.navbarVisibility !== 'all'
                },
              },
            },
            {
              name: 'navbar',
              type: 'group',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  admin: {
                    description: 'Logo image for the navbar',
                  },
                },
                {
                  name: 'logoText',
                  type: 'text',
                  required: false,
                  defaultValue: 'Future Franchise Owners',
                  admin: {
                    description: 'Text to display if no logo is uploaded',
                  },
                },
                {
                  name: 'links',
                  type: 'array',
                  required: false,
                  admin: {
                    description: 'Navigation links',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                  ],
                },
                {
                  name: 'ctaButton',
                  type: 'group',
                  admin: {
                    description: 'Optional call-to-action button',
                  },
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'label',
                      type: 'text',
                      required: false,
                      defaultValue: 'Get Started',
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: false,
                      defaultValue: '/contact',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerPublished',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from all pages)',
                position: 'sidebar',
              },
            },
            {
              name: 'footerVisibility',
              type: 'select',
              defaultValue: 'all',
              admin: {
                description: 'Control where the footer appears',
              },
              options: [
                {
                  label: 'Show on All Pages',
                  value: 'all',
                },
                {
                  label: 'Show on Specific Pages',
                  value: 'include',
                },
                {
                  label: 'Hide on Specific Pages',
                  value: 'exclude',
                },
              ],
            },
            {
              name: 'footerPages',
              type: 'relationship',
              relationTo: 'pages',
              hasMany: true,
              required: false,
              admin: {
                description: 'Select pages to include or exclude based on visibility setting above',
                condition: (data, siblingData) => {
                  return siblingData?.footerVisibility && siblingData.footerVisibility !== 'all'
                },
              },
            },
            {
              name: 'footer',
              type: 'group',
              fields: [
                {
                  name: 'companyName',
                  type: 'text',
                  required: false,
                  defaultValue: 'Future Franchise Owners',
                  admin: {
                    description: 'Company name displayed in footer',
                  },
                },
                {
                  name: 'tagline',
                  type: 'text',
                  required: false,
                  defaultValue: 'Your partner in franchise success',
                  admin: {
                    description: 'Tagline or description',
                  },
                },
                {
                  name: 'copyrightText',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Custom copyright text (leave empty for auto-generated)',
                  },
                },
                {
                  name: 'showSocialLinks',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Display social media links',
                  },
                },
                {
                  name: 'socialLinks',
                  type: 'array',
                  required: false,
                  admin: {
                    description:
                      'Add your social media links - icons will be displayed automatically',
                    condition: (data, siblingData) => siblingData?.showSocialLinks,
                  },
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Twitter / X', value: 'twitter' },
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'TikTok', value: 'tiktok' },
                        { label: 'Pinterest', value: 'pinterest' },
                        { label: 'Reddit', value: 'reddit' },
                        { label: 'Discord', value: 'discord' },
                        { label: 'Slack', value: 'slack' },
                        { label: 'GitHub', value: 'github' },
                        { label: 'GitLab', value: 'gitlab' },
                        { label: 'Twitch', value: 'twitch' },
                        { label: 'WhatsApp', value: 'whatsapp' },
                        { label: 'Telegram', value: 'telegram' },
                        { label: 'Mail', value: 'mail' },
                        { label: 'Globe / Website', value: 'globe' },
                      ],
                      admin: {
                        description: 'Select the social media platform',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Full URL to your social media profile',
                        placeholder: 'https://facebook.com/yourpage',
                      },
                    },
                  ],
                },
                {
                  name: 'footerColumns',
                  type: 'array',
                  required: false,
                  admin: {
                    description: 'Footer navigation columns',
                  },
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'links',
                      type: 'array',
                      required: true,
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'url',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'openInNewTab',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'bottomLinks',
                  type: 'array',
                  required: false,
                  admin: {
                    description: 'Links in the bottom bar (e.g., Privacy Policy, Terms)',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  required: false,
                  defaultValue: '#0F172A',
                  admin: {
                    description: 'Footer background color (hex code)',
                  },
                },
                {
                  name: 'textColor',
                  type: 'text',
                  required: false,
                  defaultValue: '#F1F5F9',
                  admin: {
                    description: 'Footer text color (hex code)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: false,
              defaultValue: 'Future Franchise Owners',
              admin: {
                description: 'Site name used in meta tags',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              required: false,
              admin: {
                description: 'Default site description for SEO',
              },
            },
            {
              name: 'contactEmail',
              type: 'email',
              required: false,
              admin: {
                description: 'Contact email for the site',
              },
            },
            {
              name: 'contactPhone',
              type: 'text',
              required: false,
              admin: {
                description: 'Contact phone number',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'defaultTitle',
                  type: 'text',
                  required: false,
                  defaultValue: 'Future Franchise Owners - Find Your Perfect Franchise',
                  admin: {
                    description:
                      "Default SEO title (50-60 characters). Used when pages don't have a custom title.",
                  },
                },
                {
                  name: 'defaultDescription',
                  type: 'textarea',
                  required: false,
                  maxLength: 160,
                  defaultValue:
                    'Discover your next franchise opportunity with expert guidance. Browse top franchises across industries and connect with seasoned consultants.',
                  admin: {
                    description:
                      'Default meta description (150-160 characters). Appears in search results.',
                  },
                },
                {
                  name: 'keywords',
                  type: 'text',
                  required: false,
                  defaultValue:
                    'franchise opportunities, buy a franchise, franchise business, franchise consultant, franchise investment, best franchises',
                  admin: {
                    description:
                      'Default keywords (comma-separated). Used for pages without specific keywords.',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  admin: {
                    description:
                      "Default social share image (1200x630px recommended). Used when pages don't have a custom image.",
                  },
                },
                {
                  name: 'twitterHandle',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Twitter/X handle (e.g., @yourhandle) for Twitter Card metadata',
                    placeholder: '@yourhandle',
                  },
                },
                {
                  name: 'facebookAppId',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Facebook App ID for Facebook Open Graph',
                  },
                },
                {
                  name: 'googleSiteVerification',
                  type: 'text',
                  required: false,
                  admin: {
                    description:
                      'Google Search Console verification code (from <meta name="google-site-verification" content="...">)',
                  },
                },
                {
                  name: 'bingSiteVerification',
                  type: 'text',
                  required: false,
                  admin: {
                    description:
                      'Bing Webmaster Tools verification code (from <meta name="msvalidate.01" content="...">)',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default SiteSettings
