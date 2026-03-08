import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getHomePage, getSiteSettings } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/metadata'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedCollectionsSection from '@/components/sections/FeaturedCollectionsSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import TeaserSection from '@/components/sections/TeaserSection'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getHomePage(), getSiteSettings()])
  return buildMetadata({
    seo: page?.seo,
    defaultSeo: settings?.defaultSeo,
    siteTitle: settings?.siteTitle,
    fallbackOgImageUrl: page?.hero?.image?.url,
  })
}

export default async function HomePage() {
  // Both calls are deduped within this request via React cache() in queries.ts.
  const page = await getHomePage()
  if (!page) notFound()

  return (
    <main>
      <HeroSection hero={page.hero} priority />
      {page.featuredCollections && (
        <FeaturedCollectionsSection section={page.featuredCollections} />
      )}
      {page.featuredProducts && (
        <FeaturedProductsSection section={page.featuredProducts} />
      )}
      {page.aboutTeaser && (
        <TeaserSection teaser={page.aboutTeaser} />
      )}
    </main>
  )
}
