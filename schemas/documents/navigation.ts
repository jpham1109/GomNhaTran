import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'mainNav',
      title: 'Main Navigation',
      type: 'array',
      of: [{ type: 'navItem' }],
      validation: Rule => Rule.required().min(1).max(6),
      description: 'Maximum 6 items. More than this breaks the header layout.',
    }),
  ],
})
