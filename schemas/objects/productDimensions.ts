import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'productDimensions',
  title: 'Dimensions',
  type: 'object',
  fields: [
    defineField({
      name: 'height',
      title: 'Height',
      type: 'number',
      validation: Rule => Rule.positive().precision(2),
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'number',
      validation: Rule => Rule.positive().precision(2),
    }),
    defineField({
      name: 'depth',
      title: 'Depth',
      type: 'number',
      validation: Rule => Rule.positive().precision(2),
    }),
    defineField({
      name: 'weight',
      title: 'Weight',
      type: 'number',
      validation: Rule => Rule.positive().precision(2),
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
      options: {
        list: [
          { title: 'Inches', value: 'in' },
          { title: 'Centimeters', value: 'cm' },
        ],
        layout: 'radio',
      },
      initialValue: 'in',
      validation: Rule => Rule.required(),
    }),
  ],
})
