import { useRef } from 'react'
import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

const MAX_TILT = 6 // degrees — subtle by design (brief caps at 5–8°)

/**
 * Transform-based "3D" tilt on mouse move — CSS transforms only, no WebGL.
 * Disabled for touch devices (no hover) and prefers-reduced-motion, so it
 * costs nothing on mobile and never causes layout shift (rotation happens
 * around the element's own center; bounds are unchanged).
 */
export default function TiltCard({ children, className, ...rest }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  const px = useMotionValue(0.5) // cursor position within card, 0..1
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [MAX_TILT, -MAX_TILT]), {
    stiffness: 200,
    damping: 22,
  })
  const rotateY = useSpring(useTransform(px, [0, 1], [-MAX_TILT, MAX_TILT]), {
    stiffness: 200,
    damping: 22,
  })

  const canTilt = () =>
    !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const onMouseMove = (e) => {
    if (!canTilt() || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  const onMouseLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <m.div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900 }
      }
      {...rest}
    >
      {children}
    </m.div>
  )
}
