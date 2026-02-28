import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'asset',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      validation: Rule => Rule.required().max(125),
      description: 'Required. Describe the image for screen readers and search engines.',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      validation: Rule => Rule.max(200),
    }),
  ],
  // Internal preview (array item cards in Studio).
  // When a PARENT document selects this field for its own preview media, go deeper:
  //   named field:  'coverImage.asset.asset'
  //   array item:   'images.0.asset.asset'
  // The outer .asset is this object's image field.
  // The inner .asset is the Sanity binary asset reference inside that image type.
  preview: {
    select: { title: 'alt', media: 'asset' },
  },
})
