import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '../lib/fm'
import {
  PACKAGE_GROUPS,
  ADD_ONS,
  PRICE_DISCLAIMER,
  PRICE_ON_QUOTE,
  quoteLinkFor,
} from '../data/packages'
import './PackageMenu.css'

/*
 * Auto Detailing package menu (data: data/packages.js).
 *
 * Brand rules (CLAUDE.md §2) that shaped this layout:
 *  - One orange CTA per screen, so the tier cards use cyan text links and the
 *    single .btn lives at the foot of the section.
 *  - Cyan is identity/links only — it carries the price figures, the badge and
 *    the list bullets; it is never a fill behind text.
 */

export default function PackageMenu() {
  return (
    <section className="section packages" id="packages">
      <div className="container">
        <Reveal as="span" className="eyebrow">
          Auto Detailing Packages
        </Reveal>
        <Reveal as="h2">Choose your level of detail</Reveal>
        <Reveal as="p" className="lead packages__lead">
          Set packages for cars, SUVs and pickups, so you know exactly what
          you’re getting before we arrive — every tier is quoted for your
          vehicle. <Link to="/contact">Ask us for a quote</Link>.
        </Reveal>

        {PACKAGE_GROUPS.map((group) => (
          <div className="packages__group" key={group.id} id={group.id}>
            <Reveal className="packages__group-head">
              <h3>{group.name}</h3>
              <p>{group.blurb}</p>
            </Reveal>

            <RevealGroup
              className="packages__grid"
              style={{ '--pkg-cols': group.packages.length }}
            >
              {group.packages.map((pkg) => (
                <RevealItem
                  as="article"
                  key={pkg.id}
                  className={`pkg${pkg.badge ? ' pkg--featured' : ''}`}
                >
                  {pkg.badge && <span className="pkg__badge">{pkg.badge}</span>}

                  <h4 className="pkg__name">{pkg.name}</h4>
                  <p className="pkg__tagline">{pkg.tagline}</p>

                  {/* Every tier is price: null right now — see the PRICING
                      NOTE in data/packages.js. The $-figure branch below
                      stays in place (rather than being deleted) so a future
                      "show prices again" only needs the data to change. */}
                  {pkg.price == null ? (
                    <p className="pkg__price pkg__price--quoted">
                      <span className="pkg__price-label">Priced per vehicle</span>
                      <span className="pkg__price-value">{PRICE_ON_QUOTE}</span>
                    </p>
                  ) : (
                    <p className="pkg__price">
                      <span className="pkg__price-label">Starting at</span>
                      <span className="pkg__price-value">${pkg.price}</span>
                    </p>
                  )}

                  <div className="pkg__body">
                    {pkg.inherits && (
                      <p className="pkg__inherits">{pkg.inherits}</p>
                    )}
                    {pkg.sections.map((section, i) => (
                      <div className="pkg__section" key={section.label ?? i}>
                        {section.label && (
                          <span className="pkg__section-label">
                            {section.label}
                          </span>
                        )}
                        <ul className="pkg__list">
                          {section.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <Link className="pkg__cta" to={quoteLinkFor(pkg.name)}>
                    Request this package
                    <MoveRight className="pkg__cta-icon" aria-hidden="true" />
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        ))}

        {/* ---------- add-ons ---------- */}
        <div className="packages__group" id="add-ons">
          <Reveal className="packages__group-head">
            <h3>Premium Add-Ons</h3>
            <p>Extras that can be added to any package above, quoted with it.</p>
          </Reveal>

          <Reveal className="packages__addons">
            <ul className="addons">
              {ADD_ONS.map((addOn) => (
                <li className="addons__row" key={addOn.id}>
                  <span className="addons__name">{addOn.name}</span>
                  <span className="addons__leader" aria-hidden="true" />
                  <span className="addons__price">
                    {addOn.price == null ? PRICE_ON_QUOTE : `$${addOn.price}`}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="packages__foot">
          <p className="packages__disclaimer">{PRICE_DISCLAIMER}</p>
          <Link className="btn" to="/contact">
            Request a quote
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
