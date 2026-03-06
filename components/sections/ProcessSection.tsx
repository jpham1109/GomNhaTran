import type { SanityProcessSection } from '@/lib/sanity/types'

type ProcessSectionProps = {
  section: SanityProcessSection
}

export default function ProcessSection({ section }: ProcessSectionProps) {
  if (!section.headline && section.steps.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {section.headline && (
          <h2 className="mb-12 text-3xl text-center font-semibold">{section.headline}</h2>
        )}
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-0 gap-10 p-0 list-none">
          {section.steps.map((step, index) => (
            <li key={step._key} className="flex flex-col gap-3">
              <span className="text-5xl leading-none font-light text-stone-300" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="leading-relaxed text-stone-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
