export const SERVICES = [
  {
    id: 'semi-truck-detailing',
    flagship: true,
    tab: 'Semi-Truck',
    name: 'Semi-Truck Detailing',
    short:
      'Deep cab interior detailing and metal polish for semi-trucks and rigs — the service most Calgary detailers won’t touch. We come to your yard.',
    fleetNote:
      'Running more than one truck? We offer recurring fleet schedules and multi-unit rates — ask for a fleet quote.',
    // No exterior wash / tire & rim / trailer work here — the company doesn't
    // offer exterior detailing on rigs. Cab interior and metal polish only.
    // The list is broken out line-by-line rather than bundled into three
    // compound bullets so the scope of the cab work reads at a glance.
    included: [
      'Seat & upholstery deep clean',
      'Sleeper bunk clean & refresh',
      'Dash, console & door panel detail',
      'Cab floor & mat deep clean',
      'Interior glass & mirror detail',
      'Aluminum & chrome polish',
      'Fuel tank polish',
    ],
    audience:
      'Fleet owners and owner-operators who need their rigs looking sharp for the road, DOT checks, or resale — without pulling a truck out of service to sit at a shop.',
  },
  {
    id: 'auto-detailing',
    flagship: false,
    tab: 'Auto',
    name: 'Auto Detailing',
    short:
      'Professional interior and exterior detailing for cars, SUVs and pickups — done at your home or workplace.',
    included: [
      'Exterior hand wash & decontamination',
      'Hand wax / sealant protection',
      'Interior vacuum & steam clean',
      'Seat & carpet shampoo and extraction',
      'Dash, trim & console detail',
      // Priced as a flat-rate extra in the package menu (data/packages.js).
      'Pet hair removal (add-on)',
      'Odor treatment (on request)',
    ],
    audience:
      'Daily drivers who want that new-car feel back, and anyone prepping a vehicle for sale — professional results without haggling or upsells.',
  },
  {
    id: 'window-tinting',
    flagship: false,
    tab: 'Window Tint',
    name: 'Window Tinting',
    short:
      'Clean, bubble-free window tint that cuts heat and glare, protects your interior, and sharpens the look of any vehicle.',
    included: [
      'Quality film, professionally installed',
      'Heat & UV rejection',
      'Glare reduction for safer driving',
      'Added privacy and security',
      'Interior fade protection',
      'Clean, bubble-free finish',
    ],
    audience:
      'Anyone who wants a cooler cabin, a sharper look, and protection from prairie sun — cars, trucks, and fleet vehicles alike.',
  },
]
