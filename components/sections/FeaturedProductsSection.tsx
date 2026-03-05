import type { SanityFeaturedProductsSection } from '@/lib/sanity/types'
import ProductCard from '@/components/ProductCard'

type FeaturedProductsSectionProps = {
  section: SanityFeaturedProductsSection
}

export default function FeaturedProductsSection({ section }: FeaturedProductsSectionProps) {
  return (
    <section>
      <h2>{section.headline}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {section.products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  )
}
