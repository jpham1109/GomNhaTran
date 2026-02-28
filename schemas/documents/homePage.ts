import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'collections', title: 'Collections' },
    { name: 'products', title: 'Products' },
    { name: 'about', title: 'About Teaser' },
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
      name: 'featuredCollections',
      title: 'Featured Collections',
      type: 'featuredCollectionsSection',
      group: 'collections',
    }),
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products',
      type: 'featuredProductsSection',
      group: 'products',
    }),
    defineField({
      name: 'aboutTeaser',
      title: 'About Teaser',
      type: 'teaserSection',
      group: 'about',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})
