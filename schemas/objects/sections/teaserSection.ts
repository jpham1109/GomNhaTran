import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'teaserSection',
  title: 'Teaser Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: Rule => Rule.required().max(60),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(300),
      description: 'Short, punchy. Max 300 characters.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
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
