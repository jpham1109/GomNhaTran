import Image from 'next/image'
import type { CSSProperties } from 'react'
import { LogoMark } from '@/components/brand/logo'
import type { ImageAsset } from '@/lib/types'
import { cn } from '@/lib/utils'

function imageStyle(image: ImageAsset): CSSProperties | undefined {
  if (!image.focus && !image.zoom) return undefined
  return {
    objectPosition: image.focus ? `${image.focus.x * 100}% ${image.focus.y * 100}%` : undefined,
    transform: image.zoom && image.zoom !== 1 ? `scale(${image.zoom})` : undefined,
  }
}

/**
 * Fixed-ratio image frame used by every photograph on the site.
 * The frame owns the aspect ratio, so portrait, square and landscape sources
 * all crop to the composition; `focus` decides what survives the crop.
 * When the image is missing, a quiet brand-mark tile holds the layout.
 */
export function Media({
  image,
  sizes,
  priority,
  decorative = false,
  className,
  imageClassName,
}: {
  image?: ImageAsset
  sizes: string
  priority?: boolean
  /** Use when adjacent text already names the subject. */
  decorative?: boolean
  className?: string
  imageClassName?: string
}) {
  return (
    <div className={cn('relative overflow-hidden bg-secondary', className)}>
      {image?.src ? (
        <Image
          src={image.src}
          alt={decorative ? '' : image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', imageClassName)}
          style={imageStyle(image)}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <LogoMark className="h-1/4 max-h-20 text-muted-foreground/30" />
        </div>
      )}
    </div>
  )
}
