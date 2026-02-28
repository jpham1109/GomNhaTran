import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pricing',
  title: 'Pricing',
  type: 'object',
  fields: [
    defineField({
      name: 'price',
      title: 'Price (VND)',
      type: 'number',
      validation: Rule => Rule.required().min(1).integer(),
      description: 'Current selling price in VND. Must be a whole number (e.g. 250000).',
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Original Price (VND)',
      type: 'number',
      validation: Rule =>
        Rule.min(1)
          .integer()
          .custom((compareAtPrice, context) => {
            if (compareAtPrice == null) return true
            const price = (context.parent as { price?: number })?.price
            if (price == null) return true
            if (compareAtPrice <= price) {
              return `Original price (${compareAtPrice} ₫) must be strictly greater than current price (${price} ₫). This is the "was" price shown with a strikethrough.`
            }
            return true
          }),
      description:
        'The "was" price in VND. Only set when on sale. Must be strictly greater than the current price.',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'VND',
      readOnly: true,
      description: 'Multi-currency will be enabled when Shopify sync is connected.',
    }),
  ],
})
