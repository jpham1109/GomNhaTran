/**
 * Converts a Sanity link object into a resolved { href, isExternal, openInNewTab } shape
 * ready for use in Next.js Link and anchor elements.
 *
 * Route map:
 *   product    → /products/[slug]
 *   collection → /collections/[slug]
 *   aboutPage  → /about         (singleton, no slug)
 *   contactPage → /contact      (singleton, no slug)
 *
 * openInNewTab is derived from isExternal — it is not a CMS field.
 * External links always open in a new tab. Internal links never do.
 * Apply rel="noopener noreferrer" whenever openInNewTab is true.
 */

import { getSafeHref } from './getSafeHref'
import type { SanityLink, SanityInternalRef } from '../sanity/types'

// ── Output type ────────────────────────────────────────────────────────────

export type ResolvedLink = {
	href: string
	isExternal: boolean
	/** Always true for external links. Always false for internal links. */
	openInNewTab: boolean
}

// ── Dev-only warning ───────────────────────────────────────────────────────

/** Logs a warning only in non-production environments. Dead-code eliminated in prod builds. */
function devWarn(message: string): void {
	if (process.env.NODE_ENV !== 'production') console.warn(message)
}

// ── Slug sanitization ─────────────────────────────────────────────────────

/**
 * Validates a slug for safe use in a route path.
 * Returns the normalized slug (leading/trailing slashes stripped) or null if unsafe.
 *
 * Rejects:
 *  - Absolute URLs (contain :// or start with //)
 *  - Path traversal (contain ..)
 *  - Literal backslashes (prevent \.. from hiding traversal)
 *  - Sub-paths (contain / after normalization)
 *  - URL-encoded slashes or backslashes (%2f, %5c)
 *  - Empty strings after normalization
 *
 * Note: Sanity schema validation is the primary gate. safeSlug is defense-in-depth.
 */
function safeSlug(slug: string): string | null {
	if (!slug) return null
	// Reject absolute URLs
	if (slug.includes('://') || slug.startsWith('//')) return null
	// Reject path traversal
	if (slug.includes('..')) return null
	// Reject literal backslashes (before stripping, so \.. can't hide)
	if (slug.includes('\\')) return null
	// Strip leading/trailing forward slashes
	const normalized = slug.replace(/^\/+|\/+$/g, '')
	if (!normalized) return null
	// Reject sub-paths
	if (normalized.includes('/')) return null
	// Reject URL-encoded slashes/backslashes (case-insensitive, after stripping)
	const lower = normalized.toLowerCase()
	if (lower.includes('%2f') || lower.includes('%5c')) return null
	return normalized
}

// ── Route map ──────────────────────────────────────────────────────────────

type RouteBuilder = (slug: string | null) => string

const ROUTE_MAP: Record<SanityInternalRef['_type'], RouteBuilder> = {
	product: (slug) => {
		if (!slug) {
			devWarn('[resolveInternalHref] product missing slug')
			return '#'
		}
		const safe = safeSlug(slug)
		if (!safe) {
			devWarn(`[resolveInternalHref] unsafe slug: "${slug}"`)
			return '#'
		}
		return `/products/${safe}`
	},
	collection: (slug) => {
		if (!slug) {
			devWarn('[resolveInternalHref] collection missing slug')
			return '#'
		}
		const safe = safeSlug(slug)
		if (!safe) {
			devWarn(`[resolveInternalHref] unsafe slug: "${slug}"`)
			return '#'
		}
		return `/collections/${safe}`
	},
	aboutPage: () => '/about',
	contactPage: () => '/contact',
}

/**
 * Converts a dereferenced Sanity internal link reference to a route string.
 * Falls back to '/' if the _type is unrecognised (defensive — shouldn't happen
 * with the current schema, but protects against future document type additions
 * that aren't yet mapped here).
 */
export function resolveInternalHref(ref: SanityInternalRef): string {
	const builder = ROUTE_MAP[ref._type]
	if (!builder) {
		devWarn(
			`[resolveInternalHref] Unknown document type: "${ref._type}". Falling back to "/".`,
		)
		return '/'
	}
	return builder(ref.slug)
}

// ── Main resolver ──────────────────────────────────────────────────────────

/**
 * Resolves a SanityLink to a ResolvedLink.
 *
 * Handles three states:
 *  1. External link  → sanitize href, isExternal: true, openInNewTab: true
 *  2. Internal link  → resolve to route, isExternal: false, openInNewTab: false
 *  3. Broken link    → internalLink is null despite linkType: 'internal'
 *                      (editor set type but didn't pick a page) → href: '#'
 */
export function resolveLink(link: SanityLink): ResolvedLink {
	if (link.linkType === 'external') {
		return {
			href: getSafeHref(link.href),
			isExternal: true,
			openInNewTab: true,
		}
	}

	// linkType === 'internal'
	if (!link.internalLink) {
		// Schema validation prevents publishing with a missing internalLink,
		// but this guard protects against draft documents or future data issues.
		return { href: '#', isExternal: false, openInNewTab: false }
	}

	return {
		href: resolveInternalHref(link.internalLink),
		isExternal: false,
		openInNewTab: false,
	}
}
