import { Link } from 'react-router-dom'
import { SITE } from '../data/site'
import './CtaBlock.css'

/** Closing quote CTA used at the bottom of most pages. */
export default function CtaBlock({
  title = 'Ready for a quote?',
  // "No prices to haggle over" was true of the original quote-only site; it
  // now contradicts the published auto package menu. Reworded to keep the
  // no-haggling promise without denying that prices exist.
  text = `Tell us what you drive and what it needs — we'll come back with a straight answer, usually the same day. No haggling, no surprise add-ons.`,
}) {
  return (
    <section className="cta-block section">
      <div className="container cta-block__inner">
        <h2>{title}</h2>
        <p className="lead">{text}</p>
        <div className="cta-block__actions">
          <Link className="btn" to="/contact">
            Book a free quote
          </Link>
          <a className="btn-ghost" href={SITE.phoneHref}>
            Or call {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}
