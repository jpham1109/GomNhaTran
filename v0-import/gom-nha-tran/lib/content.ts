/*
  Mock content standing in for Sanity queries.
  Each export mirrors one CMS document or singleton; swap these for GROQ
  results mapped into the shapes in `lib/types.ts`. Components never import this file.
*/

import type {
  BrandStatementSection,
  Collection,
  CollectionSection,
  CollectionsIndexContent,
  CraftSection,
  CraftStage,
  HeroSection,
  NavItem,
  Product,
  SiteSettings,
  Store,
  StoresSection,
  StorySection,
} from '@/lib/types'

export const navigation: NavItem[] = [
  { label: 'Collections', href: '/collections' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Stores & Contact', href: '/contact' },
]

export const siteSettings: SiteSettings = {
  name: 'Gốm Nhà Trần',
  descriptor: 'Bát Tràng',
  locationLine: 'Bát Tràng · Hà Nội',
  tagline: 'Handcrafted ceramics from our family studio in Bát Tràng, Hà Nội.',
  footerNote: 'Làng gốm Bát Tràng · Hà Nội · Việt Nam',
  email: 'hello@gomnhatran.com',
  phone: '+84 24 0000 0000',
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
  ],
}

export const hero: HeroSection = {
  eyebrow: 'Bát Tràng · Hà Nội',
  title: 'Ceramics shaped by hand, glazed by fire.',
  body: 'A family ceramics house from Bát Tràng. Every piece is thrown, glazed and fired in our studio by the river.',
  cta: { label: 'Explore the collections', href: '/collections' },
  image: {
    src: '/images/hero-studio.png',
    alt: 'Glazed cups and mugs on wooden shelves against a wall of jade green tiles, with a brick floor and soft window light.',
    focus: { x: 0.78, y: 0.5 },
  },
}

export const storyTeaser: StorySection = {
  eyebrow: 'Our story',
  title: 'Three generations at the wheel in Bát Tràng.',
  body: [
    'Bát Tràng has made ceramics beside the Red River for more than five centuries. Our family has worked here for three generations, and the studio is still where every Gốm Nhà Trần piece begins.',
    'We keep the slow parts of the process — hand-throwing, layered glazes, long firings — because they are what give each object its character.',
  ],
  cta: { label: 'Discover our story', href: '/our-story' },
  image: {
    src: '/images/story-hands.png',
    alt: "A potter's clay-covered hands shaping a cup on a spinning wheel.",
  },
  detail: {
    src: '/images/products/mug-lotus-indigo.jpg',
    alt: 'Indigo-glazed mug with a hand-carved lotus in ivory and iron red.',
    focus: { x: 0.58, y: 0.48 },
    zoom: 1.6,
  },
}

const waistedMugs: Product[] = [
  {
    slug: 'coc-eo-xanh-sen',
    name: 'Lotus Mug, Indigo',
    nameVi: 'Cốc Eo Xanh Sen',
    priceVnd: 520000,
    image: {
      src: '/images/products/mug-lotus-indigo.jpg',
      alt: 'Waisted mug in deep indigo glaze with a carved ivory lotus outlined in iron red.',
    },
  },
  {
    slug: 'coc-eo-xanh-chay',
    name: 'Flowing Blue Mug',
    nameVi: 'Cốc Eo Xanh Chảy',
    priceVnd: 450000,
    image: {
      src: '/images/products/mug-flowing-blue.jpg',
      alt: 'Waisted mug with turquoise glaze flowing over a dark brown base.',
    },
  },
  {
    slug: 'coc-eo-luc-ngung-suong',
    name: 'Jade Dew Mug',
    nameVi: 'Cốc Eo Lục Ngưng Sương',
    priceVnd: 450000,
    image: {
      src: '/images/products/mug-jade-dew.jpg',
      alt: 'Waisted mug in soft jade green with a speckled glaze edge.',
    },
  },
  {
    slug: 'coc-eo-da-xanh',
    name: 'Blue Stone Mug',
    nameVi: 'Cốc Eo Đá Xanh',
    priceVnd: 450000,
    image: {
      src: '/images/products/mug-blue-stone.jpg',
      alt: 'Waisted mug in mottled blue glaze with an amber rim.',
    },
  },
  {
    slug: 'coc-eo-kt-opal',
    name: 'Crystal Opal Mug',
    nameVi: 'Cốc Eo Kết Tinh Opal',
    priceVnd: 480000,
    image: {
      src: '/images/products/mug-crystal-opal.jpg',
      alt: 'Waisted mug with crystalline teal and pale yellow glaze over white.',
    },
  },
]

export const featuredCollection: Collection = {
  slug: 'coc-eo',
  title: 'The Waisted Mug',
  titleVi: 'Cốc Eo',
  summary:
    'A single hand-thrown form, gently narrowed at the waist so it sits naturally in the hand. We glaze each one differently — layered, dripped or crystallised in the kiln — so no two are quite the same.',
  image: waistedMugs[0].image,
  products: waistedMugs,
}

export const otherCollections: Collection[] = [
  {
    slug: 'coc-tru-cao',
    title: 'Tall Cups',
    titleVi: 'Cốc Trụ Cao',
    summary: 'Straight-walled cups for tea and water.',
    image: {
      src: '/images/products/cup-camel.jpg',
      alt: 'Tall cylindrical cup with turquoise and camel crystalline glaze.',
    },
    products: [],
  },
  {
    slug: 'men-ket-tinh',
    title: 'Crystalline Glazes',
    titleVi: 'Men Kết Tinh',
    summary: 'Glazes that form crystals as they cool.',
    image: {
      src: '/images/products/cup-crystal-opal.jpg',
      alt: 'Tall cup with blue and yellow crystalline glaze dripping over cream.',
    },
    products: [],
  },
]

/*
  Deliberately uneven: long and short names, missing descriptions, a missing
  cover, and landscape sources cropped into portrait frames via `focus`.
*/
export const collectionsIndex: CollectionsIndexContent = {
  eyebrow: 'Collections',
  title: 'Gathered in the studio, one idea at a time.',
  intro:
    'Each collection brings pieces together around a single thread — a form we keep returning to, a glaze, a way of painting — chosen by the family.',
  emptyMessage: 'New collections are being prepared in the studio. In the meantime, the full range is waiting in our boutiques.',
  emptyCta: { label: 'Visit a boutique', href: '/contact' },
  collections: [
    featuredCollection,
    ...otherCollections,
    {
      slug: 've-sen',
      title: 'Hand-Painted Lotus',
      titleVi: 'Vẽ Sen',
      summary: 'Lotus motifs drawn freehand, then outlined in iron red before the final firing.',
      image: {
        src: '/images/craft-painting.png',
        alt: 'A fine brush tracing a red lotus outline onto an indigo-glazed mug.',
        focus: { x: 0.52, y: 0.5 },
      },
    },
    {
      slug: 'men-ngoc',
      title: 'Celadon',
      titleVi: 'Men Ngọc',
      summary: 'Pale jade glazes in the old Bát Tràng tradition.',
      image: {
        src: '/images/products/mug-crystal-celadon.jpg',
        alt: 'Waisted mug in pale celadon with fine crystalline flecks.',
      },
    },
    {
      slug: 'ba-tran-chon',
      title: 'Mrs Trần’s Selection',
      titleVi: 'Bà Trần Chọn',
      summary: 'The pieces she keeps on her own table, picked each season.',
      image: {
        src: '/images/products/mug-jade-dew.jpg',
        alt: 'Waisted mug in soft jade green with a speckled glaze edge.',
      },
    },
    {
      slug: 'men-chay',
      title: 'Flowing Glazes',
      titleVi: 'Men Chảy',
      image: {
        src: '/images/products/mug-flowing-blue.jpg',
        alt: 'Waisted mug with turquoise glaze flowing over a dark brown base.',
      },
    },
    {
      slug: 'tra-sang',
      title: 'Morning Tea for Two, and Other Quiet Rituals',
      image: {
        src: '/images/products/cup-matcha-frost.jpg',
        alt: 'Tall cup with a frosted matcha green glaze.',
      },
    },
    {
      slug: 'dau-lo',
      title: 'Kiln Marks',
      titleVi: 'Dấu Lò',
      summary:
        'Pieces that carry the kiln on their surface: ash spots, pooled glaze, a blush where the flame came close. We used to set these aside. Now they are some of our favourites, and each is one of a kind, so what you see is exactly what you will hold.',
      image: {
        src: '/images/craft-kiln.png',
        alt: 'An open brick kiln with stacked glazed cups after firing.',
        focus: { x: 0.5, y: 0.6 },
      },
    },
    {
      slug: 'mau-diu',
      title: 'Soft Hours',
      titleVi: 'Màu Dịu',
      summary: 'Lavender, pearl and pale stone for slow afternoons.',
      image: {
        src: '/images/products/cup-lavender.jpg',
        alt: 'Tall cup in a soft lavender glaze.',
      },
    },
    {
      slug: 'trang-ngoc-trai',
      title: 'Pearl',
      summary: 'A single milky white glaze, fired thin enough to catch the light.',
      image: {
        src: '/images/products/cup-pearl.jpg',
        alt: 'Tall cup in a lustrous pearl white glaze.',
      },
    },
    {
      slug: 'moi-ra-lo',
      title: 'New From the Kiln',
      titleVi: 'Mới Ra Lò',
      summary: 'Pieces from our most recent firing, photographed soon.',
    },
  ],
}

export const collectionSection: CollectionSection = {
  eyebrow: 'Featured collection',
  ctaLabel: 'View the collection',
  relatedLabel: 'Also from the studio',
  collection: featuredCollection,
  related: otherCollections,
}

export const craftStages: CraftStage[] = [
  {
    title: 'Forming',
    titleVi: 'Tạo hình',
    body: 'Each body is thrown on the wheel, then trimmed by hand once the clay is leather-hard.',
    image: {
      src: '/images/craft-forming.png',
      alt: 'Rows of unglazed, hand-thrown cups drying on wooden boards.',
    },
  },
  {
    title: 'Painting',
    titleVi: 'Vẽ',
    body: 'Motifs are drawn freehand with fine brushes, so every line carries the painter’s hand.',
    image: {
      src: '/images/craft-painting.png',
      alt: 'A fine brush tracing a red lotus outline onto an indigo-glazed mug.',
    },
  },
  {
    title: 'Glazing',
    titleVi: 'Tráng men',
    body: 'Glazes are mixed in the studio and applied by dipping and pouring, often in several layers.',
    image: {
      src: '/images/craft-glazing.png',
      alt: 'An artisan dipping a bisque cup into a bucket of jade green glaze.',
    },
  },
  {
    title: 'Firing',
    titleVi: 'Nung',
    body: 'A long, slow firing melts the glaze into the clay. The kiln decides the final colour.',
    image: {
      src: '/images/craft-kiln.png',
      alt: 'An open brick kiln with stacked glazed cups after firing.',
    },
  },
]

export const craftSection: CraftSection = {
  eyebrow: 'The craft',
  title: 'Made slowly, by people, in Bát Tràng.',
  body: 'Each piece passes through many pairs of hands in our studio. Nothing is cast in a mould or decorated by machine.',
  cta: { label: 'How we work', href: '/our-story#craft' },
  stages: craftStages,
}

export const storesSection: StoresSection = {
  eyebrow: 'Visit us',
  title: 'Two boutiques in Hanoi, one studio in Bát Tràng.',
  body: 'Our pieces are best understood in the hand. Come and see the full range, or visit the studio to watch the work being made.',
  cta: { label: 'Store hours & directions', href: '/contact' },
  image: {
    src: '/images/store-hanoi.png',
    alt: 'A ceramics shop front on a tree-lined Hanoi street with a red tile awning and shelves of glazed pieces in the window.',
  },
  groups: [
    { kind: 'boutique', label: 'Boutiques · Hà Nội' },
    { kind: 'studio', label: 'Studio · Bát Tràng' },
  ],
}

export const stores: Store[] = [
  {
    name: 'Old Quarter',
    kind: 'boutique',
    address: 'Hoàn Kiếm, Hà Nội',
    hours: 'Daily, 9:00 – 21:00',
    href: '/contact#old-quarter',
  },
  {
    name: 'Tây Hồ',
    kind: 'boutique',
    address: 'Tây Hồ, Hà Nội',
    hours: 'Daily, 9:00 – 20:00',
    href: '/contact#tay-ho',
  },
  {
    name: 'Bát Tràng',
    kind: 'studio',
    address: 'Bát Tràng, Gia Lâm, Hà Nội',
    hours: 'Tue – Sun, 8:00 – 17:00',
    href: '/contact#bat-trang',
  },
]

export const brandStatement: BrandStatementSection = {
  label: 'A note from the family',
  quote: 'We make objects for daily use, and we want them to be used — every day, for a long time.',
  attribution: 'The Trần family',
}
