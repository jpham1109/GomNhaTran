import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'featuredCollectionsSection',
  title: 'Featured Collections Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section Headline',
      type: 'string',
      validation: Rule => Rule.required().max(60),
    }),
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'collection' }] }],
      validation: Rule => Rule.required().min(1).max(3),
      description: '1–3 collections. The grid layout is designed for this range.',
    }),
  ],
})
