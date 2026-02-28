import { defineType, defineField } from 'sanity'

/**
 * Slugify function for Vietnamese collection names.
 * Decomposes accented characters (e.g. Tô → To), strips diacritics,
 * and produces lowercase-hyphen slugs safe for URL use.
 */
function slugify(input: string): string {
  return input
    .normalize('NFD')                    // decompose accented chars (Tô → To + combining)
    .replace(/[\u0300-\u036f]/g, '')     // strip combining diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')        // strip anything not letter/number/space/hyphen
    .replace(/\s+/g, '-')               // spaces → hyphens
    .replace(/-+/g, '-')                // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '')            // trim leading/trailing hyphens
}

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96, slugify },
      validation: Rule => Rule.required().custom((slug) => {
        if (typeof slug !== 'object' || !slug?.current) return 'Slug is required'
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens (e.g. "my-vase")'
        }
        return true
      }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'imageWithAlt',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'coverImage.asset.asset',
      subtitle: 'description',
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: subtitle
          ? subtitle.slice(0, 60) + (subtitle.length > 60 ? '…' : '')
          : 'No description',
      }
    },
  },
})
