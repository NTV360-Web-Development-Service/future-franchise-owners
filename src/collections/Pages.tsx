import { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { SlateToLexicalFeature } from '@payloadcms/richtext-lexical/migrate'

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
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
            {
              name: 'heading',
              type: 'text',
              required: false,
              admin: { description: 'Section heading (optional)' },
            },
            {
              name: 'showFilters',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Show filter controls above the grid' },
            },
            {
              name: 'onlyFeatured',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Only include Featured franchises' },
            },
            {
              name: 'onlySponsored',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Only include Sponsored franchises' },
            },
            {
              name: 'onlyTopPick',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Only include Top Pick franchises' },
            },
            {
              name: 'category',
              type: 'select',
              required: false,
              options: [
                { label: 'All', value: 'all' },
                { label: 'Fitness', value: 'Fitness' },
                { label: 'Food and Beverage', value: 'Food and Beverage' },
                { label: 'Health and Wellness', value: 'Health and Wellness' },
                { label: 'Home Services', value: 'Home Services' },
                { label: 'Senior Care', value: 'Senior Care' },
                { label: 'Sports', value: 'Sports' },
              ],
              admin: { description: 'Restrict grid to a single category (optional)' },
            },
            {
              name: 'limit',
              type: 'number',
              required: false,
              admin: { description: 'Maximum number of items to show (optional)' },
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
              type: 'select',
              required: true,
              defaultValue: 'blue',
              options: [
                {
                  label: 'Blue',
                  value: 'blue',
                },
                {
                  label: 'Red',
                  value: 'red',
                },
                {
                  label: 'Green',
                  value: 'green',
                },
                {
                  label: 'Yellow',
                  value: 'yellow',
                },
                {
                  label: 'Purple',
                  value: 'purple',
                },
                {
                  label: 'Orange',
                  value: 'orange',
                },
              ],
              admin: {
                description: 'Background color of the ribbon',
              },
            },
            {
              name: 'textColor',
              type: 'select',
              required: true,
              defaultValue: 'white',
              options: [
                {
                  label: 'White',
                  value: 'white',
                },
                {
                  label: 'Black',
                  value: 'black',
                },
              ],
              admin: {
                description: 'Text color for the ribbon',
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
                features: ({ defaultFeatures }) => [...defaultFeatures, SlateToLexicalFeature({})],
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
              type: 'textarea',
              required: false,
              defaultValue:
                'We combine decades of franchise ownership, coaching, and operations experience to help entrepreneurs make confident, informed decisions.',
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
              },
            },
            {
              name: 'backgroundGradient',
              type: 'text',
              required: false,
              defaultValue: 'linear-gradient(135deg, #004AAD 0%, #001C40 50%, #000814 100%)',
              admin: {
                description: 'CSS gradient value used when background style is "Gradient"',
              },
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Background image used when background style is "Image"',
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
      ],
    },
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
