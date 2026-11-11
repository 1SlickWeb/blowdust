import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../lib/fm'
import { usePageMeta } from '../lib/usePageMeta'
import { SERVICES } from '../data/services'
import { PACKAGES_SERVICE_ID } from '../data/packages'
import { SITE } from '../data/site'
import { GALLERY } from '../data/gallery'
import { CAB_WORK } from '../data/cabWork'
import CtaBlock from '../components/CtaBlock'
import PackageMenu from '../components/PackageMenu'
import SemiTruckPricing from '../components/SemiTruckPricing'
import BeforeAfter from '../components/BeforeAfter'
import TintPricing from '../components/TintPricing'
import TintSimulator from '../components/TintSimulator'
// Real client photo (see below) — the Unsplash stock car-wash shot this
// replaced is still at assets/photos/auto.webp, now unused everywhere.
import autoImg from '../assets/photos/auto-interior.webp'
import autoImgThumb from '../assets/photos/auto-interior-700.webp'
import './Services.css'

// Real cab-interior shot from the client's own set (see data/cabWork.js) —
// replaces the stock engine-bay/chrome photo that used to sit here, which
// showed none of the actual cab work this service is about. A different
// rig than the one on the home service card (src/components/ServiceCards),
// so the two don't repeat the same photo. 700×525 is exactly 4:3, matching
// .service-detail__media's aspect ratio with no cropping. Looked up by id
// rather than hard-coded so `npm run gallery` can't leave a dangling path.
const SEMI_HERO =
  CAB_WORK.find((p) => p.id === 'img-20260729-wa0012') ?? CAB_WORK[0]

const PHOTOS = {
  'semi-truck-detailing': {
    src: SEMI_HERO.full,
    srcSet: `${SEMI_HERO.thumb} 700w, ${SEMI_HERO.full} 1400w`,
    alt: 'Semi-truck cab interior — dash, wheel and seats',
  },
  // A real client SUV interior (IMG-20260729-WA0016), not stock — one of six
  // the client shot that had been sitting unused (excluded from the truck
  // gallery since it's not a rig; see EXCLUDE in scripts/gen-gallery.mjs).
  // Pre-cropped from the top before the derivatives were generated to keep a
  // rear-view-mirror pendant and the street outside out of frame — that crop
  // lives in the source asset itself, not in CSS, so it can't reappear at a
  // width this page hasn't been tested at. See CLAUDE.md §9.
  'auto-detailing': {
    src: autoImg,
    srcSet: `${autoImgThumb} 700w, ${autoImg} 1400w`,
    alt: 'SUV interior — tan leather seats, console and dash',
  },
}

/*
 * Window tinting shows a draggable before/after instead of a still, because
 * the product IS the effect — factory glass vs. finished tint — and a single
 * frame can't convey it. (The previous still here was a wheel close-up with no
 * glass in shot at all.) Reuses the tint entry from the gallery so real
 * photography only has to be dropped in once.
 * TODO(client): the underlying pair is still placeholder art — see gallery.js.
 */
const TINT_SERVICE_ID = 'window-tinting'
const TINT_EFFECT = GALLERY.find((g) => g.id === 'tint-sedan')
const TRUCK_SERVICE_ID = 'semi-truck-detailing'

export default function Services() {
  usePageMeta(
    'Services',
    'Semi-truck detailing, auto detailing and window tinting — mobile across Calgary and surrounding areas. Every job quoted up front.',
  )

  return (
    <div>
      {/* PAGE HEADER — eyebrow, headline, lead, and a segmented jump-nav */}
      <section className="page-hero services-head">
        <div className="container">
          <span className="eyebrow">Our Services</span>
          <h1>Detailing built for the road</h1>
          <p className="lead">
            Three services, one standard. Every package is quoted for your
            vehicle, so the number you get is built for what you actually
            drive — never a generic rate. Tell us what you drive and we’ll
            build the right one.
          </p>
          <nav className="services-tabs" aria-label="Jump to a service">
            {SERVICES.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.tab}
              </a>
            ))}
            {/* The priced package menu (auto detailing) gets its own jump
                target — it's the section most visitors are hunting for. */}
            <a href="#packages">Packages</a>
          </nav>
        </div>
      </section>

      {/* SERVICE SECTIONS — alternating image/content, flagship leads */}
      {SERVICES.map((s, i) => {
        const photo = PHOTOS[s.id]
        const isTint = s.id === TINT_SERVICE_ID
        const isTruck = s.id === TRUCK_SERVICE_ID
        const reversed = i % 2 === 1
        return (
          <Fragment key={s.id}>
            <section
              className={`section service-detail${reversed ? ' service-detail--alt' : ''}`}
              id={s.id}
            >
              <div
                className={`container service-detail__grid${reversed ? ' service-detail__grid--reverse' : ''}`}
              >
                <Reveal
                  className={`service-detail__media${isTint ? ' service-detail__media--effect' : ''}`}
                >
                  {isTint ? (
                    <BeforeAfter item={TINT_EFFECT} variant="card" />
                  ) : (
                    <img
                      src={photo.src}
                      srcSet={photo.srcSet}
                      sizes="(max-width: 820px) 100vw, 50vw"
                      alt={photo.alt}
                      loading="lazy"
                    />
                  )}
                </Reveal>

                <Reveal className="service-detail__body">
                  <h2>{s.name}</h2>
                  <p className="lead">{s.short}</p>

                  <div className="service-detail__cols">
                    <div>
                      <span className="service-detail__label">
                        What’s included
                      </span>
                      <ul className="service-detail__list">
                        {s.included.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="service-detail__label">Who it’s for</span>
                      <p className="service-detail__audience">{s.audience}</p>
                    </div>
                  </div>

                  {s.fleetNote && (
                    <div className="service-detail__fleet">
                      <span className="service-detail__fleet-tag">Fleet</span>
                      <p>{s.fleetNote}</p>
                    </div>
                  )}

                  {s.id === PACKAGES_SERVICE_ID && (
                    <div className="service-detail__fleet">
                      <span className="service-detail__fleet-tag">Packages</span>
                      <p>
                        Every package is quoted for your vehicle —{' '}
                        <a href="#packages">see the full menu below</a>, or call
                        or DM us at{' '}
                        <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a> for
                        your number today.
                      </p>
                    </div>
                  )}

                  {isTruck && (
                    <div className="service-detail__fleet">
                      <span className="service-detail__fleet-tag">Packages</span>
                      <p>
                        Three tiers, from a cab refresh to the complete rig —{' '}
                        <a href="#semi-truck-packages">see the full menu below</a>,
                        each priced with a quote for your truck.
                      </p>
                    </div>
                  )}

                  <Link className="btn" to="/contact">
                    Request a quote
                  </Link>
                </Reveal>
              </div>
            </section>

            {/* Auto detailing's package menu. Tint and semi-truck each carry
                their own price list below.
                See data/packages.js, data/tintPricing.js and
                data/semiTruckPricing.js. */}
            {s.id === PACKAGES_SERVICE_ID && <PackageMenu />}

            {/* Semi-truck's package menu — three tiers, every price "On
                quote" (no client-supplied figures exist for rig work; see
                data/semiTruckPricing.js). Still the site's one quote-only
                service, just presented as a menu instead of a flat list. */}
            {isTruck && <SemiTruckPricing />}

            {/* Tint now carries its own price sheet, then the visualiser:
                read the coverage tiers, then pick the shade. Both are full-bleed
                rather than in the media column above — six percentage steps and
                a readable car won't fit half a grid. */}
            {isTint && (
              <>
                <TintPricing />
                <TintSimulator />
              </>
            )}
          </Fragment>
        )
      })}

      <CtaBlock
        title="Not sure what you need?"
        text="Tell us about your vehicle and we’ll recommend the right service and send a quote — no obligation."
      />
    </div>
  )
}
