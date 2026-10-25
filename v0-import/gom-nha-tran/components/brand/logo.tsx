import { cn } from '@/lib/utils'

/*
  The original mono logo is applied as a CSS mask so it inherits `currentColor`
  and works on ivory, photography and the deep bamboo footer alike.
  The aspect ratio matches the artwork's viewBox (938 × 1290), so only height is set.
*/
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block aspect-[938/1290] shrink-0 bg-current', className)}
      style={{
        maskImage: 'url(/brand/logo-mono.svg)',
        WebkitMaskImage: 'url(/brand/logo-mono.svg)',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}

type LogoSize = 'md' | 'lg'

const logoSizes: Record<LogoSize, { mark: string; name: string; descriptor: string; gap: string }> = {
  md: { mark: 'h-11', name: 'text-xl', descriptor: 'text-[0.6875rem]', gap: 'gap-3' },
  lg: {
    mark: 'h-12 lg:h-16',
    name: 'text-[1.375rem] lg:text-[1.75rem]',
    descriptor: 'text-[0.6875rem] lg:text-xs',
    gap: 'gap-3 lg:gap-4',
  },
}

export function Logo({
  name,
  descriptor,
  size = 'md',
  compact = false,
  className,
}: {
  name: string
  descriptor?: string
  size?: LogoSize
  /** Slightly smaller mark for the scrolled header state. */
  compact?: boolean
  className?: string
}) {
  const s = logoSizes[size]
  return (
    <span className={cn('inline-flex items-center', s.gap, className)}>
      <LogoMark
        className={cn('transition-[height] duration-500 ease-calm', s.mark, compact && 'lg:h-12')}
      />
      <span className="flex flex-col leading-none">
        <span className={cn('font-serif tracking-tight', s.name)}>{name}</span>
        {descriptor ? (
          <span
            lang="vi"
            className={cn('mt-1.5 font-medium tracking-[0.16em] uppercase opacity-75', s.descriptor)}
          >
            {descriptor}
          </span>
        ) : null}
      </span>
    </span>
  )
}
