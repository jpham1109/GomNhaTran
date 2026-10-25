import { CollectionCard } from '@/components/brand/cards'
import { ButtonLink, Container } from '@/components/brand/primitives'
import { Reveal } from '@/components/brand/reveal'
import type { CollectionPreview, LinkItem } from '@/lib/types'
import { cn } from '@/lib/utils'

/*
  Layout is chosen from the count alone, never from names or fixed positions:
  - 1     a single wide feature
  - 2     an asymmetric pair (wide + narrow, the narrow one dropped lower)
  - 3+    two columns from md, three from xl; one column per row is dropped
          lower, so any count — including odd ones — keeps the same rhythm and
          a final short row simply ends the stagger.
  The dropped column uses `translate`, which leaves grid rows untouched; the
  list's bottom padding reserves room for the overhang.
*/
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

export function CollectionsGallery({
  collections,
  emptyMessage,
  emptyCta,
}: {
  collections: CollectionPreview[]
  emptyMessage: string
  emptyCta?: LinkItem
}) {
  if (collections.length === 0) {
    return (
      <Container className="section-b">
        <div className="flex flex-col items-start gap-6 border-t border-border pt-14 lg:pt-20">
          <p className="max-w-xl font-serif text-h3 text-pretty">{emptyMessage}</p>
          {emptyCta ? (
            <ButtonLink href={emptyCta.href} variant="secondary">
              {emptyCta.label}
              <span aria-hidden="true">→</span>
            </ButtonLink>
          ) : null}
        </div>
      </Container>
    )
  }

  if (collections.length === 1) {
    return (
      <Container className="section-b">
        <Reveal>
          <CollectionCard
            collection={collections[0]}
            variant="feature"
            headingAs="h2"
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority
          />
        </Reveal>
      </Container>
    )
  }

  const layout = collections.length === 2 ? layouts.pair : layouts.grid

  return (
    <Container className="section-b">
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
    </Container>
  )
}
