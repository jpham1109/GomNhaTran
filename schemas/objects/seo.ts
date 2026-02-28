import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: Rule => Rule.max(60),
      description: 'Browser tab and search result title. Max 60 characters.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      validation: Rule => Rule.max(155),
      description: 'Search result snippet. Max 155 characters.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'imageWithAlt',
      description: '1200×630px recommended. Alt text appears as the aria-label on social preview cards.',
    }),
  ],
})
