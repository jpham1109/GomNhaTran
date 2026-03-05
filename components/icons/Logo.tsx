import type { SVGProps } from 'react'
import LogoSvg from './logo.svg'

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return <LogoSvg {...props} />
}
