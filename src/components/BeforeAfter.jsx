import { useCallback, useEffect, useRef, useState } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { ChevronsLeftRight, Maximize2 } from 'lucide-react'
import './BeforeAfter.css'

const MIN_POS = 3
const MAX_POS = 97
const KEY_STEP = 6

/**
 * Draggable before/after comparison slider. Drag the handle (pointer or
 * touch) or focus it and use the arrow keys to reveal more of either photo.
 * On first scroll into view it runs a brief self-guided sweep to hint the
 * interaction, then settles back to a 50/50 split. Reduced motion → skip the
 * hint, static 50/50, drag still works (direct manipulation, not ambient
 * motion, so it isn't something CLAUDE.md §5's reduced-motion rule covers).
 *
 * The drag handle and the "view larger" expand button are deliberately
 * separate controls (not one big clickable card) so a drag gesture can never
 * also fire the lightbox open — no stopPropagation gymnastics required.
 *
 * variant="card" — fixed 4:3 frame with caption below (home preview strip)
 * variant="tile" — fills its bento cell, caption overlaid (gallery)
 *
 * `layoutId` enables the shared-element expand into the Lightbox.
 */
export default function BeforeAfter({ item, onClick, layoutId, variant = 'card' }) {
  const reduced = useReducedMotion()
  const [pos, setPos] = useState(50)
  const [hinting, setHinting] = useState(false)
  const frameRef = useRef(null)
  const inViewRef = useRef(null)
  const draggingRef = useRef(false)
  const isInView = useInView(inViewRef, { once: true, margin: '0px 0px -15% 0px' })

  // One-time self-guided sweep on first view: nudge the split so the reveal
  // itself demonstrates the interaction, then settle back to 50/50.
  useEffect(() => {
    if (!isInView || reduced) return
    setHinting(true)
    const t1 = setTimeout(() => setPos(66), 300)
    const t2 = setTimeout(() => setPos(36), 850)
    const t3 = setTimeout(() => setPos(50), 1350)
    const t4 = setTimeout(() => setHinting(false), 1650)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [isInView, reduced])

  const updateFromClientX = useCallback((clientX) => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect || !rect.width) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(MAX_POS, Math.max(MIN_POS, pct)))
  }, [])

  const onPointerDown = (e) => {
    draggingRef.current = true
    setHinting(false)
    e.currentTarget.setPointerCapture(e.pointerId)
    updateFromClientX(e.clientX)
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    updateFromClientX(e.clientX)
  }

  const onPointerUp = (e) => {
    draggingRef.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setPos((p) => Math.max(MIN_POS, p - KEY_STEP))
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      setPos((p) => Math.min(MAX_POS, p + KEY_STEP))
      e.preventDefault()
    } else if (e.key === 'Home') {
      setPos(MIN_POS)
      e.preventDefault()
    } else if (e.key === 'End') {
      setPos(MAX_POS)
      e.preventDefault()
    }
  }

  return (
    <figure className={`ba ba--${variant}`}>
      <div className={`ba__stage${hinting ? ' ba__stage--hinting' : ''}`} ref={frameRef}>
        <span className="ba__inview-sentinel" ref={inViewRef} aria-hidden="true" />

        <m.span className="ba__frame" layoutId={reduced ? undefined : layoutId}>
          <img
            className="ba__img ba__before"
            src={item.before}
            alt={`${item.title} — before`}
            loading="lazy"
            draggable={false}
          />
          <img
            className="ba__img ba__after"
            src={item.after}
            alt={`${item.title} — after`}
            loading="lazy"
            draggable={false}
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          />
          {variant === 'tile' && <span className="ba__overlay">{item.title}</span>}
        </m.span>

        <span className="ba__badge ba__badge--after">After</span>
        <span className="ba__badge ba__badge--before">Before</span>

        <div
          className="ba__handle"
          style={{ left: `${pos}%` }}
          role="slider"
          tabIndex={0}
          aria-label={`Drag to compare before and after: ${item.title}`}
          aria-valuemin={MIN_POS}
          aria-valuemax={MAX_POS}
          aria-valuenow={Math.round(pos)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onKeyDown={onKeyDown}
        >
          <span className="ba__handle-grip">
            <ChevronsLeftRight aria-hidden="true" size={15} />
          </span>
        </div>

        {onClick && (
          <button
            type="button"
            className="ba__expand"
            onClick={() => onClick(item)}
            aria-label={`View larger: ${item.title}`}
          >
            <Maximize2 aria-hidden="true" size={14} />
          </button>
        )}

        <span className="ba__sample-tag">Placeholder</span>
      </div>

      {variant === 'card' && <figcaption className="ba__caption">{item.title}</figcaption>}
    </figure>
  )
}
