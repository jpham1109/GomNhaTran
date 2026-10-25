import type { Metadata } from 'next'
import { CollectionsGallery } from '@/components/collections/collections-gallery'
import { CollectionsIntro } from '@/components/collections/collections-intro'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { collectionsIndex, navigation, siteSettings, stores } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Collections — Gốm Nhà Trần',
  description:
    'Curated collections of handcrafted ceramics from our family studio in Bát Tràng — gathered by form, glaze and technique.',
  alternates: { canonical: '/collections' },
}

/**
 * Development-only `?count=N` trims the mock list so layouts can be reviewed
 * at any collection count. Production builds never read search params, so the
 * page stays static.
 */
async function resolveCollections(searchParams: Promise<{ count?: string }>) {
  const all = collectionsIndex.collections
  if (process.env.NODE_ENV === 'production') return all
  const count = Number.parseInt((await searchParams).count ?? '', 10)
  return Number.isNaN(count) ? all : all.slice(0, Math.max(0, count))
}

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ count?: string }>
}) {
  const collections = await resolveCollections(searchParams)

  return (
    <>
      <SiteHeader navigation={navigation} settings={siteSettings} />
      <main id="main">
        <CollectionsIntro content={collectionsIndex} />
        <CollectionsGallery
          collections={collections}
          emptyMessage={collectionsIndex.emptyMessage}
          emptyCta={collectionsIndex.emptyCta}
        />
      </main>
      <SiteFooter navigation={navigation} stores={stores} settings={siteSettings} />
    </>
  )
}
