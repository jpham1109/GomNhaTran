import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: Rule => Rule.required().max(60),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      validation: Rule => Rule.max(120),
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
      description: 'Displayed on the page and used as the form reply-to address.',
    }),
    defineField({
      name: 'formEnabled',
      title: 'Show Contact Form',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'studioAddress',
      title: 'Studio Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
})
