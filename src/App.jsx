import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { LazyMotion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileCtaBar from './components/MobileCtaBar'
import ChatWidget from './components/ChatWidget'
import Home from './pages/Home'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Testimonials from './pages/Testimonials'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  const { pathname, hash } = useLocation()

  // Scroll to top (or the #anchor target) on route change. Framer Motion
  // scroll/viewport listeners are owned by components and clean up on
  // unmount, so no manual teardown is needed here.
  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <LazyMotion features={() => import('./lib/motionFeatures').then((mod) => mod.default)} strict>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <MobileCtaBar />
      <ChatWidget />
    </LazyMotion>
  )
}
