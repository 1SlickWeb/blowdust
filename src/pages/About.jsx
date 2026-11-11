import { Reveal, RevealGroup, RevealItem } from '../lib/fm'
import { usePageMeta } from '../lib/usePageMeta'
import { SITE } from '../data/site'
import CtaBlock from '../components/CtaBlock'
import './About.css'

const VALUES = [
  {
    title: 'Local & owner-led',
    text: 'Blowdust is a Calgary business run by the people doing the work. When you call, you talk to the detailer — not a booking service.',
  },
  {
    title: 'Mobile by design',
    text: 'We built the business around coming to you. No shop overhead means no pressure to rush jobs through a bay — and no wasted trip for you.',
  },
  {
    title: 'Trucks first',
    text: 'Semi-truck detailing isn’t a side offering we tacked on. It’s the reason we exist, and the standard the rest of our work is held to.',
  },
]

export default function About() {
  usePageMeta(
    'About',
    'Blowdust — The Auto Avenue is an owner-led mobile detailing company founded in Calgary in 2025, specializing in semi-truck detailing.',
  )

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About us</span>
          <h1>New company. Old-school standards.</h1>
          <p className="lead">
            Founded in Calgary in {SITE.founded}, {SITE.shortName} started with
            a simple observation: the people who depend on their vehicles the
            most — truckers — had the fewest detailing options. So we built a
            mobile operation around them.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-story">
          <Reveal>
            <h2>Why we do this</h2>
            {/* Semi-truck work is mobile-only — there is no shop or bay that
                fits a rig. The earlier draft implied we had one ("Most shops
                can't fit one in the bay. We can"), which isn't true, and its
                register ran hotter than the paragraph that follows. */}
            <p>
              Semi-trucks are hard to get detailed properly. Most shops in
              Calgary aren’t set up to take one, and pulling a rig off the road
              to sit in someone else’s queue costs more than the detail does.
              So we don’t ask anyone to. Truck work is mobile only — we come to
              the yard, the lot, or wherever the rig is parked, and do it there.
            </p>
            <p>
              The same care carries over to the cars, SUVs and pickups we
              detail and tint across {SITE.serviceArea}. Every job is quoted
              up front for what the vehicle actually needs — we’d rather earn
              a repeat customer than win a haggle.
            </p>
          </Reveal>
          <RevealGroup className="grid about-values">
            {VALUES.map((v) => (
              <RevealItem className="card" key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Reveal>
        <CtaBlock title="Put us to work" />
      </Reveal>
    </div>
  )
}
