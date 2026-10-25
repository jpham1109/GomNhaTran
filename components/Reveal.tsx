'use client'

import { useEffect, useRef, useState } from 'react'

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Entrance delay in ms, for staggering siblings. */
  delay?: number
}

type RevealState = 'static' | 'hidden' | 'shown'

// Fades and lifts its children in as they scroll into view.
// Progressive enhancement: the server renders the content visible ('static').
// After hydration, a block that starts below the fold is hidden and then
// revealed on intersection; a block already on screen is left alone, so there
// is no flash and above-the-fold images stay eligible for LCP. If JS or the
// observer never runs, the content simply stays visible.
// The .reveal styles and their reduced-motion override live in globals.css.
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<RevealState>('static')

  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) return
    // Only blocks entirely below the viewport are hidden; anything on screen
    // (or already scrolled past) keeps its server-rendered visibility.
    if (node.getBoundingClientRect().top < window.innerHeight) return
    setState('hidden')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal={state === 'static' ? undefined : state}
      className={className ? `reveal ${className}` : 'reveal'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
