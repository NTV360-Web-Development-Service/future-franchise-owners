import { CollectionConfig } from 'payload'
import { auditFields } from './fields/auditFields'
import { afterChangeHook, afterDeleteHook } from '../hooks/auditLogger'

/**
 * Industries Collection
 *
 * Manages franchise industry categories for consistent categorization
 * across the site. Allows adding new industries dynamically.
 */
export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'createdAt'],
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
        description: 'Industry name (e.g., "Food & Beverage", "Fitness")',
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
      name: 'description',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Optional description of this industry category',
      },
    },
    {
      name: 'icon',
      type: 'select',
      required: false,
      defaultValue: 'Briefcase',
      options: [
        { label: '💼 Briefcase (General Business)', value: 'Briefcase' },
        { label: '🏋️ Dumbbell (Fitness/Gym)', value: 'Dumbbell' },
        { label: '☕ Coffee (Food & Beverage)', value: 'Coffee' },
        { label: '🍔 UtensilsCrossed (Restaurant)', value: 'UtensilsCrossed' },
        { label: '🏠 Home (Home Services)', value: 'Home' },
        { label: '🔧 Wrench (Maintenance/Repair)', value: 'Wrench' },
        { label: '❤️ Heart (Health & Wellness)', value: 'Heart' },
        { label: '🩺 Stethoscope (Healthcare)', value: 'Stethoscope' },
        { label: '👥 Users (Senior Care)', value: 'Users' },
        { label: '🏃 Activity (Sports)', value: 'Activity' },
        { label: '✨ Sparkles (Spa/Beauty)', value: 'Sparkles' },
        { label: '👷 HardHat (Construction)', value: 'HardHat' },
        { label: '📚 BookOpen (Education)', value: 'BookOpen' },
        { label: '👶 Baby (Childcare)', value: 'Baby' },
        { label: '🐾 PawPrint (Pet Services)', value: 'PawPrint' },
        { label: '🚗 Car (Automotive)', value: 'Car' },
        { label: '✨ Sparkle (Cleaning)', value: 'Sparkle' },
        { label: '💰 DollarSign (Financial Services)', value: 'DollarSign' },
        { label: '🏪 Store (Retail)', value: 'Store' },
        { label: '📦 Package (Shipping/Logistics)', value: 'Package' },
        { label: '🎨 Palette (Creative Services)', value: 'Palette' },
        { label: '📱 Smartphone (Technology)', value: 'Smartphone' },
        { label: '🏢 Building2 (Hospitality)', value: 'Building2' },
        { label: '✈️ Plane (Travel)', value: 'Plane' },
        { label: '🎵 Music (Entertainment)', value: 'Music' },
      ],
      admin: {
        description: 'Choose an icon to represent this industry',
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

export default Industries
