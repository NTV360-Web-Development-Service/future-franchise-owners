import { CollectionConfig } from 'payload'
import { lexicalEditor, LinkFeature, HTMLConverterFeature } from '@payloadcms/richtext-lexical'
import { SlateToLexicalFeature } from '@payloadcms/richtext-lexical/migrate'
import { auditFields } from './fields/auditFields'
import { afterChangeHook, afterDeleteHook } from '../hooks/auditLogger'

// Reusable anchor ID field for all blocks
const anchorIdField = {
  name: 'anchorId',
  type: 'text' as const,
  required: false,
  admin: {
    description:
      'Optional anchor ID for direct linking (e.g., "contact-form" creates #contact-form). Use lowercase letters, numbers, and hyphens only.',
    placeholder: 'e.g., contact-form',
    position: 'sidebar' as const,
  },
  validate: (value: string | null | undefined) => {
    if (!value) return true // Optional field

    // Validate format: lowercase letters, numbers, hyphens only
    const validFormat = /^[a-z0-9-]+$/
    if (!validFormat.test(value)) {
      return 'Anchor ID must contain only lowercase letters, numbers, and hyphens'
    }

    return true
  },
}

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [afterChangeHook],
    afterDelete: [afterDeleteHook],
    beforeValidate: [
      ({ data }) => {
        // Validate unique anchor IDs within the page
        if (!data?.layout) return data

        const anchorIds = new Map<string, string[]>()

        data.layout.forEach((block: any, index: number) => {
          if (block.anchorId) {
            const id = block.anchorId.toLowerCase()
            if (!anchorIds.has(id)) {
              anchorIds.set(id, [])
            }
            anchorIds.get(id)!.push(`${block.blockType} (position ${index + 1})`)
          }
        })

        // Check for duplicates
        const duplicates: string[] = []
        anchorIds.forEach((blocks, id) => {
          if (blocks.length > 1) {
            duplicates.push(`"${id}" used in: ${blocks.join(', ')}`)
          }
        })

        if (duplicates.length > 0) {
          throw new Error(
            `Duplicate anchor IDs found:\n${duplicates.join('\n')}\n\nEach anchor ID must be unique within the page.`,
          )
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'URL path for this page (e.g., "franchises" for /franchises, "homepage" for /). Auto-generated from title.',
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [
        {
          slug: 'franchiseGrid',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'heading',
              type: 'text',
              required: false,
              admin: { description: 'Section heading (optional)' },
            },
            {
              name: 'displayMode',
              type: 'select',
              required: true,
              defaultValue: 'automatic',
              options: [
                { label: 'Automatic (Filter-based)', value: 'automatic' },
                { label: 'Manual Selection', value: 'manual' },
              ],
              admin: {
                description: 'Choose how franchises are selected for this grid',
              },
            },
            // Manual selection fields
            {
              name: 'selectedFranchises',
              type: 'relationship',
              relationTo: 'franchises',
              hasMany: true,
              required: false,
              admin: {
                description: 'Manually select franchises to display (order matters)',
                condition: (data, siblingData) => siblingData?.displayMode === 'manual',
              },
            },
            // Show filters option (available for both modes)
            {
              name: 'showFilters',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show filter controls above the grid',
              },
            },
            {
              name: 'showTabs',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show filter tabs (Top Pick, Sponsored, Featured) next to heading',
                condition: (data, siblingData) => siblingData?.showFilters === true,
              },
            },
            // Automatic filter fields

            {
              name: 'onlyFeatured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Only include Featured franchises',
                condition: (data, siblingData) => siblingData?.displayMode === 'automatic',
              },
            },
            {
              name: 'onlySponsored',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Only include Sponsored franchises',
                condition: (data, siblingData) => siblingData?.displayMode === 'automatic',
              },
            },
            {
              name: 'onlyTopPick',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Only include Top Pick franchises',
                condition: (data, siblingData) => siblingData?.displayMode === 'automatic',
              },
            },
            {
              name: 'industry',
              type: 'relationship',
              relationTo: 'industries',
              required: false,
              hasMany: false,
              admin: {
                description: 'Filter by specific industry (optional)',
                condition: (data, siblingData) => siblingData?.displayMode === 'automatic',
              },
            },
            {
              name: 'limit',
              type: 'number',
              required: false,
              admin: {
                description: 'Maximum number of items to show (optional)',
                condition: (data, siblingData) => siblingData?.displayMode === 'automatic',
              },
            },
          ],
        },
        {
          slug: 'ribbon',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'text',
              type: 'text',
              required: true,
              admin: {
                description:
                  'The text to display in the ribbon (e.g., "Special Offer: 50% Off First Month!")',
              },
            },
            {
              name: 'backgroundColor',
              label: 'Background Color',
              type: 'text',
              required: true,
              defaultValue: '#2563eb',
              admin: {
                description: 'Background color (hex code, e.g., #2563eb for blue)',
                components: {
                  Field: '@/collections/fields/ColorPickerField',
                },
              },
            },
            {
              name: 'textColor',
              label: 'Text Color',
              type: 'text',
              required: true,
              defaultValue: '#ffffff',
              admin: {
                description: 'Text color (hex code, e.g., #ffffff for white)',
                components: {
                  Field: '@/collections/fields/ColorPickerField',
                },
              },
            },
            {
              name: 'fontSize',
              type: 'number',
              required: false,
              defaultValue: 14,
              min: 10,
              max: 32,
              admin: {
                description: 'Font size in pixels (10-32px)',
              },
            },
            {
              name: 'fontWeight',
              type: 'select',
              required: false,
              defaultValue: '400',
              options: [
                { label: 'Light (300)', value: '300' },
                { label: 'Normal (400)', value: '400' },
                { label: 'Medium (500)', value: '500' },
                { label: 'Semibold (600)', value: '600' },
                { label: 'Bold (700)', value: '700' },
                { label: 'Extrabold (800)', value: '800' },
              ],
              admin: {
                description: 'Font weight/thickness',
              },
            },
            {
              name: 'isMoving',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Enable scrolling ticker animation',
              },
            },
            {
              name: 'speed',
              type: 'number',
              required: false,
              defaultValue: 30,
              min: 10,
              max: 200,
              admin: {
                description: 'Animation speed (10-200, higher = faster). Only applies when moving.',
                condition: (data, siblingData) => siblingData?.isMoving === true,
              },
            },
            {
              name: 'textAlign',
              type: 'select',
              required: false,
              defaultValue: 'center',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
              admin: {
                description: 'Text alignment. Only applies when not moving.',
                condition: (data, siblingData) => siblingData?.isMoving === false,
              },
            },
            {
              name: 'link',
              type: 'group',
              required: false,
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'URL to navigate to when ribbon is clicked',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Open link in a new tab',
                  },
                },
              ],
              admin: {
                description: 'Optional link to make the ribbon clickable',
              },
            },
            {
              name: 'dismissible',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Allow users to dismiss/close the ribbon',
              },
            },
          ],
        },
        {
          slug: 'navbar',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'logo',
              type: 'group',
              required: false,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  admin: {
                    description: 'Logo image for the navbar',
                  },
                },
                {
                  name: 'text',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Text to display if no logo image is provided (e.g., "FFO")',
                  },
                },
              ],
              admin: {
                description: 'Logo configuration - either image or text fallback',
              },
            },
            {
              name: 'navigationLinks',
              type: 'array',
              required: true,
              minRows: 1,
              maxRows: 8,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Display text for the navigation link',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'URL path (e.g., "/", "/opportunities", "/contact")',
                  },
                },
              ],
              admin: {
                description: 'Navigation menu links',
              },
            },
            {
              name: 'ctaButton',
              type: 'group',
              required: true,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  defaultValue: 'Apply Now',
                  admin: {
                    description: 'Text for the call-to-action button',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'URL for the CTA button',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Open CTA link in a new tab',
                  },
                },
              ],
              admin: {
                description: 'Call-to-action button configuration',
              },
            },
          ],
        },
        {
          slug: 'hero',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'subheading',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  SlateToLexicalFeature({}),
                  // Enable internal links to pages and franchises
                  LinkFeature({
                    enabledCollections: ['pages', 'franchises'],
                    fields: ({ defaultFields }) => {
                      return [
                        ...defaultFields,
                        {
                          name: 'rel',
                          label: 'Rel Attribute',
                          type: 'select',
                          hasMany: true,
                          options: ['noopener', 'noreferrer', 'nofollow'],
                          admin: {
                            description:
                              'The rel attribute defines the relationship between your page and the linked page',
                          },
                        },
                        {
                          name: 'linkColor',
                          label: 'Link Color',
                          type: 'text',
                          admin: {
                            description:
                              'Custom color for this link (e.g., #004AAD, blue, rgb(0,74,173))',
                            placeholder: '#004AAD',
                          },
                        },
                      ]
                    },
                  }),
                  // Enable HTML converter to allow pasting formatted HTML
                  HTMLConverterFeature({}),
                ],
              }),
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Background image for the hero section (optional)',
              },
            },
            {
              name: 'showOverlay',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Add a dark overlay over the background image to improve contrast',
              },
            },
            {
              name: 'backgroundBlur',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Apply a soft blur to the overlay for extra readability',
              },
            },
            {
              name: 'cta_buttons',
              type: 'array',
              required: false,
              minRows: 0,
              maxRows: 5,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'Button text (e.g., "Discover Top Franchises", "Browse Opportunities")',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'URL path or external link',
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  required: true,
                  defaultValue: 'primary',
                  options: [
                    {
                      label: 'Primary (Blue)',
                      value: 'primary',
                    },
                    {
                      label: 'Secondary (White)',
                      value: 'secondary',
                    },
                  ],
                  admin: {
                    description:
                      'Button style - primary for main actions, secondary for alternative actions',
                  },
                },
              ],
              admin: {
                description: 'Call-to-action buttons (up to 5 buttons)',
              },
            },
            {
              name: 'tags',
              type: 'array',
              required: false,
              minRows: 0,
              maxRows: 8,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Tag text (e.g., "Low Cost", "Home Based", "Financing Available")',
                  },
                },
              ],
              admin: {
                description: 'Feature tags/badges to display below the buttons (up to 8 tags)',
              },
            },
          ],
        },
        {
          slug: 'aboutTeaser',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'eyebrow',
              type: 'text',
              required: false,
              defaultValue: 'About Future Franchise Owners',
              admin: {
                description: 'Short label shown above the heading (e.g., "Our Purpose")',
              },
            },
            {
              name: 'heading',
              type: 'text',
              required: false,
              defaultValue: 'Seasoned franchise experts guiding your journey',
              admin: {
                description: 'Main section heading',
              },
            },
            {
              name: 'description',
              type: 'richText',
              required: false,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  SlateToLexicalFeature({}),
                  LinkFeature({
                    enabledCollections: ['pages', 'franchises'],
                    fields: ({ defaultFields }) => {
                      return [
                        ...defaultFields,
                        {
                          name: 'rel',
                          label: 'Rel Attribute',
                          type: 'select',
                          hasMany: true,
                          options: ['noopener', 'noreferrer', 'nofollow'],
                          admin: {
                            description:
                              'The rel attribute defines the relationship between your page and the linked page',
                          },
                        },
                        {
                          name: 'linkColor',
                          label: 'Link Color',
                          type: 'text',
                          admin: {
                            description:
                              'Custom color for this link (e.g., #004AAD, blue, rgb(0,74,173))',
                            placeholder: '#004AAD',
                          },
                        },
                      ]
                    },
                  }),
                  HTMLConverterFeature({}),
                ],
              }),
              admin: {
                description: 'Supporting paragraph introducing your team and value proposition',
              },
            },
            {
              name: 'highlights',
              type: 'array',
              required: false,
              minRows: 0,
              maxRows: 4,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Short highlight title (e.g., "25+ Years Advising Franchises")',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: false,
                  admin: {
                    description: 'Optional supporting sentence elaborating on the highlight',
                  },
                },
              ],
              admin: {
                description: 'Key differentiators, credentials, or testimonials to feature',
              },
            },
            {
              name: 'ctas',
              type: 'array',
              required: false,
              minRows: 0,
              maxRows: 4,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Call-to-action text (e.g., "Speak to a Consultant")',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Call-to-action link destination',
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  required: false,
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary (Solid)', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Outline', value: 'outline' },
                    { label: 'Ghost', value: 'ghost' },
                  ],
                  admin: {
                    description: 'Visual style for the button',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Open the call-to-action in a new tab',
                  },
                },
              ],
              admin: {
                description: 'Add one or more call-to-action buttons (optional)',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Optional supporting image or consultant photo',
              },
            },
          ],
        },
        {
          slug: 'callToAction',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'eyebrow',
              type: 'text',
              required: false,
              admin: {
                description: 'Optional kicker text shown above the heading (e.g., "Let\'s Talk")',
              },
            },
            {
              name: 'heading',
              type: 'text',
              required: false,
              defaultValue: 'Ready to explore your franchise future?',
              admin: {
                description: 'Primary CTA headline',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: false,
              admin: {
                description: 'Supporting copy that reinforces the call to action',
              },
            },
            {
              name: 'alignment',
              type: 'select',
              required: false,
              defaultValue: 'center',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Left', value: 'left' },
              ],
              admin: {
                description: 'Control text and button alignment',
              },
            },
            {
              name: 'backgroundStyle',
              type: 'select',
              required: false,
              defaultValue: 'gradient',
              options: [
                { label: 'Solid Color', value: 'color' },
                { label: 'Gradient', value: 'gradient' },
                { label: 'Image', value: 'image' },
              ],
              admin: {
                description: 'Choose how the background should render',
              },
            },
            {
              name: 'backgroundColor',
              type: 'text',
              required: false,
              defaultValue: '#004AAD',
              admin: {
                description: 'Hex color used when background style is set to "Solid Color"',
                condition: (data, siblingData) => siblingData?.backgroundStyle === 'color',
              },
            },
            {
              name: 'backgroundGradient',
              type: 'text',
              required: false,
              defaultValue: 'linear-gradient(135deg, #004AAD 0%, #001C40 50%, #000814 100%)',
              admin: {
                description: 'CSS gradient value used when background style is "Gradient"',
                condition: (data, siblingData) => siblingData?.backgroundStyle === 'gradient',
              },
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Background image used when background style is "Image"',
                condition: (data, siblingData) => siblingData?.backgroundStyle === 'image',
              },
            },
            {
              name: 'overlayColor',
              type: 'text',
              required: false,
              defaultValue: '#000000',
              admin: {
                description: 'Overlay color shown on top of gradient or image backgrounds',
              },
            },
            {
              name: 'overlayOpacity',
              type: 'number',
              required: false,
              defaultValue: 0.45,
              admin: {
                description:
                  'Overlay opacity (0 - 0.95). Applies to gradient and image backgrounds.',
              },
              min: 0,
              max: 0.95,
            },
            {
              name: 'ctas',
              type: 'array',
              required: false,
              minRows: 0,
              maxRows: 3,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Button label (e.g., "Speak to a Consultant")',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Destination URL for the CTA button',
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  required: false,
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary (Brand Solid)', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Outline', value: 'outline' },
                    { label: 'Ghost', value: 'ghost' },
                  ],
                  admin: {
                    description: 'Button visual style',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Open the CTA link in a new tab',
                  },
                },
              ],
              admin: {
                description: 'Add up to three CTA buttons',
              },
            },
            {
              name: 'smallPrint',
              type: 'text',
              required: false,
              admin: {
                description: 'Optional fine print or reassurance text shown below the buttons',
              },
            },
          ],
        },
        {
          slug: 'blogHighlights',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'heading',
              type: 'text',
              required: false,
              defaultValue: 'Latest Blog Posts',
              admin: {
                description: 'Section heading (e.g., "Latest Insights", "Recent Articles")',
              },
            },
            {
              name: 'subheading',
              type: 'text',
              required: false,
              defaultValue: 'Stay updated with the latest franchise insights and business tips',
              admin: {
                description: 'Optional subheading text below the main heading',
              },
            },
            {
              name: 'feedUrl',
              type: 'text',
              required: false,
              defaultValue: 'https://quantumbc.substack.com/feed',
              admin: {
                description: 'RSS feed URL to fetch blog posts from',
              },
            },
            {
              name: 'limit',
              type: 'number',
              required: false,
              defaultValue: 6,
              min: 1,
              max: 12,
              admin: {
                description: 'Maximum number of blog posts to display (1-12)',
              },
            },
            {
              name: 'showAuthor',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Display author information on each post',
              },
            },
            {
              name: 'showDate',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Display publication date on each post',
              },
            },
            {
              name: 'showReadTime',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Display estimated reading time on each post',
              },
            },
            {
              name: 'viewAllLink',
              type: 'text',
              required: false,
              defaultValue: 'https://quantumbc.substack.com',
              admin: {
                description: 'URL for the "View All Posts" button (e.g., link to your full blog)',
              },
            },
            {
              name: 'showViewAllButton',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show the "View All Posts" button at the bottom',
              },
            },
          ],
        },
        {
          slug: 'map',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'heading',
              type: 'text',
              required: false,
              defaultValue: 'Find Franchise Opportunities Near You',
              admin: {
                description:
                  'Section heading (e.g., "Explore Our Locations", "Find Opportunities")',
              },
            },
            {
              name: 'description',
              type: 'text',
              required: false,
              defaultValue:
                'Explore our network of franchise locations and discover opportunities in your area.',
              admin: {
                description: 'Optional description text below the heading',
              },
            },
            {
              name: 'mapUrl',
              type: 'text',
              required: false,
              defaultValue:
                'https://www.google.com/maps/d/u/0/embed?mid=1WvsN2zVD73ijJA6Kmyrv72IN36qRZxo&ehbc=2E312F',
              admin: {
                description: 'Google Maps embed URL (from Google My Maps)',
              },
            },
            {
              name: 'height',
              type: 'number',
              required: false,
              defaultValue: 450,
              min: 300,
              max: 800,
              admin: {
                description: 'Map height in pixels (300-800)',
              },
            },
            {
              name: 'showViewButton',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show "View Full Map" button below the map',
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              required: false,
              defaultValue: 'View Full Directory',
              admin: {
                description: 'Custom text for the "View Full Map" button',
              },
            },
          ],
        },
        {
          slug: 'teamSection',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'heading',
              type: 'text',
              required: false,
              defaultValue: 'Meet Our Team',
              admin: {
                description: 'Section heading (e.g., "Our Team", "Meet the Experts")',
              },
            },
            {
              name: 'subheading',
              type: 'text',
              required: false,
              admin: {
                description: 'Optional subheading text below the main heading',
              },
            },
            {
              name: 'layoutMode',
              type: 'select',
              required: true,
              defaultValue: 'grid',
              options: [
                { label: 'Grid', value: 'grid' },
                { label: 'Carousel', value: 'carousel' },
              ],
              admin: {
                description: 'Choose how team members are displayed',
              },
            },
            {
              name: 'teamMembers',
              type: 'array',
              required: false,
              minRows: 0,
              maxRows: 50,
              fields: [
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  admin: {
                    description:
                      'Team member photo (optional - will show initials if not provided)',
                  },
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Team member full name',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Job title or role (e.g., "Senior Consultant", "CEO")',
                  },
                },
                {
                  name: 'location',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Location (e.g., "New York, NY", "Remote", "San Francisco")',
                  },
                },
                {
                  name: 'biography',
                  type: 'richText',
                  required: false,
                  editor: lexicalEditor({
                    features: ({ defaultFeatures }) => [
                      ...defaultFeatures,
                      SlateToLexicalFeature({}),
                      LinkFeature({
                        enabledCollections: ['pages', 'franchises'],
                        fields: ({ defaultFields }) => {
                          return [
                            ...defaultFields,
                            {
                              name: 'rel',
                              label: 'Rel Attribute',
                              type: 'select',
                              hasMany: true,
                              options: ['noopener', 'noreferrer', 'nofollow'],
                              admin: {
                                description:
                                  'The rel attribute defines the relationship between your page and the linked page',
                              },
                            },
                            {
                              name: 'linkColor',
                              label: 'Link Color',
                              type: 'text',
                              admin: {
                                description:
                                  'Custom color for this link (e.g., #004AAD, blue, rgb(0,74,173))',
                                placeholder: '#004AAD',
                              },
                            },
                          ]
                        },
                      }),
                      HTMLConverterFeature({}),
                    ],
                  }),
                  admin: {
                    description: 'Team member biography with support for links and formatting',
                  },
                },
              ],
              admin: {
                description: 'Add team members to display (up to 50 members)',
              },
            },
          ],
        },
        {
          slug: 'formBuilder',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'heading',
              type: 'text',
              required: false,
              defaultValue: 'Get in Touch',
              admin: {
                description: 'Form heading (e.g., "Contact Us", "Request Information")',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: false,
              admin: {
                description: 'Optional description text above the form',
              },
            },
            {
              name: 'formFields',
              type: 'array',
              label: 'Form Fields',
              required: true,
              minRows: 1,
              maxRows: 20,
              fields: [
                {
                  name: 'fieldType',
                  type: 'select',
                  required: true,
                  defaultValue: 'text',
                  options: [
                    { label: 'Text Input', value: 'text' },
                    { label: 'Email', value: 'email' },
                    { label: 'Phone', value: 'tel' },
                    { label: 'Number', value: 'number' },
                    { label: 'Text Area', value: 'textarea' },
                    { label: 'Select Dropdown', value: 'select' },
                  ],
                  admin: {
                    description: 'Type of input field',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Field label (e.g., "Full Name", "Email Address")',
                  },
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'Field name for form data (e.g., "fullName", "email") - use camelCase, no spaces',
                  },
                },
                {
                  name: 'placeholder',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Optional placeholder text',
                  },
                },
                {
                  name: 'required',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Make this field required',
                  },
                },
                {
                  name: 'width',
                  type: 'select',
                  required: true,
                  defaultValue: 'full',
                  options: [
                    { label: 'Full Width', value: 'full' },
                    { label: 'Half Width', value: 'half' },
                    { label: 'One Third', value: 'third' },
                  ],
                  admin: {
                    description: 'Field width - use half or third for side-by-side fields',
                  },
                },
                {
                  name: 'options',
                  type: 'array',
                  required: false,
                  minRows: 1,
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                    },
                  ],
                  admin: {
                    description:
                      'Options for select dropdown (only used when field type is Select)',
                    condition: (data, siblingData) => siblingData?.fieldType === 'select',
                  },
                },
              ],
              admin: {
                description: 'Add and configure form fields - drag to reorder',
              },
            },
            {
              name: 'submitButtonText',
              type: 'text',
              required: false,
              defaultValue: 'Send Message',
              admin: {
                description: 'Text for the submit button',
              },
            },
            {
              name: 'successMessage',
              type: 'text',
              required: false,
              defaultValue: "Thank you! We'll get back to you soon.",
              admin: {
                description: 'Message shown after successful form submission',
              },
            },
          ],
        },
        {
          slug: 'contactInfo',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'heading',
              type: 'text',
              required: false,
              defaultValue: 'Contact Information',
              admin: {
                description: 'Section heading (e.g., "Reach Us", "Get in Touch")',
              },
            },
            {
              name: 'contactDetails',
              type: 'group',
              label: 'Contact Details',
              fields: [
                {
                  name: 'showPhone',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show phone number',
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Phone number (e.g., "(555) 123-4567")',
                    condition: (data, siblingData) => siblingData?.showPhone === true,
                  },
                },
                {
                  name: 'showEmail',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show email address',
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  required: false,
                  admin: {
                    description: 'Email address',
                    condition: (data, siblingData) => siblingData?.showEmail === true,
                  },
                },
                {
                  name: 'showAddress',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show physical address',
                  },
                },
                {
                  name: 'address',
                  type: 'textarea',
                  required: false,
                  admin: {
                    description: 'Physical address (use line breaks for formatting)',
                    condition: (data, siblingData) => siblingData?.showAddress === true,
                  },
                },
                {
                  name: 'showHours',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Show business hours',
                  },
                },
                {
                  name: 'hours',
                  type: 'textarea',
                  required: false,
                  admin: {
                    description: 'Business hours (use line breaks for formatting)',
                    condition: (data, siblingData) => siblingData?.showHours === true,
                  },
                },
              ],
            },
            {
              name: 'showMap',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Show embedded map',
              },
            },
            {
              name: 'mapUrl',
              type: 'text',
              required: false,
              admin: {
                description: 'Google Maps embed URL',
                condition: (data, siblingData) => siblingData?.showMap === true,
              },
            },
            {
              name: 'mapHeight',
              type: 'number',
              required: false,
              defaultValue: 300,
              min: 200,
              max: 600,
              admin: {
                description: 'Map height in pixels (200-600)',
                condition: (data, siblingData) => siblingData?.showMap === true,
              },
            },
          ],
        },
        {
          slug: 'addToCart',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
                position: 'sidebar',
              },
            },
            anchorIdField,
            {
              name: 'franchise',
              type: 'relationship',
              relationTo: 'franchises',
              required: true,
              admin: {
                description: 'Select the franchise to add',
              },
            },
            {
              name: 'listType',
              type: 'select',
              required: false,
              defaultValue: 'wishlist',
              options: [
                { label: 'Wishlist (Save for later)', value: 'wishlist' },
                { label: 'Cart (Ready to pursue)', value: 'cart' },
              ],
              admin: {
                description: 'Choose which list to add the franchise to',
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              required: false,
              admin: {
                description: 'Custom button text (optional, auto-generated based on list type)',
              },
            },
            {
              name: 'buttonVariant',
              type: 'select',
              required: false,
              defaultValue: 'default',
              options: [
                { label: 'Default (Solid)', value: 'default' },
                { label: 'Outline', value: 'outline' },
                { label: 'Ghost', value: 'ghost' },
              ],
              admin: {
                description: 'Button style',
              },
            },
            {
              name: 'buttonSize',
              type: 'select',
              required: false,
              defaultValue: 'default',
              options: [
                { label: 'Small', value: 'sm' },
                { label: 'Default', value: 'default' },
                { label: 'Large', value: 'lg' },
              ],
              admin: {
                description: 'Button size',
              },
            },
            {
              name: 'alignment',
              type: 'select',
              required: false,
              defaultValue: 'center',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
              admin: {
                description: 'Button alignment',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'SEO title (50-60 characters). Leave empty to use page title + site name.',
            placeholder: 'Leave empty to use default',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          maxLength: 160,
          admin: {
            description:
              'SEO description (150-160 characters). Appears in search results. Leave empty to use site default.',
            placeholder: 'Leave empty to use default',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Focus Keywords',
          admin: {
            description:
              'Comma-separated keywords for this page (e.g., "food franchises, restaurant opportunities"). Leave empty to use site defaults.',
            placeholder: 'keyword1, keyword2, keyword3',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
          admin: {
            description:
              'Image for social media sharing (1200x630px recommended). Leave empty to use site default.',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'No Index',
          defaultValue: false,
          admin: {
            description:
              '⚠️ Check to prevent search engines from indexing this page (useful for draft/private pages)',
          },
        },
      ],
    },
    // Audit fields
    ...auditFields,
  ],
}

export default Pages
/**
 * Pages collection
 *
 * CMS-managed pages composed of reusable blocks (Ribbon, Navbar, Hero,
 * FranchiseGrid). Used to render the frontend without hardcoding layout.
 * Primary `id` is a UUID string.
 */
