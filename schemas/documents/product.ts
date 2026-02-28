import { defineType, defineField } from 'sanity'

/**
 * Slugify function for Vietnamese product names.
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
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    { name: 'details', title: 'Details' },
    { name: 'media', title: 'Media' },
    { name: 'commerce', title: 'Commerce' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'details',
      validation: Rule => Rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
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
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
      group: 'details',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'richText',
      group: 'details',
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'details',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
      rows: 2,
      group: 'details',
      validation: Rule => Rule.max(300),
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'productDimensions',
      group: 'details',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'media',
      of: [{ type: 'imageWithAlt' }],
      validation: Rule => Rule.required().min(1).max(8),
      description: 'First image is the primary display image. Min 1, max 8.',
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'pricing',
      group: 'commerce',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      group: 'commerce',
      initialValue: true,
      description: 'When Shopify is connected, inventory will manage this automatically.',
    }),
    defineField({
      name: 'externalId',
      title: 'External Product ID',
      type: 'string',
      group: 'commerce',
      description: 'Shopify product GID or Stripe price ID. Leave blank until integration is live.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'images.0.asset.asset',
      subtitle: 'pricing.price',
      inStock: 'inStock',
    },
    prepare({ title, media, subtitle, inStock }) {
      return {
        title,
        media,
        subtitle: subtitle
          ? `${subtitle.toLocaleString('vi-VN')} ₫ · ${inStock ? 'In Stock' : 'Out of Stock'}`
          : 'No price set',
      }
    },
  },
})
