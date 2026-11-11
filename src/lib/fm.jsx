import { m, useReducedMotion } from 'framer-motion'

/*
 * Framer Motion foundation for the site.
 *
 * Uses the lightweight `m` components — the animation engine (domMax) is
 * loaded asynchronously by <LazyMotion> in App.jsx to keep first paint fast.
 *
 * Non-negotiable rules (CLAUDE.md §5 + build brief):
 *  - prefers-reduced-motion → no parallax/tilt/stagger; simple opacity fades only.
 *  - Animations use opacity/transform exclusively (never visibility/display),
 *    so CTAs are clickable from the first frame.
 *  - Micro-interactions stay in the 150–300ms band; section reveals ≤ 600ms.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1]

/** Variants for a staggered card grid / copy block. */
export function useRevealVariants() {
  const reduced = useReducedMotion()
  return {
    container: {
      hidden: {},
      show: {
        transition: reduced
          ? { duration: 0 }
          : { staggerChildren: 0.08, delayChildren: 0.05 },
      },
    },
    item: {
      hidden: { opacity: 0, y: reduced ? 0 : 24 },
      show: {
        opacity: 1,
        y: 0,
        transition: reduced
          ? { duration: 0.3 }
          : { duration: 0.55, ease: EASE_OUT },
      },
    },
  }
}

const VIEWPORT = { once: true, margin: '0px 0px -10% 0px' }

/** Single element that fades/slides up when scrolled into view. */
export function Reveal({ as = 'div', children, className, ...rest }) {
  const { item } = useRevealVariants()
  const Tag = m[as] ?? m.div
  return (
    <Tag
      className={className}
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Container whose direct <RevealItem> children stagger in on scroll. */
export function RevealGroup({ as = 'div', children, className, ...rest }) {
  const { container } = useRevealVariants()
  const Tag = m[as] ?? m.div
  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Child of <RevealGroup> — inherits the stagger from the parent. */
export function RevealItem({ as = 'div', children, className, ...rest }) {
  const { item } = useRevealVariants()
  const Tag = m[as] ?? m.div
  return (
    <Tag className={className} variants={item} {...rest}>
      {children}
    </Tag>
  )
}
