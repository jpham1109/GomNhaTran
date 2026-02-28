/**
 * Sanitizes an external href before rendering.
 *
 * Blocks dangerous URL schemes (javascript:, data:, vbscript:) by only
 * allowing an explicit allowlist of safe protocols.
 *
 * Returns '#' for anything that:
 *  - fails to parse as a URL
 *  - uses a non-allowlisted protocol
 *  - is null, undefined, or an empty string
 *
 * Apply ONLY to link.href (external links).
 * Internal links are Sanity references resolved to your own routes — no sanitization needed.
 *
 * @example
 * getSafeHref('https://instagram.com/studio')  // → 'https://instagram.com/studio'
 * getSafeHref('mailto:hello@studio.com')        // → 'mailto:hello@studio.com'
 * getSafeHref('javascript:alert(1)')            // → '#'
 * getSafeHref('data:text/html,<script>')        // → '#'
 * getSafeHref(null)                             // → '#'
 */

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])

export function getSafeHref(href: string | null | undefined): string {
  if (!href) return '#'
  try {
    const { protocol } = new URL(href)
    return SAFE_PROTOCOLS.has(protocol) ? href : '#'
  } catch {
    return '#'
  }
}
