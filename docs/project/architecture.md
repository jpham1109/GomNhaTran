# Architecture

> Engineering blueprint. Routing, data layer, component patterns, and caching.

---

## Routing

The site uses the Next.js App Router under `app/(site)/`.

| Route                 | File                                  |
| --------------------- | ------------------------------------- |
| `/`                   | `app/(site)/page.tsx`                 |
| `/about`              | `app/(site)/about/page.tsx`           |
| `/collections`        | `app/(site)/collections/page.tsx`     |
| `/collections/[slug]` | `app/(site)/collections/[slug]/page.tsx` |
| `/products/[slug]`    | `app/(site)/products/[slug]/page.tsx` |

The `(site)` route group applies shared layout without affecting the URL.

The Sanity Studio is mounted at `/studio` under `app/studio/`.

---

## Data Layer

All CMS data flows through named query functions in `lib/sanity/queries.ts`.

### Rules

- Routes and layouts call named query functions directly.
- Section components receive data via props from their parent route or layout.
- Never call `sanityFetch` or the Sanity client directly from components or routes.
- Query functions are wrapped with React `cache()` for per-request deduplication.

### Types

Types in `lib/sanity/types.ts` reflect **query output shapes**, not raw Sanity document types.

- Images are resolved to `{ url, alt, caption }`
- Slugs are unwrapped to plain `string`
- References are dereferenced inline

Never import types from `sanity` or `@sanity/types` in the UI layer.

---

## Component Patterns

### Sections

- One section component corresponds to one CMS section slot.
- Accept a single typed prop from the data layer.
- Never fetch data inside a section.
- Each section renders its own container (`mx-auto max-w-7xl px-4 md:px-8`) unless intentionally full-bleed.
- Sections do not depend on other sections.

### Naming

- Section components: `<Name>Section` (e.g. `HeroSection`, `ProcessSection`)
- Card components: `<Name>Card` (e.g. `ProductCard`, `CollectionCard`)
- Renderer/display components: `<Name>Renderer` or `<Name>Display`

### Server vs Client

- All components are React Server Components by default.
- Only add `use client` when interactivity or browser APIs are genuinely required.
- Keep client islands small and leaf-level.

---

## Caching

`sanityFetch` in `lib/sanity/client.ts` caches every CMS response for
`CMS_REVALIDATE_SECONDS` (60s) via `next: { revalidate, tags }`, which `@sanity/client`
forwards to `fetch`. Static CMS routes therefore build as ISR (`Revalidate 1m`) and
dynamic routes reuse the data cache. Verified at runtime: HIT → STALE after 60s →
regenerated → HIT. Tags are kept for a future `revalidateTag` webhook.

Query functions use React `cache()` to deduplicate calls within a single render pass.

On-demand revalidation via `revalidateTag` webhooks is planned but not yet implemented.

---

## Metadata

Metadata generation stays in the route that owns the content. Do not centralize
page-specific metadata logic in shared UI components.

Shared metadata utilities in `lib/` are allowed for normalization and fallback assembly,
as long as each route keeps its own `generateMetadata()` and declares its route-specific
fallback inputs locally.

The shared utility lives at `lib/seo/buildMetadata.ts`.

### Fallback order

- **Title:** page seo → page-specific content title (dynamic pages only) → site defaultSeo → siteTitle
- **Description:** page seo → route fallback → site defaultSeo
- **OG Image:** page seo → route fallback (hero image, first product image)
- Empty or whitespace-only strings are treated as missing at every step.

---

## Links

- Always use `SmartLink` for CMS-sourced links.
- `resolveLink.ts` maps document types to route paths via `ROUTE_MAP`.
- External URLs are sanitized via `getSafeHref` (allowlist: `http:`, `https:`, `mailto:`, `tel:`).

---

## Email — Inquiry Form

The Contact page inquiry form submits via a Next.js Server Action.

- Email delivery is handled by **Resend** (`resend` npm package).
- The business destination email is sourced from the `contactPage.email` CMS field, and the visitor's submitted email is used as the `replyTo` value.
- The Server Action lives at `app/(site)/contact/actions.ts`.
- The form UI is implemented as a `use client` island.
- `RESEND_API_KEY` must be set in `.env.local` (and Vercel environment variables).

---

## Design Tokens

Design tokens are defined as CSS custom properties inside a Tailwind v4 `@theme` block in the global CSS file.

The full token set — colors, typography, spacing — is specified in `docs/project/design-system.md`.

Semantic tokens (e.g. `--color-panel`, `--color-text-primary`) are the source of truth for all app-facing component styling. Raw Tailwind stone utilities are replaced by semantic tokens during the design system implementation pass.

### Class merging

`cn()` in `lib/cn.ts` (clsx + tailwind-merge) joins conditional classes and resolves
`className` overrides. It registers our custom `--text-*`, `--shadow-*` and `--ease-*`
tokens; without that, tailwind-merge reads `text-h3` as a color and drops it next to
`text-text-secondary`. Add any new custom token to `lib/cn.ts` alongside `globals.css`.

### Development fixtures

`lib/dev/` holds development-only fixtures. `/collections?fixture=<name>` swaps in
`lib/dev/collectionFixtures.ts` when `NODE_ENV !== 'production'` via a dynamic import;
production builds never read `searchParams` (the route stays static) and contain no
fixture data. Fixtures never write to Sanity.

## Logo Asset Pipeline

Logo variants are generated from a designer-exported 35-tile SVG strip at `components/icons/logo.svg`. The pipeline lives in `scripts/logo/`:

- `optimize-logo.mjs` — generates all standalone SVG assets into `components/icons/`
- `inspect-logo-tiles.mjs` — read-only tile inventory for the source strip
- `compute-bbox.mjs` — diagnostic bounding-box debugger (not pipeline-critical)

Run `node scripts/logo/optimize-logo.mjs` from the project root whenever `logo.svg` is updated. Generated files are committed to the repo.

The `Logo` component at `components/icons/Logo.tsx` wraps all variants behind a typed `variant` prop. See `docs/brand/logo-system.md` for the full logo system reference.

---

## Sanity Schema

Schema registration order in `schemas/index.ts`:

1. Primitives
2. Links / nav
3. Section objects
4. Documents

Pages have defined section slots. Editors do not assemble pages freely.
