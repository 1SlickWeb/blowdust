import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '../lib/fm'
import { PRICE_ON_QUOTE } from '../data/packages'
import {
  TINT_PACKAGES,
  TINT_ADD_ONS,
  TINT_PRICE_DISCLAIMER,
  tintPackageQuoteLink,
} from '../data/tintPricing'
import './TintPricing.css'

/*
 * Window-tint price list (data: data/tintPricing.js).
 *
 * Deliberately lighter than <PackageMenu />: tint packages are one line each —
 * how much glass — with no inclusion lists to render, so they get price rows
 * rather than tier cards. Same brand constraint as the package menu though:
 * cyan carries the figures, and the section's single orange CTA sits at the
 * foot so the rows don't turn into a wall of competing buttons.
 */

export default function TintPricing() {
  return (
    <section className="section tint-pricing" id="tint-pricing">
      <div className="container">
        <Reveal as="span" className="eyebrow">
          Tint Pricing
        </Reveal>
        <Reveal as="h2">What tint costs</Reveal>
        <Reveal as="p" className="lead tint-pricing__lead">
          Priced by how much glass you want covered. Every package is the same
          film and the same install — pick the coverage, then pick your shade
          below.
        </Reveal>

        <RevealGroup className="tint-pricing__list">
          {TINT_PACKAGES.map((pkg) => (
            <RevealItem as="div" className="tint-pricing__row" key={pkg.id}>
              <Link className="tint-pricing__name" to={tintPackageQuoteLink(pkg.name)}>
                {pkg.name}
                <MoveRight className="tint-pricing__icon" aria-hidden="true" />
              </Link>
              <span className="tint-pricing__leader" aria-hidden="true" />
              <span className="tint-pricing__price">
                {pkg.price == null ? PRICE_ON_QUOTE : `$${pkg.price}`}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="tint-pricing__group">
          <h3>Add-ons</h3>
          <ul className="tint-pricing__list tint-pricing__list--addons">
            {TINT_ADD_ONS.map((addOn) => (
              <li className="tint-pricing__row" key={addOn.id}>
                <span className="tint-pricing__name">{addOn.name}</span>
                <span className="tint-pricing__leader" aria-hidden="true" />
                <span className="tint-pricing__price">
                  {addOn.price == null ? PRICE_ON_QUOTE : `$${addOn.price}`}
                  {addOn.unit && (
                    <span className="tint-pricing__unit"> / {addOn.unit}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="tint-pricing__foot">
          <p className="tint-pricing__disclaimer">{TINT_PRICE_DISCLAIMER}</p>
          <Link className="btn" to={tintPackageQuoteLink('Full Car')}>
            Book your tint
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
