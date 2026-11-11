// PLACEHOLDER gallery data. Every image below is a generated SVG stand-in —
// replace with the client's real before/after photography from /assets/photos/
// (folder was missing from the repo at build time) before launch.

import semiBefore from '../assets/placeholders/semi-before.svg'
import semiAfter from '../assets/placeholders/semi-after.svg'
import autoBefore from '../assets/placeholders/auto-before.svg'
import autoAfter from '../assets/placeholders/auto-after.svg'
import tintBefore from '../assets/placeholders/tint-before.svg'
import tintAfter from '../assets/placeholders/tint-after.svg'

export const GALLERY_FILTERS = [
  { id: 'all', label: 'All work' },
  { id: 'semi', label: 'Semi-Truck' },
  { id: 'auto', label: 'Auto Detailing' },
  { id: 'tint', label: 'Window Tinting' },
]

export const GALLERY = [
  {
    id: 'semi-cab-refresh',
    category: 'semi',
    title: 'Highway tractor — cab interior detail',
    before: semiBefore,
    after: semiAfter,
  },
  {
    id: 'auto-interior-revival',
    category: 'auto',
    title: 'SUV — interior shampoo & exterior wax',
    before: autoBefore,
    after: autoAfter,
  },
  {
    id: 'tint-sedan',
    category: 'tint',
    title: 'Sedan — full window tint',
    before: tintBefore,
    after: tintAfter,
  },
  {
    id: 'semi-fleet-unit',
    category: 'semi',
    title: 'Fleet unit — cab reset & chrome polish',
    before: semiBefore,
    after: semiAfter,
  },
  {
    id: 'auto-resale-prep',
    category: 'auto',
    title: 'Pickup — resale prep detail',
    before: autoBefore,
    after: autoAfter,
  },
  {
    id: 'tint-truck',
    category: 'tint',
    title: 'Pickup — front windows matched to factory rear',
    before: tintBefore,
    after: tintAfter,
  },
]
