# Blowdust — The Auto Avenue

Marketing site for a Calgary mobile detailing company (semi-truck detailing,
auto detailing, window tinting). React + Vite + React Router, plain CSS,
Framer Motion for all animation (loaded via LazyMotion so the engine stays
out of the critical bundle). Full brief: [CLAUDE.md](./CLAUDE.md) — note the
brief's §5 motion spec predates the switch from GSAP to Framer Motion.

## Commands

```sh
npm run dev          # dev server
npm run build        # production build → dist/
npm run preview      # serve dist/ on :4173
npm run lint         # oxlint
npx playwright test  # e2e tests (builds & serves automatically)
```

## Structure

- `src/data/site.js` — every business fact (phone, hours, socials). All
  launch-blocking TODOs are marked `TODO(client)` here and in components.
- `src/data/{services,gallery,testimonials}.js` — page content.
- `src/lib/fm.jsx` — Framer Motion reveal/stagger primitives and
  `prefers-reduced-motion` handling; `src/lib/motionFeatures.js` is the
  async-loaded animation engine (domMax).
- `src/assets/placeholders/` — generated SVG stand-ins for the client's real
  photography. Every one is stamped "PLACEHOLDER".

## Before launch (client input needed)

1. Real phone number (`src/data/site.js` — currently a 555 placeholder)
2. Business hours (placeholder — verify Google listing)
3. Real photos: hero semi-truck shot + before/after pairs (replace
   `src/assets/placeholders/*`; hero should be WebP, <200KB at mobile width)
4. Real testimonials (`src/data/testimonials.js`)
5. Social media URLs (`src/data/site.js`)
6. Exact domain name, then deploy (Netlify `_redirects` and `vercel.json`
   SPA rewrites are both included)
7. Quote form submission endpoint — see TODO in
   `src/components/QuoteForm.jsx` (Formspree vs Apps Script vs backend)
8. SVG/vector logo (current `public/logo.png` is 1015×600 raster)
