import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
      validation: Rule => Rule.required().max(30),
      description: 'e.g. "Shop Now", "See the Collection". Keep concise.',
    }),
    defineField({
      name: 'link',
      title: 'Destination',
      type: 'link',
      validation: Rule => Rule.required(),
    }),
  ],
})
