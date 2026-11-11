/*
 * Semi-truck detailing package menu.
 *
 * PRICING NOTE: semi-truck detailing stays the site's one quote-only service
 * (CLAUDE.md §1) — no client-supplied price sheet exists for rig work, the
 * way there is for auto detailing and window tint, and the client's stated
 * reason is that a rig's size and condition swing the number too far to post
 * one (day cab vs. sleeper, single vs. tandem, how much buildup there is).
 *
 * So this gives the section the *package-menu format* — three tiers, clear
 * inclusion lists, a card each — without inventing dollar figures the
 * business hasn't confirmed. Every tier's `price` is `null` and renders as
 * "On quote" through the same convention the Ceramic Coating tiers in
 * data/packages.js already use for the same reason.
 *
 * TODO(client): supply real starting prices per tier (or confirm rig work
 * genuinely can't be tiered, in which case this should collapse back to a
 * single "Request a quote" CTA under the included-work list). Once prices
 * land, set `price` on the tiers below — <SemiTruckPricing /> switches from
 * "On quote" to "$X" automatically, the same way <PackageMenu /> does.
 *
 * Tiers are cumulative and built ONLY from the 7 line items already
 * confirmed for semi-truck scope (see data/services.js — cab interior and
 * metal polish, no exterior work). Nothing new is claimed here; the existing
 * list is grouped into a menu instead of staying one flat list. Tier 3 is
 * exactly the full existing list.
 */

export const SEMI_TRUCK_SERVICE_NAME = 'Semi-Truck Detailing'

export const SEMI_TRUCK_PACKAGES = [
  {
    id: 'cab-essentials',
    name: 'Cab Essentials',
    price: null,
    tagline: 'The core cab clean — seats, floor, glass and dash.',
    sections: [
      {
        label: null,
        items: [
          'Seat & upholstery deep clean',
          'Cab floor & mat deep clean',
          'Interior glass & mirror detail',
          'Dash, console & door panel detail',
        ],
      },
    ],
  },
  {
    id: 'full-cab-detail',
    name: 'Full Cab Detail',
    price: null,
    tagline: 'Cab Essentials, plus the sleeper — for rigs that live in too.',
    inherits: 'Everything in Cab Essentials, plus:',
    sections: [
      {
        label: null,
        items: ['Sleeper bunk clean & refresh'],
      },
    ],
  },
  {
    id: 'complete-rig-detail',
    name: 'Complete Rig Detail',
    price: null,
    badge: 'Most complete',
    tagline: 'The full program — cab and sleeper inside, polished metal outside.',
    inherits: 'Everything in Full Cab Detail, plus:',
    sections: [
      {
        label: null,
        items: ['Aluminum & chrome polish', 'Fuel tank polish'],
      },
    ],
  },
]

export const SEMI_TRUCK_PRICE_DISCLAIMER =
  'Semi-truck pricing depends on cab configuration and condition — day cab or sleeper, single or tandem, and how much buildup there is. We confirm the exact price once we know your rig.'

/** Every tier name, flattened — validates the ?truckPackage= URL param. */
export const SEMI_TRUCK_PACKAGE_NAMES = SEMI_TRUCK_PACKAGES.map((p) => p.name)

/** Deep link to the quote form with the service and rig tier pre-selected. */
export function semiTruckQuoteLink(packageName) {
  const params = new URLSearchParams({
    service: SEMI_TRUCK_SERVICE_NAME,
    truckPackage: packageName,
  })
  return `/contact?${params}#quote`
}
