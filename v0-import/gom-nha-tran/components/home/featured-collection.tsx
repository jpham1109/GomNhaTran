import { useId } from 'react'
import { CollectionRow, ProductCard } from '@/components/brand/cards'
import { ButtonLink, Container, Eyebrow, SectionHeading } from '@/components/brand/primitives'
import { Reveal } from '@/components/brand/reveal'
import { routes } from '@/lib/routes'
import type { CollectionSection, Product } from '@/lib/types'

/**
 * The supporting grid is two columns with a staggered second column, so it only
 * reads as intended with an even count. Show up to four, rounded down to a pair;
 * a lone supporting product is kept rather than dropped.
 */
function pickSupporting(products: Product[]) {
  if (products.length <= 1) return products
  const count = Math.min(4, products.length - (products.length % 2))
  return products.slice(0, count)
}

export function FeaturedCollection({ content }: { content: CollectionSection }) {
  const titleId = useId()
  const { collection, related } = content
  const [lead, ...rest] = collection.products
  const supporting = pickSupporting(rest)

  return (
    <section aria-labelledby={titleId} className="section-b">
      <Container className="flex flex-col gap-14 lg:gap-20">
        <Reveal className="grid grid-cols-1 gap-8 border-t border-border pt-14 lg:grid-cols-12 lg:gap-8 lg:pt-20">
          <div className="flex flex-col gap-5 lg:col-span-6">
            {content.eyebrow ? <Eyebrow>{content.eyebrow}</Eyebrow> : null}
            <SectionHeading size="h1" id={titleId}>
              {collection.title}
              {collection.titleVi ? (
                <span lang="vi" className="mt-2 block font-serif text-h3 italic text-muted-foreground">
                  {collection.titleVi}
                </span>
              ) : null}
            </SectionHeading>
          </div>
          <div className="flex flex-col gap-7 lg:col-span-5 lg:col-start-8 lg:justify-end">
            {collection.summary ? (
              <p className="max-w-prose text-body-lg text-muted-foreground text-pretty">
                {collection.summary}
              </p>
            ) : null}
            <div>
              <ButtonLink href={routes.collection(collection.slug)} variant="secondary">
                {content.ctaLabel}
                <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        {lead ? (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className={supporting.length > 0 ? 'lg:col-span-7' : 'lg:col-span-6'}>
              <ProductCard
                product={lead}
                mediaClassName="aspect-[4/5]"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </Reveal>
            {supporting.length > 0 ? (
              <ul className="grid grid-cols-2 content-start gap-x-4 gap-y-12 md:gap-x-6 lg:col-span-5 lg:gap-x-8">
                {supporting.map((product, index) => (
                  <li key={product.slug} className={index % 2 === 1 ? 'mt-10 lg:mt-20' : undefined}>
                    <Reveal delay={(index % 2) * 120}>
                      <ProductCard product={product} sizes="(min-width: 1024px) 20vw, 45vw" />
                    </Reveal>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {related.length > 0 ? (
          <Reveal className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            {content.relatedLabel ? (
              <p className="text-label font-medium text-muted-foreground lg:col-span-3 lg:pt-12">
                {content.relatedLabel}
              </p>
            ) : null}
            <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 lg:col-span-9 lg:col-start-4">
              {related.map((item) => (
                <li key={item.slug} className="border-b border-border md:nth-[-n+2]:border-t">
                  <CollectionRow collection={item} />
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </Container>
    </section>
  )
}
