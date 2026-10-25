/*
  View-model types consumed by every UI component.
  They are deliberately data-source agnostic: the Sanity layer maps documents
  into these shapes, and components never import mock data or CMS clients.
  Optional (?) fields must render gracefully when absent.
*/

export type ImageAsset = {
  src: string
  alt: string
  /** Focal point, 0–1 on each axis. Maps to a Sanity image hotspot. */
  focus?: { x: number; y: number }
  /** Extra magnification for tight detail crops. Maps to a Sanity crop rect. */
  zoom?: number
}

export type LinkItem = {
  label: string
  href: string
}

export type NavItem = LinkItem

export type SiteSettings = {
  name: string
  /** Small line set under the wordmark in the logo lockup. Rendered uppercase. */
  descriptor?: string
  /** Short place line used in the mobile menu. */
  locationLine?: string
  tagline?: string
  footerNote?: string
  email: string
  phone?: string
  social: LinkItem[]
}

export type HeroSection = {
  eyebrow?: string
  title: string
  body?: string
  cta?: LinkItem
  image: ImageAsset
}

export type StorySection = {
  eyebrow?: string
  title: string
  /** One string per paragraph (flattened portable text). */
  body: string[]
  cta?: LinkItem
  image: ImageAsset
  detail?: ImageAsset
}

export type Product = {
  slug: string
  name: string
  nameVi?: string
  priceVnd?: number
  image?: ImageAsset
}

export type Collection = {
  slug: string
  title: string
  titleVi?: string
  summary?: string
  image?: ImageAsset
  products: Product[]
}

/** The fields a collection needs to be listed; no products are loaded. */
export type CollectionPreview = Pick<Collection, 'slug' | 'title' | 'titleVi' | 'summary' | 'image'>

export type CollectionsIndexContent = {
  eyebrow?: string
  title: string
  intro?: string
  /** Shown when no collections are published. */
  emptyMessage: string
  emptyCta?: LinkItem
  /** Rendered in the given order; the CMS owns ordering and publishing. */
  collections: CollectionPreview[]
}

export type CollectionSection = {
  eyebrow?: string
  ctaLabel: string
  relatedLabel?: string
  collection: Collection
  related: Collection[]
}

export type CraftStage = {
  title: string
  titleVi?: string
  body?: string
  image?: ImageAsset
}

export type CraftSection = {
  eyebrow?: string
  title: string
  body?: string
  cta?: LinkItem
  stages: CraftStage[]
}

export type StoreKind = 'boutique' | 'studio'

export type Store = {
  name: string
  kind: StoreKind
  address: string
  hours?: string
  href?: string
}

export type StoreGroup = {
  kind: StoreKind
  label: string
}

export type StoresSection = {
  eyebrow?: string
  title: string
  body?: string
  cta?: LinkItem
  image?: ImageAsset
  /** Display order and labels for each kind of location. Unlisted kinds render last, unlabelled. */
  groups: StoreGroup[]
}

export type BrandStatementSection = {
  label: string
  quote: string
  attribution?: string
}
