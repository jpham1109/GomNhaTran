import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Page',
      type: 'reference',
      to: [
        { type: 'product' },
        { type: 'collection' },
        { type: 'aboutPage' },
        { type: 'contactPage' },
      ],
      hidden: ({ parent }) => parent?.linkType !== 'internal',
      validation: Rule =>
        Rule.custom((value, context) => {
          const linkType = (context.parent as { linkType?: string })?.linkType
          if (linkType === 'internal' && !value) return 'Select an internal page.'
          return true
        }),
    }),
    defineField({
      name: 'href',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: Rule =>
        Rule.custom((value, context) => {
          const linkType = (context.parent as { linkType?: string })?.linkType
          if (linkType === 'external' && !value) return 'Enter a URL.'
          return true
        }),
    }),
  ],
})
