// Bare layout — NextStudio provides its own full-page UI.
// Inherits only the root layout (html/body/globals.css); no site chrome.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
