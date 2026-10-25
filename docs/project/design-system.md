# Design System

> Spec for the Gốm Nhà Trần visual design system.
> All decisions here must be approved before writing CSS or Tailwind config.
> Implementation: Tailwind CSS v4 tokens in `@theme` + utilities in `app/globals.css`.

> **Revised 2026-10-21 — v0 editorial direction approved.** The business owner approved
> the v0 homepage design (`v0-import/`, read-only reference, gitignored). It keeps our brand
> palette but changes how surfaces are used: content sits directly on an ivory paper ground,
> bamboo green becomes the deep surface for chrome and feature bands, and the type and
> spacing become larger and fluid. Sections below are marked **Target** (approved design)
> and **Current** (what the code does today) wherever the two differ.

## Migration Status

| Area | Target | Current implementation |
| ---- | ------ | ---------------------- |
| Brand color tokens | Unchanged | ✅ Unchanged |
| Type scale (fluid, Playfair 400) | Site-wide | ✅ Tokens in `globals.css`; used on `/collections` only |
| Layout rhythm (container, gutter, section space) | Site-wide | ✅ Utilities in `globals.css`; used on `/collections` only |
| Motion (reveal, intro rise, `ease-calm`, reduced motion) | Site-wide | ✅ In `globals.css`; reduced-motion override is global |
| Focus-visible ring | Site-wide | ✅ Global (`currentColor`, bamboo on paper) |
| Paper ground | All content pages | 🔄 `/collections` only (`surface-paper` on its `<main>`) |
| Collections index `/collections` | v0 design | ✅ Implemented |
| Homepage | v0 design | ⬜ Needs migration — still canvas ground, pre-design sections |
| Contact page | Paper ground, form treatment TBD | ⬜ Needs migration — still EditorialPanel on canvas |
| Collection detail, Product, About | Paper ground | ⬜ Needs design + migration |
| Navbar (shared chrome) | v0 header (ivory, wordmark lockup, scroll state) | ⬜ Needs approval + migration — still green bar |
| Footer (shared chrome) | v0 deep bamboo footer (columns, stores, contact) | ⬜ Needs approval + migration — still minimal canvas footer |
| `body` / `Canvas` ground | Paper | ⬜ Still bamboo canvas — flip once the pages above are migrated |

---

# Brand Foundation

The visual system is derived from two sources:

1. **The logo** — a calligraphy wordmark inside a rectangular seal mark over a bamboo-green gradient background.
2. **The storefronts** — red earthen roof awnings, jade green glossy wall tiles, red brick tile floors, warm wooden shelving, and ceramics in creams, celadons, earthy browns, and soft whites.

Symbolically, bamboo represents resilience, tradition, and connection to the land. Historically, bamboo was used to fuel the kilns of Bát Tràng — the brand color therefore represents both **material and cultural heritage**, not simply decoration.

---

# Typography

## Typeface Pairing

| Role    | Font             | Rationale                                                     |
| ------- | ---------------- | ------------------------------------------------------------- |
| Heading | Playfair Display | Editorial serif with strong Vietnamese diacritic support      |
| Body    | Be Vietnam Pro   | Designed specifically for Vietnamese, clean contemporary sans |

Both fonts are loaded via `next/font/google` in `app/layout.tsx` (Vietnamese subset).

## Type Scale — Target (implemented as tokens)

Fluid sizes from the approved v0 design. Each token is a Tailwind utility (`text-h1`, …)
that sets size, line height and, for headings, letter spacing.

| Token   | Size (min → max)              | Line height | Usage                        |
| ------- | ----------------------------- | ----------- | ---------------------------- |
| display | `clamp(2.75rem → 5.75rem)`    | 1.02        | Hero headlines               |
| h1      | `clamp(2.25rem → 4rem)`       | 1.06        | Page titles                  |
| h2      | `clamp(1.875rem → 3rem)`      | 1.1         | Section headings, feature cards |
| h3      | `clamp(1.375rem → 1.75rem)`   | 1.2         | Card titles                  |
| body-lg | `clamp(1.0625rem → 1.1875rem)`| 1.6         | Lead paragraphs              |
| body    | `1rem`                        | 1.6         | Default text                 |
| small   | `0.875rem`                    | 1.5         | Captions, card summaries     |
| label   | `0.875rem`, tracking 0.05em   | 1.35        | Eyebrows, group labels       |
| nav     | `0.9375rem`                   | 1.3         | Navigation, buttons, text links |

- Headings are **Playfair Display at weight 400** (`font-serif font-normal`). Italic Playfair
  is used for secondary title lines.
- Body copy is Be Vietnam Pro 400; labels and links use 500 (`font-medium`).
- **Vietnamese diacritics:** any `text-display/h1/h2/h3` element whose language resolves to
  Vietnamese (`lang="vi"` on it or an ancestor) gets extra line height (1.14–1.28) so
  stacked tone marks (Ấ, Ổ, Ặ) don't collide. Mark Vietnamese text with `lang="vi"`.
- Eyebrow pattern: `text-label font-medium text-bamboo-main` preceded by a 24px hairline.
- The custom text tokens are registered with tailwind-merge in `lib/cn.ts`. Add new
  `--text-*` tokens there too, or `cn()` will treat them as colors and drop them.

**Current:** only `/collections` uses the new scale. `body` keeps the browser default size
and line height so existing pages are unaffected. Apply `text-body` per surface until the
site-wide flip.

> Superseded: the original fixed scale (display 3.5rem/700, h1 2.5rem/600, …, body line
> height 1.7) was never applied in code and is replaced by the table above.

---

# Core Color System

## Semantic Token Replacement

The new semantic tokens are the **source of truth** for all app-facing components.
Direct use of raw Tailwind stone utilities in components is replaced by semantic tokens.

| Semantic Token          | Replaces      |
| ----------------------- | ------------- |
| `--color-panel`         | `stone-50`    |
| `--color-text-primary`  | `stone-900`   |

Tailwind stone values may still be referenced internally during transition (e.g. placeholders, borders, secondary text), but any stone utility that maps clearly to a semantic token should be migrated. All new component code should use semantic tokens from the start.

---

## Bamboo Canvas

Primary site background.

Inspired by bamboo stalks, jade tiles, and celadon glaze depth.

```css
--color-canvas: #3F5B2B
```

Characteristics:

- Deep bamboo green
- Grounded and calm
- Designed to contrast clearly with editorial panels

---

## Ceramic Ivory

Primary foreground tone for elements placed directly on the canvas.

Inspired by porcelain clay and kiln ash.

```css
--color-ceramic: #F1E6DA
```

Usage:

- Logo stroke color
- Navigation links on canvas
- Icon strokes on canvas
- Divider lines on canvas
- Subtle UI accents placed against the canvas

Pure white is intentionally avoided.

---

## Editorial Panel Surface

Floating panels that contain all readable content.

```css
--color-panel: #FAF7F2
```

A warm paper tone that maintains a handcrafted, ceramic feeling. Replaces `stone-50` in all panel contexts.

---

## Primary Text

Primary text color inside editorial panels.

```css
--color-text-primary: #3A2F2A
```

A warm dark brown rather than pure black. Replaces `stone-900` in all text contexts.

## Secondary Text

Secondary text, captions, labels, and supporting copy inside panels.

```css
--color-text-secondary: #6B5F59
```

A mid warm brown. Used for subheadlines, eyebrow labels, metadata, and any text that should recede relative to primary content.

---

## Image Placeholder

Background color for image containers while loading or when no image is present.

```css
--color-image-placeholder: #EFEAE3
```

A warm linen tone. Consistent with the panel and ceramic palette. Replaces `stone-100` in all image placeholder contexts.

---

## UI Border

Subtle border color for dividers, input outlines, and panel interior separators.

```css
--color-border-subtle: #E5DED6
```

A warm off-white border. Chosen over `rgba(0,0,0,0.08)` to maintain palette warmth and avoid cool-gray borders that would feel inconsistent with the ceramic and panel surfaces.

---

## Supporting Bamboo Tones

Derived from the logo gradient.

```css
--bamboo-main:  #4C6A2E
--bamboo-mid:   #607F3E
--bamboo-light: #8FA35B
```

Used sparingly for hover states, accents, and subtle UI feedback.

### Usage constraint — `--bamboo-light`

`--bamboo-light: #8FA35B` has a contrast ratio of approximately **2.8:1** against `--color-panel: #FAF7F2`.
This is below WCAG AA (4.5:1 for normal text, 3:1 for large text).

- Decorative use only
- May be used for borders, hover states, icon accents, or subtle UI feedback on the canvas
- **Must not be used for body text or small text on `--color-panel`**
- **Must not be used anywhere AA text contrast is required**

---

## Supporting Accents

Storefront-inspired accent tokens. Derived from the physical brand environment.

```css
--color-brick:   #8C3B2A;  /* kiln brick / roof awning */
--color-clay:    #B88A6A;  /* raw clay / earthen floors */
--color-wood:    #8A684B;  /* warm wooden shelving */
--color-celadon: #A8B7A1;  /* soft ceramic glaze tint */
```

### Intent

| Token             | Inspiration                  |
| ----------------- | ---------------------------- |
| `--color-brick`   | Kiln brick, roof awning      |
| `--color-clay`    | Raw clay, earthen warmth     |
| `--color-wood`    | Natural wooden shelving      |
| `--color-celadon` | Soft ceramic glaze tint      |

### Usage rules

Supporting accents are secondary. They must never compete with the bamboo canvas, ceramic ivory, or panel surface. Appropriate uses:

- Details and emphasis
- Badges and labels
- Dividers
- Hover states
- Very restrained highlights

**Never** use supporting accents on large surface areas or as background colors for major layout sections.

---

# Surfaces

## Target — paper ground, deep bamboo accents

| Surface | Token | Used for | Text |
| ------- | ----- | -------- | ---- |
| **Paper** (page ground) | `--color-panel` `#FAF7F2` | All content pages. Sections sit directly on it — no floating panels. | `text-primary`, `text-secondary`, accents in `bamboo-main` |
| **Deep bamboo** | `--color-canvas` `#3F5B2B` | Shared chrome (footer), occasional full-bleed feature bands | `ceramic` (6.2:1); panel ivory (7.2:1) |
| **Muted band** | `--color-image-placeholder` `#EFEAE3` | Image placeholders; quiet alternating bands (e.g. craft process) | `text-primary` / `text-secondary` (5.2:1) |

- The `surface-paper` utility sets the paper background, `text-primary` text and a
  bamboo focus ring. Apply it to a route's `<main>` (current) or `body` (after the flip).
- Hairline dividers use `border-border-subtle`. On paper they are deliberately faint;
  revisit only if a design needs stronger separation.
- `EditorialPanel` is no longer the default container for page sections. It remains
  available for self-contained boxed content (e.g. the inquiry form) pending the
  Contact page redesign.

**Current:** `body` and `Canvas` still paint the bamboo canvas; only `/collections` sets
`surface-paper` on its `<main>`, between the unchanged green Navbar and Footer.

## Legacy — Canvas + Editorial Panel (current on Contact; superseded)

The sections below describe the original system. They still describe the Contact page
and the shared chrome until those are migrated, then this part should be removed.

## The Canvas

The page background uses the bamboo canvas color (`#3F5B2B`).

A **very subtle organic texture** is layered on top.

Texture inspiration:

- Bamboo fiber
- Handmade paper
- Ceramic glaze variation

Rules:

- Texture must be barely visible at first glance
- Opacity: **2–5%** maximum
- It should add atmosphere, not pattern
- If the texture draws the eye while reading, it is too strong

Implementation options (decide during implementation):

- Low-opacity SVG noise or fiber texture
- Subtle repeating PNG tile at low opacity
- CSS noise pattern via `background-image`

---

## Editorial Panels

Panels float above the canvas and contain all readable content.

| Property      | Value                                                  |
| ------------- | ------------------------------------------------------ |
| Background    | `--color-panel` (`#FAF7F2`)                            |
| Border radius | `rounded-3xl` (1.5rem) — soft and organic              |
| Shadow        | `0 6px 28px rgba(0, 0, 0, 0.08)` — soft ambient only  |
| Padding       | `p-6` mobile · `p-8` default · `p-12` large panels    |
| Max width     | `max-w-7xl`                                            |

The effect should feel like a **sheet of paper resting above a colored surface**, not a UI card.

### Panel radius — validation note

`rounded-3xl` (1.5rem) is the intended global default for editorial panels.

- Validate on mobile and narrow-width layouts during implementation
- If 1.5rem feels too bulbous in a specific component, reduce the radius locally
- Do not change the global direction prematurely based on one component — adjust locally first and revisit the global default only if the pattern proves consistently problematic

---

## Content Rules

| Inside Panels      | On Canvas (outside panels)  |
| ------------------ | --------------------------- |
| All body text      | Hero photography            |
| Product grids      | Full-bleed imagery          |
| Forms              | Intentional whitespace      |
| Editorial content  | Large section separators    |

Panels must never fully cover the canvas. The green background must always remain visible around the edges and between sections.

---

# Layout Rhythm

## Target (implemented as utilities)

| Variable | < 768px | ≥ 768px (md) | ≥ 1024px (lg) | Utility |
| -------- | ------- | ------------ | ------------- | ------- |
| `--container-page` | 90rem | 90rem | 90rem | `container-page` (max width + centered + gutter) |
| `--gutter` | 1.25rem (20px) | 2rem | 3rem | `px-gutter` |
| `--section-space` | 6rem | 8rem | 11rem | `section-y` (top + bottom), `section-b` (bottom only) |

- Desktop layouts use a 12-column grid (`lg:grid-cols-12`) with asymmetric spans, e.g. a
  7-column title against a 4-column lead paragraph starting at column 9.
- Readable copy stays within `max-w-prose` (~65ch).
- Mobile gutter (20px) keeps the 16px minimum side margin.
- Page intros (below the sticky Navbar) use `pt-14 md:pt-20 lg:pt-28`. v0's fixed overlay
  header added `--header-height` to this; our sticky header doesn't need it.

**Current:** used by `/collections`. Other pages still use the legacy container below.

## Legacy

```
mx-auto max-w-7xl px-4 md:px-8
```

| Context        | Spacing |
| -------------- | ------- |
| Section        | `py-16` |
| Inside panel   | `py-10` |
| Panel gap      | `gap-8` |

---

# Image Presentation

## Aspect Ratios

| Context           | Ratio                     |
| ----------------- | ------------------------- |
| Product card      | 1:1 (lead product 4:5)    |
| Collection card   | 4:5 (single feature: 5:4 from `lg`) |
| Hero              | 16:9 desktop / 4:5 mobile |
| Editorial imagery | Flexible                  |

## Style Rules

- All framed photographs use the `Media` component (`components/Media.tsx`): the frame owns
  the aspect ratio, the image covers it, and a missing image shows the mono seal on
  `--color-image-placeholder`
- Image corners: `rounded-xs` (0.125rem) — barely softened, not card-like
- Hover on linked imagery: slow zoom (`scale-103`, 1200ms, `ease-calm`)
- No decorative borders on images
- Full-bleed images on the canvas may carry a very subtle dark overlay if text is placed above them
- `object-fit: cover` is the default
- Focal point cropping via `@sanity/image-url` is deferred until professional photography arrives

## Photography Direction

Ceramics photography should feel natural and material:

- Soft natural light, diffused shadows
- Warm neutral backgrounds (stone, wood, linen)
- Ceramic texture visible and prominent
- Calm, deliberate styling
- Avoid harsh flash or bright commercial lighting

---

# Motion & Interaction

- Easing: `ease-calm` (`cubic-bezier(0.22, 0.61, 0.36, 1)`). Durations 300–900ms; image zoom 1200ms.
- Scroll entrance: wrap blocks in `<Reveal>` (`components/Reveal.tsx`). Progressive enhancement:
  content is server-rendered visible; after hydration, only blocks entirely below the viewport
  are hidden, then fade and lift 14px in as they scroll into view. Without JS nothing is hidden.
  Stagger siblings with `delay` (≤ ~120ms steps).
- Page-intro entrance: `hero-copy` on the parent staggers its first four children on first paint.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, all transitions and animations
  are reduced to effectively zero and revealed content is shown immediately. This override
  is global.
- Text selection uses a 20% bamboo tint on `surface-paper` only (invisible on the canvas).
- **Focus:** `:focus-visible` draws a 2px outline, offset 3px, in `var(--focus-ring, currentColor)`.
  `surface-paper` sets the ring to `bamboo-main`. Cards with a stretched link draw the ring on
  the card (`has-[a:focus-visible]`) rather than on the link.
- Cards with a stretched link have one tab stop whose accessible name is the title.

---

# Responsive Behavior

**Target:** single column on mobile; two columns from `md`; 12-column editorial layouts
from `lg`; three-column galleries from `xl`. Test at 375, 768, 1024 and 1440px.

**Legacy (current on canvas pages):**

| Breakpoint | Behavior                                                      |
| ---------- | ------------------------------------------------------------- |
| Mobile     | Single column. Panels span full width with `px-4` margin.    |
| Tablet     | Comfortable horizontal padding. Some two-column grids collapse. |
| Desktop    | Full two-column layouts. Canvas breathing room visible on sides. |

Panels must always leave visible canvas margins. The canvas must never be fully hidden by panels at any breakpoint.

Minimum canvas margin on mobile: `16px` (`px-4`).

---

# Status

| Section              | Status                                              |
| -------------------- | --------------------------------------------------- |
| Typography           | ✅ Revised 2026-10-21 (fluid scale, Playfair 400)    |
| Color palette        | ✅ Confirmed — unchanged                             |
| Surfaces             | ✅ Revised 2026-10-21 (paper ground, deep bamboo)    |
| Canvas texture       | 🔲 Reconsider — canvas is no longer the page ground |
| Panel system         | ⚠️ Superseded for page sections; kept for boxed content |
| Layout rhythm        | ✅ Revised 2026-10-21                                |
| Motion & focus       | ✅ Approved 2026-10-21                               |
| Image rules          | ✅ Revised 2026-10-21                                |
| Responsive behavior  | ✅ Revised 2026-10-21                                |

See **Migration Status** at the top for what is implemented where.
