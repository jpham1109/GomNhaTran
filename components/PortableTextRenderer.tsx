/**
 * PortableTextRenderer — renders SanityPortableTextBlock[] with a typed component map.
 *
 * Handles:
 *  - Block styles: normal → <p>, h3 → <h3>, h4 → <h4>
 *  - List types: bullet → <ul>, number → <ol>
 *  - List items: bullet/number → <li>
 *  - Marks: strong → <strong>, em → <em>
 *  - Link annotation → SmartLink (guarded by isLinkValue type predicate)
 *
 * Wrap output in <div className={className}> so consumers can target all
 * portable text content with a single class (e.g. className="prose").
 *
 * Server-component note: @portabletext/react uses useContext internally in
 * v5 and earlier. If you get "useState/useContext cannot be called in a Server
 * Component" errors, add 'use client' at the top of this file.
 */

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { SanityPortableTextBlock, SanityLink } from '@/lib/sanity/types'
import SmartLink from './SmartLink'

// ── Type guard ─────────────────────────────────────────────────────────────

/**
 * Guards the Portable Text mark value as a SanityLink.
 *
 * GROQ can omit fields in edge cases; the mark value arrives as
 * Record<string, unknown> with no structural guarantees. All required
 * fields are explicitly checked before casting.
 */
function isLinkValue(v: Record<string, unknown>): v is SanityLink {
  const lt = v.linkType
  if (lt !== 'internal' && lt !== 'external') return false
  if (!('internalLink' in v)) return false
  if (!('href' in v)) return false
  if (v.href !== null && typeof v.href !== 'string') return false
  return true
}

// ── Component map ─────────────────────────────────────────────────────────
//
// Defined outside the function component to avoid re-creation on each render.

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      if (!value || !isLinkValue(value)) {
        // Malformed annotation — render children without a link wrapper.
        return <>{children}</>
      }
      return <SmartLink link={value}>{children}</SmartLink>
    },
  },
}

// ── Component ──────────────────────────────────────────────────────────────

type PortableTextRendererProps = {
  value: SanityPortableTextBlock[]
  className?: string
}

export default function PortableTextRenderer({ value, className }: PortableTextRendererProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
