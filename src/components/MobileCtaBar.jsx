import { Link } from 'react-router-dom'
import { SITE } from '../data/site'
import './MobileCtaBar.css'

/**
 * Fixed bottom bar on mobile (<768px): Call + Book a Quote, always reachable
 * one-handed, present on every page (CLAUDE.md §6).
 */
export default function MobileCtaBar() {
  return (
    <div className="cta-bar" data-testid="mobile-cta-bar">
      <a className="btn-ghost cta-bar__call" href={SITE.phoneHref} data-testid="cta-bar-call">
        Call now
      </a>
      <Link className="btn cta-bar__quote" to="/contact" data-testid="cta-bar-quote">
        Book a quote
      </Link>
    </div>
  )
}
