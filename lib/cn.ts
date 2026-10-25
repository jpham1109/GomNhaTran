import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge only knows Tailwind's default theme. Without registering our
// custom tokens from globals.css, it reads `text-h3` as a text *color* and
// drops it when combined with `text-text-secondary`. Keep these lists in sync
// with the --text-*, --shadow-* and --ease-* tokens in app/globals.css.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display', 'h1', 'h2', 'h3', 'body-lg', 'body', 'small', 'label', 'nav'],
      shadow: ['panel'],
      ease: ['calm'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
