import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getHomePage, getSiteSettings } from '@/lib/sanity/queries'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedCollectionsSection from '@/components/sections/FeaturedCollectionsSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import TeaserSection from '@/components/sections/TeaserSection'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getHomePage(), getSiteSettings()])
  const seo = page?.seo
  const defaultSeo = settings?.defaultSeo
  return {
    title: seo?.metaTitle ?? defaultSeo?.metaTitle ?? settings?.siteTitle ?? undefined,
    description: seo?.metaDescription ?? defaultSeo?.metaDescription ?? undefined,
    openGraph: seo?.ogImage ? { images: [{ url: seo.ogImage.url }] } : undefined,
  }
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
