/**
 * SmartLink — renders the correct link element for any SanityLink value.
 *
 * Output depends on resolved link state:
 *  - Internal link  → <Link href="…"> (Next.js client-side navigation)
 *  - External link  → <a href="…" target="_blank" rel="noopener noreferrer">
 *  - Broken link    → <span> (inert, no role — editor left the reference unpicked)
 *
 * href safety guarantee: resolveLink calls getSafeHref for external links and
 * safeSlug for internal slugs. SmartLink does NOT re-sanitize.
 *
 * Internal link hrefs are produced exclusively by resolveLink's ROUTE_MAP +
 * safeSlug — no arbitrary user-input URL surface.
 */

import Link from 'next/link'
import type { SanityLink } from '@/lib/sanity/types'
import { resolveLink } from '@/lib/links/resolveLink'

type SmartLinkProps = {
  link: SanityLink
  children: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'>

export default function SmartLink({ link, children, ...rest }: SmartLinkProps) {
  const { href, isExternal, openInNewTab } = resolveLink(link)

  // Broken link: internalLink reference was not resolved (draft or data issue).
  // Render inert <span> — no role, no href, not interactive.
  if (href === '#') {
    const { className, style } = rest
    const filteredRest = Object.fromEntries(
      Object.entries(rest).filter(([k]) => k.startsWith('aria-') || k.startsWith('data-'))
    ) as React.HTMLAttributes<HTMLSpanElement>
    return (
      <span className={className} style={style} {...filteredRest}>
        {children}
      </span>
    )
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : 'noopener'}
        {...rest}
      >
        {children}
      </a>
    )
  }

  // Internal link — Next.js client-side navigation.
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}
