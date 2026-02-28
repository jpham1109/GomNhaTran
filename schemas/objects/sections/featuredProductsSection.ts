import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'featuredProductsSection',
  title: 'Featured Products Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section Headline',
      type: 'string',
      validation: Rule => Rule.required().max(60),
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: Rule => Rule.required().min(1).max(4),
      description: '1–4 products. The grid is designed for this number.',
    }),
  ],
})
