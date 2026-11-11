import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { MoveRight, PhoneCall, MapPin } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '../lib/fm'
import { usePageMeta } from '../lib/usePageMeta'
import { SITE } from '../data/site'
import { GALLERY } from '../data/gallery'
import { TESTIMONIALS } from '../data/testimonials'
import ServiceCards from '../components/ServiceCards'
import BeforeAfter from '../components/BeforeAfter'
import Lightbox from '../components/Lightbox'
import CtaBlock from '../components/CtaBlock'
import LazyMap from '../components/LazyMap'
import ScrollExpandMedia from '../components/ui/scroll-expansion-hero'
import { Hero } from '../components/ui/animated-hero'
import { Button } from '../components/ui/button'
import './Home.css'

/*
 * The four "why us" pillars. Each one has to be a claim a visitor could hold
 * us to — a service promise, not an adjective.
 *
 * The fourth slot used to be "Straight pricing". It went stale the moment
 * tint got a published price list: the copy still told visitors trucks AND
 * tint were quoted per unit. Rather than patch the sentence a second time,
 * the pillar moved to availability, which nothing else on the page covers —
 * pricing already speaks for itself on /services.
 */
const TRUST_POINTS = [
  {
    title: 'We come to you',
    text: 'Yard, lot, job site or driveway — we bring the shop to the vehicle, so your truck never waits in someone else’s queue.',
  },
  {
    title: 'Semi-truck specialists',
    text: 'Most Calgary detailers stop at pickups. Rigs are our lead service, not a sideline — cab interiors and metal polish, done in your yard.',
  },
  {
    title: 'Owner-operated',
    text: 'The person who quotes your job is the person who does it. No call centers, no hand-offs, no crew you have never met.',
  },
  {
    // Hours come from SITE so this pillar and the contact page can never
    // drift apart. Confirmed against the Google Business Profile.
    title: 'Seven days a week',
    text: `${SITE.hours[0].days}, ${SITE.hours[0].time}. Book around your route or your day off — not around our opening hours.`,
  },
]

export default function Home() {
  usePageMeta(null)
  const [lightboxItem, setLightboxItem] = useState(null)
  const reduced = useReducedMotion()

  // Services section parallax: the bg photo drifts opposite the section's
  // own scroll travel (~20% total), same technique the original hero used.
  const servicesRef = useRef(null)
  const { scrollYProgress: servicesScroll } = useScroll({
    target: servicesRef,
    offset: ['start end', 'end start'],
  })
  const servicesParallaxY = useTransform(servicesScroll, [0, 1], ['-10%', '10%'])

  return (
    <div>
      {/* HERO — scroll-expanding media (src/components/ui/scroll-expansion-hero).
          A muted, looping road video sits over the highway backdrop and grows
          to fill the viewport as you scroll; the value prop + CTAs are revealed
          as the component's children once it's fully expanded. */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/videos/162766-826290880_medium.mp4"
        bgImageSrc="/images/shot-highway-road.jpg"
        title="Blowdust Detailing"
        date={`Mobile detailing — ${SITE.serviceArea}`}
        scrollToExpand="Scroll to see the work"
        textBlend
      >
        {/* Animated hero (src/components/ui/animated-hero) configured for the
            brand: "We detail the trucks that ___" cycles through what the rigs
            do for the city. Reduced vertical padding since it's nested inside
            the scroll-expand reveal. */}
        <Hero
          className="py-6 lg:py-10"
          titlePrefix="We detail the trucks that"
          titles={[
            'run the city',
            'haul freight',
            'move loads',
            'never stop',
            'keep rolling',
          ]}
          titleClassName="text-[#2BAFE5]"
          badge={
            /* min-h-11 = 44px tap target; size="sm" alone renders 36px */
            <Button asChild variant="secondary" size="sm" className="gap-2 min-h-11">
              <Link to="/about">
                <MapPin className="w-4 h-4" /> We come to you
              </Link>
            </Button>
          }
          description="Semi-truck detailing, auto detailing and window tinting — brought to your yard, lot or driveway. Quoted up front. Done right."
          actions={
            <>
              <Button asChild size="lg" variant="outline" className="gap-2 text-foreground">
                <a href={SITE.phoneHref}>
                  <PhoneCall className="w-4 h-4" /> Call {SITE.phoneDisplay}
                </a>
              </Button>
              <Button asChild size="lg" className="gap-2">
                <Link to="/contact">
                  Book a free quote <MoveRight className="w-4 h-4" />
                </Link>
              </Button>
            </>
          }
        />
      </ScrollExpandMedia>

      {/* SERVICES OVERVIEW — photo-led cards, see components/ServiceCards */}
      <section className="section home-services-section" ref={servicesRef}>
        <m.div
          className="home-services-section__media"
          aria-hidden="true"
          style={reduced ? undefined : { y: servicesParallaxY }}
        >
          <img src="/images/bg.jpg" alt="" loading="lazy" />
        </m.div>
        <div className="container">
          <Reveal as="span" className="eyebrow">What we do</Reveal>
          <Reveal as="h2">Three services. Two finishing touches.</Reveal>
          <ServiceCards />
        </div>
      </section>

      {/* WHY US */}
      <section className="section home-trust">
        <div className="container">
          <Reveal as="span" className="eyebrow">Why Blowdust</Reveal>
          <Reveal as="h2">Built for people who work their vehicles</Reveal>
          <RevealGroup className="grid grid--4">
            {TRUST_POINTS.map((p) => (
              <RevealItem className="home-trust__point" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* GALLERY PREVIEW — draggable before/after comparison sliders
          (src/components/BeforeAfter) */}
      <section className="section">
        <div className="container">
          <Reveal as="span" className="eyebrow">The proof</Reveal>
          <Reveal as="h2">Before &amp; after</Reveal>
          <Reveal as="p" className="lead home-proof__lead">
            Drag the slider on any photo to see the difference for yourself.
          </Reveal>
          <RevealGroup className="grid grid--3">
            {GALLERY.slice(0, 3).map((galleryItem) => (
              <RevealItem key={galleryItem.id}>
                <BeforeAfter
                  item={galleryItem}
                  onClick={setLightboxItem}
                  layoutId={`ba-${galleryItem.id}`}
                />
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="home-more">
            <Link className="btn-ghost" to="/gallery">
              View the full gallery <MoveRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS PREVIEW — light block per brand rules */}
      <section className="section section--light">
        <div className="container">
          <Reveal as="span" className="eyebrow">Word of mouth</Reveal>
          <Reveal as="h2">What customers say</Reveal>
          <RevealGroup className="grid grid--3">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <RevealItem as="blockquote" className="home-review" key={t.id}>
                {/* Dark glyphs: orange/cyan on a light card fails contrast. */}
                <span
                  className="home-review__stars"
                  role="img"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {'★'.repeat(t.rating)}
                </span>
                <p>“{t.quote}”</p>
                <footer>
                  <strong>{t.author}</strong>
                  <span>{t.service}</span>
                </footer>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="home-more">
            <Link className="btn-ghost" to="/testimonials">
              Read all reviews
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="section">
        <div className="container home-area">
          <Reveal className="home-area__text">
            <span className="eyebrow">Where we work</span>
            <h2>Calgary and surrounding areas</h2>
            <p className="lead">
              Based in northeast Calgary, we run mobile across the city and the
              surrounding areas. Yards, industrial lots, workplaces and
              driveways — if the vehicle is there, so are we.
            </p>
            <p className="home-area__address">{SITE.address}</p>
          </Reveal>
          <Reveal>
            <LazyMap
              className="home-area__map"
              src={SITE.mapEmbedUrl}
              title={`Map of ${SITE.name} service area`}
            />
          </Reveal>
        </div>
      </section>

      <CtaBlock />
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  )
}
