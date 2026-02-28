import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'processSection',
  title: 'Process Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section Headline',
      type: 'string',
      validation: Rule => Rule.max(60),
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'processStep',
          fields: [
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: Rule => Rule.required().max(40),
            }),
            defineField({
              name: 'body',
              title: 'Step Description',
              type: 'text',
              validation: Rule => Rule.required().max(200),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'body' },
          },
        },
      ],
      // Conditional: only requires ≥1 step if the editor has set a headline,
      // signalling intent to use this section. Leaving headline empty means
      // the section is intentionally unused — no steps required.
      validation: Rule =>
        Rule.max(5).custom((steps, context) => {
          const parent = context.parent as { headline?: string } | undefined
          const headline = parent?.headline
          const count = Array.isArray(steps) ? steps.length : 0
          if (headline && count === 0) {
            return 'Add at least 1 step, or clear the Process Headline to leave this section unused.'
          }
          return true
        }),
      description: 'Up to 5 steps. Leave empty (and clear the headline) to hide this section.',
    }),
  ],
})
