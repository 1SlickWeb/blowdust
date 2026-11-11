import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Reveal, useRevealVariants } from '../lib/fm'
import { usePageMeta } from '../lib/usePageMeta'
import { GALLERY, GALLERY_FILTERS } from '../data/gallery'
import { CAB_WORK, CAB_WORK_PAGE_SIZE } from '../data/cabWork'
import { CAR_CABIN_WORK, CAR_CABIN_WORK_PAGE_SIZE } from '../data/carCabinWork'
import BeforeAfter from '../components/BeforeAfter'
import Lightbox from '../components/Lightbox'
import PhotoGrid from '../components/PhotoGrid'
import CtaBlock from '../components/CtaBlock'
import './Gallery.css'

// Bento spans (ui-ux-pro-max Bento Grid pattern): varied 2x2 / 2x1 / 1x1
// cells on a 4-col grid, collapsing to 2 cols then 1 on mobile.
const SPANS = ['bento__item--lg', '', '', 'bento__item--wide', '', '']

export default function Gallery() {
  usePageMeta(
    'Gallery',
    'Before and after photos of semi-truck detailing, auto detailing and window tinting across Calgary and surrounding areas.',
  )
  const [filter, setFilter] = useState('all')
  const [lightboxItem, setLightboxItem] = useState(null)
  const { item: itemVariants } = useRevealVariants()

  const items = GALLERY.filter((g) => filter === 'all' || g.category === filter)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Gallery</span>
          <h1>The work speaks</h1>
          <p className="lead">
            Real vehicles, real turnarounds. Tap any pair to see it up close.
          </p>
        </div>
      </section>

      <section className="section--tight section">
        <div className="container">
          <div className="gallery-filters" role="group" aria-label="Filter gallery by service">
            {GALLERY_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`gallery-filters__chip${filter === f.id ? ' is-active' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <m.div className="bento" layout>
            <AnimatePresence mode="popLayout">
              {items.map((galleryItem, i) => (
                <m.div
                  key={galleryItem.id}
                  layout
                  className={`bento__item ${SPANS[i % SPANS.length]}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <BeforeAfter
                    item={galleryItem}
                    onClick={setLightboxItem}
                    layoutId={`ba-${galleryItem.id}`}
                    variant="tile"
                  />
                </m.div>
              ))}
            </AnimatePresence>
          </m.div>
        </div>
      </section>

      <section className="section cabwork" id="truck-cab-wall">
        <div className="container">
          <Reveal className="cabwork__intro">
            <span className="eyebrow">Semi-Truck · Cab Interiors</span>
            <h2>Inside the cab</h2>
            <p className="lead">
              Straight off the job: floors, bunks, dashes, fridges and storage
              from {CAB_WORK.length} recent semi-truck cab details. Unstaged and
              uncropped — tap any shot to see it full size.
            </p>
          </Reveal>

          <PhotoGrid
            items={CAB_WORK}
            pageSize={CAB_WORK_PAGE_SIZE}
            label="Semi-truck cab interior detailing photos"
            title="Semi-truck cab interior detail"
            captionFor={(_, i) =>
              `Semi-truck cab interior detail — Calgary, photo ${i + 1} of ${CAB_WORK.length}`
            }
          />
        </div>
      </section>

      {/* Car interiors get their own wall rather than folding into the truck
          one above — different vehicle type, and a much smaller, hand-picked
          set (see CAR_CABIN in scripts/gen-gallery.mjs) rather than a full
          job-site drop, so it reads oddly mixed into "Inside the cab". */}
      <section className="section cabwork" id="car-cabin-wall">
        <div className="container">
          <Reveal className="cabwork__intro">
            <span className="eyebrow">Auto Detailing · Car Interiors</span>
            <h2>Inside the car</h2>
            <p className="lead">
              A look inside a recent auto detail — seats, cargo and console.
              Tap any shot to see it full size.
            </p>
          </Reveal>

          <PhotoGrid
            items={CAR_CABIN_WORK}
            pageSize={CAR_CABIN_WORK_PAGE_SIZE}
            label="Auto detailing car interior photos"
            title="Auto detailing car interior"
            captionFor={(_, i) =>
              `Auto detailing car interior — Calgary, photo ${i + 1} of ${CAR_CABIN_WORK.length}`
            }
          />
        </div>
      </section>

      <Reveal>
        <CtaBlock title="Want yours in here?" />
      </Reveal>
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  )
}
