import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Canvas from '@/components/Canvas'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <Canvas>
      <Navbar />
      {children}
      <Footer />
    </Canvas>
  )
}
