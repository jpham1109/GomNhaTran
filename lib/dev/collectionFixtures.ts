/**
 * DEVELOPMENT-ONLY fixtures for reviewing the /collections layouts.
 *
 * Loaded by app/(site)/collections/page.tsx via `?fixture=<name>` only when
 * NODE_ENV !== 'production', through a dynamic import that production builds
 * eliminate. Never read by the data layer and never written to Sanity.
 *
 *   ?fixture=0 … 9      first N collections of a deliberately uneven pool
 *   ?fixture=no-images  every cover image missing
 *   ?fixture=no-text    every description missing
 *   ?fixture=long       long titles and descriptions
 *
 * Images reuse a landscape asset already in the Sanity dataset, so the
 * fixtures exercise the real CDN + next/image path and the portrait crop.
 */

import type { SanityCollectionPreview, SanityImage } from '@/lib/sanity/types'

const IMAGE: SanityImage = {
  url: 'https://cdn.sanity.io/images/lbkb7v6e/production/2dadf1493a76456fd0f3c972a8df0f61905d1117-5712x4284.jpg',
  alt: 'Fixture image',
  caption: null,
}

const LONG_DESCRIPTION =
  'Pieces that carry the kiln on their surface: ash spots, pooled glaze, a blush where the flame came close. We used to set these aside. Now they are some of our favourites, and each is one of a kind, so what you see is exactly what you will hold.'

// Uneven on purpose: long and short titles, missing descriptions, a missing cover.
const POOL: SanityCollectionPreview[] = [
  { slug: 'cup-eo', title: 'Waisted Mugs', description: 'Our signature waisted form, thrown by hand and finished with a pulled handle.', coverImage: IMAGE },
  { slug: 'coc-tru-cao', title: 'Tall Cups', description: 'Straight-sided cups for tea and coffee, glazed in soft studio colours.', coverImage: IMAGE },
  { slug: 've-sen', title: 'Hand-Painted Lotus', description: 'Lotus motifs drawn freehand, then outlined in iron red before the final firing.', coverImage: IMAGE },
  { slug: 'men-ngoc', title: 'Celadon', description: 'Pale jade glazes in the old Bát Tràng tradition.', coverImage: IMAGE },
  { slug: 'ba-tran-chon', title: 'Mrs Trần’s Selection', description: 'The pieces she keeps on her own table, picked each season.', coverImage: IMAGE },
  { slug: 'men-chay', title: 'Flowing Glazes', description: null, coverImage: IMAGE },
  { slug: 'tra-sang', title: 'Morning Tea for Two, and Other Quiet Rituals', description: null, coverImage: IMAGE },
  { slug: 'dau-lo', title: 'Kiln Marks', description: LONG_DESCRIPTION, coverImage: IMAGE },
  { slug: 'moi-ra-lo', title: 'New From the Kiln', description: 'Pieces from our most recent firing, photographed soon.', coverImage: null },
]

const NAMED: Record<string, SanityCollectionPreview[]> = {
  'no-images': POOL.slice(0, 4).map((c) => ({ ...c, coverImage: null })),
  'no-text': POOL.slice(0, 3).map((c) => ({ ...c, description: null })),
  long: [
    { ...POOL[0], title: 'Morning Tea for Two, and Other Quiet Rituals of the Studio Kitchen', description: LONG_DESCRIPTION },
    { ...POOL[1], title: 'Supercalifragilisticexpialidocious-Glaze-Experiments', description: LONG_DESCRIPTION + ' ' + LONG_DESCRIPTION },
    { ...POOL[2], title: 'Gốm Men Rạn Cổ Truyền Bát Tràng Làm Thủ Công', description: LONG_DESCRIPTION },
  ],
}

/** Returns the fixture set for `name`, or null when the name is unknown. */
export function getCollectionFixture(name: string): SanityCollectionPreview[] | null {
  if (Object.hasOwn(NAMED, name)) return NAMED[name]
  const count = Number.parseInt(name, 10)
  return Number.isNaN(count) ? null : POOL.slice(0, Math.max(0, count))
}
