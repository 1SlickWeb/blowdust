/*
 * Window-tint levels for <TintSimulator />.
 *
 * `vlt` — Visible Light Transmission, the share of light the film lets
 * through. LOWER = DARKER. 5% is limo dark; 50% is barely there. These six
 * steps are the range the client offers.
 *
 * `glass` — render opacity of the film layer drawn over the cabin art in
 * <TintCar />. Deliberately NOT a literal `1 - vlt/100`: automotive glass
 * already carries a factory tint before any film goes on, and a linear map
 * makes 5% a solid black hole while 50% barely reads as tinted at all. This
 * compressed curve keeps every step visibly distinct from its neighbours,
 * which is the whole job of the widget.
 */

export const TINT_LEVELS = [
  {
    vlt: 5,
    glass: 0.94,
    name: 'Limo',
    blurb: 'Near-total blockout. Nothing reads through the glass from outside.',
  },
  {
    vlt: 15,
    glass: 0.86,
    name: 'Very dark',
    blurb: 'Strong privacy, with a little more visibility left for night driving.',
  },
  {
    vlt: 20,
    glass: 0.79,
    name: 'Dark',
    blurb: 'The popular pick for rear glass — private, and still easy to drive.',
  },
  {
    vlt: 35,
    glass: 0.63,
    name: 'Medium',
    blurb: 'Balanced shade. Cuts glare and heat without hiding the cabin.',
  },
  {
    vlt: 40,
    glass: 0.55,
    name: 'Light medium',
    blurb: 'A subtle shade that still carries most of the heat rejection.',
  },
  {
    vlt: 50,
    glass: 0.42,
    name: 'Light',
    blurb: 'Barely-there look. Maximum clarity once the sun goes down.',
  },
]

/** Level the simulator settles on — the one most people actually buy. */
export const DEFAULT_VLT = 20

/*
 * The client's reference material lists different percentage ranges per film
 * ("CARBON TINT IS OFFERED IN 5%, 15%, …" / "CERAMIC TINT IS OFFERED IN 5%,
 * 20%, …") but both lists were cut off, so the exact pairing isn't known.
 * Until the client confirms them, the UI states only that both films are
 * available and that the match is settled at quote time — no invented specs.
 * TODO(client): get the full carbon/ceramic percentage lists, then either
 * extend each level above with a `films: [...]` array or keep this note.
 */
export const FILM_NOTE =
  'Available in carbon and ceramic film. Not every percentage is offered in ' +
  'every film, and front-window tint is regulated in Alberta — we confirm ' +
  'both when we quote your vehicle.'

/** Whitelist used by the quote form to validate an inbound `?tint=` param. */
export const TINT_VLT_VALUES = TINT_LEVELS.map((l) => String(l.vlt))

/** Deep link into the quote form, pre-selected for window tint at `vlt`. */
export function tintQuoteLink(vlt) {
  return `/contact?service=${encodeURIComponent('Window Tinting')}&tint=${vlt}#quote`
}
