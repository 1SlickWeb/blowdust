import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react'
import { RevealGroup, RevealItem } from '../lib/fm'
import { SERVICES } from '../data/services'
import { PACKAGE_GROUPS } from '../data/packages'
import { CAB_WORK } from '../data/cabWork'
import TintCar from './TintCar'
// Real client photo (see ART below) — the Unsplash stock car-wash shot this
// replaced is still at assets/photos/auto.webp, now unused everywhere.
import autoImg from '../assets/photos/auto-interior.webp'
import autoImgThumb from '../assets/photos/auto-interior-700.webp'
// License-free stock (Unsplash License — free commercial use, no attribution
// required), same terms the site's other stock photos already use. Neither
// shot is the client's own work — swap for real client photography of an
// actual correction/coating job whenever it exists. See CLAUDE.md §9.
import paintCorrectionImg from '../assets/photos/paint-correction.webp'
import paintCorrectionThumb from '../assets/photos/paint-correction-700.webp'
import ceramicCoatingImg from '../assets/photos/ceramic-coating.webp'
import ceramicCoatingThumb from '../assets/photos/ceramic-coating-700.webp'
import './ServiceCards.css'

/*
 * Photo-led service cards for the home overview: the work fills the card, the
 * name and an arrow sit over it, and a notch is cut from the bottom-right.
 * Replaces the icon-and-paragraph cards — for a trade sold on how the finished
 * job looks, a photograph of the actual work outsells an icon and three lines
 * of description.
 *
 * The whole card is one link rather than a card with a link inside it, so the
 * tap target is the full tile on a phone.
 */

// Cab-interior cockpit shot from the client's own set — dash, wheel and both
// seats in frame, which reads as "semi-truck interior" at a glance. Looked up
// rather than hard-coded so `npm run gallery` regenerating cabWork.js can't
// leave a dangling path behind.
// (Previously wa0017; swapped to wa0026 — a different rig, same clean
// symmetric dash+wheel+seats framing, at the client's request.)
const CAB_HERO =
  CAB_WORK.find((p) => p.id === 'img-20260729-wa0026') ?? CAB_WORK[0]

const ART = {
  'semi-truck-detailing': {
    src: CAB_HERO.full,
    srcSet: `${CAB_HERO.thumb} 700w, ${CAB_HERO.full} 1400w`,
  },
  // A real client SUV interior (IMG-20260729-WA0016), not stock — one of six
  // the client shot that had been sitting unused (excluded from the truck
  // gallery since it's not a rig; see EXCLUDE in scripts/gen-gallery.mjs).
  // This card renders at 1/1 (desktop), 16/9 (tablet) and 5/4 (mobile) — the
  // square crop is the most generous, so it's the one that governs framing;
  // pre-cropped from the top before the derivatives were generated to keep a
  // rear-view-mirror pendant and the street outside out of every one of them.
  // See CLAUDE.md §9.
  'auto-detailing': {
    src: autoImg,
    srcSet: `${autoImgThumb} 700w, ${autoImg} 1400w`,
  },
  // Window tinting has no photo of its own — see the note in ServiceCards.css
  // and CLAUDE.md §9. It falls through to the <TintCar /> illustration below.
  //
  // Paint Correction and Ceramic Coating have no client photography (neither
  // is a shot the client's phone-camera drop happens to contain — machine
  // polishing and coating application aren't things a "before/after" phone
  // photo of a parked car can show), so these are stock. Framed to keep the
  // technician + polisher + gloss story in every crop (see objectPosition
  // below) — a plain centred crop pushes his face out of frame on the wider
  // aspect ratios, since the source is a tall portrait shot.
  'paint-correction': {
    src: paintCorrectionImg,
    srcSet: `${paintCorrectionThumb} 700w, ${paintCorrectionImg} 1400w`,
    objectPosition: 'center 15%',
  },
  // Source is already close to the card's own aspect ratio and has no single
  // focal point (an even field of droplets), so the default centred crop
  // needs no help here.
  'ceramic-coating': {
    src: ceramicCoatingImg,
    srcSet: `${ceramicCoatingThumb} 700w, ${ceramicCoatingImg} 1400w`,
  },
}

// Homepage overview: the three core services, plus Paint Correction and
// Ceramic Coating — two tiers from Auto Detailing's own package menu
// (data/packages.js) that otherwise only surface after a click into Auto
// Detailing itself. Pulled from PACKAGE_GROUPS rather than re-typing their
// names here, so the two stay in sync with the actual menu automatically.
const PAINT_CORRECTION = PACKAGE_GROUPS.find((g) => g.id === 'paint-correction')
const CERAMIC_COATING = PACKAGE_GROUPS.find((g) => g.id === 'ceramic-coating')

const HOME_CARDS = [
  ...SERVICES.map((s) => ({ id: s.id, name: s.name, flagship: s.flagship, wide: false })),
  // `wide: true` gives these two their own half-width row below the three
  // core services (see .svc-card--wide in ServiceCards.css) rather than
  // cramming five cards into one 3-up grid, which leaves an off-centre pair
  // dangling under the third column. Two featured enhancements reading as
  // "the finishing touches" under three equal core services also matches
  // what they actually are — upsells layered onto a detail, not a fourth and
  // fifth service standing equal to semi-truck/auto/tint.
  { id: PAINT_CORRECTION.id, name: PAINT_CORRECTION.name, wide: true },
  { id: CERAMIC_COATING.id, name: CERAMIC_COATING.name, wide: true },
]

// Every service is quoted per vehicle now (see CLAUDE.md §1) — no card has a
// published "from $X" figure to tease, so only the flagship gets a corner
// tag. Previously this also returned "From $149" / "From $89" for auto and
// tint; that math (LOWEST_PRICE / TINT_LOWEST_PRICE) went with it.
function tagFor(card) {
  return card.flagship ? 'Our specialty' : null
}

export default function ServiceCards() {
  return (
    <RevealGroup className="svc-cards">
      {HOME_CARDS.map((card) => {
        const art = ART[card.id]
        const tag = tagFor(card)
        return (
          <RevealItem
            as="article"
            key={card.id}
            className={`svc-card${card.wide ? ' svc-card--wide' : ''}`}
          >
            <Link className="svc-card__link" to={`/services#${card.id}`}>
              {/* Decorative: the card's own title already names the service, so
                  the artwork must not add a second reading to the link name. */}
              <span className="svc-card__media" aria-hidden="true">
                {art?.src ? (
                  <img
                    src={art.src}
                    srcSet={art.srcSet}
                    sizes="(max-width: 900px) 100vw, 33vw"
                    style={art.objectPosition ? { objectPosition: art.objectPosition } : undefined}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="svc-card__art">
                    <TintCar filmOpacity={0.9} label="" />
                  </span>
                )}
              </span>

              {tag && <span className="svc-card__tag">{tag}</span>}

              <span className="svc-card__body">
                <span className="svc-card__title">{card.name}</span>
                <MoveRight className="svc-card__arrow" aria-hidden="true" />
              </span>
            </Link>
          </RevealItem>
        )
      })}
    </RevealGroup>
  )
}
