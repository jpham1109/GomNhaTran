import Image from 'next/image'
import Link from 'next/link'
import type { SanityCollectionCard } from '@/lib/sanity/types'
import { resolveInternalHref } from '@/lib/links/resolveLink'

type CollectionCardProps = {
  collection: SanityCollectionCard
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const href = resolveInternalHref({ _type: 'collection', slug: collection.slug })

  return (
    <article className="relative">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={collection.coverImage.url}
          alt={collection.coverImage.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <h3>
        {/* after:* stretches the link's click area over the whole card.
            Future interactive elements (e.g. favourite button) need relative z-10
            to sit above this overlay. */}
        <Link href={href} className="after:absolute after:inset-0 after:content-['']">
          {collection.title}
        </Link>
      </h3>
      {collection.description && <p>{collection.description}</p>}
    </article>
  )
}
