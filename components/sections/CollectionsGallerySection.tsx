import type { SanityCollectionPreview, SanityCta } from '@/lib/sanity/types'
import CollectionCard from '@/components/CollectionCard'
import Reveal from '@/components/Reveal'
import SmartLink from '@/components/SmartLink'
import { cn } from '@/lib/cn'

type CollectionsGallerySectionProps = {
  gallery: {
    collections: SanityCollectionPreview[]
    emptyMessage: string
    emptyCta: SanityCta | null
  }
}

// Layout is chosen from the count alone, never from names or positions:
//   0   an empty-state message with an optional link
//   1   a single wide feature
//   2   an asymmetric pair (wide + narrow, the narrow one dropped lower)
//   3+  two columns from md, three from xl; one column per row is dropped
//       lower, so any count — including odd ones — keeps the same rhythm.
// The drop uses `translate`, which leaves grid rows untouched; the list's
// bottom padding reserves room for the overhang.
const layouts = {
  pair: {
    list: 'md:grid-cols-2 md:gap-x-8 md:pb-24 lg:grid-cols-12 lg:pb-40',
    item: 'md:even:translate-y-24 lg:odd:col-span-7 lg:even:col-span-4 lg:even:col-start-9 lg:even:translate-y-40',
    sizes: '(min-width: 1024px) 55vw, (min-width: 768px) 45vw, 100vw',
  },
  grid: {
    list: 'md:grid-cols-2 md:gap-x-8 md:gap-y-24 md:pb-24 xl:grid-cols-3 xl:gap-x-10 xl:pb-32',
    item: 'md:max-xl:even:translate-y-24 xl:[&:nth-child(3n+2)]:translate-y-32',
    sizes: '(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw',
  },
}

export default function CollectionsGallerySection({ gallery }: CollectionsGallerySectionProps) {
  const { collections, emptyMessage, emptyCta } = gallery

  if (collections.length === 0) {
    return (
      <section aria-label="Collections" className="container-page section-b">
        <div className="flex flex-col items-start gap-6 border-t border-border-subtle pt-14 lg:pt-20">
          <p className="max-w-xl font-serif text-h3 text-pretty">{emptyMessage}</p>
          {emptyCta && (
            <SmartLink
              link={emptyCta.link}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xs border border-text-primary/30 px-6 text-nav font-medium transition-colors duration-300 ease-calm hover:border-text-primary hover:bg-text-primary/4"
            >
              {emptyCta.label}
              <span aria-hidden="true">→</span>
            </SmartLink>
          )}
        </div>
      </section>
    )
  }

  if (collections.length === 1) {
    return (
      <section aria-label="Collections" className="container-page section-b">
        <Reveal>
          <CollectionCard
            collection={collections[0]}
            variant="feature"
            headingAs="h2"
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority
          />
        </Reveal>
      </section>
    )
  }

  const layout = collections.length === 2 ? layouts.pair : layouts.grid

  return (
    <section aria-label="Collections" className="container-page section-b">
      <ul className={cn('grid grid-cols-1 items-start gap-y-16', layout.list)}>
        {collections.map((collection, index) => (
          <li key={collection.slug} className={layout.item}>
            <Reveal delay={(index % 2) * 120}>
              <CollectionCard
                collection={collection}
                headingAs="h2"
                sizes={layout.sizes}
                priority={index < 2}
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
