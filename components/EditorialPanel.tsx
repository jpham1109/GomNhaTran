type EditorialPanelProps = {
  children: React.ReactNode
  className?: string
}

// EditorialPanel is the floating content surface that sits above the canvas.
// It owns its full visual context — background, shadow, text color, and radius —
// so panel content is never affected by canvas-level styles leaking in.
// Default padding is p-6 (mobile) → p-8 (default). Pass p-12 via className
// for wider panels that need more breathing room.
//
// Uses <section> for semantic content block structure. Each usage site should
// ensure an associated heading exists for a well-formed document outline.

export default function EditorialPanel({ children, className }: EditorialPanelProps) {
  return (
    <section className={`p-6 md:p-8 text-text-primary bg-panel rounded-3xl shadow-panel ${className ?? ''}`}>
      {children}
    </section>
  )
}
