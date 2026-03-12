import type { Metadata } from 'next'
import { Playfair_Display, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

// Fonts are loaded via next/font for automatic optimization and self-hosting.
// Each font exposes a CSS variable that @theme in globals.css wires to
// Tailwind's font-serif / font-sans utilities.

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
  display: 'swap',
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

// Default metadata — individual pages override via their own generateMetadata.
export const metadata: Metadata = { title: 'Gốm Nhà Trần' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // TODO: Phase 3 — replace hardcoded lang="en" with a dynamically resolved
  // locale value once Vietnamese language support is introduced.
  return (
    <html lang="en" className={`${playfair.variable} ${beVietnamPro.variable}`}>
      <body>{children}</body>
    </html>
  )
}
