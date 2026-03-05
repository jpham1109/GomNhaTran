import Image from 'next/image'
import type { SanityStorySection } from '@/lib/sanity/types'
import PortableTextRenderer from '@/components/PortableTextRenderer'

type StorySectionProps = {
  section: SanityStorySection
}

export default function StorySection({ section }: StorySectionProps) {
  return (
    <section>
      {section.headline && <h2>{section.headline}</h2>}
      {section.body && section.body.length > 0 && (
        <PortableTextRenderer value={section.body} className="prose" />
      )}
      {section.images && section.images.length > 0 && (
        <div className="flex gap-4">
          {section.images.slice(0, 3).map((image) => (
            <div key={image.url} className="relative aspect-square flex-1 overflow-hidden">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
