import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '../lib/fm'
import { PRICE_ON_QUOTE } from '../data/packages'
import {
  SEMI_TRUCK_PACKAGES,
  SEMI_TRUCK_PRICE_DISCLAIMER,
  semiTruckQuoteLink,
} from '../data/semiTruckPricing'
// Deliberately reuses <PackageMenu />'s stylesheet rather than duplicating
// ~250 lines of tier-card CSS (card, badge, price, list, hover, responsive,
// reduced-motion). The two components render the same visual pattern — a
// priced tier card — so this is one design system, not two coincidentally
// similar ones; forking the CSS would just mean keeping two files in sync by
// hand forever. The classnames below (.pkg, .packages__grid, …) are that
// shared component's, not this file's own.
import './PackageMenu.css'

/*
 * Semi-truck detailing package menu (data: data/semiTruckPricing.js).
 *
 * Every tier reads "On quote" instead of a dollar figure — see the note in
 * that data file for why semi-truck stays the one quote-only service even
 * with a package-menu presentation. Unlike <PackageMenu /> this renders a
 * single tier group with no add-ons block, since there's no add-on data for
 * rig work to show.
 */
export default function SemiTruckPricing() {
  return (
    <section className="section packages" id="semi-truck-packages">
      <div className="container">
        <Reveal as="span" className="eyebrow">
          Semi-Truck Packages
        </Reveal>
        <Reveal as="h2">Three levels of rig detail</Reveal>
        <Reveal as="p" className="lead packages__lead">
          From a cab refresh to the complete rig, inside and out — every tier
          builds on the last. Pricing depends on the truck, so each one is
          confirmed with a quote.
        </Reveal>

        <RevealGroup className="packages__grid" style={{ '--pkg-cols': 3 }}>
          {SEMI_TRUCK_PACKAGES.map((pkg) => (
            <RevealItem
              as="article"
              key={pkg.id}
              className={`pkg${pkg.badge ? ' pkg--featured' : ''}`}
            >
              {pkg.badge && <span className="pkg__badge">{pkg.badge}</span>}

              <h3 className="pkg__name">{pkg.name}</h3>
              <p className="pkg__tagline">{pkg.tagline}</p>

              <p className="pkg__price pkg__price--quoted">
                <span className="pkg__price-label">Priced per rig</span>
                <span className="pkg__price-value">{PRICE_ON_QUOTE}</span>
              </p>

              <div className="pkg__body">
                {pkg.inherits && <p className="pkg__inherits">{pkg.inherits}</p>}
                {pkg.sections.map((section, i) => (
                  <div className="pkg__section" key={section.label ?? i}>
                    <ul className="pkg__list">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <Link className="pkg__cta" to={semiTruckQuoteLink(pkg.name)}>
                Request this package
                <MoveRight className="pkg__cta-icon" aria-hidden="true" />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="packages__foot">
          <p className="packages__disclaimer">{SEMI_TRUCK_PRICE_DISCLAIMER}</p>
          <Link className="btn" to="/contact">
            Request a quote
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
