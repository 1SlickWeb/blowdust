import { useEffect } from 'react'

const DEFAULT_DESC =
  'Mobile semi-truck detailing, auto detailing, and window tinting in Calgary and surrounding areas. We come to you. Call or book a free quote.'

export function usePageMeta(title, description = DEFAULT_DESC) {
  useEffect(() => {
    document.title = title
      ? `${title} | Blowdust — The Auto Avenue`
      : 'Blowdust — The Auto Avenue | Mobile Detailing in Calgary'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }, [title, description])
}
