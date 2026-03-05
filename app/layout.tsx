import type { Metadata } from 'next'
import './globals.css'

// Default metadata — individual pages override via their own generateMetadata.
export const metadata: Metadata = { title: 'Gốm Nhà Trần' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
