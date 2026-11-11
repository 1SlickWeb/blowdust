import { usePageMeta } from '../lib/usePageMeta'
import { SITE } from '../data/site'
import QuoteForm from '../components/QuoteForm'
import LazyMap from '../components/LazyMap'
import './Contact.css'

export default function Contact() {
  usePageMeta(
    'Contact & Quotes',
    'Book a free detailing quote in Calgary and surrounding areas. Call, email, or send the quote form — we come to you.',
  )

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Get your free quote</h1>
          <p className="lead">
            Tell us what you drive and what it needs. We’ll come back with a
            straight quote — usually the same day.
          </p>
        </div>
      </section>

      <section className="section contact-grid-wrap">
        <div className="container contact-grid">
          {/* No entrance animation here: the form is the page's main content
              and its LCP element — it must paint immediately. */}
          <div className="contact-form-col" id="quote">
            <h2>Request a quote</h2>
            <QuoteForm />
          </div>

          <aside className="contact-info">
            <div className="card">
              <h3>Prefer to talk?</h3>
              <p>
                <a href={SITE.phoneHref} className="contact-info__phone">
                  {SITE.phoneDisplay}
                </a>
              </p>
              <p>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </div>

            <div className="card">
              <h3>Hours</h3>
              <ul className="contact-info__hours">
                {SITE.hours.map((h) => (
                  <li key={h.days}>
                    <span>{h.days}</span>
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
              <p className="contact-info__hours-note">{SITE.hoursNote}</p>
            </div>

            <div className="card">
              <h3>Where we work</h3>
              <p>{SITE.address}</p>
              <p>Mobile across {SITE.serviceArea} — we come to you.</p>
            </div>

            <LazyMap
              className="contact-info__map"
              src={SITE.mapEmbedUrl}
              title={`Map to ${SITE.name}`}
            />
          </aside>
        </div>
      </section>
    </div>
  )
}
