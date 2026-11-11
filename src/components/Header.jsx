import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SITE } from '../data/site'
import './Header.css'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [shrunk, setShrunk] = useState(false)
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Publish the header's real height so the mobile drawer can sit flush under
  // it. This was hard-coded to 69px in CSS while the bar actually measures
  // ~83px (and ~53px once shrunk), so the drawer's first row slid behind the
  // header. A ResizeObserver keeps it correct through the shrink transition
  // and any logo//font swap.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const publish = () => {
      document.documentElement.style.setProperty(
        '--header-h',
        `${Math.round(el.getBoundingClientRect().height)}px`
      )
    }
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      ref={headerRef}
      className={`site-header${shrunk ? ' site-header--shrunk' : ''}`}
    >
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand" onClick={() => setOpen(false)}>
          {/* logo-nav.png is a 128px-high resize of logo.png (546KB → 29KB);
              the original stays in /public for og:image / print use */}
          <img
            src="/logo-nav.png"
            alt={SITE.name}
            className="site-header__logo"
            width="217"
            height="128"
          />
        </Link>

        <nav
          id="site-nav"
          className={`site-nav${open ? ' site-nav--open' : ''}`}
          aria-label="Main navigation"
        >
          <ul>
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <a
            className="btn-ghost site-nav__cta"
            href={SITE.phoneHref}
            onClick={() => setOpen(false)}
          >
            Call {SITE.phoneDisplay}
          </a>
        </nav>

        <Link className="btn-ghost site-header__quote" to="/contact">
          Get a Quote
        </Link>

        <button
          type="button"
          className="site-header__toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          data-testid="nav-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="site-header__toggle-bar" />
          <span className="site-header__toggle-bar" />
          <span className="site-header__toggle-bar" />
        </button>
      </div>
    </header>
  )
}
