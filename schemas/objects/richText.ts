import { defineType } from 'sanity'

export default defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        // H1/H2 excluded — those come from the page layout component, not editor input
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            // Mirrors the `link` object structure but must be defined inline —
            // Portable Text annotations cannot reference external named schema types.
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'linkType',
                type: 'string',
                title: 'Link Type',
                options: {
                  list: [
                    { title: 'Internal Page', value: 'internal' },
                    { title: 'External URL', value: 'external' },
                  ],
                  layout: 'radio',
                },
                initialValue: 'internal',
              },
              {
                name: 'internalLink',
                type: 'reference',
                title: 'Internal Page',
                to: [
                  { type: 'product' },
                  { type: 'collection' },
                  { type: 'aboutPage' },
                  { type: 'contactPage' },
                ],
                hidden: ({ parent }: { parent: { linkType?: string } }) =>
                  parent?.linkType !== 'internal',
              },
              {
                name: 'href',
                type: 'url',
                title: 'External URL',
                hidden: ({ parent }: { parent: { linkType?: string } }) =>
                  parent?.linkType !== 'external',
              },
            ],
          },
        ],
      },
    },
  ],
})
