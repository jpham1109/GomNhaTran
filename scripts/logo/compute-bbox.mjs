#!/usr/bin/env node
/**
 * Computes the bounding box of all visible artwork in the SVG logo files.
 *
 * The SVG structure:
 *   <svg viewBox="0 0 2000 2000">
 *     <g transform="translate(-8080)">
 *       <path transform="matrix(1.3333333,0,0,-1.3333333,tx,ty)" d="..." />
 *       ...
 *     </g>
 *   </svg>
 *
 * For each point (x_local, y_local) in path d:
 *   x_svg = 1.3333333 * x_local + tx + (-8080)  [outer group translate]
 *   y_svg = -1.3333333 * y_local + ty
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SVG_FILE = join(__dirname, '../../components/icons/logo-transparent.svg')

// ─── Path Parser ────────────────────────────────────────────────────────────

/**
 * Parse SVG path d attribute and return all absolute (x, y) control/end points.
 * Handles: M, m, L, l, H, h, V, v, C, c, Z, z
 */
function parsePath(d) {
  const points = [];

  // Tokenize: split into command letters and numbers
  const tokens = [];
  const re = /([MmLlHhVvCcSsQqTtAaZz])|(-?[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?)/g;
  let match;
  while ((match = re.exec(d)) !== null) {
    if (match[1]) tokens.push(match[1]);
    else tokens.push(parseFloat(match[2]));
  }

  let i = 0;
  let cx = 0, cy = 0; // current point
  let startX = 0, startY = 0; // start of current subpath

  function nums(n) {
    const result = [];
    for (let k = 0; k < n; k++) {
      result.push(tokens[i++]);
    }
    return result;
  }

  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (typeof cmd !== 'string') continue;

    switch (cmd) {
      case 'M': {
        const [x, y] = nums(2);
        cx = x; cy = y;
        startX = cx; startY = cy;
        points.push([cx, cy]);
        // Subsequent pairs are implicit L
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x2, y2] = nums(2);
          cx = x2; cy = y2;
          points.push([cx, cy]);
        }
        break;
      }
      case 'm': {
        const [dx, dy] = nums(2);
        cx += dx; cy += dy;
        startX = cx; startY = cy;
        points.push([cx, cy]);
        // Subsequent pairs are implicit l
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [dx2, dy2] = nums(2);
          cx += dx2; cy += dy2;
          points.push([cx, cy]);
        }
        break;
      }
      case 'L': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x, y] = nums(2);
          cx = x; cy = y;
          points.push([cx, cy]);
        }
        break;
      }
      case 'l': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [dx, dy] = nums(2);
          cx += dx; cy += dy;
          points.push([cx, cy]);
        }
        break;
      }
      case 'H': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          cx = tokens[i++];
          points.push([cx, cy]);
        }
        break;
      }
      case 'h': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          cx += tokens[i++];
          points.push([cx, cy]);
        }
        break;
      }
      case 'V': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          cy = tokens[i++];
          points.push([cx, cy]);
        }
        break;
      }
      case 'v': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          cy += tokens[i++];
          points.push([cx, cy]);
        }
        break;
      }
      case 'C': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x1, y1, x2, y2, x, y] = nums(6);
          // Include control points for bbox approximation
          points.push([x1, y1], [x2, y2], [x, y]);
          cx = x; cy = y;
        }
        break;
      }
      case 'c': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [dx1, dy1, dx2, dy2, dx, dy] = nums(6);
          points.push([cx + dx1, cy + dy1], [cx + dx2, cy + dy2], [cx + dx, cy + dy]);
          cx += dx; cy += dy;
        }
        break;
      }
      case 'S': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x2, y2, x, y] = nums(4);
          points.push([x2, y2], [x, y]);
          cx = x; cy = y;
        }
        break;
      }
      case 's': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [dx2, dy2, dx, dy] = nums(4);
          points.push([cx + dx2, cy + dy2], [cx + dx, cy + dy]);
          cx += dx; cy += dy;
        }
        break;
      }
      case 'Q': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [x1, y1, x, y] = nums(4);
          points.push([x1, y1], [x, y]);
          cx = x; cy = y;
        }
        break;
      }
      case 'q': {
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const [dx1, dy1, dx, dy] = nums(4);
          points.push([cx + dx1, cy + dy1], [cx + dx, cy + dy]);
          cx += dx; cy += dy;
        }
        break;
      }
      case 'Z':
      case 'z': {
        cx = startX; cy = startY;
        break;
      }
      case 'A':
      case 'a': {
        // Arc: consume 7 params, track endpoint
        while (i < tokens.length && typeof tokens[i] === 'number') {
          const params = nums(7);
          if (cmd === 'A') {
            cx = params[5]; cy = params[6];
          } else {
            cx += params[5]; cy += params[6];
          }
          points.push([cx, cy]);
        }
        break;
      }
      default:
        // Unknown command, skip
        break;
    }
  }

  return points;
}

// ─── Matrix / Transform Parser ───────────────────────────────────────────────

/**
 * Parse transform="matrix(a,b,c,d,e,f)" -> {a,b,c,d,e,f}
 * or transform="translate(tx,ty)" -> matrix form
 */
function parseTransform(transformStr) {
  if (!transformStr) return null;

  const matrixMatch = transformStr.match(/matrix\(\s*([-\d.e+]+)\s*,\s*([-\d.e+]+)\s*,\s*([-\d.e+]+)\s*,\s*([-\d.e+]+)\s*,\s*([-\d.e+]+)\s*,\s*([-\d.e+]+)\s*\)/);
  if (matrixMatch) {
    return {
      a: parseFloat(matrixMatch[1]),
      b: parseFloat(matrixMatch[2]),
      c: parseFloat(matrixMatch[3]),
      d: parseFloat(matrixMatch[4]),
      e: parseFloat(matrixMatch[5]),
      f: parseFloat(matrixMatch[6]),
    };
  }

  const translateMatch = transformStr.match(/translate\(\s*([-\d.e+]+)(?:\s*,\s*([-\d.e+]+))?\s*\)/);
  if (translateMatch) {
    return {
      a: 1, b: 0, c: 0, d: 1,
      e: parseFloat(translateMatch[1]),
      f: translateMatch[2] ? parseFloat(translateMatch[2]) : 0,
    };
  }

  return null;
}

function applyMatrix(matrix, x, y) {
  return [
    matrix.a * x + matrix.c * y + matrix.e,
    matrix.b * x + matrix.d * y + matrix.f,
  ];
}

function multiplyMatrix(m1, m2) {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    e: m1.a * m2.e + m1.c * m2.f + m1.e,
    f: m1.b * m2.e + m1.d * m2.f + m1.f,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

const svgContent = readFileSync(SVG_FILE, 'utf8');

// ── Step 0: Show current SVG root attributes ─────────────────────────────────
const svgRootMatch = svgContent.match(/<svg[^>]+>/);
const currentViewBox = (svgRootMatch && svgRootMatch[0].match(/viewBox="([^"]+)"/))
  ? svgRootMatch[0].match(/viewBox="([^"]+)"/)[1] : 'not found';
const currentWidth = (svgRootMatch && svgRootMatch[0].match(/\bwidth="([^"]+)"/))
  ? svgRootMatch[0].match(/\bwidth="([^"]+)"/)[1] : 'not found';
const currentHeight = (svgRootMatch && svgRootMatch[0].match(/\bheight="([^"]+)"/))
  ? svgRootMatch[0].match(/\bheight="([^"]+)"/)[1] : 'not found';
console.log('=== Current SVG root attributes ===');
console.log(`  viewBox: "${currentViewBox}"  width: ${currentWidth}  height: ${currentHeight}`);

// ── Step 1: Show the outer group transform ────────────────────────────────────
const outerGroupMatch = svgContent.match(/<g[^>]+transform="([^"]+)"[^>]*>/);
const outerTransformStr = outerGroupMatch ? outerGroupMatch[1] : null;
const outerTransform = parseTransform(outerTransformStr) || { a:1,b:0,c:0,d:1,e:0,f:0 };
console.log('\n=== Outer <g> transform ===');
console.log(`  raw: "${outerTransformStr}"`);
console.log(`  matrix: e=${outerTransform.e}, f=${outerTransform.f} (a=${outerTransform.a},d=${outerTransform.d})`);

// ── Step 2: Sanity-check first path manually ──────────────────────────────────
const firstPathMatch = svgContent.match(/<path[^>]+>/);
if (firstPathMatch) {
  const firstPath = firstPathMatch[0];
  const ftMatch = firstPath.match(/\btransform="([^"]+)"/);
  const ftStr = ftMatch ? ftMatch[1] : null;
  const ft = parseTransform(ftStr);
  console.log('\n=== First <path> transform ===');
  console.log(`  raw: "${ftStr}"`);
  if (ft) {
    console.log(`  a=${ft.a.toFixed(6)}, d=${ft.d.toFixed(6)}, tx=e=${ft.e.toFixed(4)}, ty=f=${ft.f.toFixed(4)}`);
    // Manually map path origin (0,0) through path matrix then outer translate
    const combined = multiplyMatrix(outerTransform, ft);
    const [ox, oy] = applyMatrix(combined, 0, 0);
    console.log(`  Path origin (0,0) maps to SVG coords: (${ox.toFixed(2)}, ${oy.toFixed(2)})`);
    console.log(`  Is (${ox.toFixed(0)}, ${oy.toFixed(0)}) plausibly inside viewBox "${currentViewBox}"? ` +
      `${ox >= 0 && ox <= 2000 && oy >= 0 && oy <= 2000 ? 'YES — transform math looks correct' : 'NO — investigate transform accumulation'}`);
  }
}

// ── Step 3: Compute full bounding box ─────────────────────────────────────────
const pathRegex = /<path[^>]+>/gs;
let pathMatch;
let pathCount = 0;

let xMin = Infinity, xMax = -Infinity;
let yMin = Infinity, yMax = -Infinity;

while ((pathMatch = pathRegex.exec(svgContent)) !== null) {
  const pathEl = pathMatch[0];
  const dMatch = pathEl.match(/\bd="([^"]+)"/);
  if (!dMatch) continue;
  const d = dMatch[1];

  const tMatch = pathEl.match(/\btransform="([^"]+)"/);
  const pathTransformStr = tMatch ? tMatch[1] : null;
  const pathTransform = parseTransform(pathTransformStr);

  let combinedTransform;
  if (pathTransform) {
    combinedTransform = multiplyMatrix(outerTransform, pathTransform);
  } else {
    combinedTransform = outerTransform;
  }

  const localPoints = parsePath(d);
  for (const [lx, ly] of localPoints) {
    const [sx, sy] = applyMatrix(combinedTransform, lx, ly);
    if (sx < xMin) xMin = sx;
    if (sx > xMax) xMax = sx;
    if (sy < yMin) yMin = sy;
    if (sy > yMax) yMax = sy;
  }
  pathCount++;
}

console.log(`\n=== Full bounding box (${pathCount} paths) ===`);
console.log(`  xMin = ${xMin.toFixed(2)},  xMax = ${xMax.toFixed(2)},  width  = ${(xMax - xMin).toFixed(2)}`);
console.log(`  yMin = ${yMin.toFixed(2)},  yMax = ${yMax.toFixed(2)},  height = ${(yMax - yMin).toFixed(2)}`);
console.log(`  Aspect ratio (w/h): ${((xMax - xMin)/(yMax - yMin)).toFixed(3)}`);

const [cvbX, cvbY, cvbW, cvbH] = currentViewBox.split(' ').map(Number);
console.log(`\n=== Overlap with current viewBox "${currentViewBox}" ===`);
const overlapX = Math.max(0, Math.min(xMax, cvbX + cvbW) - Math.max(xMin, cvbX));
const overlapY = Math.max(0, Math.min(yMax, cvbY + cvbH) - Math.max(yMin, cvbY));
console.log(`  Artwork x range: [${xMin.toFixed(0)}, ${xMax.toFixed(0)}]   viewBox x range: [${cvbX}, ${cvbX+cvbW}]`);
console.log(`  Artwork y range: [${yMin.toFixed(0)}, ${yMax.toFixed(0)}]   viewBox y range: [${cvbY}, ${cvbY+cvbH}]`);
console.log(`  Horizontal overlap: ${overlapX.toFixed(0)} units`);
console.log(`  Vertical overlap:   ${overlapY.toFixed(0)} units`);
if (overlapX > 0 && overlapY > 0) {
  console.log('  -> Partial overlap: artwork is partially visible');
} else {
  console.log('  -> NO overlap: artwork bbox is entirely outside the current viewBox!');
  console.log('     This likely means the outer translate is being double-applied in the script.');
}

// ── Step 4: Re-run WITHOUT outer translate (to detect double-apply) ───────────
console.log('\n=== Re-run WITHOUT outer translate (identity as outer) ===');
const identity = { a:1, b:0, c:0, d:1, e:0, f:0 };
let xMin2 = Infinity, xMax2 = -Infinity;
let yMin2 = Infinity, yMax2 = -Infinity;
const pathRegex2 = /<path[^>]+>/gs;
let pathMatch2;
while ((pathMatch2 = pathRegex2.exec(svgContent)) !== null) {
  const pathEl = pathMatch2[0];
  const dMatch = pathEl.match(/\bd="([^"]+)"/);
  if (!dMatch) continue;
  const d = dMatch[1];
  const tMatch = pathEl.match(/\btransform="([^"]+)"/);
  const pathTransformStr = tMatch ? tMatch[1] : null;
  const pathTransform = parseTransform(pathTransformStr) || identity;
  const localPoints = parsePath(d);
  for (const [lx, ly] of localPoints) {
    const [sx, sy] = applyMatrix(pathTransform, lx, ly);
    if (sx < xMin2) xMin2 = sx;
    if (sx > xMax2) xMax2 = sx;
    if (sy < yMin2) yMin2 = sy;
    if (sy > yMax2) yMax2 = sy;
  }
}
console.log(`  xMin = ${xMin2.toFixed(2)},  xMax = ${xMax2.toFixed(2)},  width  = ${(xMax2 - xMin2).toFixed(2)}`);
console.log(`  yMin = ${yMin2.toFixed(2)},  yMax = ${yMax2.toFixed(2)},  height = ${(yMax2 - yMin2).toFixed(2)}`);
const overlapX2 = Math.max(0, Math.min(xMax2, cvbX + cvbW) - Math.max(xMin2, cvbX));
const overlapY2 = Math.max(0, Math.min(yMax2, cvbY + cvbH) - Math.max(yMin2, cvbY));
console.log(`  Overlap with viewBox "${currentViewBox}": x=${overlapX2.toFixed(0)}, y=${overlapY2.toFixed(0)}`);
if (overlapX2 > 0 && overlapY2 > 0) {
  console.log('  -> This version (path transform only, no outer translate) overlaps the current viewBox.');
  console.log('     The outer translate should NOT be included in the bbox calc for viewBox purposes.');
} else {
  console.log('  -> Still no overlap without outer translate either.');
}

// ── Step 5: Proposed viewBox (using the version that overlaps the current box) ──
console.log('\n=== Proposed viewBox (15px padding) ===');
const useX = (overlapX2 > 0 && overlapY2 > 0) ? { xMin: xMin2, xMax: xMax2, yMin: yMin2, yMax: yMax2 }
                                                 : { xMin, xMax, yMin, yMax };
const PADDING = 15;
const vxMin = Math.floor(useX.xMin - PADDING);
const vyMin = Math.floor(useX.yMin - PADDING);
const vWidth = Math.ceil(useX.xMax - useX.xMin + 2 * PADDING);
const vHeight = Math.ceil(useX.yMax - useX.yMin + 2 * PADDING);
console.log(`  Based on: ${(overlapX2 > 0 && overlapY2 > 0) ? 'path transforms only (no outer translate)' : 'full combined transform'}`);
console.log(`  viewBox="${vxMin} ${vyMin} ${vWidth} ${vHeight}"`);
console.log(`  width="${vWidth}" height="${vHeight}"`);
console.log(`  Aspect ratio: ${(vWidth/vHeight).toFixed(3)}`);
