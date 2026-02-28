import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'storySection',
  title: 'Story Section',
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
      title: 'Story Body',
      type: 'richText',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      validation: Rule => Rule.max(3),
      description: 'Up to 3 images shown in the story section.',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      media: 'images.0.asset.asset',
    },
  },
})
