# GomNhaTran - Ceramics Website
Official website for Gốm Nhà Trần, an artisanal ceramics studio rooted in the traditions of Bát Tràng pottery village in Hanoi, Vietnam.

The website showcases the studio’s work and enables visitors to inquire about purchasing handmade pieces.

Future stages will introduce international shipping and online checkout.

-------------------------------------------------------------------------------------------------------------------

## Live Vision

The website aims to combine:

- Editorial storytelling
- Product showcase
- Inquiry-based purchasing ( Eventually full e-commerce )

Target audience:

- tourists visiting Vietnam
- international collectors
- design enthusiasts


## Tech Stack

### Frontend:
- Next.js 16 (app router)
- React
- TypeScript
- Tailwind CSS v4

### CMS 
- Sanity.io
- Embedded Studio at `/studio`

### Architecture
- Server Components
- Client component islands
- GROQ queries with typed projections
- CDN-cached Sanity reads
- ISR tag invalidation ready


## Architecture Overview

The application follows a three-layer architecture separating content, data, and UI.

```
Sanity CMS
     │
     ▼
Data Layer
(lib/sanity)
queries + typed projections
     │
     ▼
UI Components
(components/)
cards + sections + primitives
     │
     ▼
Next.js Routes
(app/)
pages + layouts
```

This separation keeps:
- CMS data clean
- UI reusable
- routes lightweight

## Key Components

### SmartLink
Centralized link resolver for all CMS links.

It supports:
- internal document references
- external URLs
- safe fallback for broken links

Security safeguards include:
- sanitized external URLs
- route-mapped internal links
- protection against script injection

### Pricing Display
Handles currency formatting.
Uses `Intl.NumberFormat` so currencies automatically render correctly.

Examples:
```
USD → $35.50
VND → 25.000 ₫
```

Future support:
- USD/EUR conversion from VND
- currency selector

### ProductCard

Reusable card used across:

- collection pages
- homepage features
- product listings

Includes:

- responsive image
- pricing display
- stock state indicator

## Pages Implemented
### Homepage

CMS-driven sections:

- Hero
- Featured Collections
- Featured Products
- About teaser

### Collection Page
`/collections/[slug]`

Displays:

- collection cover image
- description
- grid of products

Example layout:
```
Collection Cover
Title + Description
Product Grid
```

## Next.js Dynamic Params

Next.js 15+ treats route parameters as asynchronous dynamic APIs.

Instead of:

`params.slug`

The correct pattern is:

`const { slug } = await params`

Example:
```
type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
}
```
This avoids deprecated synchronous access and ensures compatibility with future Next.js releases.

## Project Structure
```
app/
  (site)/
    collections/[slug]/
    page.tsx
  studio/

components/
  icons/
  sections/
  Navbar.tsx
  Footer.tsx
  MobileMenu.tsx
  ProductCard.tsx
  CollectionCard.tsx

lib/
  sanity/
    client.ts
    queries.ts
    types.ts
  links/
    resolveLink.ts
    getSafeHref.ts

schemas/
  documents/
  objects/
```
## Sanity CMS

Sanity Studio is embedded inside the application:

`/studio`

Editors can manage:

- homepage
- products
- collections
- navigation
- site settings

## Running Locally

Install dependencies

`npm install`

Create environment file

`.env.local`

Required variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
```

Optional variables:
```
SANITY_API_READ_TOKEN=   # only needed for draft/preview mode
```
Start dev server

`npm run dev`

Open

`http://localhost:3000`

Studio

`http://localhost:3000/studio`


## Roadmap
### Phase 1 (in progress)

- Homepage ✓
- Collections ✓
- Products (not yet built)
- Inquiry workflow (not yet built)

### Phase 2

- Vietnamese language version
- Currency switcher (VND / USD)
- Inquiry cart

### Phase 3

- Shopify checkout
- domestic payments
- international shipping

## Design Philosophy

The site uses a **structured CMS, not a page builder**.

Benefits:

- consistent layout
- predictable UI
- easier maintenance
- faster performance

Content editors control **content**, not layout.

## Maintainers

Built by **Jamie Pham**

For the Tran family ceramics studio in Bát Tràng, Vietnam.
