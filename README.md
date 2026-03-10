# GomNhaTran - Ceramics Studio Website
Official website for Gốm Nhà Trần, an artisanal ceramics studio rooted in the traditions of Bát Tràng pottery village in Hanoi, Vietnam.

The website showcases the studio's work and enables visitors to inquire about purchasing handmade pieces.

Future stages will introduce international shipping and online checkout.

---

## Live Vision

The website aims to combine:

- Editorial storytelling
- Product showcase
- Inquiry-based purchasing (eventually full e-commerce)

Target audience:

- Tourists visiting Vietnam
- International collectors
- Design enthusiasts


## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

### CMS
- Sanity.io
- Embedded Studio at `/studio`

### Email
- Resend (inquiry form delivery)

### Architecture
- React Server Components by default
- Client component islands (`use client`) only where interactivity is required
- GROQ queries with typed projections
- CDN-cached Sanity reads
- ISR tag invalidation ready


## Core Architecture Principles

The project follows several architectural rules to keep the codebase predictable and maintainable.

**1. CMS provides content, not layout**
Sanity stores structured content only.
Page structure and presentation are defined entirely in the React UI.

**2. Routes own data fetching**
Next.js routes (`app/`) fetch data from the Sanity layer and pass it to components.
Components remain presentation-focused.

**3. Server Components by default**
React Server Components are the default.
Client components (`use client`) are used only when interactivity is required (e.g. the contact form).

**4. Typed data layer**
All Sanity queries live in `lib/sanity/` and return strongly typed projections.

**5. Shared utilities for cross-cutting logic**
Common functionality such as SEO metadata normalization lives in `lib/`.

---

## Architecture Overview

The application separates content, data access, routes, and UI components.

```
Sanity CMS
     │  structured content only
     ▼
Data Layer (lib/sanity/)
     │  GROQ queries + typed projections
     ▼
Next.js Routes (app/)
     │  pages + layouts, kept lightweight
     ▼
UI Components (components/)
     │  sections, cards, primitives
```

This separation keeps:
- CMS data clean
- UI reusable
- Routes lightweight and easy to scan


## Key Components

### SmartLink
Centralized link resolver for all CMS-sourced links.

Supports:
- Internal document references → `<Link>` (Next.js client-side navigation)
- External URLs → `<a target="_blank" rel="noopener noreferrer">`
- Broken references → inert `<span>` (no href, no role)

Security safeguards include sanitized external URLs (allowlist: `http:`, `https:`, `mailto:`, `tel:`).

### PricingDisplay
Handles currency formatting using `Intl.NumberFormat`.

```
USD → $35.50
VND → 25.000 ₫
```

### ProductCard
Reusable card used across collection pages, the homepage, and product listings.

Includes responsive image, pricing display, and stock state indicator.


## Pages

All Phase 1 pages are complete and fully driven by Sanity content.

| Page       | Route                   | Status |
| ---------- | ----------------------- | ------ |
| Homepage   | `/`                     | ✅     |
| Collection | `/collections/[slug]`   | ✅     |
| Product    | `/products/[slug]`      | ✅     |
| About      | `/about`                | ✅     |
| Contact    | `/contact`              | ✅     |

### Homepage
CMS-driven sections: Hero, Featured Collections, Featured Products, About Teaser.

### Collection `/collections/[slug]`
Cover image, description, and a grid of products fetched via reverse reference query.

### Product `/products/[slug]`
Full product detail: image gallery, description (Portable Text), materials, dimensions, pricing, and stock state.

### About `/about`
Brand story with Portable Text body, images, and a step-by-step process section.

### Contact `/contact`
Two-column layout: contact details (email, phone, locations, social links) and a functional inquiry form. Form submissions are delivered via Resend. The form toggle and destination email are managed in Sanity.


## Project Structure

```
app/
  (site)/
    page.tsx                  ← Homepage
    about/
    collections/[slug]/
    products/[slug]/
    contact/
      page.tsx
      actions.ts              ← Inquiry form server action (Resend)
  studio/                     ← Embedded Sanity Studio

components/
  forms/
    ContactForm.tsx           ← use client inquiry form island
  icons/
  sections/                   ← Page-level content blocks
  CollectionCard.tsx
  Footer.tsx
  MobileMenu.tsx
  Navbar.tsx
  PortableTextRenderer.tsx
  PricingDisplay.tsx
  ProductCard.tsx
  SmartLink.tsx

lib/
  sanity/
    client.ts
    queries.ts
    types.ts
  seo/
    buildMetadata.ts          ← Shared metadata normalization
  links/
    resolveLink.ts
    getSafeHref.ts

schemas/
  documents/
  objects/
    sections/
```


## Sanity CMS

Sanity Studio is embedded inside the application at `/studio`.

Editors can manage:

- Site settings and default SEO
- Navigation
- Homepage sections
- Products and collections
- About page
- Contact page (email, phone, locations, social links, form toggle)


## Running Locally

Install dependencies

```
npm install
```

Create environment file `.env.local` with the following variables:

```
# Sanity (required)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=

# Resend — inquiry form email delivery (required for form to work)
RESEND_API_KEY=
RESEND_FROM_ADDRESS=        # must be a verified address on your Resend domain

# Optional
SANITY_API_READ_TOKEN=      # only needed for draft/preview mode
```

Start dev server

```
npm run dev
```

Open `http://localhost:3000`

Studio `http://localhost:3000/studio`


## Roadmap

### Phase 1 — Core Content Routes ✅
All pages implemented and fully driven by Sanity content.

### Phase 2 — Inquiry & Localization
- Inquiry flow from product pages (CTA → contact)
- Product-specific inquiry context passed to form
- Vietnamese language version
- Currency display switcher (VND / USD)

### Phase 3 — E-commerce
- Checkout integration
- Domestic payment methods
- International shipping support
- Cart / order management


## Design Philosophy

The site uses a **structured CMS, not a page builder**.

Content editors control **content**, not layout. Pages have defined section slots — editors fill in the content, the UI handles all presentation decisions.

The visual tone is calm, editorial, and craft-focused — closer to an editorial publication than a typical e-commerce store.


## Maintainers

Built by **Jamie Pham**

For the Trần family ceramics studio in Bát Tràng, Vietnam.
