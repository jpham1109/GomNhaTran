import Link from 'next/link'
import { Media } from '@/components/brand/media'
import { formatVnd } from '@/lib/format'
import { routes } from '@/lib/routes'
import type { CollectionPreview, Product, Store } from '@/lib/types'
import { cn } from '@/lib/utils'

const hoverZoom = 'transition-transform duration-1200 ease-calm'

export function ProductCard({
  product,
  className,
  mediaClassName,
  sizes = '(min-width: 1024px) 22vw, 45vw',
  priority,
}: {
  product: Product
  className?: string
  /** Overrides the default square frame, e.g. `aspect-[4/5]` for a lead product. */
  mediaClassName?: string
  sizes?: string
  priority?: boolean
}) {
  return (
    <Link href={routes.product(product.slug)} className={cn('group flex flex-col gap-4', className)}>
      <Media
        image={product.image}
        sizes={sizes}
        priority={priority}
        className={cn('aspect-square rounded-sm', mediaClassName)}
        imageClassName={cn(hoverZoom, 'group-hover:scale-103')}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="text-body font-medium break-words text-pretty">{product.name}</h3>
          {product.nameVi ? (
            <p lang="vi" className="font-serif text-small italic text-muted-foreground break-words">
              {product.nameVi}
            </p>
          ) : null}
        </div>
        {product.priceVnd != null ? (
          <p className="shrink-0 text-small tabular-nums text-muted-foreground">
            {formatVnd(product.priceVnd)}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

/**
 * Photograph-led card for collection galleries. The title link is stretched
 * over the whole card, so the card has a single tab stop whose accessible
 * name is just the collection title; the focus ring is drawn on the card.
 */
export function CollectionCard({
  collection,
  variant = 'stacked',
  headingAs: Heading = 'h3',
  sizes = '(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw',
  priority,
  ctaLabel = 'Explore',
  className,
}: {
  collection: CollectionPreview
  /** `feature` sets image and text side by side from `lg` up, for a lone collection. */
  variant?: 'stacked' | 'feature'
  headingAs?: 'h2' | 'h3'
  sizes?: string
  priority?: boolean
  ctaLabel?: string
  className?: string
}) {
  const feature = variant === 'feature'

  return (
    <article
      className={cn(
        'group relative grid grid-cols-1 gap-5 rounded-sm outline-offset-8 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-ring md:gap-6',
        feature && 'lg:grid-cols-12 lg:items-end lg:gap-8',
        className,
      )}
    >
      <Media
        image={collection.image}
        sizes={sizes}
        priority={priority}
        decorative
        className={cn('aspect-[4/5] rounded-sm', feature && 'lg:col-span-7 lg:aspect-[5/4]')}
        imageClassName={cn(hoverZoom, 'group-hover:scale-103')}
      />
      <div className={cn('flex flex-col gap-2', feature && 'lg:col-span-4 lg:col-start-9 lg:gap-3')}>
        <Heading
          className={cn(
            'font-serif font-normal break-words text-balance',
            feature ? 'text-h2' : 'text-h3',
          )}
        >
          <Link
            href={routes.collection(collection.slug)}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {collection.title}
          </Link>
        </Heading>
        {collection.titleVi ? (
          <p lang="vi" className="font-serif text-body italic text-muted-foreground break-words">
            {collection.titleVi}
          </p>
        ) : null}
        {collection.summary ? (
          <p
            className={cn(
              'mt-1 max-w-prose text-small text-muted-foreground text-pretty',
              feature ? 'lg:text-body' : 'line-clamp-3',
            )}
          >
            {collection.summary}
          </p>
        ) : null}
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

/** Compact thumbnail row for listing collections alongside other content. */
export function CollectionRow({ collection }: { collection: CollectionPreview }) {
  return (
    <Link href={routes.collection(collection.slug)} className="group flex items-center gap-5 py-5">
      <Media
        image={collection.image}
        sizes="96px"
        decorative
        className="size-20 shrink-0 rounded-sm md:size-24"
        imageClassName={cn(hoverZoom, 'group-hover:scale-105')}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="font-serif text-h3 break-words">{collection.title}</h3>
        {collection.titleVi || collection.summary ? (
          <p className="text-small text-muted-foreground text-pretty">
            {collection.titleVi ? (
              <span lang="vi" className="font-serif italic">
                {collection.titleVi}
              </span>
            ) : null}
            {collection.titleVi && collection.summary ? ' · ' : null}
            {collection.summary}
          </p>
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="text-muted-foreground transition-transform duration-500 ease-calm group-hover:translate-x-1 group-hover:text-foreground"
      >
        →
      </span>
    </Link>
  )
}

export function StoreRow({ store }: { store: Store }) {
  const body = (
    <>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="font-serif text-h3 break-words">{store.name}</p>
        <p lang="vi" className="text-body text-muted-foreground text-pretty">
          {store.address}
        </p>
        {store.hours ? (
          <p className="text-small tabular-nums text-muted-foreground">{store.hours}</p>
        ) : null}
      </div>
      {store.href ? (
        <span
          aria-hidden="true"
          className="pt-1 text-muted-foreground transition-transform duration-500 ease-calm group-hover:translate-x-1 group-hover:text-foreground"
        >
          →
        </span>
      ) : null}
    </>
  )
  const rowClass = 'grid grid-cols-[1fr_auto] items-start gap-6 py-6'

  return (
    <li className="border-b border-border first:border-t">
      {store.href ? (
        <Link href={store.href} className={cn('group', rowClass)}>
          {body}
        </Link>
      ) : (
        <div className={rowClass}>{body}</div>
      )}
    </li>
  )
}
