type CanvasProps = {
  children: React.ReactNode
  className?: string
}

// Canvas is the explicit visual primitive for the page background layer —
// the bamboo green surface that editorial panels sit above.
// bg-canvas and text-ceramic are also set on body in globals.css as a baseline,
// but Canvas intentionally restates them to be self-contained as a design
// primitive. This makes the canvas layer unambiguous in the JSX tree and
// ensures the visual contract holds regardless of body inheritance.
//
// TODO: layer a subtle organic texture (2–5% opacity) over the canvas once
// the texture asset and technique are decided. See ai/design-system.md.

export default function Canvas({ children, className = '' }: CanvasProps) {
  return (
    <div className={`bg-canvas text-ceramic ${className}`}>
      {children}
    </div>
  )
}
