import { CollectionConfig } from 'payload'
import { v7 as uuidv7 } from 'uuid'

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => uuidv7(),
      admin: {
        hidden: true,
      },
    },
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
              name: 'text',
              type: 'text',
              required: true,
              admin: {
                description: 'The text to display in the ribbon (e.g., "Special Offer: 50% Off First Month!")',
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
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'subheading',
              type: 'richText',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
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
                    description: 'Button text (e.g., "Discover Top Franchises", "Browse Opportunities")',
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
                    description: 'Button style - primary for main actions, secondary for alternative actions',
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
      ],
    },
  ],
}

export default Pages
