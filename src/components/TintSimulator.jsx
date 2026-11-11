import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  animate,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { Reveal, EASE_OUT } from '../lib/fm'
import {
  TINT_LEVELS,
  DEFAULT_VLT,
  FILM_NOTE,
  tintQuoteLink,
} from '../data/tintLevels'
import TintCar from './TintCar'
import './TintSimulator.css'

/*
 * "Which tint works best for you?" — pick a VLT percentage and the car's glass
 * re-tints to match. Window tinting is quote-only (CLAUDE.md §1), so this is
 * the section's substitute for a price list: it lets a visitor specify what
 * they want before they ever talk to anyone, then carries that choice into the
 * quote form via ?tint=.
 *
 * On first scroll into view it runs one unprompted sweep — darkest, then
 * lightest, then settling on the level most people actually buy. Without it a
 * static car reads as a picture and nobody discovers the control. Reduced
 * motion skips the sweep and lands on the default straight away; the picker
 * itself still works, since that's direct manipulation rather than ambient
 * motion (same call as <BeforeAfter />).
 */

const DARKEST = TINT_LEVELS[0].vlt
const LIGHTEST = TINT_LEVELS[TINT_LEVELS.length - 1].vlt
const STEP_KEYS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

export default function TintSimulator() {
  const reduced = useReducedMotion()
  const [vlt, setVlt] = useState(DARKEST)
  const sentinelRef = useRef(null)
  const chipRefs = useRef([])
  // Once the visitor touches the picker the intro sweep must not fight them.
  const touchedRef = useRef(false)
  const isInView = useInView(sentinelRef, { once: true, margin: '0px 0px -20% 0px' })

  const index = TINT_LEVELS.findIndex((l) => l.vlt === vlt)
  const level = TINT_LEVELS[index]

  // Big readout counts between levels instead of snapping — the number and the
  // glass then resolve together, which is what makes the change feel physical.
  const counter = useMotionValue(DARKEST)
  const shown = useTransform(counter, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(counter, vlt, {
      duration: reduced ? 0 : 0.5,
      ease: EASE_OUT,
    })
    return () => controls.stop()
  }, [vlt, counter, reduced])

  useEffect(() => {
    if (!isInView) return undefined
    if (reduced) {
      setVlt(DEFAULT_VLT)
      return undefined
    }
    const t1 = setTimeout(() => !touchedRef.current && setVlt(LIGHTEST), 550)
    const t2 = setTimeout(() => !touchedRef.current && setVlt(DEFAULT_VLT), 1600)
    return () => [t1, t2].forEach(clearTimeout)
  }, [isInView, reduced])

  const select = useCallback((next) => {
    touchedRef.current = true
    setVlt(next)
  }, [])

  const onKeyDown = (e) => {
    if (e.key in STEP_KEYS) {
      e.preventDefault()
      const next = (index + STEP_KEYS[e.key] + TINT_LEVELS.length) % TINT_LEVELS.length
      select(TINT_LEVELS[next].vlt)
      chipRefs.current[next]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      select(DARKEST)
      chipRefs.current[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      select(LIGHTEST)
      chipRefs.current[TINT_LEVELS.length - 1]?.focus()
    }
  }

  return (
    <section className="section tint-sim" id="tint-simulator">
      <div className="container">
        <Reveal as="span" className="eyebrow">
          Tint Visualiser
        </Reveal>
        <Reveal as="h2">Which tint works best for you?</Reveal>
        <Reveal as="p" className="lead tint-sim__lead">
          Tint is easier to choose when you can see it. Step through the
          percentages we install and watch the glass change — then send us the
          one you like and we’ll quote it for your vehicle.
        </Reveal>

        <Reveal className="tint-sim__stage">
          <span className="tint-sim__sentinel" ref={sentinelRef} aria-hidden="true" />

          <div className="tint-sim__readout">
            <span className="tint-sim__vlt-label">Visible light transmission</span>
            <span className="tint-sim__pct">
              <m.span>{shown}</m.span>%
            </span>
            <span className="tint-sim__name">{level.name}</span>
            <m.p
              className="tint-sim__blurb"
              key={vlt}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              {level.blurb}
            </m.p>
          </div>

          <div className="tint-sim__car">
            <TintCar
              filmOpacity={level.glass}
              label={`Sedan shown with ${vlt}% window tint — ${level.name.toLowerCase()}`}
            />
          </div>
        </Reveal>

        <Reveal className="tint-sim__control">
          <span className="tint-sim__control-label" id="tint-sim-label">
            Choose your tint %
          </span>
          <div
            className="tint-sim__chips"
            role="radiogroup"
            aria-labelledby="tint-sim-label"
            onKeyDown={onKeyDown}
          >
            {TINT_LEVELS.map((l, i) => {
              const active = l.vlt === vlt
              return (
                <button
                  key={l.vlt}
                  type="button"
                  ref={(el) => {
                    chipRefs.current[i] = el
                  }}
                  className={`tint-sim__chip${active ? ' is-active' : ''}`}
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(l.vlt)}
                >
                  {/* Shared-element pill: the orange active state slides between
                      chips rather than blinking on and off. */}
                  {active && (
                    <m.span
                      className="tint-sim__chip-pill"
                      layoutId={reduced ? undefined : 'tint-chip-pill'}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="tint-sim__chip-label">{l.vlt}%</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <Reveal className="tint-sim__foot">
          <p className="tint-sim__note">{FILM_NOTE}</p>
          <Link className="btn" to={tintQuoteLink(vlt)}>
            Get a quote for {vlt}% tint
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
