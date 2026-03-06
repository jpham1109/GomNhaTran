import Image from 'next/image'
import type { SanityStorySection } from '@/lib/sanity/types'
import PortableTextRenderer from '@/components/PortableTextRenderer'

type StorySectionProps = {
  section: SanityStorySection
}

export default function StorySection({ section }: StorySectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      {section.headline && (
        <h2 className="mb-8 text-3xl font-semibold">{section.headline}</h2>
      )}
      {section.body && section.body.length > 0 && (
        <PortableTextRenderer
          value={section.body}
          className={`prose prose-stone max-w-2xl${!section.images?.length ? ' mb-8' : ''}`}
        />
      )}
      {section.images && section.images.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {section.images.slice(0, 3).map((image) => (
            <div key={image.url} className="relative aspect-square overflow-hidden bg-stone-100">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
