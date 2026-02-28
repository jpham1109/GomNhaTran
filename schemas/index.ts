// ── Primitives ──────────────────────────────────────────────────────────────
// Objects must be registered before documents that reference them.
// Primitives come first — link/nav/section objects depend on them.
import imageWithAlt from './objects/imageWithAlt'
import seo from './objects/seo'
import richText from './objects/richText'
import pricing from './objects/pricing'
import productDimensions from './objects/productDimensions'

// ── Links & Navigation ───────────────────────────────────────────────────────
import link from './objects/link'
import cta from './objects/cta'
import navItem from './objects/navItem'

// ── Section Objects ──────────────────────────────────────────────────────────
import hero from './objects/sections/hero'
import teaserSection from './objects/sections/teaserSection'
import featuredCollectionsSection from './objects/sections/featuredCollectionsSection'
import featuredProductsSection from './objects/sections/featuredProductsSection'
import storySection from './objects/sections/storySection'
import processSection from './objects/sections/processSection'

// ── Documents ────────────────────────────────────────────────────────────────
import siteSettings from './documents/siteSettings'
import navigation from './documents/navigation'
import homePage from './documents/homePage'
import product from './documents/product'
import collection from './documents/collection'
import aboutPage from './documents/aboutPage'
import contactPage from './documents/contactPage'

export const schemaTypes = [
  // Primitives
  imageWithAlt,
  seo,
  richText,
  pricing,
  productDimensions,
  // Links & Navigation
  link,
  cta,
  navItem,
  // Section Objects
  hero,
  teaserSection,
  featuredCollectionsSection,
  featuredProductsSection,
  storySection,
  processSection,
  // Documents
  siteSettings,
  navigation,
  homePage,
  product,
  collection,
  aboutPage,
  contactPage,
]
