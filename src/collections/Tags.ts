import { CollectionConfig } from 'payload'
import { auditFields } from './fields/auditFields'
import { afterChangeHook, afterDeleteHook } from '../hooks/auditLogger'

/**
 * Tags Collection
 *
 * Manages franchise feature tags for filtering and categorization.
 * Allows adding new tags dynamically.
 */
export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'createdAt'],
  },
  access: {
    read: () => true, // Public access for reading
  },
  hooks: {
    afterChange: [afterChangeHook],
    afterDelete: [afterDeleteHook],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Tag name (e.g., "Low Cost", "Home Based", "Financing Available")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version (auto-generated from name)',
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
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
      name: 'type',
      type: 'select',
      required: false,
      defaultValue: 'feature',
      options: [
        { label: 'Feature', value: 'feature' },
        { label: 'Investment Level', value: 'investment' },
        { label: 'Business Model', value: 'model' },
        { label: 'Location Type', value: 'location' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Categorize the tag for better organization',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Optional description of this tag',
      },
    },
    {
      name: 'color',
      label: 'Background Color',
      type: 'text',
      required: false,
      admin: {
        description: 'Badge background color (hex code) - Leave empty for default light gray',
        components: {
          Field: '@/collections/fields/ColorPickerField',
        },
      },
    },
    {
      name: 'textColor',
      label: 'Text Color',
      type: 'text',
      required: false,
      defaultValue: '#ffffff',
      admin: {
        description:
          'Badge text color (hex code) - Only used when background color is set. Default is white (#ffffff)',
        components: {
          Field: '@/collections/fields/ColorPickerField',
        },
      },
    },
    // Audit fields
    ...auditFields,
  ],
}

export default Tags
