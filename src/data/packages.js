/*
 * Auto Detailing package menu.
 *
 * Source: client's "BDZ Package Menu (Updated)" PDF — Blow Dust Zone Ltd.,
 * Premium Detailing Packages. Package names and inclusion lists are
 * transcribed verbatim from that document; the short `tagline` on each card is
 * site copy written to summarise the tier, not a client-supplied claim.
 *
 * PRICING NOTE (fourth revision — see CLAUDE.md §1 for the full history):
 * every tier and add-on below is `price: null`, rendering as "On quote"
 * (`<PackageMenu />` already has the null-price branch built in from the
 * Ceramic Coating tiers, so this needed no new UI). The real client-supplied
 * figures are genuine and were shown on the site for a while — each is kept
 * in a trailing comment so a future "show prices again" is a one-line revert
 * per item, not a re-transcription from the source PDF. Every CTA still
 * routes to a quote request either way.
 */

export const PACKAGES_SERVICE_ID = 'auto-detailing'

export const PRICE_DISCLAIMER =
  'Prices may vary depending on vehicle size and condition. Your quote confirms the final price before any work starts.'

export const PACKAGE_GROUPS = [
  {
    id: 'interior-detailing',
    name: 'Interior Detailing',
    blurb:
      'Cabin-only packages. For vehicles whose paint is fine but whose interior has taken the brunt of the job site, the commute or the kids.',
    packages: [
      {
        id: 'select-interior-detail',
        name: 'Select Interior Detail',
        price: null, // was $149 — hidden per owner request, see CLAUDE.md §1
        tagline: 'A full reset of the cabin — cleaned, sanitized, back to sharp.',
        sections: [
          {
            label: null,
            items: [
              'Complete Interior Sanitization',
              'Thorough Interior Vacuum',
              'Dashboard, Console & Door Panel Cleaning',
              'Spot Treatment for Minor Stains',
              'Interior Windows & Mirrors',
              'Floor Mat Cleaning',
              'Door Jamb Cleaning',
              'Trunk Vacuum & Wipe Down',
            ],
          },
        ],
      },
      {
        id: 'signature-interior-detail',
        name: 'Signature Interior Detail',
        price: null, // was $229 — hidden per owner request, see CLAUDE.md §1
        tagline:
          'Extraction, steam and UV protection for interiors that need more than a clean.',
        inherits: 'Everything in Select, plus:',
        sections: [
          {
            label: null,
            items: [
              'Carpet & Seat Shampoo Extraction',
              'Leather Cleaning & Conditioning (if applicable)',
              'Premium Steam Cleaning',
              'UV Protection for Plastic & Vinyl Surfaces',
              'Enhanced Stain Removal',
              'Floor Mat Deep Cleaning',
              'Door Jamb Detailing',
              'Trunk Deep Cleaning',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'full-detailing',
    name: 'Full Detailing',
    blurb:
      'Inside and out. Three tiers that build on each other — pick the level of paint work the vehicle actually needs.',
    packages: [
      {
        id: 'select-full-detail',
        name: 'Select Full Detail',
        price: null, // was $219 — hidden per owner request, see CLAUDE.md §1
        tagline: 'Interior clean plus a hand wash and three months of sealant.',
        sections: [
          {
            label: 'Interior',
            items: [
              'Complete Interior Vacuum',
              'Interior Surface Cleaning & Sanitization',
              'Spot Treatment for Minor Stains',
              'Interior Windows & Mirrors',
              'Floor Mat Cleaning',
              'Door Jamb Cleaning',
              'Trunk Vacuum & Wipe Down',
            ],
          },
          {
            label: 'Exterior',
            items: [
              'Premium Hand Wash',
              'Wheel & Rim Detailing',
              'Tire Dressing',
              '3-Month Paint Sealant Protection',
            ],
          },
        ],
      },
      {
        id: 'premier-full-detail',
        name: 'Premier Full Detail',
        price: null, // was $299 — hidden per owner request, see CLAUDE.md §1
        tagline:
          'Shampoo extraction and steam inside, six months of protection outside.',
        sections: [
          {
            label: 'Interior',
            items: [
              'Complete Interior Vacuum',
              'Carpet & Seat Shampoo Extraction',
              'Premium Steam Cleaning',
              'UV Protection for Plastic & Vinyl',
              'Interior Windows & Mirrors',
              'Floor Mat Deep Cleaning',
              'Door Jamb Detailing',
              'Trunk Deep Cleaning',
            ],
          },
          {
            label: 'Exterior',
            items: [
              'Professional Hand Wash',
              'Wheel Well Cleaning',
              'Wheel & Rim Detailing',
              'Tire Dressing',
              '6-Month Paint Sealant Protection',
            ],
          },
        ],
      },
      {
        id: 'signature-full-detail',
        name: 'Signature Full Detail',
        price: null, // was $399 — hidden per owner request, see CLAUDE.md §1
        // Factual label taken from the menu itself (this tier contains every
        // line item the others do, plus clay bar and polish) — not a
        // "most popular" style claim, which we have no data to support.
        badge: 'Most complete',
        tagline:
          'The full program — clay bar decontamination and a one-step polish on top of everything else.',
        sections: [
          {
            label: 'Interior',
            items: [
              'Complete Interior Vacuum',
              'Deep Carpet & Seat Shampoo Extraction',
              'Premium Steam Cleaning & Sanitization',
              'Leather Cleaning & Conditioning',
              'Advanced Stain Treatment',
              'UV Protection for Plastic & Vinyl',
              'Interior Windows & Mirrors',
              'Floor Mat Restoration',
              'Door Jamb Detailing',
              'Trunk Deep Cleaning',
            ],
          },
          {
            label: 'Exterior',
            items: [
              'Professional Hand Wash',
              'Clay Bar Exterior',
              'Wheel Wells',
              'Detail Rims & Tires',
              'Dress Tires',
              'Premium One-Step Polish',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'paint-correction',
    name: 'Paint Correction',
    // The client listed Decontamination on its own, away from the two
    // correction tiers. It sits here instead because it is the entry rung of
    // the same ladder — decontaminate, then correct lightly, then correct
    // hard — and a one-card group of its own would read as an orphan.
    blurb:
      'Paint work, in three depths. Start with decontamination and sealant, or go further and machine the defects out of the clear coat.',
    packages: [
      {
        id: 'decontamination',
        name: 'Decontamination',
        price: null, // was $189 — hidden per owner request, see CLAUDE.md §1
        tagline:
          'Strip the bonded contamination off the paint and seal what is underneath.',
        sections: [
          {
            label: null,
            items: [
              'Exterior Wash',
              'Tire and Wheel Wash',
              // TODO(client): this line arrived truncated ("…to remove minor").
              // Completed from context — confirm the intended wording.
              'Decontaminate paint to remove minor contaminants',
              'Clay Bar Treatment to remove impurities',
              'Apply Paint Sealant',
              'Tire Dressing',
            ],
          },
        ],
      },
      {
        id: 'initial-stage-package',
        name: 'Initial-Stage Package',
        price: null, // was $299 — hidden per owner request, see CLAUDE.md §1
        tagline:
          'A single machine stage that takes the top layer of swirls and haze out.',
        sections: [
          {
            label: null,
            items: [
              'Exterior Wash Package',
              'Up to 50%–60% defects removed',
              'Ceramic Paint Sealant',
            ],
          },
        ],
      },
      {
        id: 'second-stage-paint-correction',
        name: '2nd Stage Paint Correction',
        price: null, // was $499 — hidden per owner request, see CLAUDE.md §1
        badge: 'Deepest correction',
        tagline:
          'Multi-stage work for paint carrying real defects, not just dullness.',
        sections: [
          {
            label: null,
            items: [
              'Exterior Hand Wash',
              'Up to 70–90% defects removed',
              'Ceramic Paint Sealant',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ceramic-coating',
    name: 'Ceramic Coating',
    blurb:
      'Long-term paint protection, every tier backed by a 1-year coating warranty. Coating is quoted per vehicle — condition and paint size drive the figure more than they do on a detail.',
    packages: [
      {
        // No price supplied for any coating tier — see PRICE_ON_QUOTE below and
        // the open item in CLAUDE.md §9.
        id: 'factory-fresh',
        name: 'Factory Fresh',
        price: null,
        tagline: 'For paint already in good shape — enhance it, then lock it in.',
        sections: [
          {
            label: 'Includes',
            items: [
              'Paint Decontamination',
              'Paint Enhancement Polish',
              'Professional Ceramic Coating Application',
              '1 Year Ceramic Coating Warranty',
            ],
          },
          {
            label: 'Benefits',
            items: [
              'Deep Gloss Finish',
              'Hydrophobic Water Repellency',
              'UV & Environmental Protection',
            ],
          },
        ],
      },
      {
        id: 'everyday-shield',
        name: 'Everyday Shield',
        price: null,
        // The client's own label from the source menu, not a site claim.
        badge: 'Most popular',
        tagline:
          'Correction, coating and trim protection for a car that gets driven.',
        sections: [
          {
            label: 'Includes',
            items: [
              'Paint Decontamination',
              'One-step Paint Correction',
              'Professional Ceramic Coating Application',
              'Plastic and Trim Coating',
              '1 Year Ceramic Coating Warranty',
            ],
          },
          {
            label: 'Benefits',
            items: [
              'Enhanced Gloss & Slick Finish',
              'Superior Water & Dirt Repellency',
              'UV, Road Salt & Chemical Protection',
              'Easier Cleaning & Maintenance',
            ],
          },
        ],
      },
      {
        id: 'complete-revival',
        name: 'Complete Revival',
        price: null,
        tagline:
          'Everything coated — paint, trim, glass and wheel faces — after a multi-stage correction.',
        sections: [
          {
            label: 'Includes',
            items: [
              'Full Paint Decontamination',
              'Multi-stage Paint Correction',
              'Professional Ceramic Coating',
              'Plastics & Trim Coating',
              'Glass Coating',
              'Wheel Face Coating',
              '1 Year Ceramic Coating Warranty',
            ],
          },
          {
            label: 'Benefits',
            items: [
              'Maximum Gloss and Depth',
              'Long-term Hydrophobic Protection',
              'Premium Surface Protection',
            ],
          },
        ],
      },
    ],
  },
]

/*
 * Shown in place of a figure whenever a tier or add-on carries `price: null`
 * — every one of them, right now (see the PRICING NOTE above). Originally
 * built for the ceramic-coating tiers, which the client supplied without
 * prices at all; the same label now covers the rest, which do have known
 * prices, just hidden. Same string either way, so the UI can't tell the two
 * reasons apart, which is fine — a visitor shouldn't be able to either.
 */
export const PRICE_ON_QUOTE = 'On quote'

/** Flat-rate extras, addable to any package above. Prices hidden per owner
 *  request (see CLAUDE.md §1) — original figures kept in comments. */
export const ADD_ONS = [
  { id: 'pet-hair-removal', name: 'Pet Hair Removal', price: null }, // was $50
  { id: 'engine-bay-detail', name: 'Engine Bay Detail & Dressing', price: null }, // was $50
  { id: 'decontamination-wash', name: 'Decontamination Wash', price: null }, // was $50
  { id: 'headlight-restoration', name: 'Headlight Restoration', price: null }, // was $80
  { id: 'glass-protection', name: 'Glass Protection Treatment', price: null }, // was $90
]

/** Every package name, flattened — used to validate ?package= URL params. */
export const PACKAGE_NAMES = PACKAGE_GROUPS.flatMap((g) =>
  g.packages.map((p) => p.name),
)

/**
 * Deep link to the quote form with the service and package pre-selected.
 * QuoteForm validates both params against known values before using them.
 */
export function quoteLinkFor(packageName) {
  const params = new URLSearchParams({
    service: 'Auto Detailing',
    package: packageName,
  })
  return `/contact?${params}#quote`
}
