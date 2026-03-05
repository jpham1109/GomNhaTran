import type { SanityFeaturedCollectionsSection } from '@/lib/sanity/types'
import CollectionCard from '@/components/CollectionCard'

type FeaturedCollectionsSectionProps = {
  section: SanityFeaturedCollectionsSection
}

export default function FeaturedCollectionsSection({ section }: FeaturedCollectionsSectionProps) {
  return (
    <section>
      <h2>{section.headline}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {section.collections.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>
    </section>
  )
}
