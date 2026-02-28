import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'story', title: 'Story' },
    { name: 'process', title: 'Process' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'hero',
      group: 'hero',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'story',
      title: 'Story',
      type: 'storySection',
      group: 'story',
    }),
    defineField({
      name: 'process',
      title: 'Process',
      type: 'processSection',
      group: 'process',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})
