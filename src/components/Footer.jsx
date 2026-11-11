import { Link } from 'react-router-dom'
import { SITE } from '../data/site'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <img
            src="/logo-nav.png"
            alt={SITE.name}
            className="site-footer__logo"
            width="217"
            height="128"
          />
          <p className="site-footer__blurb">
            Mobile detailing for semi-trucks, autos and window tinting. We come
            to you across {SITE.serviceArea}.
          </p>
        </div>

        <nav aria-label="Footer">
          <h3 className="site-footer__heading">Pages</h3>
          <ul className="site-footer__list">
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="site-footer__heading">Get in touch</h3>
          <ul className="site-footer__list">
            <li>
              <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>{SITE.address}</li>
            <li>Serving {SITE.serviceArea}</li>
          </ul>
        </div>

        <div>
          <h3 className="site-footer__heading">Follow us</h3>
          <ul className="site-footer__list">
            {/* TODO(client): real social URLs — placeholders for now */}
            <li>
              <a href={SITE.social.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a href={SITE.social.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container site-footer__legal">
        <p>
          © {new Date().getFullYear()} {SITE.name}. Serving {SITE.serviceArea}{' '}
          since {SITE.founded}.
        </p>
      </div>
    </footer>
  )
}
