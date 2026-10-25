# Rules

> Behavioral constraints for Claude. Coding conventions, patterns, and decisions made for this project.

---

## Data Layer

- All CMS data must flow through named query functions in `lib/sanity/queries.ts`.
- Never call `sanityFetch` or the Sanity client directly from components or routes.
- Routes and layouts call query functions directly. Section components should receive data via props from their parent.
- Never import types from `sanity` or `@sanity/types` in the UI layer. Always use `lib/sanity/types.ts`.
- Types in `types.ts` reflect **query output shapes** — images are resolved `{ url, alt, caption }`, slugs are unwrapped to plain `string`, references are dereferenced inline.
- Query functions should be wrapped with React `cache()` to deduplicate requests within a render. Follow the existing pattern in `queries.ts`.

---

## Links

- Always use `SmartLink` for any CMS-sourced link. Never render a raw `<a>` tag for CMS content.
- `SmartLink` handles three states automatically: internal (`<Link>`), external (`<a rel="noopener noreferrer">`), broken (`<span>`).
- External URLs are sanitized via `getSafeHref`. The allowlist is `http:`, `https:`, `mailto:`, `tel:`. Everything else returns `'#'`.
- When adding a new linkable document type, update `ROUTE_MAP` in `resolveLink.ts` and the `SanityInternalRef._type` union in `types.ts`.

---

## Components

### Sections

Sections should remain layout-focused and predictable.

- One section component corresponds to one CMS section slot.
- Accept a single typed prop from the data layer. Never fetch data inside a section.
- Sections should not perform complex data transformations.
- Sections should not depend on other sections.
- Sections may compose primitives and cards.
- Each section renders its own container (`mx-auto max-w-7xl px-4 md:px-8`) unless intentionally full-bleed.

### Naming

- Section components: `<Name>Section` (e.g. `HeroSection`, `ProcessSection`)
- Card components: `<Name>Card` (e.g. `ProductCard`, `CollectionCard`)
- Renderer/display components: `<Name>Renderer` or `<Name>Display`

### Server vs Client

- All components are React Server Components by default.
- Only add `use client` when interactivity or browser APIs are genuinely required.
- Keep client islands small and leaf-level.

---

## Routes

Routes in `app/` must stay lightweight. They may:

- Call named query functions
- Assemble page sections
- Export `generateMetadata`

Routes must not contain complex data-shaping logic or duplicate presentation logic already handled by sections.

---

## Metadata

- Fallback priority: `page seo → site defaultSeo → siteTitle → undefined`
- In metadata fallbacks, use `||` instead of `??`. Sanity string fields return `""` for blank editor input, which `??` does not catch.
- Always call `.trim()` on string fallbacks. Whitespace-only values are treated as missing.
- OG image fallback order: `page seo.ogImage → page-specific fallback (hero, first product image) → omit`
- `generateMetadata` stays in the route file that owns the content. Do not centralize it in shared components.
- Shared metadata utilities in `lib/` are allowed for normalization and fallback assembly, as long as each route keeps its own `generateMetadata()` and declares its route-specific fallback inputs locally.
- The shared utility is `lib/seo/buildMetadata.ts` — use it in all routes.

---

## Sanity Schema

- Schema registration order in `schemas/index.ts`: primitives → links/nav → section objects → documents.
- Sanity stores structured content only. No HTML, no styling, no layout logic in CMS fields.
- Prefer semantic field names, reusable object types, and structured fields over rich text where possible.
- Pages have defined section slots. Editors do not assemble pages freely.

---

## Portable Text

- Use Portable Text for editorial body content only — not for page layout or structured data.
- The `PortableTextRenderer` component wraps output in `<div className={className}>`. Apply typography styles at the container level (`prose prose-stone`).
- Malformed link annotations degrade gracefully — children render without the link wrapper.

---

## Layout & Spacing

- Standard page container: `mx-auto max-w-7xl px-4 md:px-8`
- Standard section vertical rhythm: `py-16`
- Follow the shared container and spacing rhythm unless a full-bleed treatment is intentional.

---

## Design

The design system is fully specified in `docs/project/design-system.md`. That file is the source of truth for all visual decisions. Read it before touching any styling.

- Use semantic CSS custom property tokens — not raw Tailwind stone utilities — in all app-facing components. See the token list in `docs/project/design-system.md`.
- Key replacements: `--color-panel` replaces `stone-50`, `--color-text-primary` replaces `stone-900`, `--color-image-placeholder` replaces `stone-100`.
- Do not introduce new colors outside the approved palette without discussion.
- Supporting accent colors (`--color-brick`, `--color-clay`, `--color-wood`, `--color-celadon`) are for details and emphasis only — never large surfaces.
- `--bamboo-light` (`#8FA35B`) must not be used for text — contrast is insufficient against panel surfaces.
- The visual tone should be calm, editorial, craft-focused, and minimal — not e-commerce.

---

## Tailwind Class Order

Prefer this general Tailwind class order for readability:

```
Layout → Flex/Grid → Spacing → Sizing → Typography → Background/Color → Border → Effects → Transitions → State
```

Example:

```tsx
// Layout → Flex/Grid → Spacing → Sizing → Typography → Background/Color → Border → Effects → Transitions → State
<div className="relative flex flex-col gap-4 p-8 w-full max-w-md text-sm font-medium text-stone-900 bg-stone-50 rounded-lg shadow-sm transition-colors hover:bg-stone-100" />
```

State variants (`hover:`, `focus:`, `disabled:`, responsive breakpoints) come last and mirror the same internal order.

---

## Images

Images should be resolved in GROQ queries to `{ url, alt, caption }`. Do not pass raw Sanity asset references into UI components.

---

### Data Flow

Data fetching happens at the route or layout level.

Routes call named query functions in `lib/sanity/queries.ts`.
Query functions call `sanityFetch` in `lib/sanity/client.ts` to query Sanity CMS.

UI components receive typed data via props and must never fetch CMS data
directly.

---

## Git Branches

Branch names follow a prefix convention based on the nature of the work:

| Prefix    | Used for                                      |
| --------- | --------------------------------------------- |
| `feat/`   | New product features                          |
| `fix/`    | Bug fixes                                     |
| `design/` | Visual system and design implementation       |
| `docs/`   | Documentation only                            |

Examples: `feat/contact-page`, `fix/metadata-fallbacks`, `design/site-foundation`, `docs/readme-update-phase-1`

---

## General

- Do not over-engineer. Only make changes that are directly requested or clearly necessary.
- Avoid defensive code for impossible states. Trust validated inputs and framework guarantees unless there is a clear failure path.
- Do not add docstrings, comments, or type annotations to code you did not change.
- Do not create helpers or abstractions for one-time operations.
