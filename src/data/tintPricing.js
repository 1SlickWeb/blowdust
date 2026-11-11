/*
 * Window-tint price list.
 *
 * PRICING NOTE (fourth revision — see CLAUDE.md §1 for the full history): the
 * client supplied a real tint price sheet, and it was shown on the site for a
 * while. Every entry below is now `price: null`, rendering as "On quote" via
 * the same PRICE_ON_QUOTE convention data/packages.js uses — the real figures
 * are genuine, not missing, so they're kept in trailing comments rather than
 * deleted; restoring them is a one-line revert per item. Every CTA still
 * routes to a quote so the final number is confirmed per vehicle either way.
 *
 * The source sheet also carried a fourth package at $119 whose name was
 * struck through and unreadable. A price with no service attached can't go on
 * the site regardless of whether prices are shown, so it stays omitted —
 * confirm what it was, or that it's discontinued. See CLAUDE.md §9.
 */

export const TINT_SERVICE_NAME = 'Window Tinting'

export const TINT_PACKAGES = [
  { id: 'two-windows', name: '2 Windows', price: null }, // was $89
  { id: 'sides-and-rear', name: 'Side Windows & Rear Screen', price: null }, // was $179
  { id: 'full-car', name: 'Full Car', price: null }, // was $279
]

/** Flat-rate extras, addable to any tint package above. */
export const TINT_ADD_ONS = [
  { id: 'quarter-panels', name: 'Quarter Panels', price: null, unit: null }, // was $29
  { id: 'tint-removal', name: 'Tint Removal', price: null, unit: 'per window' }, // was $19
  { id: 'windshield', name: 'Windshield', price: null, unit: null }, // was $39
]

export const TINT_PRICE_DISCLAIMER =
  'Your price depends on your vehicle — glass size, film condition and how many windows are done. We confirm it when we quote your car.'

/** Every tint package name, flattened — validates the ?tintPackage= param. */
export const TINT_PACKAGE_NAMES = TINT_PACKAGES.map((p) => p.name)

/** Deep link to the quote form with the service and tint package pre-selected. */
export function tintPackageQuoteLink(packageName) {
  const params = new URLSearchParams({
    service: TINT_SERVICE_NAME,
    tintPackage: packageName,
  })
  return `/contact?${params}#quote`
}
