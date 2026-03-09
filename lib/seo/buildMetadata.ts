import type { Metadata } from 'next'
import type { SanitySeo } from '@/lib/sanity/types'

function clean(value: string | null | undefined) {
	return value?.trim() || undefined
}

type BuildMetadataOptions = {
	seo: SanitySeo | null | undefined
	defaultSeo: SanitySeo | null | undefined
	siteTitle: string | null | undefined
	fallbackTitle?: string | null
	fallbackDescription?: string | null
	fallbackOgImageUrl?: string | null
}

// Utility for building Next.js Metadata with consistent fallback behavior.
// Routes still own generateMetadata() and provide page-specific fallbacks.
// This function only normalizes values (trim) and assembles the Metadata object.
// Empty or whitespace-only values are treated as missing at every step.
//
// Title fallback order differs by page type — this is intentional:
//
// Static pages (Homepage, About):
//   page seo → site defaultSeo → siteTitle
//   These pages have no content title. Their identity is brand-level.
//
// Dynamic pages (Collection, Product):
//   page seo → content title (collection.title / product.title)
//           → site defaultSeo → siteTitle
//   The content title is a more meaningful fallback than the generic
//   site default before reaching the last-resort siteTitle.
//
// Description:
//   page seo → route fallback → site defaultSeo
//
// OG Image:
//   page seo → route fallback
export function buildMetadata({
	seo,
	defaultSeo,
	siteTitle,
	fallbackTitle,
	fallbackDescription,
	fallbackOgImageUrl,
}: BuildMetadataOptions): Metadata {
	const ogImageUrl = clean(seo?.ogImage?.url) || clean(fallbackOgImageUrl)
	return {
		title:
			clean(seo?.metaTitle) ||
			clean(fallbackTitle) ||
			clean(defaultSeo?.metaTitle) ||
			clean(siteTitle),
		description:
			clean(seo?.metaDescription) ||
			clean(fallbackDescription) ||
			clean(defaultSeo?.metaDescription),
		openGraph: ogImageUrl ? { images: [{ url: ogImageUrl }] } : undefined,
	}
}
