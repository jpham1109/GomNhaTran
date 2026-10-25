import type { Metadata } from 'next'
import { getCollections, getCollectionsPage, getSiteSettings } from '@/lib/sanity/queries'
import type { SanityCta } from '@/lib/sanity/types'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import CollectionsIntroSection from '@/components/sections/CollectionsIntroSection'
import CollectionsGallerySection from '@/components/sections/CollectionsGallerySection'

type Props = {
	searchParams: Promise<{ fixture?: string }>
}

// Fallback copy until the collectionsPage singleton is published.
// Each field falls back independently, so editors can override one at a time.
const FALLBACK = {
	eyebrow: 'Collections',
	title: 'Gathered in the studio, one idea at a time.',
	intro:
		'Each collection brings pieces together around a single thread — a form we keep returning to, a glaze, a way of painting — chosen by the family.',
	emptyMessage:
		'New collections are being prepared in the studio. In the meantime, the full range is waiting in our boutiques.',
	emptyCta: {
		label: 'Visit a boutique',
		link: { linkType: 'internal', internalLink: { _type: 'contactPage', slug: null }, href: null },
	} satisfies SanityCta,
	description:
		'Curated collections of handcrafted ceramics from our family studio in Bát Tràng — gathered by form, glaze and technique.',
}

function text(value: string | null | undefined, fallback: string) {
	return value?.trim() || fallback
}

// Development-only: `?fixture=<name>` swaps in local fixtures (see
// lib/dev/collectionFixtures.ts). Production never reads searchParams, so the
// route stays static and the fixture module is eliminated from the build.
async function loadCollections(searchParams: Props['searchParams']) {
	if (process.env.NODE_ENV !== 'production') {
		const { fixture } = await searchParams
		if (fixture) {
			const { getCollectionFixture } = await import('@/lib/dev/collectionFixtures')
			const collections = getCollectionFixture(fixture)
			if (collections) return collections
		}
	}
	return getCollections()
}

export async function generateMetadata(): Promise<Metadata> {
	const [page, collections, settings] = await Promise.all([
		getCollectionsPage(),
		getCollections(),
		getSiteSettings(),
	])
	return buildMetadata({
		seo: page?.seo,
		defaultSeo: settings?.defaultSeo,
		siteTitle: settings?.siteTitle,
		fallbackTitle: 'Collections',
		fallbackDescription: FALLBACK.description,
		fallbackOgImageUrl: collections.find((c) => c.coverImage)?.coverImage?.url,
	})
}

export default async function CollectionsPage({ searchParams }: Props) {
	const [page, collections] = await Promise.all([
		getCollectionsPage(),
		loadCollections(searchParams),
	])

	return (
		<main className="surface-paper">
			<CollectionsIntroSection
				intro={{
					eyebrow: text(page?.eyebrow, FALLBACK.eyebrow),
					title: text(page?.title, FALLBACK.title),
					intro: text(page?.intro, FALLBACK.intro),
				}}
			/>
			<CollectionsGallerySection
				gallery={{
					collections,
					emptyMessage: text(page?.emptyMessage, FALLBACK.emptyMessage),
					emptyCta: page?.emptyCta ?? FALLBACK.emptyCta,
				}}
			/>
		</main>
	)
}
