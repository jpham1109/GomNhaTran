/**
 * scripts/optimize-logo.mjs
 *
 * Reproducible asset-generation script. Keep in the repo.
 * Run from the project root: node scripts/optimize-logo.mjs
 *
 * Reads:  components/icons/logo.svg  (source — never modified)
 * Writes:
 *   components/icons/logo-boxed.svg       — full brand badge, green bg + tagline (tile 1)
 *   components/icons/logo-mark.svg        — simplified seal, green bg, no tagline (tile 6)
 *   components/icons/logo-transparent.svg — simplified seal, no background (tile 6)
 *   components/icons/logo-mono.svg        — simplified seal, all fills → currentColor (tile 6)
 *
 * Source structure:
 *   The Inkscape export is a 35-tile strip. Tiles 1–5 are the full badge with tagline.
 *   Tiles 6–10 are designer-provided simplified seals without the bottom tagline.
 *   Only tile 1 (full) and tile 6 (simplified) are extracted; all other tiles are discarded.
 *   See scripts/inspect-logo-tiles.mjs for the full tile inventory.
 */

import { optimize } from 'svgo'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

// ── Helpers ───────────────────────────────────────────────────────────────────

const kb = (str) => (Buffer.byteLength(str, 'utf8') / 1024).toFixed(1) + ' KB'

function assert(condition, message) {
  if (!condition) {
    console.error('\n✗ VALIDATION FAILED:', message)
    process.exit(1)
  }
}

// ── Tile definitions ──────────────────────────────────────────────────────────
// Each tile is a 2000×2000 px section of the strip (1500×1500 local units,
// scaled ×1.333). txStart / txEnd are the matrix tx boundaries in the raw SVG.
// viewBox places the tile in the SVG coordinate space after translate(-8080).

const TILE1 = {
  txStart: 0,
  txEnd: 2020,
  viewBox: '-8080 0 2000 2000',
  bgId: 'path1',
  label: 'tile 1 (full badge)',
}

const TILE6 = {
  txStart: 10100,
  txEnd: 12120,
  viewBox: '2020 0 2000 2000',
  bgId: 'path36',
  label: 'tile 6 (simplified seal)',
}

// ── Pre-processing: extract a single tile ─────────────────────────────────────
// Runs on the raw Inkscape source string before SVGO so the original
// comma-separated matrix format is intact and the tx values are exact.
// All <path /> elements outside the tile's tx range are stripped.

function extractTile(src, tile) {
  return src.replace(/<path\b[\s\S]*?\/>/g, (match) => {
    const m = match.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+),/)
    if (!m) return match
    const tx = parseFloat(m[1])
    return tx >= tile.txStart && tx < tile.txEnd ? match : ''
  })
}

// ── viewBox patching ──────────────────────────────────────────────────────────
// The source viewBox "0 0 2000 2000" is replaced with the tile-specific crop.
// Called after SVGO so the attribute is present and unambiguous.

function patchViewBox(svgData, tile) {
  const vb = `viewBox="${tile.viewBox}"`
  const patched = svgData.replace(/viewBox="[^"]*"/, vb)
  assert(
    patched.includes(vb),
    `patchViewBox: replacement did not apply for ${tile.label}`,
  )
  return patched
}

// ── Base SVGO plugins ─────────────────────────────────────────────────────────
// Applied to all variants. convertPathData disabled to preserve exact visual
// fidelity — do not enable without visual regression testing.

const basePlugins = [
  {
    name: 'preset-default',
    params: {
      overrides: {
        removeViewBox: false,
        cleanupIds: false,
        convertPathData: false,
      },
    },
  },
  'removeMetadata',
  'removeComments',
  'removeEditorsNSData',
  'removeXMLProcInst',
  'removeDoctype',
  // Removes the Inkscape ICC color-profile element — a ~500KB base64 blob
  // with no visual effect on web rendering.
  {
    name: 'removeColorProfile',
    fn: () => ({
      element: {
        enter: (node, parentNode) => {
          if (node.name === 'color-profile') {
            parentNode.children = parentNode.children.filter((c) => c !== node)
          }
        },
      },
    }),
  },
]

// ── Plugin factory: remove background rect ────────────────────────────────────
// Removes the 1500×1500 filled background rect by its path ID.
// Returns the plugin and a wasFound() accessor for post-pass assertion.

function makeRemoveBackground(bgId) {
  let found = false
  const plugin = {
    name: 'removeBackground',
    fn: () => ({
      element: {
        enter: (node, parentNode) => {
          if (node.name === 'path' && node.attributes.id === bgId) {
            parentNode.children = parentNode.children.filter((c) => c !== node)
            found = true
          }
        },
      },
    }),
  }
  return { plugin, wasFound: () => found }
}

// ── Plugin: convert all color fills and strokes to currentColor ───────────────
// Handles every location a hex color can appear:
//   1. fill="..."         2. stroke="..."
//   3. fill:... in style  4. stroke:... in style
// Leaves fill="none" / stroke="none" untouched.

const convertToCurrentColor = {
  name: 'convertToCurrentColor',
  fn: () => ({
    element: {
      enter: (node) => {
        if (node.attributes.fill?.startsWith('#')) {
          node.attributes.fill = 'currentColor'
        }
        if (node.attributes.stroke?.startsWith('#')) {
          node.attributes.stroke = 'currentColor'
        }
        if (node.attributes.style) {
          node.attributes.style = node.attributes.style
            .replace(/\bfill\s*:\s*#[0-9a-fA-F]{3,8}\b/gi, 'fill:currentColor')
            .replace(/\bstroke\s*:\s*#[0-9a-fA-F]{3,8}\b/gi, 'stroke:currentColor')
        }
      },
    },
  }),
}

// ── Extract tile sources ───────────────────────────────────────────────────────

const source = readFileSync('components/icons/logo.svg', 'utf8')
mkdirSync('components/icons', { recursive: true })

const tile1Src = extractTile(source, TILE1)
const tile6Src = extractTile(source, TILE6)

// ── Generate variants ─────────────────────────────────────────────────────────

// 1. Boxed — full brand badge with tagline (tile 1)
const boxedRaw = optimize(tile1Src, { plugins: basePlugins })
const boxed = { data: patchViewBox(boxedRaw.data, TILE1) }
writeFileSync('components/icons/logo-boxed.svg', boxed.data)

// 2. Mark — simplified seal, background intact (tile 6)
const markRaw = optimize(tile6Src, { plugins: basePlugins })
const mark = { data: patchViewBox(markRaw.data, TILE6) }
writeFileSync('components/icons/logo-mark.svg', mark.data)

// 3. Transparent — simplified seal, no background (tile 6)
const { plugin: removeBg, wasFound: bgFound } = makeRemoveBackground(TILE6.bgId)
const transparentRaw = optimize(tile6Src, { plugins: [...basePlugins, removeBg] })
assert(bgFound(), `${TILE6.bgId} (background rect) not found in ${TILE6.label}`)
const transparent = { data: patchViewBox(transparentRaw.data, TILE6) }
writeFileSync('components/icons/logo-transparent.svg', transparent.data)

// 4. Mono — simplified seal, all fills → currentColor (tile 6)
const { plugin: removeBgMono, wasFound: bgFoundMono } = makeRemoveBackground(TILE6.bgId)
const monoRaw = optimize(tile6Src, { plugins: [...basePlugins, removeBgMono, convertToCurrentColor] })
assert(bgFoundMono(), `${TILE6.bgId} not found in mono pass`)
const mono = { data: patchViewBox(monoRaw.data, TILE6) }
writeFileSync('components/icons/logo-mono.svg', mono.data)

// ── Validate outputs ──────────────────────────────────────────────────────────

// Non-empty
assert(boxed.data.length > 500, 'logo-boxed.svg appears empty')
assert(mark.data.length > 500, 'logo-mark.svg appears empty')
assert(transparent.data.length > 500, 'logo-transparent.svg appears empty')
assert(mono.data.length > 500, 'logo-mono.svg appears empty')

// Correct viewBoxes
assert(boxed.data.includes(`viewBox="${TILE1.viewBox}"`), 'logo-boxed.svg has wrong viewBox')
assert(mark.data.includes(`viewBox="${TILE6.viewBox}"`), 'logo-mark.svg has wrong viewBox')
assert(transparent.data.includes(`viewBox="${TILE6.viewBox}"`), 'logo-transparent.svg has wrong viewBox')
assert(mono.data.includes(`viewBox="${TILE6.viewBox}"`), 'logo-mono.svg has wrong viewBox')

// Transparent: background rect gone
assert(!transparent.data.includes(`id="${TILE6.bgId}"`), 'logo-transparent.svg still contains background rect')

// Mono: background rect gone
assert(!mono.data.includes(`id="${TILE6.bgId}"`), 'logo-mono.svg still contains background rect')

// Mono: currentColor present
assert(mono.data.includes('currentColor'), 'logo-mono.svg contains no currentColor')

// Mono: no remaining hex fill or stroke values
assert(!/fill\s*:\s*#[0-9a-fA-F]/i.test(mono.data), 'logo-mono.svg still contains a hex fill in style')
assert(!/fill="#[0-9a-fA-F]/i.test(mono.data), 'logo-mono.svg still contains a hex fill attribute')
assert(!/stroke="#[0-9a-fA-F]/i.test(mono.data), 'logo-mono.svg still contains a hex stroke attribute')
assert(!/stroke\s*:\s*#[0-9a-fA-F]/i.test(mono.data), 'logo-mono.svg still contains a hex stroke in style')

// Mono: no rgb() or hsl() color syntax
assert(!/fill\s*:\s*rgb\(/i.test(mono.data), 'logo-mono.svg contains rgb() fill in style')
assert(!/fill\s*:\s*hsl\(/i.test(mono.data), 'logo-mono.svg contains hsl() fill in style')
assert(!/fill="rgb\(/i.test(mono.data), 'logo-mono.svg contains rgb() fill attribute')
assert(!/fill="hsl\(/i.test(mono.data), 'logo-mono.svg contains hsl() fill attribute')

// ── Report ────────────────────────────────────────────────────────────────────

console.log('Source                  ', kb(source))
console.log('✓ logo-boxed.svg        ', kb(boxed.data), ' (tile 1 — full badge)')
console.log('✓ logo-mark.svg         ', kb(mark.data), ' (tile 6 — simplified seal, boxed)')
console.log('✓ logo-transparent.svg  ', kb(transparent.data), ' (tile 6 — simplified seal, no bg)')
console.log('✓ logo-mono.svg         ', kb(mono.data), ' (tile 6 — simplified seal, mono)')
console.log('\nAll variants generated and validated.')
