# Project Context

> The project brain. Describes what this project is and how it is designed.

# Gốm Nhà Trần

## Overview

Website for Gốm Nhà Trần, a ceramic business based in Bát Tràng, Vietnam.

Primary goals:

- Showcase unique handmade ceramic products
- Tell the story of the craft and production process
- Allow product discovery
- Support inquiry-based purchasing
- Prepare the architecture for future e-commerce

This project prioritizes:

1. Clean editorial design
2. Simple CMS editing for non-technical users
3. Scalable architecture for future features

---

## Business Model

The current site uses **inquiry-based purchasing**.

There is **no cart or checkout**.

Product pages should guide users toward:

- contacting the studio
- submitting an inquiry
- requesting pricing or wholesale information

Full e-commerce (cart, checkout, payments) is a future phase.

---

## Tech Stack

Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

CMS

- Sanity

Content Rendering

- PortableText

Deployment

- TBD (likely Vercel)

---

## Four-Layer Architecture

The project follows a ** Four-layer data architecture**.

Sanity CMS stores structured content.

Data is fetched and shaped through the data layer before reaching components.

Flow:

```
Sanity CMS
│  structured content only
▼
Data Layer  (lib/sanity/)
│  GROQ queries + typed projections
│  types.ts = query OUTPUT shapes, not raw Sanity doc types
▼
Next.js Routes  (app/)
│  pages + layouts, kept lightweight
▼
UI Components  (components/)
│  sections, cards, primitives

```

This separation keeps CMS data clean, UI reusable, and routes easy to scan.

---

## Key Architectural Principles

### CMS stays clean

Sanity should store structured content only.

Avoid:

- HTML in CMS
- styling in CMS
- layout logic in CMS

### UI handles rendering and sanitizing

The React layer is responsible for:

- formatting
- layout
- styling
- content safety

### Not a page builder

Editors should not assemble pages freely.

Instead pages have **defined section slots** like:

- Hero
- Featured
- Process
- CTA

---

## Content Philosophy

Sanity schemas should prioritize clarity and reuse.

Prefer:

- semantic field names
- reusable object types
- structured content over rich text when possible

Avoid:

- schema designs that encode layout decisions
- storing presentation logic in CMS fields

---

## Data Fetching

All CMS data should be fetched via the named query functions in `lib/sanity/queries.ts`
(e.g. `getAboutPage`, `getHomePage`). These wrap `sanityFetch` from `lib/sanity/client.ts`
with React `cache()` for per-request deduplication and ISR tag support.

Do not call `sanityFetch` or the Sanity client directly in components — doing so
bypasses the cache layer.

---

## Key Files

| File                       | Purpose                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `lib/sanity/queries.ts`    | All GROQ queries and typed fetch functions                 |
| `lib/sanity/types.ts`      | TypeScript types matching query output shapes              |
| `lib/sanity/client.ts`     | Sanity client + `sanityFetch` wrapper with ISR tag support |
| `lib/seo/buildMetadata.ts` | Shared metadata normalization and fallback assembly        |
| `lib/links/resolveLink.ts` | Maps CMS link objects to safe hrefs                        |
| `components/SmartLink.tsx` | Universal link renderer (internal / external / broken)     |

### SmartLink

Core primitive used everywhere a CMS link needs to render. Handles three states:

- Internal → `<Link>` (Next.js client-side navigation)
- External → `<a target="_blank" rel="noopener noreferrer">`
- Broken reference → inert `<span>` (no href, no role)

External URLs are sanitized via `getSafeHref`. Never bypass SmartLink for CMS links.

---

## Design Language

**Color palette:** semantic design tokens defined in `app/globals.css` via Tailwind v4 `@theme`. The full spec is in `docs/project/design-system.md`. Do not use raw Tailwind stone utilities in new component code — use semantic tokens (`bg-canvas`, `text-ceramic`, `bg-panel`, `text-text-primary`, etc.).

**Typography:** Playfair Display (serif headings) + Be Vietnam Pro (sans body), loaded via `next/font` in `app/layout.tsx` with Vietnamese subset support. Wired to `--font-heading` / `--font-body` CSS variables.

**Layout primitives:** `Canvas` (bamboo green background layer) and `EditorialPanel` (warm paper panel floating above the canvas). All readable content lives inside panels.

**Spacing:** `mx-auto max-w-7xl px-4 md:px-8` is the standard page container.
Sections should wrap content in this container unless intentionally full-bleed.
`py-16` is the standard section vertical rhythm.

### Design Direction

The visual style should feel:

- calm
- editorial
- craft-focused
- minimal

The site should resemble an editorial craft publication rather than a
typical e-commerce store.

Avoid:

- loud colors
- heavy UI decoration
- aggressive marketing elements

---

## Folder Structure

Current (actual):

```
app/
  (site)/
    page.tsx
    about/
    collections/[slug]/
    products/[slug]/
  studio/

components/
  icons/          ← Logo component + generated SVG variants
  sections/       ← page-level building blocks
  *.tsx           ← shared primitives (Canvas, EditorialPanel, SmartLink, etc.)

lib/
  sanity/
  seo/
  links/

schemas/
  documents/
  objects/
    sections/

scripts/
  logo/           ← SVG asset pipeline scripts + README

docs/
  brand/          ← brand documentation (logo-system.md, etc.)
  project/        ← canonical project docs (context, architecture, design system, rules, roadmap)

ai/               ← gitignored AI session notes (bootstrap.md, handoff.md)
```

Planned (not yet created):

```
components/
  ui/             ← small reusable UI atoms (buttons, badges, etc.)
  portableText/   ← custom PortableText block renderers
```

### Section Components

Components inside `components/sections/` represent page-level content blocks.

Examples:

- HeroSection
- FeaturedSection
- ProcessSection
- CTASection

Sections should:

- accept typed data from the data layer
- avoid fetching data themselves
- remain layout-focused

---

## Image Strategy

Early stage:

- simple photography

Later:

- professional photography

Images are resolved in GROQ to `{ url, alt, caption }`. Raw asset references
and hotspot/crop data are not currently used. Upgrade path: `@sanity/image-url`
with hotspot support when professional photography arrives.
