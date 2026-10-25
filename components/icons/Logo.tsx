import type { SVGProps } from 'react'
import LogoBoxed from './logo-boxed.svg'
import LogoMark from './logo-mark.svg'
import LogoTransparent from './logo-transparent.svg'
import LogoMono from './logo-mono.svg'

// Variant notes:
//   'boxed'       — full brand badge, bamboo green bg, tagline included (tile 1)
//   'mark'        — simplified seal, bamboo green bg, no tagline (tile 6)
//   'transparent' — simplified seal, no background, artwork colors embedded (tile 6)
//   'mono'        — simplified seal, no background, all fills → currentColor (tile 6)
//
// Navbar / mobile use: 'transparent' or 'mono'
// Brand / print use:   'boxed'
// Simplified branded:  'mark'
export type LogoVariant = 'boxed' | 'mark' | 'transparent' | 'mono'

type LogoProps = SVGProps<SVGSVGElement> & {
  variant?: LogoVariant
}

const variants = {
  boxed: LogoBoxed,
  mark: LogoMark,
  transparent: LogoTransparent,
  mono: LogoMono,
} as const

// Default: aria-hidden="true" — Logo is decorative when used inside a labeled
// <Link>. Pass aria-label and remove aria-hidden for standalone usage.
export function Logo({ variant = 'transparent', 'aria-hidden': ariaHidden = true, ...props }: LogoProps) {
  const SVG = variants[variant]
  return <SVG aria-hidden={ariaHidden} {...props} />
}
