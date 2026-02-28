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
 * Typed fetch wrapper with Next.js App Router cache tag support.
 *
 * Pass `tags` to enable on-demand ISR via `revalidateTag()` from a
 * Sanity webhook. Example:
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
    next: { tags },
  })
}
