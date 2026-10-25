import Image from 'next/image'
import type { SanityImage } from '@/lib/sanity/types'
import { Logo } from '@/components/icons/Logo'
import { cn } from '@/lib/cn'

type MediaProps = {
  image: SanityImage | null
  sizes: string
  priority?: boolean
  /** Use when adjacent text already names the subject. */
  decorative?: boolean
  /** The frame owns the aspect ratio — pass e.g. `aspect-[4/5]`. */
  className?: string
  imageClassName?: string
}

// Fixed-ratio image frame. Portrait, square and landscape sources all crop to
// the frame. When the image is missing, a quiet mono seal holds the layout.
// TODO: focal-point cropping via @sanity/image-url hotspot once professional
// photography arrives (see docs/project/roadmap.md icebox).
export default function Media({
  image,
  sizes,
  priority,
  decorative = false,
  className,
  imageClassName,
}: MediaProps) {
  return (
    <div className={cn('relative overflow-hidden bg-image-placeholder', className)}>
      {image ? (
        <Image
          src={image.url}
          alt={decorative ? '' : image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', imageClassName)}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <Logo variant="mono" className="h-1/4 max-h-20 w-auto text-text-secondary opacity-30" />
        </div>
      )}
    </div>
  )
}
