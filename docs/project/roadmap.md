# Roadmap

> Task tracker. Claude updates this as work progresses.
> This roadmap tracks product-level features, not individual code changes.
> Status: ✅ Done · 🔄 In Progress · ⬜ Planned

---

## Phase 1 — Core Content Routes

Goal: all core pages implemented and fully driven by Sanity content —
a complete, polished brand site ready for public launch.

| Page       | Route                 | Status |
| ---------- | --------------------- | ------ |
| Homepage   | `/`                   | ✅     |
| Collection | `/collections/[slug]` | ✅     |
| Product    | `/products/[slug]`    | ✅     |
| About      | `/about`              | ✅     |
| Contact    | `/contact`            | ✅     |
| Collections index | `/collections` | ✅ (v0 design, 2026-10-21) |

### Known TODOs (deferred from earlier pages)

- ⬜ Product gallery interaction (thumbnail swap)
  — requires a small `use client` island; noted in `products/[slug]/page.tsx`
- ⬜ Product page: add `weightUnit` field to dimensions schema
  — weight currently renders without a unit
- ⬜ Contact page: replace `<div>` groups in `ContactSection.tsx` with semantic `<ul>`/`<li>` lists
  — noted in component; improves accessibility and document structure
- ⬜ Set `RESEND_API_KEY` in `.env.local` and Vercel environment variables
  — required for inquiry form to deliver emails in production
- ⬜ Set `RESEND_FROM_ADDRESS` in `.env.local` and Vercel environment variables
  — must be a verified sending address on a confirmed Resend domain; noted with TODO in `app/(site)/contact/actions.ts`

### Design System (Pre-Launch)

Finalize the visual system before launch. Spec fully approved in `docs/project/design-system.md`. Implementation is the current active task.

Spec covers: typography (Playfair Display + Be Vietnam Pro), semantic color tokens, bamboo canvas + editorial panel system, spacing rhythm, image presentation, and responsive behavior.

- ✅ Design system spec approved
- ✅ Tailwind v4 `@theme` token implementation (global CSS)
- ✅ Google Fonts loaded (Playfair Display + Be Vietnam Pro)
- ✅ Canvas background applied (`Canvas` primitive + body baseline)
- ✅ Editorial panel primitive implemented (`EditorialPanel`)
- ✅ Logo asset pipeline — 4 variants generated from 35-tile designer source strip
- ✅ Footer migrated to canvas tokens
- ✅ Logo sizing and Navbar refinement (h-18, tight viewBox, border removed, full-width anchoring)
- ✅ ContactSection migrated to EditorialPanel + semantic tokens
v0 design direction approved 2026-10-21 (reference: `v0-import/`, gitignored, read-only).
See the Migration Status table in `docs/project/design-system.md`.

- ✅ v0 design system tokens added (fluid type, layout rhythm, motion, focus) — additive only
- ✅ Collections index `/collections` built to v0 design (`collectionsPage` singleton + fallbacks)
- ⬜ Homepage rebuilt to v0 design (v0 sections: hero, story teaser, featured collection, craft process, brand statement, stores)
- ⬜ Navbar + Footer migrated to v0 chrome _(needs explicit approval)_
- ⬜ Flip `body`/`Canvas` ground to paper once pages are migrated
- ⬜ Contact, Collection detail, Product, About migrated to paper ground _(About/Collection/Product need designs)_
- ⬜ Fix unlayered `a { color: inherit }` in `globals.css` — it overrides every `text-*` utility on links (e.g. Contact `hover:text-bamboo-main` never applies). Moving it into `@layer base` will change link colors on existing pages, so do it with the chrome migration.
- ⬜ Add ESLint (no lint config or script exists; `next build` no longer lints in Next 16)
- ⬜ Collections ordering — currently `_createdAt asc`; add an orderable field if editors need control
- ⬜ Remaining components migrated to semantic tokens _(follows layout build-out)_
- ⬜ Canvas organic texture applied (technique TBD — see `docs/project/design-system.md`)
- ⬜ Responsive refinements validated
- ⬜ Section spacing consistency pass

The primary goal of the first launch is brand presentation and storytelling,
not transaction volume.

---

## Phase 2 — Inquiry & Localization

Goal: enable customers to inquire about products; support Vietnamese audience.

- ⬜ Inquiry flow from product pages (CTA → contact)
- ⬜ Product-specific inquiry context (product name/image passed to form)
- ⬜ Vietnamese language version
- ⬜ Currency display switcher (VND / USD)

---

## Phase 3 — E-commerce

Goal: full purchasing capability.

- ⬜ Checkout integration (platform TBD)
- ⬜ Domestic payment methods
- ⬜ International shipping support
- ⬜ Cart / order management

---

## Icebox — Unscheduled

Ideas noted but not yet prioritized.

- ⬜ `@sanity/image-url` with hotspot/crop support
  — unblock once professional photography arrives
- ⬜ Draft / preview mode (Sanity read token required)
- ⬜ `revalidateTag` webhook for on-demand ISR
- ⬜ `components/ui/` — shared UI atoms (buttons, badges)
- ⬜ `components/portableText/` — custom PortableText renderers
- ⬜ Product search
- ⬜ Responsive image optimization
