import type { CollectionConfig } from 'payload'
import { v7 as uuidv7 } from 'uuid'

const Agents: CollectionConfig = {
  slug: 'agents',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    description: 'Manage franchise consultants and agents',
    defaultColumns: ['name', 'email', 'phone', 'isActive', 'updatedAt'],
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => uuidv7(),
      admin: { hidden: true },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'bio', type: 'richText' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'specialties',
      type: 'array',
      admin: { description: 'Franchise categories or specialties' },
      fields: [
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Fitness', value: 'Fitness' },
            { label: 'Food and Beverage', value: 'Food and Beverage' },
            { label: 'Health and Wellness', value: 'Health and Wellness' },
            { label: 'Home Services', value: 'Home Services' },
            { label: 'Senior Care', value: 'Senior Care' },
            { label: 'Sports', value: 'Sports' },
          ],
        },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'ghlWebhook', type: 'text', admin: { description: 'GoHighLevel webhook URL (optional)' } },
  ],
}

export default Agents