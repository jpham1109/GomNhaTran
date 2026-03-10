import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    { name: 'info', title: 'Contact Info' },
    { name: 'locations', title: 'Locations' },
    { name: 'form', title: 'Inquiry Form' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'info',
      validation: Rule => Rule.required().max(60),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      group: 'info',
      validation: Rule => Rule.max(120),
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      group: 'info',
      validation: Rule => Rule.required().email(),
      description: 'Displayed on the page. Inquiry form submissions are delivered to this address.',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'info',
      validation: Rule => Rule.required().max(20),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'info',
      description: 'Full URL, e.g. https://instagram.com/gomnhatran',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      group: 'info',
      description: 'Full URL, e.g. https://facebook.com/gomnhatran',
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      group: 'locations',
      validation: Rule => Rule.min(1),
      of: [
        {
          type: 'object',
          name: 'location',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: Rule => Rule.required().max(60),
              description: 'e.g. "Old Quarter – Hàng Bông" or "Bát Tràng Studio"',
            }),
            defineField({
              name: 'address',
              title: 'Address',
              type: 'text',
              rows: 3,
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'address' },
          },
        },
      ],
    }),
    defineField({
      name: 'formEnabled',
      title: 'Show Inquiry Form',
      type: 'boolean',
      group: 'form',
      initialValue: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})
