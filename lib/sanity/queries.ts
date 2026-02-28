/**
 * GROQ query definitions and typed fetch functions for the data layer.
 *
 * Conventions:
 *  - *_QUERY constants export the raw GROQ string (useful for testing / Sanity Vision)
 *  - Companion async functions wrap sanityFetch with correct return types and cache tags
 *  - GROQ fragments (*_FIELDS) are reusable projections, not exported (internal only)
 *
 * Image resolution:
 *  - All imageWithAlt fields are projected to { url, alt, caption }
 *  - `url` is the raw Sanity CDN URL — see NOTE in types.ts re: hotspot/crop
 *
 * Singleton queries ([0]) return null if the document hasn't been published yet.
 * All consumer code must handle null gracefully.
 */

import { sanityFetch } from './client'
import type {
  SanitySiteSettings,
  SanityNavigation,
  SanityHomePage,
  SanityProduct,
  SanityCollection,
} from './types'

// ── Reusable GROQ fragments ────────────────────────────────────────────────
//
// These are template literal snippets used inside larger queries.
// They are NOT exported — queries are the public API.

/** Resolves an imageWithAlt object to { url, alt, caption }. */
const IMAGE_FIELDS = `
  "url": asset.asset->url,
  alt,
  caption
`

/** Resolves a seo object including its ogImage. */
const SEO_FIELDS = `
  metaTitle,
  metaDescription,
  "ogImage": ogImage {
    ${IMAGE_FIELDS}
  }
`

/**
 * Resolves a link object.
 * internalLink is dereferenced to { _type, slug } so resolveLink() can map it to a route.
 * slug.current is unwrapped to a plain string. Null for singleton pages without a slug.
 */
const LINK_FIELDS = `
  linkType,
  "internalLink": internalLink-> {
    _type,
    "slug": slug.current
  },
  href
`

/** Resolves a cta object including its link. */
const CTA_FIELDS = `
  label,
  "link": link {
    ${LINK_FIELDS}
  }
`

// ── Site Settings ──────────────────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    siteTitle,
    "logo": logo {
      ${IMAGE_FIELDS}
    },
    "defaultSeo": defaultSeo {
      ${SEO_FIELDS}
    },
    "socialLinks": socialLinks {
      instagram,
      pinterest
    },
    footerTagline
  }
`

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return sanityFetch<SanitySiteSettings | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  })
}

// ── Navigation ─────────────────────────────────────────────────────────────

export const NAVIGATION_QUERY = `
  *[_type == "navigation"][0] {
    "mainNav": mainNav[] {
      label,
      "link": link {
        ${LINK_FIELDS}
      }
    }
  }
`

export async function getNavigation(): Promise<SanityNavigation | null> {
  return sanityFetch<SanityNavigation | null>({
    query: NAVIGATION_QUERY,
    tags: ['navigation'],
  })
}

// ── Home Page ──────────────────────────────────────────────────────────────

export const HOME_PAGE_QUERY = `
  *[_type == "homePage"][0] {
    "hero": hero {
      headline,
      subheadline,
      "image": image {
        ${IMAGE_FIELDS}
      },
      "cta": cta {
        ${CTA_FIELDS}
      }
    },
    "featuredCollections": featuredCollections {
      headline,
      "collections": collections[]-> {
        title,
        "slug": slug.current,
        description,
        "coverImage": coverImage {
          ${IMAGE_FIELDS}
        }
      }
    },
    "featuredProducts": featuredProducts {
      headline,
      "products": products[]-> {
        title,
        "slug": slug.current,
        "image": images[0] {
          ${IMAGE_FIELDS}
        },
        "pricing": pricing {
          price,
          compareAtPrice,
          currency
        },
        inStock
      }
    },
    "aboutTeaser": aboutTeaser {
      headline,
      body,
      "image": image {
        ${IMAGE_FIELDS}
      },
      "cta": cta {
        ${CTA_FIELDS}
      }
    },
    "seo": seo {
      ${SEO_FIELDS}
    }
  }
`

export async function getHomePage(): Promise<SanityHomePage | null> {
  return sanityFetch<SanityHomePage | null>({
    query: HOME_PAGE_QUERY,
    tags: ['homePage'],
  })
}

// ── Product by Slug ────────────────────────────────────────────────────────

export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    "collection": collection-> {
      title,
      "slug": slug.current
    },
    description,
    materials,
    careInstructions,
    "dimensions": dimensions {
      height,
      width,
      depth,
      weight,
      unit
    },
    "images": images[] {
      ${IMAGE_FIELDS}
    },
    "pricing": pricing {
      price,
      compareAtPrice,
      currency
    },
    inStock,
    "seo": seo {
      ${SEO_FIELDS}
    }
  }
`

export async function getProductBySlug(slug: string): Promise<SanityProduct | null> {
  return sanityFetch<SanityProduct | null>({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
    tags: ['product'],
  })
}

// ── Collection by Slug ─────────────────────────────────────────────────────
//
// Products in a collection are fetched via reverse reference query rather than
// a stored array, keeping the collection document lean.
// Ordered by _createdAt descending (newest first). Adjust as needed.

export const COLLECTION_BY_SLUG_QUERY = `
  *[_type == "collection" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    description,
    "coverImage": coverImage {
      ${IMAGE_FIELDS}
    },
    "products": *[_type == "product" && references(^._id)] | order(_createdAt desc) {
      title,
      "slug": slug.current,
      "image": images[0] {
        ${IMAGE_FIELDS}
      },
      "pricing": pricing {
        price,
        compareAtPrice,
        currency
      },
      inStock
    },
    "seo": seo {
      ${SEO_FIELDS}
    }
  }
`

export async function getCollectionBySlug(slug: string): Promise<SanityCollection | null> {
  return sanityFetch<SanityCollection | null>({
    query: COLLECTION_BY_SLUG_QUERY,
    params: { slug },
    tags: ['collection'],
  })
}
