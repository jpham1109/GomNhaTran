import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProductBySlug, getSiteSettings } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/buildMetadata'
import { resolveInternalHref } from '@/lib/links/resolveLink'
import PricingDisplay from '@/components/PricingDisplay'
import PortableTextRenderer from '@/components/PortableTextRenderer'

type Props = {
	params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const [product, settings] = await Promise.all([
		getProductBySlug(slug),
		getSiteSettings(),
	])
	return buildMetadata({
		seo: product?.seo,
		defaultSeo: settings?.defaultSeo,
		siteTitle: settings?.siteTitle,
		fallbackTitle: product?.title,
		fallbackOgImageUrl: product?.images[0]?.url,
	})
}

export default async function ProductPage({ params }: Props) {
	const { slug } = await params
	const product = await getProductBySlug(slug)
	if (!product) notFound()

	const [firstImage, ...restImages] = product.images

	// Guard against null collection slug — resolveInternalHref returns '#' for null slugs.
	const collectionHref = product.collection
		? resolveInternalHref({
				_type: 'collection',
				slug: product.collection.slug,
			})
		: null

	return (
		<main>
			<div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-2">
					{/* Image gallery */}
					<div className="flex flex-col gap-3">
						{/* Main image — placeholder box if product has no images */}
						{firstImage ? (
							<div className="relative aspect-square w-full overflow-hidden bg-stone-100">
								<Image
									src={firstImage.url}
									alt={firstImage.alt}
									fill
									sizes="(min-width: 768px) 50vw, 100vw"
									className="object-cover"
									priority
								/>
							</div>
						) : (
							<div className="aspect-square w-full bg-stone-100" />
						)}

						{/* Thumbnails
                TODO (post About/Contact): make thumbnails clickable to swap the main image.
                Requires a small 'use client' island that holds selected image index in state. */}
						{restImages.length > 0 && (
							<div className="grid grid-cols-4 gap-2">
								{restImages.map((image) => (
									<div
										key={image.url}
										className="relative aspect-square overflow-hidden bg-stone-100"
									>
										<Image
											src={image.url}
											alt={image.alt}
											fill
											sizes="(min-width: 768px) 12vw, 25vw"
											className="object-cover"
										/>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Product details */}
					<div className="flex flex-col gap-6">
						{/* Collection breadcrumb */}
						{product.collection &&
							(collectionHref !== '#' ? (
								<Link
									href={collectionHref!}
									className="text-sm text-stone-500 hover:text-stone-800"
								>
									{product.collection.title}
								</Link>
							) : (
								<span className="text-sm text-stone-500">
									{product.collection.title}
								</span>
							))}

						<div className="flex flex-col gap-2">
							<h1 className="text-3xl font-semibold">{product.title}</h1>
							<PricingDisplay pricing={product.pricing} />
							{!product.inStock && (
								<span className="text-sm text-stone-400">Out of stock</span>
							)}
						</div>

						{/* Description */}
						{product.description && product.description.length > 0 && (
							<PortableTextRenderer
								value={product.description}
								className="prose prose-stone"
							/>
						)}

						{/* Materials */}
						{product.materials && product.materials.length > 0 && (
							<div>
								<h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-stone-500">
									Materials
								</h2>
								<p className="text-stone-700">{product.materials.join(', ')}</p>
							</div>
						)}

						{/* Care instructions */}
						{product.careInstructions && (
							<div>
								<h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-stone-500">
									Care
								</h2>
								<p className="text-stone-700">{product.careInstructions}</p>
							</div>
						)}

						{/* Dimensions
                TODO: weight omits unit — add weightUnit: 'g' | 'kg' | 'oz' | 'lb' to
                SanityProductDimensions type, queries.ts projection, and Sanity schema in a follow-up PR. */}
						{product.dimensions && (
							<div>
								<h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-stone-500">
									Dimensions
								</h2>
								<dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
									{product.dimensions.height != null && (
										<>
											<dt className="text-stone-500">Height</dt>
											<dd className="text-stone-700">
												{product.dimensions.height} {product.dimensions.unit}
											</dd>
										</>
									)}
									{product.dimensions.width != null && (
										<>
											<dt className="text-stone-500">Width</dt>
											<dd className="text-stone-700">
												{product.dimensions.width} {product.dimensions.unit}
											</dd>
										</>
									)}
									{product.dimensions.depth != null && (
										<>
											<dt className="text-stone-500">Depth</dt>
											<dd className="text-stone-700">
												{product.dimensions.depth} {product.dimensions.unit}
											</dd>
										</>
									)}
									{product.dimensions.weight != null && (
										<>
											<dt className="text-stone-500">Weight</dt>
											<dd className="text-stone-700">
												{product.dimensions.weight}
											</dd>
										</>
									)}
								</dl>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	)
}
