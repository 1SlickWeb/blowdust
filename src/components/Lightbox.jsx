import { useEffect, useRef } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '../lib/fm'
import './Lightbox.css'

/**
 * Full-screen photo viewer, in two shapes:
 *
 *  - before/after pair — `item.before` + `item.after` (bento gallery tiles).
 *    The panel shares a `layoutId` with the clicked tile, so it expands from
 *    the thumbnail (shared-element transition).
 *  - single photo — `item.full` (the cab-interior photo wall). Optional
 *    `onPrev`/`onNext` add arrow-key + on-screen stepping through the set.
 *
 * Esc or backdrop closes. Reduced motion → plain quick fade.
 */
export default function Lightbox({ item, onClose, onPrev, onNext, position }) {
  const closeRef = useRef(null)
  const reduced = useReducedMotion()
  const single = Boolean(item?.full)

  // Handlers change identity every render in the stepping case; a ref keeps
  // the key listener from re-binding on each step.
  const navRef = useRef({ onPrev, onNext })
  navRef.current = { onPrev, onNext }

  useEffect(() => {
    if (!item) return
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') navRef.current.onPrev?.()
      else if (e.key === 'ArrowRight') navRef.current.onNext?.()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // `item` identity changes as you step, which is harmless — the listener
    // just re-binds. Keyed on presence, not on the specific photo.
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <m.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <m.div
            className="lightbox__panel"
            layoutId={reduced ? undefined : `ba-${item.id}`}
            style={{ borderRadius: 'var(--radius)' }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <div className="lightbox__head">
              <h3 className="lightbox__title">{item.title}</h3>
              {position && <span className="lightbox__position">{position}</span>}
              <button
                ref={closeRef}
                type="button"
                className="lightbox__close"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {single ? (
              <div className="lightbox__single">
                <img src={item.full} alt={item.title} />
                {(onPrev || onNext) && (
                  <div className="lightbox__nav">
                    <button
                      type="button"
                      className="lightbox__step"
                      onClick={onPrev}
                      disabled={!onPrev}
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="lightbox__step"
                      onClick={onNext}
                      disabled={!onNext}
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="lightbox__pair">
                <figure>
                  <img src={item.before} alt={`${item.title} — before`} />
                  <figcaption>Before</figcaption>
                </figure>
                <figure>
                  <img src={item.after} alt={`${item.title} — after`} />
                  <figcaption>After</figcaption>
                </figure>
              </div>
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
