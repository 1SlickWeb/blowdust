import { useEffect, useRef, useState } from 'react'

/**
 * Google Maps embed facade. The real iframe (heavy third-party JS) mounts
 * only when the map scrolls near the viewport — `loading="lazy"` alone isn't
 * enough because Chrome's lazy threshold (~2000px) still loads it during
 * initial page load on short pages, wrecking mobile LCP.
 */
export default function LazyMap({ src, title, className }) {
  const ref = useRef(null)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || load) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [load])

  return (
    <div ref={ref} className={className}>
      {load ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="lazy-map__placeholder" aria-hidden="true" />
      )}
    </div>
  )
}
