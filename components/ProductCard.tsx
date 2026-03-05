import Image from 'next/image'
import Link from 'next/link'
import type { SanityProductCard } from '@/lib/sanity/types'
import { resolveInternalHref } from '@/lib/links/resolveLink'
import PricingDisplay from './PricingDisplay'

type ProductCardProps = {
  product: SanityProductCard
}

export default function ProductCard({ product }: ProductCardProps) {
  const href = resolveInternalHref({ _type: 'product', slug: product.slug })

  return (
    <article className="relative">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-100" />
        )}
      </div>
      <h3>
        {/* after:* stretches the link's click area over the whole card.
            Future interactive elements (e.g. quick-add button) need relative z-10
            to sit above this overlay. */}
        <Link href={href} className="after:absolute after:inset-0 after:content-['']">
          {product.title}
        </Link>
      </h3>
      <PricingDisplay pricing={product.pricing} />
      {!product.inStock && <span>Out of stock</span>}
    </article>
  )
}
