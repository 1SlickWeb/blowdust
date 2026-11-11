import { Reveal, RevealGroup, RevealItem } from '../lib/fm'
import { usePageMeta } from '../lib/usePageMeta'
import {
  TESTIMONIALS,
  REVIEW_COUNT,
  AVERAGE_RATING,
} from '../data/testimonials'
import CtaBlock from '../components/CtaBlock'
import { Card, CardContent } from '../components/ui/card'
import { Marquee } from '../components/ui/marquee-01-utils/marquee'
import './Testimonials.css'

/* Star rating — dark glyphs on the light card so contrast holds
   (orange text/icons on light backgrounds fail the brand's contrast rule). */
function Stars({ rating }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  )
}

/* Marquee review card — shadcn Card + Marquee primitives, fed by the site's
   own on-brand testimonial data. A monogram avatar stands in for a photo so we
   never ship an invented customer face (CLAUDE.md §4). */
function MarqueeReviewCard({ author, service, quote, rating }) {
  return (
    <Card className="h-full w-72 shrink-0 overflow-hidden border-border bg-card shadow-none p-4">
      <CardContent className="p-0 flex flex-col gap-3">
        <div className="flex flex-row items-center gap-3">
          <span className="tm-avatar" aria-hidden="true">
            {author.charAt(0)}
          </span>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-foreground">{author}</p>
            <p className="text-xs font-medium text-muted-foreground">{service}</p>
          </div>
        </div>
        <p className="text-sm line-clamp-3 text-foreground">“{quote}”</p>
        <span
          className="stars tm-stars"
          role="img"
          aria-label={`${rating} out of 5 stars`}
        >
          {'★'.repeat(rating)}
        </span>
      </CardContent>
    </Card>
  )
}

/* The two marquee rows split the review list rather than each replaying the
   whole array — otherwise the same person's card drifts past twice at once,
   which reads as padding. Every review still appears exactly once across the
   two rows. */
const SPLIT = Math.ceil(TESTIMONIALS.length / 2)
const MARQUEE_ROW_TOP = TESTIMONIALS.slice(0, SPLIT)
const MARQUEE_ROW_BOTTOM = TESTIMONIALS.slice(SPLIT)

export default function Testimonials() {
  usePageMeta(
    'Testimonials',
    'What fleet owners, owner-operators and car owners say about Blowdust mobile detailing in Calgary and surrounding areas.',
  )

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Testimonials</span>
          <h1>Word gets around</h1>
          <p className="lead">
            A young company lives on its reputation. Here’s what the people we
            work for have to say.
          </p>

          {/* Rating summary — figures are derived from the review data itself
              (data/testimonials.js), never hardcoded, so they can't drift out
              of step with the cards below. */}
          <div className="tm-score">
            <span className="tm-score__value">{AVERAGE_RATING.toFixed(1)}</span>
            <span className="stars tm-score__stars" role="img" aria-label={`${AVERAGE_RATING} out of 5 stars`}>
              ★★★★★
            </span>
            <span className="tm-score__count">
              {REVIEW_COUNT} reviews on Google
            </span>
          </div>
        </div>
      </section>

      {/* Scrolling review wall — dark band, powered by the Marquee primitive
          (src/components/ui/marquee-01-utils/marquee) with real testimonial
          data. Two rows drift in opposite directions; hover to pause. */}
      <section className="section testimonials-marquee">
        <div className="container">
          <Reveal as="span" className="eyebrow">Straight from the yard</Reveal>
          <Reveal as="h2">A wall of good words</Reveal>
        </div>
        <div className="testimonials-marquee__rows">
          <Marquee pauseOnHover className="[--duration:30s]">
            {MARQUEE_ROW_TOP.map((t) => (
              <MarqueeReviewCard key={t.id} {...t} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:30s]">
            {MARQUEE_ROW_BOTTOM.map((t) => (
              <MarqueeReviewCard key={t.id} {...t} />
            ))}
          </Marquee>
          <div className="testimonials-marquee__fade testimonials-marquee__fade--l" />
          <div className="testimonials-marquee__fade testimonials-marquee__fade--r" />
        </div>
      </section>

      {/* Light section — the one place light backgrounds are on-brand. */}
      <section className="section section--light">
        <div className="container">
          <Reveal className="tm-full-head">
            <span className="eyebrow">Every review, in full</span>
            <p>
              Published as written, straight from the company’s Google Business
              Profile.
            </p>
          </Reveal>
          <RevealGroup className="grid grid--2">
            {TESTIMONIALS.map((t) => (
              <RevealItem as="blockquote" className="review-card" key={t.id}>
                <Stars rating={t.rating} />
                <p>“{t.quote}”</p>
                <footer>
                  <strong>
                    {t.author}
                    {/* Google's own badge, not a claim of ours. */}
                    {t.localGuide && (
                      <span className="review-card__badge">Local Guide</span>
                    )}
                  </strong>
                  <span>{t.service}</span>
                </footer>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Reveal>
        <CtaBlock title="Be the next review" />
      </Reveal>
    </div>
  )
}
