/**
 * Sanity client configuration.
 *
 * Dependencies: npm install next-sanity
 *
 * Required env vars (add to .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *
 * Optional (needed for draft/preview mode):
 *   SANITY_API_READ_TOKEN=your_token
 */

import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2025-01-01',
  // useCdn: true caches responses at the CDN edge — fast, but up to 60s stale.
  // Set to false during development or when using draft preview mode.
  useCdn: process.env.NODE_ENV === 'production',
})

/**
 * Seconds a cached CMS response is served before Next.js refetches it in the
 * background. Applies to every query, so all CMS-driven routes (pages and
 * generateMetadata) pick up published edits within this window without a
 * redeploy. On-demand revalidation via webhook (tags below) can come later.
 */
export const CMS_REVALIDATE_SECONDS = 60

/**
 * Typed fetch wrapper with Next.js App Router cache tag support.
 *
 * Responses are cached for CMS_REVALIDATE_SECONDS. Pass `tags` to also enable
 * on-demand ISR via `revalidateTag()` from a Sanity webhook. Example:
 *   await sanityFetch({ query: PRODUCT_QUERY, params: { slug }, tags: ['product'] })
 *
 * Then in a route handler:
 *   revalidateTag('product')
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  // Record<string, unknown> matches Sanity's own QueryParams type.
  // GROQ params can be string, number, boolean, arrays, or nested objects —
  // Record<string, string> is too narrow.
  params?: Record<string, unknown>
  tags?: string[]
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: CMS_REVALIDATE_SECONDS, tags },
  })
}
