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
              name: 'cta_button',
              type: 'group',
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
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Pages
