# Logo System

## Source file

`components/icons/logo.svg` — Inkscape export. The SVG exported from the
designer is a horizontal strip of 35 tiles. Each tile is a 2000 × 2000 canvas
containing a logo variation. The extraction script isolates individual tiles and
generates standalone SVG assets used by the application.

**Never modify this file.** All production assets are derived from it by
`scripts/logo/optimize-logo.mjs`.

---

## Colour scheme (repeats across every 5-tile group)

| Position in group | Background fill | Intended use |
|---|---|---|
| +0 (green) | `#45592e` | Canonical brand representative |
| +1 (cream) | `#fcddd8` | Warm alternative |
| +2 (green) | `#45592e` | — |
| +3 (black) | `#000000` | Dark-mode / print |
| +4 (white) | `#ffffff` | Light-mode / reversed |

Only the **green tile** (position +0) is extracted as the canonical asset. The
others are available in the strip if needed.

---

## Logo variation groups

### Group 1 — Primary Badge (tiles 1–5)

| Property | Value |
|---|---|
| Representative tile | Tile 1 |
| Background ID | `path1` |
| Art paths | 6 |
| Tagline | YES |

**Description:** Full brand badge. Bamboo-green background, rectangular seal mark
centred, brand name text, tagline text below. This is the primary brand asset
for formal use.

**Canonical output:** `logo-full.svg`

**Usage:** Marketing materials, print, OG images, hero sections, email headers.

---

### Group 2 — Seal Mark (tiles 6–10)

| Property | Value |
|---|---|
| Representative tile | Tile 6 |
| Background ID | `path36` |
| Art paths | 3 |
| Tagline | NO |

**Description:** Simplified rectangular seal mark only, no tagline, no supporting
text. Designer-provided navbar-optimised variant. This group is the source for
all UI seal variants.

**Canonical outputs:**
- `logo-seal.svg` — green background intact
- `logo-seal-transparent.svg` — background removed
- `logo-seal-mono.svg` — background removed, all fills → `currentColor`

**Usage:**
- `seal-transparent` — default navbar / mobile logo
- `seal-mono` — monochrome contexts, icon buttons, favicons
- `seal` — branded tiles, app icons

---

### Group 3 — Wordmark Horizontal (tiles 11–15)

| Property | Value |
|---|---|
| Representative tile | Tile 11 |
| Background ID | `path56` |
| Art paths | 15 |
| Tagline | NO |

**Description:** Text-only wordmark left-aligned with the brand name on one single line. No tagline.

**Canonical output:** `logo-wordmark-horizontal.svg`

**Usage:** Wide horizontal spaces — desktop navigation bars if text is needed,
letterhead, document headers.

---

### Group 4 — Wordmark Stacked (tiles 16–20)

| Property | Value |
|---|---|
| Representative tile | Tile 16 |
| Background ID | `path136` |
| Art paths | 15 |
| Tagline | NO |

**Description:** Text-only wordmark with the brand name split across two centered lines: Gốm Nhà / Trần. No tagline.

**Canonical output:** `logo-wordmark-stacked.svg`

**Usage:** Square / portrait spaces — splash screens, loading screens, email
signatures, social avatars.

---

### Group 5 — Craft Stamp (Handicrafts) (tiles 21–25)

| Property | Value |
|---|---|
| Representative tile | Tile 21 |
| Background ID | `path216` |
| Art paths | 28 |
| Tagline | NO |

**Description:** Detailed rectangular stamp treatment with handicraft / artisan
styling. Highest path count of the seal variants. Elaborate decorative border.

**Canonical output:** `logo-stamp-handicrafts.svg`

**Usage:** Craft / artisan product labels, packaging, editorial callouts,
textile / print use. Not for small sizes — minimum 48px.

---

### Group 6 — Hero Badge (tile 26 only)

| Property | Value |
|---|---|
| Representative tile | Tile 26 |
| Background ID | `path361` |
| Art paths | 31 |
| Tagline | YES |

**Description:** Large-format full logo with more detailed artwork than the
Primary Badge. Highest-fidelity version, includes tagline. Single tile (no
colour variants in the strip).

**Canonical output:** `logo-full-large.svg`

**Usage:** Hero images, large print, billboard-scale digital use where fine
detail is visible.

---

### Group 7 — Badge Template (tiles 27–30)

| Property | Value |
|---|---|
| Representative tile | Tile 28 |
| Background ID | `path425` |
| Art paths | 31 |
| Tagline | YES (blank bar) |

**Description:** Full logo with tagline zone present as an empty bar — intended
for co-branding or localised tagline overlays. 4-tile group (not 5).

**Canonical output:** `logo-full-blank-tagline.svg`

**Usage:** Co-branded materials where partner text or campaign tagline is placed
in the reserved bar. Template asset; do not use as a standalone logo.

---

### Group 8 — Craft Stamp (Handcrafted) (tiles 31–35)

| Property | Value |
|---|---|
| Representative tile | Tile 31 |
| Background ID | `path521` |
| Art paths | 29 |
| Tagline | NO |

**Description:** Rectangular stamp with "handcrafted" / artisan mark styling.
Similar to Group 5 but with different text treatment and fewer paths.

**Canonical output:** `logo-stamp-handcrafted.svg`

**Usage:** Same as Group 5 — craft product labels, packaging, editorial. Use
this variant when the "handcrafted" message is primary.

---

## Logo usage hierarchy

When choosing a logo variant, follow this priority:

1. **Seal Mark (transparent)**
   Primary logo for UI and navigation.

2. **Primary Badge**
   Full brand logo with tagline. Use for marketing pages and hero sections.

3. **Wordmark Horizontal**
   Use when the brand name must appear prominently.

4. **Wordmark Stacked**
   Use in narrow or portrait layouts.

5. **Craft Stamps**
   Reserved for product photography, packaging, or editorial contexts.

6. **Hero Badge**
   High-resolution version used only for large displays.

7. **Badge Template**
   Only used when inserting a custom tagline.

---

## Generated files

All files live in `components/icons/`. Generated by running:

```sh
node scripts/logo/optimize-logo.mjs
```

| File | Group | Tile | Background | Minimum size | Notes |
|---|---|---|---|---|---|
| `logo-seal-transparent.svg` | Seal Mark | 6 | None | 24px icon · 40px navbar | **Default navbar logo** |
| `logo-seal-mono.svg` | Seal Mark | 6 | None | 24px | All fills = `currentColor` |
| `logo-seal.svg` | Seal Mark | 6 | Green | 32px | Seal with bg |
| `logo-full.svg` | Primary Badge | 1 | Green | 80px | Primary brand badge |
| `logo-wordmark-horizontal.svg` | Wordmark Horizontal | 11 | Green | 120px wide | Horizontal layout |
| `logo-wordmark-stacked.svg` | Wordmark Stacked | 16 | Green | 80px | Stacked layout |
| `logo-stamp-handicrafts.svg` | Craft Stamp (Handicrafts) | 21 | Green | 48px | Elaborate stamp |
| `logo-full-large.svg` | Hero Badge | 26 | Green | 200px | Large-format full logo |
| `logo-full-blank-tagline.svg` | Badge Template | 28 | Green | 200px | Co-brand template |
| `logo-stamp-handcrafted.svg` | Craft Stamp (Handcrafted) | 31 | Green | 48px | Handcrafted stamp |

Minimum sizes are indicative and will be refined as each variant is placed in
context. Update this table when confirmed sizes are established.

---

## Logo component

`components/icons/Logo.tsx` exports a typed `<Logo variant="…" />` component.

```tsx
import { Logo } from '@/components/icons/Logo'

// Default (navbar / mobile)
<Logo className="h-10 w-auto" />

// Full brand badge
<Logo variant="full" className="h-16 w-auto" />

// Monochrome seal (icon-only button)
<Logo variant="seal-mono" className="h-6 w-6" aria-hidden={false} aria-label="Gom Nha Tran" />
```

**Variants:** `full` | `seal` | `seal-transparent` (default) | `seal-mono` | `wordmark-horizontal` | `wordmark-stacked` | `stamp-handicrafts` | `full-large` | `full-blank-tagline` | `stamp-handcrafted`

**Accessibility:** Default `aria-hidden={true}` — logo is decorative when
inside a labeled `<Link>`. Pass `aria-label` and `aria-hidden={false}` for
standalone usage.

---

## Asset pipeline internals

See `scripts/logo/optimize-logo.mjs` for full implementation. Key steps:

1. **Pre-SVGO tile extraction** (`extractTile`) — strips all `<path>` elements
   outside the tile's `txStart`/`txEnd` range from the raw source string. Must
   run before SVGO because SVGO's `preset-default` normalises Inkscape's
   comma-separated matrix format to space-separated, breaking tx-based matching.

2. **SVGO pass** — removes ICC colour-profile blob (~500 KB base64), metadata,
   editor namespaces. `convertPathData` is disabled to preserve the
   `translate(-8080)` Inkscape origin offset.

3. **viewBox patching** (`patchViewBox`) — replaces the source
   `viewBox="0 0 2000 2000"` with the tile-specific crop after SVGO.

4. **Variant post-processing** — transparent variants remove the background
   rect by ID; mono variant additionally converts all hex fills/strokes to
   `currentColor`.

5. **Validation** — assertions on file size, correct viewBox, background
   removal, and colour conversion before write.

For tile coordinate math and script internals, see
`scripts/logo/README.md`.
