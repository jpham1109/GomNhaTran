import Link from 'next/link'
import type { SanityCollectionPreview } from '@/lib/sanity/types'
import { resolveInternalHref } from '@/lib/links/resolveLink'
import Media from '@/components/Media'
import { cn } from '@/lib/cn'

type CollectionCardProps = {
  collection: SanityCollectionPreview
  /** `feature` sets image and text side by side from `lg` up, for a lone collection. */
  variant?: 'stacked' | 'feature'
  headingAs?: 'h2' | 'h3'
  sizes?: string
  priority?: boolean
  ctaLabel?: string
}

const hoverZoom = 'transition-transform duration-1200 ease-calm group-hover:scale-103'

// Photograph-led card. The title link is stretched over the whole card, so the
// card has a single tab stop whose accessible name is the collection title;
// the focus ring is drawn on the card rather than the link.
// Secondary text uses opacity rather than a fixed color so the card reads on
// both the paper surface and the bamboo canvas (homepage, until migrated).
// 90% keeps AA contrast on both: ~9:1 on paper, ~5.4:1 on canvas.
export default function CollectionCard({
  collection,
  variant = 'stacked',
  headingAs: Heading = 'h3',
  sizes = '(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw',
  priority,
  ctaLabel = 'Explore',
}: CollectionCardProps) {
  const href = resolveInternalHref({ _type: 'collection', slug: collection.slug })
  const feature = variant === 'feature'

  return (
    <article
      className={cn(
        'group relative grid grid-cols-1 gap-5 rounded-xs outline-offset-8 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-[color:var(--focus-ring,currentColor)] md:gap-6',
        feature && 'lg:grid-cols-12 lg:items-end lg:gap-8',
      )}
    >
      <Media
        image={collection.coverImage}
        sizes={sizes}
        priority={priority}
        decorative
        className={cn('aspect-[4/5] rounded-xs', feature && 'lg:col-span-7 lg:aspect-[5/4]')}
        imageClassName={hoverZoom}
      />
      <div className={cn('flex min-w-0 flex-col gap-2', feature && 'lg:col-span-4 lg:col-start-9 lg:gap-3')}>
        <Heading className={cn('font-serif font-normal break-words text-balance', feature ? 'text-h2' : 'text-h3')}>
          {/* after:* stretches the link's click area over the whole card.
              Future interactive elements (e.g. favourite button) need relative z-10
              to sit above this overlay. */}
          <Link href={href} className="outline-none after:absolute after:inset-0 after:content-['']">
            {collection.title}
          </Link>
        </Heading>
        {collection.description && (
          <p
            className={cn(
              'mt-1 max-w-prose text-small text-pretty opacity-90',
              feature ? 'lg:text-body' : 'line-clamp-3',
            )}
          >
            {collection.description}
          </p>
        )}
        <span aria-hidden="true" className="mt-3 inline-flex items-center gap-3 text-nav font-medium">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-calm group-hover:bg-[length:100%_1px]">
            {ctaLabel}
          </span>
          <span className="transition-transform duration-500 ease-calm group-hover:translate-x-1">→</span>
        </span>
      </div>
    </article>
  )
}
