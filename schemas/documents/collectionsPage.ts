import { defineType, defineField } from 'sanity'

// Singleton for the /collections index. Every field is optional: the route
// supplies fallback copy, so the page renders before this is ever published.
// The list of collections itself is not stored here — all published
// collection documents are listed.
export default defineType({
  name: 'collectionsPage',
  title: 'Collections Page',
  type: 'document',
  groups: [
    { name: 'intro', title: 'Introduction' },
    { name: 'empty', title: 'Empty State' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'intro',
      validation: Rule => Rule.max(40),
      description: 'Short label above the title, e.g. "Collections".',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'intro',
      validation: Rule => Rule.max(80),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      group: 'intro',
      validation: Rule => Rule.max(300),
    }),
    defineField({
      name: 'emptyMessage',
      title: 'Empty State Message',
      type: 'text',
      rows: 2,
      group: 'empty',
      validation: Rule => Rule.max(200),
      description: 'Shown when no collections are published.',
    }),
    defineField({
      name: 'emptyCta',
      title: 'Empty State Link',
      type: 'cta',
      group: 'empty',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Collections Page' }),
  },
})
