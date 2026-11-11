# Blow - The Auto Avenue — Website Build Brief (Claude Code)

## 1. Project summary

Mobile detailing company in Calgary, AB (founded 2025). Lead service is
**semi-truck detailing** — the differentiator most competitors don't offer.
Also does auto detailing and window tinting. Goal: every page pushes toward
**call** or **book a quote**.

**Semi-truck scope (client-confirmed):** rigs get **cab interior detailing and
metal polish only — no exterior detailing**, no trailer wash, no tire/rim
dressing. Auto detailing *does* include exterior work; the two are not the
same scope. A test in `tests/packages.spec.js` fails if exterior copy
reappears in the semi-truck section.

**Pricing (revised a fourth time — every service is quote-only again):**
**no service publishes a dollar figure anywhere on the site.** All three
services — Auto Detailing (`/src/data/packages.js`), Window Tinting
(`/src/data/tintPricing.js`) and Semi-Truck Detailing
(`/src/data/semiTruckPricing.js`) — render every tier and add-on as
**"On quote"** (`PRICE_ON_QUOTE`, defined in `packages.js` and imported
wherever needed). Every CTA still routes to a quote request; the final number
is confirmed per vehicle/rig either way.

The history matters here because it's swung back and forth three times
already: original brief → quote-only for everything → client supplied real
price sheets for auto and tint, so those started showing "Starting at" figures
→ semi-truck got a package-menu presentation too, but with no real prices to
show (`price: null` from day one, no client sheet existed) → **now reverted
again, at the owner's explicit request, back to quote-only for auto and tint
too.** Given that pattern, expect it might move again. To make the next flip
cheap: auto and tint's real, client-supplied figures were **not deleted**,
just hidden — every tier and add-on in `packages.js` and `tintPricing.js`
carries a `price: null` with the original number in a trailing comment (e.g.
`price: null, // was $149`). Restoring prices is a one-line edit per item, not
a re-transcription from the source PDF/sheet. Semi-truck's tiers never had
real figures to begin with — see the open item below.

The **"Packages" callout** in the Auto Detailing section (top of `/services`,
next to "What's included") used to cite the cheapest figure directly
("Set packages from $149 — see the full menu below, or ask for a custom
quote."). That's gone along with the figure; it now reads "Every package is
quoted for your vehicle — see the full menu below, or call or DM us at
`SITE.phoneDisplay` for your number today," with the phone number a real
`tel:` link. Semi-truck's parallel callout never cited a figure and needed no
change. Tint's top section never had this callout at all.

One thing pricing display does NOT affect: **semi-truck's scope.** rigs get
**cab interior detailing and metal polish only — no exterior detailing**, no
trailer wash, no tire/rim dressing, regardless of how its price is shown or
hidden. Auto detailing *does* include exterior work; the two are not the same
scope. A test in `tests/packages.spec.js` fails if exterior copy reappears in
the semi-truck section. Tint is priced by **coverage, not shade** — 5% costs
the same as 50% — which is a separate, permanent reason `<TintSimulator />`
has never shown figures.

Tests in `tests/packages.spec.js`, `tests/tint-pricing.spec.js` and
`tests/semi-truck-pricing.spec.js` assert every group renders "On quote" and
that no `$` figure appears anywhere; `tests/tint-simulator.spec.js` covers the
shade picker separately.

- **Business name:** Blow - The Auto Avenue.
- **Location:** 176 Martinvalley Crescent NE, Calgary, AB T3J 4L6
- **Service area:** Calgary and surrounding areas (revised from the original
  "Calgary, Chestermere" wording — see `SITE.serviceArea` in `/src/data/site.js`)
- **Contact:** blowdustzoneltd@gmail.com · (403) 313-7803
- **Domain:** client confirmed he owns one — get the exact name before deploy
- **Audience:** fleet owners, owner-operators, car owners who want
  professional work and don't haggle on price

---

## 2. Brand system (non-negotiable)

```css
--color-base:      #17191A;  /* near-black background */
--color-cta:       #FD8000;  /* orange — ACTIONS ONLY */
--color-accent:    #2BAFE5;  /* cyan — IDENTITY ONLY, never buttons */
--color-text:      #FDFDFD;
--color-cta-text:  #17191A;  /* text ON orange buttons */
```

**Hard rules — verified against WCAG, do not deviate:**

1. Buttons are **orange fill with `#17191A` text**. White text on orange is
   2.54:1 contrast — fails accessibility. Do not use white-on-orange anywhere.
2. Never render orange or cyan as text on a white/light background
   (2.5:1, fails). Both accents only work on the dark base.
3. Orange = calls-to-action and active states, full stop. Cyan = brand
   accents, links, icon highlights — never a button fill. If both start
   showing up as buttons, stop and fix it.
4. Site is dark-first (`#17191A` base). Light sections are reserved for
   photography breakouts and the testimonials block — used sparingly.
5. One orange CTA visible per screen. Don't compete with yourself.

**Typography:** the logo wordmark is a wide-tracked geometric sans. Headings
use a geometric sans, uppercase, generous letter-spacing, to echo it. Body
text uses a highly legible sans at normal tracking — don't stretch body copy.

**Logo:** `/assets/logo.png`, transparent background, place on `#17191A`
only — it disappears or clashes on white. Ask the client for an SVG/vector
source before final deploy; the PNG is raster at 1015×600.

---

## 3. Tech stack

- **React + Vite**, regular CSS (no Tailwind, no CSS-in-JS) — CSS Modules or
  plain files per component, whichever keeps the codebase simplest.
- **GSAP + ScrollTrigger** for all motion. No Three.js / WebGL for v1 — see
  §7 for why.
- **React Router** for the 6 pages.
- Deploy target: static hosting (Vercel/Netlify) unless client's domain
  registrar dictates otherwise — confirm before scaffolding CI.
- **Photo pipeline:** client photos land as raw phone JPEGs in
  `/public/images/gallery/`. `npm run gallery` (sharp) EXIF-rotates them and
  emits 700px/1400px WebP derivatives into `gallery/opt/` plus two generated
  data files — `/src/data/cabWork.js` (semi-truck cabs) and
  `/src/data/carCabinWork.js` (a small, hand-curated set of car interiors,
  `<PhotoGrid />`'d separately on `/gallery`) — never hand-edit either file.
  Three sets at the top of the script sort every source photo:
  `NOT_A_VEHICLE` (excluded everywhere, permanently), `CAR_CABIN` (routed to
  the car-interior file instead of the truck one), `HELD_BACK` (a real photo
  the script still has, deliberately not published — see the comments there
  for why each one). A `CROP_TOP` map trims pixels off the top of specific
  source photos before either derivative is cut, for frames with something in
  the shot that shouldn't be public (baked into the file, not CSS, so it can't
  resurface at some width the page wasn't checked at). Every derivative
  filename (and the URL written into the data file) is built from a slugified
  stem, not the raw one — a raw forward/share export (e.g. "WhatsApp Image
  2026-09-09 at 22.58.49 (1).jpeg") has spaces and parentheses no other asset
  on the site carries, which is not a name a browser can be trusted to fetch
  un-encoded. The script also prunes derivatives whose source is gone or now
  excluded. A build plugin in `vite.config.js` strips the raw JPEGs from
  `dist/` so the deploy carries only the derivatives.

---

## 4. Pages & content

Content source: client's form responses (attached in repo as
`/docs/client-intake.xlsx`) and `/assets/photos/` (client's real photography
— use these, not stock, wherever a truck/car/tint shot is needed).

1. **Home** — hero (real semi-truck photo, not 3D), service overview
   (`<ServiceCards />`: the 3 core services on top — Semi-Truck Detailing
   leads, then Auto Detailing, then Window Tinting — plus **Paint Correction
   and Ceramic Coating** in their own wider row underneath). Those two are
   not entries in `SERVICES`; they're pulled straight from Auto Detailing's
   own package menu (`PACKAGE_GROUPS` in `data/packages.js`) so the homepage
   card can't drift out of sync with the real menu, and each links to its own
   group on `/services` (`#paint-correction` / `#ceramic-coating`), not to
   the top of Auto Detailing. Neither has real client photography, so both
   run on License-free Unsplash stock for now — see §9.
   Then trust/why-us section, gallery preview strip, testimonials preview,
   service-area block (Calgary and surrounding areas, map), quote CTA block.
2. **Services** — same three services, each gets: what's included, who it's
   for, "Request a Quote" CTA. All three additionally carry a package/price
   menu — Auto Detailing's (`<PackageMenu />`: Interior tiers, Full Detail
   tiers, Paint Correction, Ceramic Coating, Premium Add-Ons), Window
   Tinting's (`<TintPricing />` plus the `<TintSimulator />` shade picker),
   and Semi-Truck Detailing's (`<SemiTruckPricing />`) — but every tier and
   add-on across all three renders "On quote", never a dollar figure. See §1
   for the pricing-display history and why.
3. **Gallery** — filterable by service type, before/after pairs, lightbox on
   click. Photo-first, minimal chrome. Below that, two separate photo walls
   (`<PhotoGrid />`, own pagination/lightbox each): "Inside the cab" (90 real
   semi-truck interiors) and "Inside the car" (3 curated real auto-detailing
   interiors) — see §3's photo pipeline and §9 for how the car set was
   chosen.
4. **Testimonials** — review cards: name, service, rating. **Done — real
   Google reviews supplied by the client are now live** in
   `/src/data/testimonials.js` (11 reviews, all 5★). Quotes are verbatim and
   must stay that way; they're attributed to named real people. The `service`
   label on each card is inferred from the review text, not part of the
   original review.
5. **About** — trust-building for a young (2025) company: owner-led, local,
   mobile-to-you convenience.
6. **Contact** — quote-request form (name, phone, email, vehicle type,
   service needed, preferred date, notes), click-to-call phone number,
   embedded Google Map, business hours (**confirmed:** 9 AM – 8 PM daily).

**Explicitly out of scope for v1** — client's form ticked these but they
don't fit a quote-only, two-person mobile operation yet:
- Live chat (nobody would be watching it)
- Online payments (there's nothing to charge until a quote is issued)

Leave clean extension points (e.g. a `<ChatWidget />` stub component) but
don't build them out.

---

## 5. Motion spec — GSAP ScrollTrigger

This replaces the 3D hero. Goal: premium feel, real weight, without the
payload or mobile risk of WebGL.

- **Hero:** poster-first. Real truck photo loads as the LCP element,
  full-bleed, no animation blocking paint. On scroll, a subtle parallax
  (photo moves slower than scroll, ~0.3 speed factor) plus a fade-in on the
  headline and CTA button.
- **Before/after reveals:** scroll-triggered wipe or crossfade transitions
  between before/after photo pairs in the gallery and home preview strip.
- **Section reveals:** staggered fade/slide-up on card grids (services, trust
  points, testimonials) as they enter viewport — `ScrollTrigger.batch()`,
  stagger ~0.08s, don't overdo the delay or it feels sluggish.
- **Sticky nav shrink:** header compresses on scroll past ~80px.
- **Numbers/stats** (if client provides any — years in business, jobs done):
  count-up animation on scroll into view.

**Rules:**
- Respect `prefers-reduced-motion` — disable parallax and stagger, keep
  simple fades, for anyone with that OS setting on.
- No animation may delay the CTA button's interactivity. Buttons are
  clickable immediately, even mid-animation.
- Kill all ScrollTrigger instances on route change to avoid memory leaks
  (`ScrollTrigger.getAll().forEach(t => t.kill())` in cleanup).

---

## 6. Mobile requirements

Primary users are on phones, often outdoors or in a truck cab, sometimes on
slow LTE.

- Every page must work cleanly at **360px width** minimum.
- **Sticky bottom bar** on mobile: Call button + Book/Quote button, always
  reachable one-handed, present on every page.
- Test at 360 / 768 / 1440px. Screenshot all three per page.
- Target **Lighthouse mobile performance ≥ 90**. If the hero photo is
  fighting this, serve responsive `srcset` sizes and compress hard (WebP,
  target < 200KB for the hero image at mobile width).
- No animation-heavy library should block first paint — GSAP loads async
  after the poster renders.

---

## 7. Why GSAP over 3D (context, not a task)

Client's goal is calls/bookings from people checking their phone in a yard
or a truck cab on Calgary LTE. A Three.js hero typically adds 1–3MB before
textures and tends to become the LCP bottleneck on exactly the device this
audience uses. Real photography of the actual trucks, animated well, sells
the work better than a rendered model — and ships lighter. If a 3D hero gets
revisited later, gate it behind `min-width: 1024px` and
`prefers-reduced-motion: no-preference`, keep the poster image as the true
LCP element, and treat it as a desktop-only enhancement, not the primary
asset.

---

## 8. Build & verify workflow

Suggested plan for Claude Code — full spec up front, let it run, review at
checkpoints rather than interrupting constantly:

1. Scaffold Vite + React + Router, brand tokens as CSS custom properties
   from §2, base layout (header, sticky mobile CTA bar, footer).
2. Build Home page fully, including hero + GSAP setup. Screenshot at 360/
   768/1440 and self-check against brand rules in §2 before moving on.
3. Build remaining 5 pages.
4. Wire the quote-request form (client-side validation; leave a clearly
   marked TODO for backend/email submission endpoint — confirm with client
   whether Google Apps Script, Formspree, or a real backend is preferred).
5. Write Playwright tests for: quote form validation, mobile sticky CTA bar
   visibility, nav on mobile.
6. Run Lighthouse (mobile) on Home and Contact. Report scores.
7. Final pass: confirm no white-text-on-orange, no orange/cyan-on-white
   instances anywhere in the codebase — grep for it if useful.
8. Report back: what was built, what's placeholder (testimonials, hours,
   phone number, domain), what needs client input before launch.

---

## 9. Open items to confirm with client before launch

- Exact domain name (he confirmed ownership, didn't provide it)
- ~~Real phone number (Excel corrupted the form's phone field)~~ —
  **confirmed:** (403) 313-7803. Set at `SITE.phoneDisplay` /
  `SITE.phoneHref` in `/src/data/site.js`, the single source every `tel:`
  link and on-page phone number reads from — header, footer, mobile sticky
  CTA bar, home hero, Contact page and the CTA block all update from that
  one change.
- ~~Current business hours (form said "check Google" — verify and lock them
  in)~~ — **confirmed:** 9:00 AM – 8:00 PM, seven days a week, per the Google
  Business Profile. Locked in at `SITE.hours` in `/src/data/site.js`.
- Real social media URLs (he wrote "Facebook, insta" with no links)
- ~~Real testimonials/reviews to replace placeholders~~ — **received.** Two
  follow-ups remain: (a) Tarun Sarout's review was supplied cut off mid-
  sentence, so it's quoted only to the last complete sentence — get the full
  text from Google; (b) confirm the inferred per-review `service` labels
- Vector/SVG version of the logo
- **A real window-tint photo pair (highest-priority asset).** The old still in
  that slot was a wheel close-up with no glass in shot, so the section now runs
  a draggable before/after (untinted vs. tinted) wired to the `tint-sedan`
  entry in `data/gallery.js` — the right format for a service whose product IS
  the effect. The art behind it is still placeholder SVG and is the weakest
  visual on the site. Dropping a real untinted/tinted pair into that gallery
  entry updates the Services page and the Gallery at once. Note this slot now
  sits directly above `<TintSimulator />`, so the placeholder art reads worse
  by comparison than it used to — if the client can't supply a pair, consider
  dropping the before/after from Services and letting the visualiser carry the
  section on its own.
- **Four of six real SUV-interior photos are now live; publishing consent for
  the vehicle is still unconfirmed.** All six are frames from a genuine
  auto-detailing job the client shot, not stock — originally all lumped into
  one `EXCLUDE` set in `scripts/gen-gallery.mjs` because none of them are
  semi-truck cabs. That set is now split three ways (`NOT_A_VEHICLE` / the
  two room photos below; `CAR_CABIN`; `HELD_BACK`), and the script generates
  a second data file, `src/data/carCabinWork.js`, alongside `cabWork.js`.
  Where each of the six landed:
  - `IMG-20260729-WA0016` (tan leather seats, console, dash) — **not** run
    through the batch pipeline; it has its own bespoke, pre-cropped
    derivatives at `src/assets/photos/auto-interior*.webp` and is the Auto
    Detailing hero on the home card and `/services`.
  - `IMG-20260729-WA0028` (near-duplicate framing of WA0016, same vehicle) and
    `IMG-20260729-WA0014` (cargo area) / `IMG-20260729-WA0056` (passenger-side
    seats) — in `CAR_CABIN`, driving the new **"Inside the car"** wall on
    `/gallery` (`<PhotoGrid items={CAR_CABIN_WORK} />`, next to the existing
    truck wall). WA0028 needed the same rear-view-mirror-pendant crop as
    WA0016 — see `CROP_TOP` in the script; the client's `/gallery` background
    photo (`/images/bg.jpg`) is unrelated to this and untouched.
  - `IMG-20260729-WA0043` and `IMG-20260729-WA0053` — in `HELD_BACK`, excluded
    from everything. WA0043 shows a child car-seat in the back (real personal/
    family information, not just an interior shot); WA0053 is a debris-covered
    floor mat with no matching clean shot to pair it with, so alone it reads
    as a "before," not a showcase "after."
  **Publishing consent for the vehicle itself is still unconfirmed** — now
  covering four photos across two pages instead of one. Get that confirmed
  before launch; if the answer is no, all four pull from
  `scripts/gen-gallery.mjs`'s `CAR_CABIN` set (+ the separate hero derivatives
  for WA0016) and can come down together. `auto.webp`, the original stock
  photo the hero replaced, is left in place unused for exactly this reason.
- **Two photos in the drop are rooms in a house**, not vehicles: a living
  room (`IMG-20260729-WA0048`) and a bedroom with an area rug
  (`IMG-20260729-WA0038`). Both excluded. Worth checking whether they were
  sent by mistake, or whether the client also does home/upholstery and rug
  cleaning — neither is on the site.
- **The struck-out tint package.** The client's tint sheet listed a fourth
  package at **$119** whose name was crossed out and unreadable. A price with no
  service attached can't go on the site, so it is omitted from
  `/src/data/tintPricing.js` — confirm what it was, or that it's discontinued.
  A test asserts "119" never appears in the pricing block.
- **Paint Correction and Ceramic Coating now run on stock photography, not
  client work.** Both cards on `<ServiceCards />` (see §4) briefly fell back
  to a plain lucide icon; at the owner's request they now show real photos
  instead — a technician machine-polishing a car (Paint Correction) and
  water beading on paint (Ceramic Coating), both License-free Unsplash stock
  (same terms as the site's other stock photos), saved at
  `src/assets/photos/paint-correction*.webp` and `ceramic-coating*.webp`.
  Same open question as the rest of the site's stock imagery: swap for real
  photos of the client's own correction/coating jobs whenever those exist —
  a glossy "after" shot or beaded-water photo of an actual client vehicle
  would outsell generic stock the same way the real cab/SUV photos already
  outsold the auto-detailing stock shot elsewhere on the site.
- **Every price on the site is currently hidden by owner request** (see §1's
  pricing history) — this note is about which ones are *known but hidden* vs.
  *never supplied at all*, in case pricing display comes back a fifth time.
  **Known, just hidden:** every Auto Detailing tier/add-on
  (`/src/data/packages.js`) and every Window Tinting tier/add-on
  (`/src/data/tintPricing.js`) — each carries its real figure in a trailing
  comment (`price: null, // was $149`), so restoring them is a one-line edit
  per item. **Never supplied at all:** the three **ceramic coating** tiers
  (Factory Fresh, Everyday Shield, Complete Revival) arrived with full
  inclusion/benefit lists but no prices from the client, and all three
  **semi-truck** tiers ("Cab Essentials" → "Full Cab Detail" → "Complete Rig
  Detail") were built with no client-supplied price sheet for rig work at all
  — those two groups need real numbers *sourced*, not just un-hidden, before
  they could ever show a figure. Separately, if rig pricing genuinely can't be
  tiered (sizes and condition vary too much, the original reason semi-truck
  stayed quote-only), the three-tier menu could collapse back to a single flat
  "What's included" list plus one "Request a quote" CTA — worth confirming
  either way, independent of the current hide-everything decision.
- **One truncated line in the Decontamination package.** The source read
  "Decontaminate paint to remove minor" and stopped. It is published as
  "Decontaminate paint to remove minor contaminants" — confirm the wording.
- **The carbon vs. ceramic percentage lists.** The client's reference material
  says "CARBON TINT IS OFFERED IN 5%, 15%, …" and "CERAMIC TINT IS OFFERED IN
  5%, 20%, …" but both lists were cut off. `FILM_NOTE` in
  `/src/data/tintLevels.js` currently says only that both films exist and the
  match is confirmed at quote time. Once the real lists arrive, give each level
  a `films: [...]` array and surface it per selection.
- **Whether front-window tint copy needs legal review.** `FILM_NOTE` says
  front-window tint "is regulated in Alberta" without stating a limit, which is
  true and non-committal. Confirm the client is happy with that framing before
  launch.
- ~~A semi-truck photo showing **cab interior** work.~~ — **received,
  and topped up.** The client's original drop was 98 shots, of which **90
  were semi-truck cab interiors** (floors, bunks, dashes, fridges, storage);
  the other eight travelled with it and are not trucks — six frames of one
  tan-leather SUV, plus a living room and a bedroom — and are listed in
  `NOT_A_VEHICLE`/`CAR_CABIN`/`HELD_BACK` in `scripts/gen-gallery.mjs`. A
  second drop of 50 more shots (a WhatsApp forward/share export — filenames
  like "WhatsApp Image 2026-09-09 at 22.58.49 (1).jpeg" rather than the
  original set's "IMG-20260729-WA0026.jpg" pattern) landed later and was
  eyeballed the same way: all 50 are cab interiors too (dash, seats, sleeper
  bunk, storage, wiring), nothing needed excluding. **140 cab-interior photos
  now drive** the "Inside the cab" photo wall on the Gallery page
  (`<PhotoGrid />` + `/src/data/cabWork.js`). That second drop is also what
  exposed a real bug: the pipeline was writing derivative filenames (and the
  URLs pointing at them) straight from the raw stem, which is fine for
  filenames the client's phone already makes URL-safe but broke as soon as a
  stem had a space or a parenthesis in it. Fixed by slugifying before a
  filename is ever written — see the Photo pipeline note above.
  One follow-up remains: (a) ~~the **Services** page semi-truck still is
  unchanged — it's an engine-bay/chrome shot~~ — **done.** Both the home
  service card (`<ServiceCards />`, `WA0026`) and the Services page hero
  (`PHOTOS['semi-truck-detailing']` in `Services.jsx`, `WA0012`) now show real
  cab interiors, each a different rig so the two spots don't repeat a photo.
  `WA0012` is exactly 4:3, matching `.service-detail__media` with no cropping.
  The stock `assets/photos/semi-truck.webp` this replaced is now unused —
  fine to delete once confirmed nothing else needs it. (b) **Checked across
  all 148 photos from both drops: no usable before/after pairs.** Every
  photo was compared against every other by normalised structural signature;
  re-run after the second, 50-photo drop landed, same conclusion both times.
  The only frames similar enough to be the same fixed spot are near-duplicate
  angles of the same already-finished state (e.g. `WA0012` ↔ `WA0017`, the
  same cab a few inches apart) — none of the 50 new photos paired with
  anything, old or new. The closest thing to a real candidate is `WA0099`
  (messy footwell) → `WA0052` (same cab, clean), but the camera moved between
  them, so a wipe-slider would jump. The dirtiest frame in the set, `WA0075`,
  has no clean counterpart at all. So it stays a flat wall unless the client
  shoots matched pairs from a fixed position, or generates the "after"
  halves. Shortlist of the best "before" frames for that:
  `WA0075 · WA0013 · WA0099 · WA0081 · WA0091 · WA0059 · WA0103 · WA0065`
  (dirt) and `WA0072 · WA0039 · WA0055 · WA0045 · WA0058 · WA0036` (clutter).
  If pairs ever exist they'd be far stronger as
  `<BeforeAfter />` entries in `data/gallery.js`.
- Whether quote form submissions should go to email, a form service, or a
  real backend