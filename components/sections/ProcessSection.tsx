import type { SanityProcessSection } from '@/lib/sanity/types'

type ProcessSectionProps = {
  section: SanityProcessSection
}

export default function ProcessSection({ section }: ProcessSectionProps) {
  if (!section.headline && section.steps.length === 0) {
    return null
  }

  return (
    <section>
      {section.headline && <h2>{section.headline}</h2>}
      <ol>
        {section.steps.map((step) => (
          <li key={step._key}>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
