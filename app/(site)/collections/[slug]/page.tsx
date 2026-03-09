import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getCollectionBySlug, getSiteSettings } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import ProductCard from '@/components/ProductCard'

type Props = {
	params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const [collection, settings] = await Promise.all([
		getCollectionBySlug(slug),
		getSiteSettings(),
	])
	return buildMetadata({
		seo: collection?.seo,
		defaultSeo: settings?.defaultSeo,
		siteTitle: settings?.siteTitle,
		fallbackTitle: collection?.title,
		fallbackDescription: collection?.description,
	})
}

export default async function CollectionPage({ params }: Props) {
	const { slug } = await params
	const collection = await getCollectionBySlug(slug)
	if (!collection) notFound()

	return (
		<main>
			{/* Cover image */}
			<div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
				<Image
					src={collection.coverImage.url}
					alt={collection.coverImage.alt}
					fill
					sizes="100vw"
					className="object-cover"
					priority
				/>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
				{/* Header */}
				<div className="mb-10">
					<h1 className="text-3xl font-semibold">{collection.title}</h1>
					{collection.description && (
						<p className="mt-3 max-w-2xl text-stone-600">
							{collection.description}
						</p>
					)}
				</div>

				{/* Product grid */}
				{collection.products.length > 0 ? (
					<ul className="grid grid-cols-2 gap-6 list-none m-0 p-0 md:grid-cols-3 lg:grid-cols-4">
						{collection.products.map((product) => (
							<li key={product.slug}>
								<ProductCard product={product} />
							</li>
						))}
					</ul>
				) : (
					<p className="text-stone-500">No products in this collection yet.</p>
				)}
			</div>
		</main>
	)
}
