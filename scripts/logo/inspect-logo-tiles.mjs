/**
 * scripts/inspect-logo-tiles.mjs
 *
 * Read-only inspection script — does not modify any files.
 * Analyses the tile strip in logo.svg and prints a summary of each tile:
 *   - tile index
 *   - background fill colour
 *   - number of artwork paths
 *   - vertical span of artwork (ty range), as a proxy for tagline presence
 *
 * Run from the project root: node scripts/inspect-logo-tiles.mjs
 */

import { readFileSync } from 'fs'

const source = readFileSync('components/icons/logo.svg', 'utf8')

// ── Extract all paths with their matrix(tx, ty) and fill ──────────────────────

const PATH_RE =
  /<path[\s\S]*?id="(path\d+)"[\s\S]*?style="([^"]+)"[\s\S]*?matrix\(1\.3333333,0,0,-1\.3333333,([^,]+),([^)]+)\)[\s\S]*?\/>/g

const paths = []
let m
while ((m = PATH_RE.exec(source)) !== null) {
  const [, id, style, txStr, tyStr] = m
  const tx = parseFloat(txStr)
  const ty = parseFloat(tyStr)
  const fillMatch = style.match(/fill:([^;]+)/)
  const fill = fillMatch ? fillMatch[1].trim() : '?'
  const isBgRect = source
    .slice(m.index, m.index + m[0].length)
    .includes('M 0,0 H 1500 V 1500 H 0 Z')
  paths.push({ id, tx, ty, fill, isBgRect })
}

// ── Group into tiles by background rect tx ────────────────────────────────────

const bgPaths = paths.filter((p) => p.isBgRect).sort((a, b) => a.tx - b.tx)

const tiles = bgPaths.map((bg, i) => {
  const nextBgTx = bgPaths[i + 1]?.tx ?? Infinity
  const artwork = paths.filter(
    (p) => !p.isBgRect && p.tx >= bg.tx && p.tx < nextBgTx,
  )
  const tyValues = artwork.map((p) => p.ty)
  const tyMin = tyValues.length ? Math.min(...tyValues) : '-'
  const tyMax = tyValues.length ? Math.max(...tyValues) : '-'
  const hasLowPaths = tyValues.some((ty) => ty >= 1400 && ty < 2000)
  return {
    index: i + 1,
    bgId: bg.id,
    bgTx: bg.tx,
    svgX: bg.tx - 8080,
    bgFill: bg.fill,
    artCount: artwork.length,
    tyMin,
    tyMax,
    hasLowPaths,
    artIds: artwork.map((p) => p.id).join(', '),
  }
})

// ── Report ────────────────────────────────────────────────────────────────────

console.log(
  `\nTotal paths: ${paths.length}   Tiles: ${tiles.length}\n`,
)
console.log(
  `${'#'.padEnd(4)} ${'bgId'.padEnd(8)} ${'bgFill'.padEnd(11)} ${'art'.padStart(3)} ${'tyMin'.padStart(6)} ${'tyMax'.padStart(6)}  ${'tagline?'.padEnd(9)} artwork IDs`,
)
console.log('─'.repeat(100))

for (const t of tiles) {
  const tagline = t.hasLowPaths ? 'YES' : 'no'
  console.log(
    `${String(t.index).padEnd(4)} ${t.bgId.padEnd(8)} ${t.bgFill.padEnd(11)} ${String(t.artCount).padStart(3)} ${String(t.tyMin).padStart(6)} ${String(t.tyMax).padStart(6)}  ${tagline.padEnd(9)} ${t.artIds}`,
  )
}

console.log('\nKey:')
console.log('  art      = artwork path count (excl. background rect)')
console.log('  tyMax    = highest ty among artwork paths (ty ≥ 1400 = bottom-area element)')
console.log('  tagline? = YES if any artwork path has ty ∈ [1400, 2000) (probable tagline zone)')
