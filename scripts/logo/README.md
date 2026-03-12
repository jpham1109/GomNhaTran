# Logo scripts

These scripts support the logo asset pipeline. Run all commands from the **project root**.

---

## Which script should I run?

- Updated `components/icons/logo.svg` from the designer? Run `optimize-logo.mjs`
- Need to understand what tiles exist in the strip? Run `inspect-logo-tiles.mjs`
- Debugging unexpected logo cropping or viewBox issues? Run `compute-bbox.mjs`

---

## Scripts

### `optimize-logo.mjs` — Asset generator

Reads the designer-exported `components/icons/logo.svg` strip and writes all
standalone SVG assets to `components/icons/`.

```sh
node scripts/logo/optimize-logo.mjs
```

Run this whenever `logo.svg` is updated. Generated output files are committed to
the repo for runtime use. Do not edit them directly; regenerate them from the
source strip instead.

---

### `inspect-logo-tiles.mjs` — Tile inventory

Read-only. Prints a full inventory of every tile in the strip: background fill,
artwork path count, tagline detection, and artwork path IDs.

```sh
node scripts/logo/inspect-logo-tiles.mjs
```

Use this to verify the source strip or inspect existing designer-provided variations.

---

### `compute-bbox.mjs` — Bounding-box debugger

Read-only. Computes the axis-aligned bounding box of all artwork paths in a
generated SVG and reports overlap with the current `viewBox`. Targets
`logo-transparent.svg` by default.

```sh
node scripts/logo/compute-bbox.mjs
```

This script is diagnostic only. It is not required for normal asset generation.

---

## Tile coordinate system

The Inkscape export is a horizontal strip of 35 tiles. Each tile occupies a
2000 × 2000 SVG viewBox. An outer group carries `transform="translate(-8080)"`
to compensate for the Inkscape canvas origin.

### Tile address formulas

| Value | Formula | Example (tile 1) |
|---|---|---|
| `bgTx` | Raw Inkscape `matrix(…, tx, …)` of the background rect | `0` |
| `txEnd` | `bgTx + 2020` | `2020` |
| `svgX` | `bgTx − 8080` | `−8080` |
| `viewBox` | `"${svgX} 0 2000 2000"` | `"-8080 0 2000 2000"` |

For tiles 1–25 and 31–35: `bgTx = (tileIndex − 1) × 2020`.
Tile 26 is a single-tile group at `bgTx = 50500`.
Tiles 27–30 begin at `bgTx = 54540`.

### Pre-SVGO tile extraction

All tile stripping happens **before** SVGO runs. SVGO's `preset-default`
normalises Inkscape's comma-separated `matrix(a,b,c,d,tx,ty)` format to
space-separated, which breaks `tx`-based regex matching. The `extractTile()`
function in `optimize-logo.mjs` operates on the raw source string where the
original comma format is intact.

### Why `convertPathData` is disabled

SVGO's `convertPathData` plugin resolves the `translate(-8080)` outer group
transform into absolute path coordinates (x ≈ −7299), placing all artwork
outside the viewBox. This option is permanently disabled in the SVGO config.
`@svgr/webpack` is also configured with `svgo: false` in `next.config.ts` for
the same reason.

### Tile reference table

| Tile | `bgId` | `bgTx` | `svgX` | Art paths | Group |
|---|---|---|---|---|---|
| 1 | `path1` | 0 | −8080 | 6 | Primary Badge |
| 6 | `path36` | 10100 | 2020 | 3 | Seal Mark |
| 11 | `path56` | 20200 | 12120 | 15 | Wordmark Horizontal |
| 16 | `path136` | 30300 | 22220 | 15 | Wordmark Stacked |
| 21 | `path216` | 40400 | 32320 | 28 | Craft Stamp (Handicrafts) |
| 26 | `path361` | 50500 | 42420 | 31 | Hero Badge |
| 28 | `path425` | 54540 | 46460 | 31 | Badge Template |
| 31 | `path521` | 60600 | 52520 | 29 | Craft Stamp (Handcrafted) |
