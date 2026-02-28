/**
 * TypeScript types that match GROQ query OUTPUT shapes.
 *
 * These are NOT the raw Sanity document types from the schema.
 * They represent what the queries in queries.ts actually return after
 * projection — i.e., the data shape your React components receive.
 *
 * Key differences from schema types:
 *  - Images are resolved to { url, alt, caption } — no raw asset references
 *  - Slugs are unwrapped from { current: string } to plain strings
 *  - References are dereferenced inline (e.g. product.collection is an object, not a ref)
 *  - Portable Text blocks retain their raw shape for use with @portabletext/react
 */

// ── Shared primitives ──────────────────────────────────────────────────────

/**
 * Resolved imageWithAlt. The raw asset reference and Sanity image wrapper
 * are collapsed into a flat object.
 *
 * NOTE: `url` is the full master asset URL. It does not carry hotspot/crop
 * metadata. For next/image with focal-point cropping, upgrade to also
 * returning `hotspot` and `crop` from the image object and use @sanity/image-url.
 */
export type SanityImage = {
  url: string
  alt: string
  caption: string | null
}

/**
 * The resolved internal reference inside a link.
 * `slug` is null for singleton pages (aboutPage, contactPage) that have no slug field.
 */
export type SanityInternalRef = {
  _type: 'product' | 'collection' | 'aboutPage' | 'contactPage'
  slug: string | null
}

/** Resolved link object. Exactly one of internalLink/href will be populated. */
export type SanityLink = {
  linkType: 'internal' | 'external'
  internalLink: SanityInternalRef | null
  href: string | null
}

export type SanityCta = {
  label: string
  link: SanityLink
}

export type SanityNavItem = {
  label: string
  link: SanityLink
}

export type SanitySeo = {
  metaTitle: string | null
  metaDescription: string | null
  ogImage: SanityImage | null
}

export type SanityPricing = {
  price: number
  compareAtPrice: number | null
  currency: string
}

export type SanityProductDimensions = {
  height: number | null
  width: number | null
  depth: number | null
  weight: number | null
  unit: 'in' | 'cm'
}

// ── Portable Text ──────────────────────────────────────────────────────────
//
// Product descriptions use Portable Text with custom link annotations.
// Replace with `TypedObject` from `@portabletext/types` if you add that package.

type PortableTextSpan = {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

// The specific mark shape we defined in richText.ts.
// Kept as a named type for use in @portabletext/react component value props.
export type PortableTextLinkMark = {
  _type: 'link'
  _key: string
  linkType: 'internal' | 'external'
  internalLink: SanityInternalRef | null
  href: string | null
}

// Base structural contract for any Portable Text mark definition.
// Matches @portabletext/types's PortableTextMarkDefinition:
//   _type and _key are guaranteed as string (not unknown), with room for
//   arbitrary additional fields from future annotation types.
type PortableTextMarkBase = { _type: string; _key: string; [key: string]: unknown }

export type SanityPortableTextBlock = {
  _type: 'block'
  _key: string
  style: 'normal' | 'h3' | 'h4'
  listItem?: 'bullet' | 'number'
  level?: number
  children: PortableTextSpan[]
  // PortableTextLinkMark is structurally a subtype of PortableTextMarkBase,
  // so this union is semantically PortableTextMarkBase[] — but the explicit
  // union documents the known shape and keeps it navigable by grep/IDE.
  // Prefer this over unknown[] (loses _type/_key access) or
  // Record<string,unknown>[] (same structural result but less readable).
  markDefs: Array<PortableTextLinkMark | PortableTextMarkBase>
}

// ── Section types ──────────────────────────────────────────────────────────

export type SanityHeroSection = {
  headline: string
  subheadline: string | null
  image: SanityImage
  cta: SanityCta | null
}

export type SanityTeaserSection = {
  headline: string
  body: string
  image: SanityImage | null
  cta: SanityCta | null
}

export type SanityFeaturedCollectionsSection = {
  headline: string
  collections: SanityCollectionCard[]
}

export type SanityFeaturedProductsSection = {
  headline: string
  products: SanityProductCard[]
}

// ── Card types (used in grids / lists) ────────────────────────────────────

/** Minimal product shape for listing cards — first image only. */
export type SanityProductCard = {
  title: string
  slug: string
  image: SanityImage | null
  pricing: SanityPricing
  inStock: boolean
}

/** Minimal collection shape for listing cards. */
export type SanityCollectionCard = {
  title: string
  slug: string
  description: string | null
  coverImage: SanityImage
}

// ── Full document types ────────────────────────────────────────────────────

export type SanitySiteSettings = {
  siteTitle: string
  logo: SanityImage | null
  defaultSeo: SanitySeo | null
  socialLinks: {
    instagram: string | null
    pinterest: string | null
  } | null
  footerTagline: string | null
}

export type SanityNavigation = {
  mainNav: SanityNavItem[]
}

export type SanityHomePage = {
  hero: SanityHeroSection
  featuredCollections: SanityFeaturedCollectionsSection | null
  featuredProducts: SanityFeaturedProductsSection | null
  aboutTeaser: SanityTeaserSection | null
  seo: SanitySeo | null
}

export type SanityProduct = {
  title: string
  slug: string
  collection: { title: string; slug: string } | null
  description: SanityPortableTextBlock[] | null
  materials: string[] | null
  careInstructions: string | null
  dimensions: SanityProductDimensions | null
  images: SanityImage[]
  pricing: SanityPricing
  inStock: boolean
  seo: SanitySeo | null
}

export type SanityCollection = {
  title: string
  slug: string
  description: string | null
  coverImage: SanityImage
  products: SanityProductCard[]
  seo: SanitySeo | null
}
