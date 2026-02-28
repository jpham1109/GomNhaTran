import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: Rule => Rule.required().max(60),
      description: 'Max 60 characters prevents wrapping on mobile viewports.',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      validation: Rule => Rule.max(120),
    }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'imageWithAlt',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'cta',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      media: 'image.asset.asset',
    },
  },
})
