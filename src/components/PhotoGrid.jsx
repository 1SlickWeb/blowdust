import { useCallback, useEffect, useRef, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '../lib/fm'
import Lightbox from './Lightbox'
import './PhotoGrid.css'

/**
 * Photo wall for a large single-image set (the client's 98-shot cab-interior
 * drop). Three things keep it cheap on a phone in a truck yard:
 *
 *  1. Only `pageSize` tiles are mounted at a time — "View more" appends the
 *     next batch. The other ~86 <img> tags don't exist in the DOM at all, so
 *     they cost nothing even as decode work.
 *  2. Mounted tiles are `loading="lazy"`, so a batch that's still below the
 *     fold doesn't fetch either. Scrolling is what pulls bytes.
 *  3. Every tile reserves its box up front (fixed aspect ratio) and shows a
 *     shimmer skeleton until its own photo decodes — no layout shift, and the
 *     grid reads as "loading" rather than as holes.
 *
 * Tiles are uniform-ratio with `object-fit: cover`; the lightbox shows the
 * full uncropped frame at 1400px.
 */
export default function PhotoGrid({
  items,
  pageSize = 12,
  label,
  title,
  captionFor,
}) {
  const [shown, setShown] = useState(pageSize)
  const [openIndex, setOpenIndex] = useState(null)
  const reduced = useReducedMotion()

  const visible = items.slice(0, shown)
  const remaining = items.length - visible.length

  // Focus the first tile of a freshly appended batch so keyboard users aren't
  // dumped back at the top of the grid after pressing View more.
  const focusIndexRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const target = focusIndexRef.current
    if (target == null) return
    focusIndexRef.current = null
    gridRef.current?.querySelector(`[data-tile-index="${target}"]`)?.focus()
  }, [shown])

  const viewMore = () => {
    focusIndexRef.current = shown
    setShown((n) => Math.min(items.length, n + pageSize))
  }

  const step = useCallback(
    (delta) =>
      setOpenIndex((i) => {
        if (i == null) return i
        const next = i + delta
        return next < 0 || next >= visible.length ? i : next
      }),
    [visible.length],
  )

  // The lightbox header carries a short constant `title` plus an "n of total"
  // counter — the per-tile caption stays on the <img alt>, where a distinct
  // string per photo is actually worth something.
  const open = openIndex != null ? { ...visible[openIndex], title } : null

  return (
    <>
      <div className="photogrid" ref={gridRef} role="list" aria-label={label}>
        {visible.map((item, i) => (
          <m.div
            key={item.id}
            role="listitem"
            className="photogrid__cell"
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{
              duration: reduced ? 0.25 : 0.45,
              ease: EASE_OUT,
              // stagger within a batch only — a batch appended later starts
              // its own 0..n ramp instead of inheriting a huge delay
              delay: reduced ? 0 : (i % pageSize) * 0.04,
            }}
          >
            <PhotoTile
              item={item}
              index={i}
              caption={captionFor?.(item, i)}
              onOpen={() => setOpenIndex(i)}
            />
          </m.div>
        ))}
      </div>

      <div className="photogrid__more">
        <p className="photogrid__count" aria-live="polite">
          Showing {visible.length} of {items.length}
        </p>
        {/* ghost, not .btn — orange is reserved for the quote CTA further down
            the page (CLAUDE.md §2: one orange CTA per screen) */}
        {remaining > 0 && (
          <button type="button" className="btn-ghost" onClick={viewMore}>
            View more ({remaining} left)
          </button>
        )}
      </div>

      <Lightbox
        item={open}
        onClose={() => setOpenIndex(null)}
        onPrev={openIndex > 0 ? () => step(-1) : undefined}
        onNext={
          openIndex != null && openIndex < visible.length - 1
            ? () => step(1)
            : undefined
        }
        // visible is a prefix of items, so openIndex is the true set position
        position={
          openIndex != null ? `${openIndex + 1} of ${items.length}` : undefined
        }
      />
    </>
  )
}

function PhotoTile({ item, index, caption, onOpen }) {
  const [loaded, setLoaded] = useState(false)

  // A cached image can finish before React attaches onLoad, which would leave
  // the skeleton up forever — check `complete` when the node lands.
  const imgRef = useCallback((node) => {
    if (node?.complete) setLoaded(true)
  }, [])

  return (
    <button
      type="button"
      className={`phototile${loaded ? ' is-loaded' : ''}`}
      data-tile-index={index}
      onClick={onOpen}
      aria-label={`View larger: ${caption}`}
    >
      <span className="phototile__skeleton" aria-hidden="true" />
      <img
        ref={imgRef}
        className="phototile__img"
        src={item.thumb}
        alt={caption}
        width={item.w}
        height={item.h}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </button>
  )
}
