import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: Rule => Rule.required().max(30),
      description: 'Text shown in the nav bar.',
    }),
    defineField({
      name: 'link',
      title: 'Destination',
      type: 'link',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'link.href',
      internalRef: 'link.internalLink._ref',
    },
    prepare({ title, subtitle, internalRef }) {
      return {
        title,
        subtitle: subtitle ?? (internalRef ? '→ Internal page' : 'No link set'),
      }
    },
  },
})
