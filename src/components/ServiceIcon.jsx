/** Inline icon set — cyan strokes on dark, per brand rules (icons ≠ buttons). */
const ICONS = {
  'semi-truck-detailing': (
    <>
      <rect x="2" y="10" width="20" height="16" rx="2" />
      <path d="M22 16h8l6 7v3h-14z" />
      <circle cx="10" cy="28" r="3.4" />
      <circle cx="18" cy="28" r="3.4" />
      <circle cx="30" cy="28" r="3.4" />
    </>
  ),
  'auto-detailing': (
    <>
      <path d="M4 24v-4c0-2 1.5-3.4 3.6-3.8C9.5 12 13 9.6 18 9.6s8 2.2 10 6.2c3 .6 4 2.2 4 4.2v4" />
      <circle cx="11" cy="26" r="3.2" />
      <circle cx="25" cy="26" r="3.2" />
      <path d="M28 6l1 2.4L31.5 9.5 29 10.6 28 13l-1-2.4-2.5-1.1L27 8.4z" />
    </>
  ),
  'window-tinting': (
    <>
      <rect x="5" y="8" width="26" height="20" rx="3" />
      <path d="M5 8l26 20" />
      <path d="M18 8v20" opacity="0.6" />
    </>
  ),
}

export default function ServiceIcon({ id }) {
  return (
    <svg
      className="service-icon"
      viewBox="0 0 36 36"
      width="44"
      height="44"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {ICONS[id]}
    </svg>
  )
}
