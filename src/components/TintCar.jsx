import { useId } from 'react'

/*
 * Side-profile sports sedan, drawn as vector so the glass can be tinted
 * independently of the body — that separation is the whole point of the
 * component. <TintSimulator /> passes `filmOpacity` (0–1) and everything
 * behind the greenhouse darkens with it.
 *
 * Why a pearl-silver body: the tint effect only reads if the glass has
 * something bright to contrast against. On the site's #17191A base a dark car
 * would swallow the 5% state entirely — you'd see one black shape at every
 * level. Silver also sidesteps the brand rule that orange and cyan are UI
 * colours, not decoration; cyan appears here only as a rim light along the
 * roof edge, which is the "icon highlight" use CLAUDE.md §2 allows.
 *
 * Geometry: 1200×500 viewBox. Rocker line y≈352, wheels centred at (294, 348)
 * and (931, 348) with r=84, tyres meeting the floor at y=432 — the last 68px
 * are the studio-floor reflection.
 *
 * Paint order matters twice over:
 *  - The wheel-arch openings are cut inside the body's clip, so the WHEELS
 *    must be painted after the body. Draw them first and the arch fill covers
 *    the top of each tyre, which turns the openings into black craters.
 *  - GREENHOUSE is one closed path shared by the film, the sheen and the
 *    chrome trim, and the pillars are painted opaque *over* the film. That's
 *    what splits the glass into front-door / rear-door / quarter panes without
 *    three separately-maintained pane outlines drifting out of alignment.
 */

const GREENHOUSE = 'M496 218 L604 140 L818 138 L975 188 Z'

const BODY =
  'M140 318 C130 296 128 268 136 250 C140 240 144 237 148 236 ' +
  'C214 230 272 226 326 224 C394 219 440 214 472 210 ' +
  'L592 128 C650 119 712 118 820 126 ' +
  'C892 142 962 166 1024 186 L1076 190 ' +
  'C1098 193 1110 204 1116 222 C1124 248 1123 296 1112 328 ' +
  'L1030 344 L700 352 L380 352 L200 344 C160 338 148 330 140 318 Z'

// Pillars, front to back. Opaque, painted over the film.
const PILLARS = [
  'M496 218 L604 140 L642 139.6 L554 214.4 Z', // A-pillar
  'M690 139.2 L706 139 L706 204.8 L690 205.9 Z', // B-pillar
  'M846 146.9 L860 151.4 L860 195.2 L846 196.1 Z', // quarter-glass divider
  'M904 165 L975 188 L904 192.5 Z', // C-pillar
]

// Wheel openings. Radius clears the tyre by only 12px — any looser and the
// arch stops reading as an opening and starts reading as a hole in the car.
const ARCH_FRONT = 'M198 352 A96 96 0 0 1 390 352'
const ARCH_REAR = 'M835 352 A96 96 0 0 1 1027 352'

const WHEELS = [294, 931]
const WHEEL_Y = 348
const SPOKE_ANGLES = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324]
const LUG_ANGLES = [0, 72, 144, 216, 288]

/*
 * Deliberately no tread blocks: dead side-on you see the sidewall, and the
 * tread only ever shows edge-on at the contact patch. Ringing the tyre with
 * dashes makes it read as a cog, not a wheel. What sells rubber here is the
 * shoulder shadow, the bead step and a soft sheen on the upper sidewall.
 *
 * The disc drilling IS a dashed stroke — one element instead of ~20 paths per
 * wheel — with the gap sized to divide the circumference evenly so the pattern
 * doesn't leave a visible seam at 3 o'clock.
 */
function Wheel({ cx, cy, uid }) {
  return (
    <g>
      {/* tyre: carcass, shoulder shadow, bead step, sidewall sheen */}
      <circle cx={cx} cy={cy} r="84" fill={`url(#${uid}-tire)`} />
      <circle cx={cx} cy={cy} r="76" fill="none" stroke="#000" strokeOpacity="0.32" strokeWidth="5" />
      <circle
        cx={cx}
        cy={cy}
        r="74"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.11"
        strokeWidth="6"
        strokeDasharray="86 400"
        strokeLinecap="round"
        transform={`rotate(-158 ${cx} ${cy})`}
      />
      <circle cx={cx} cy={cy} r="70" fill="none" stroke="#262c30" strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r="66" fill="#0b0d0f" />

      {/* rim barrel */}
      <circle cx={cx} cy={cy} r="59" fill={`url(#${uid}-rim)`} />
      <circle cx={cx} cy={cy} r="51" fill="#0f1214" />

      {/* drilled disc + caliper, glimpsed between the spokes */}
      <circle cx={cx} cy={cy} r="38" fill="#242a2f" />
      <circle
        cx={cx}
        cy={cy}
        r="31"
        fill="none"
        stroke="#353d44"
        strokeWidth="7"
        strokeDasharray="3 7.82"
      />
      <rect x={cx - 9} y={cy - 45} width="18" height="29" rx="6" fill="#3a434b" />

      {/* spokes — each carries a shaded trailing face so they read as formed
          metal rather than flat wedges */}
      {SPOKE_ANGLES.map((a) => (
        <g key={a} transform={`translate(${cx} ${cy}) rotate(${a})`}>
          <path d="M-6.5 -18 L-10.5 -53 L10.5 -53 L6.5 -18 Z" fill={`url(#${uid}-spoke)`} />
          <path d="M1 -18 L1 -53 L10.5 -53 L6.5 -18 Z" fill="#000" fillOpacity="0.22" />
        </g>
      ))}

      {/* hub, lug nuts, centre cap */}
      <circle cx={cx} cy={cy} r="27" fill={`url(#${uid}-hub)`} />
      {LUG_ANGLES.map((a) => (
        <circle
          key={a}
          cx={cx}
          cy={cy - 18}
          r="3.6"
          fill="#2b3238"
          transform={`rotate(${a} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r="9" fill="#333b42" />
      <circle
        cx={cx}
        cy={cy}
        r="9"
        fill="none"
        stroke="#9aa2aa"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />

      {/* lip, plus the specular arc that sells it as polished alloy */}
      <circle
        cx={cx}
        cy={cy}
        r="59"
        fill="none"
        stroke="#8b939b"
        strokeOpacity="0.6"
        strokeWidth="2.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r="59"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.32"
        strokeWidth="3"
        strokeDasharray="95 300"
        strokeLinecap="round"
        transform={`rotate(-150 ${cx} ${cy})`}
      />
      <circle cx={cx} cy={cy} r="84" fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="2" />
    </g>
  )
}

export default function TintCar({ filmOpacity, label }) {
  // Namespaced so the gradient ids can never collide with another instance.
  const uid = `tc${useId().replace(/:/g, '')}`

  return (
    <svg
      className="tint-car"
      viewBox="0 0 1200 500"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* --- paint ---
            Stops are tuned against the body's own bounding box (the gradient
            is painted onto a rect matching it), so 0 = roof and 1 = rocker.
            The dip at 57% is the reflection horizon — the band where a real
            car's flank stops mirroring sky and starts mirroring dark ground —
            and the lift at 66% is light bouncing back off the floor. Losing
            either one is what makes flat vector cars look like stickers. */}
        <linearGradient id={`${uid}-paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="7%" stopColor="#eff3f7" />
          <stop offset="26%" stopColor="#d9e0e6" />
          <stop offset="38%" stopColor="#c1cad2" />
          <stop offset="48%" stopColor="#96a0aa" />
          <stop offset="57%" stopColor="#5d666e" />
          <stop offset="66%" stopColor="#8d959e" />
          <stop offset="78%" stopColor="#69717a" />
          <stop offset="90%" stopColor="#434a52" />
          <stop offset="100%" stopColor="#2a2f35" />
        </linearGradient>
        <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="34%" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="62%" stopColor="#fff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-beltshade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>

        {/* --- glass --- */}
        <clipPath id={`${uid}-glass`}>
          <path d={GREENHOUSE} />
        </clipPath>
        <linearGradient id={`${uid}-cabin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b434d" />
          <stop offset="100%" stopColor="#171a1e" />
        </linearGradient>
        {/* Daylight coming through the far-side windows. This is the thing tint
            actually takes away, so it does most of the work of selling the
            effect as the film opacity climbs. */}
        <linearGradient id={`${uid}-daylight`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c6d2dc" stopOpacity="0" />
          <stop offset="22%" stopColor="#ccd7e0" stopOpacity="0.88" />
          <stop offset="70%" stopColor="#bcc8d3" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#b4c1cc" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-sheen`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="17%" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="25%" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="33%" stopColor="#fff" stopOpacity="0.03" />
          <stop offset="56%" stopColor="#fff" stopOpacity="0" />
          <stop offset="67%" stopColor="#fff" stopOpacity="0.13" />
          <stop offset="75%" stopColor="#fff" stopOpacity="0.01" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-pillar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#333a41" />
          <stop offset="100%" stopColor="#13161a" />
        </linearGradient>
        <linearGradient id={`${uid}-chrome`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2f6f9" />
          <stop offset="55%" stopColor="#b3bcc4" />
          <stop offset="100%" stopColor="#7d868e" />
        </linearGradient>

        {/* --- wheels --- */}
        <linearGradient id={`${uid}-tire`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#2c3034" />
          <stop offset="45%" stopColor="#16191c" />
          <stop offset="100%" stopColor="#08090b" />
        </linearGradient>
        <linearGradient id={`${uid}-rim`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#a5aeb6" />
          <stop offset="50%" stopColor="#5e666e" />
          <stop offset="100%" stopColor="#2b3136" />
        </linearGradient>
        <linearGradient id={`${uid}-spoke`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b6bfc7" />
          <stop offset="55%" stopColor="#7d858e" />
          <stop offset="100%" stopColor="#3e454c" />
        </linearGradient>
        <radialGradient id={`${uid}-hub`}>
          <stop offset="0%" stopColor="#c0c8cf" />
          <stop offset="100%" stopColor="#4b525a" />
        </radialGradient>

        {/* Wheel wells read as depth, not as flat holes, when the opening is
            darkest at the top where the arch overhangs. */}
        <radialGradient id={`${uid}-well`} cx="0.5" cy="1" r="0.95">
          <stop offset="0%" stopColor="#1a1e22" />
          <stop offset="100%" stopColor="#06080a" />
        </radialGradient>

        {/* --- lighting + trim --- */}
        <linearGradient id={`${uid}-headlight`} x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e2f2fb" />
          <stop offset="100%" stopColor="#8ea5b3" />
        </linearGradient>
        <radialGradient id={`${uid}-projector`}>
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#cfe6f4" />
          <stop offset="100%" stopColor="#6d8494" />
        </radialGradient>
        <linearGradient id={`${uid}-taillight`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3d4348" />
          <stop offset="100%" stopColor="#191d20" />
        </linearGradient>
        <linearGradient id={`${uid}-handle`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ccd4db" />
          <stop offset="55%" stopColor="#838c94" />
          <stop offset="100%" stopColor="#4b535a" />
        </linearGradient>
        <radialGradient id={`${uid}-halo`}>
          <stop offset="0%" stopColor="#2BAFE5" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#2BAFE5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-shadow`}>
          <stop offset="0%" stopColor="#000" stopOpacity="0.62" />
          <stop offset="62%" stopColor="#000" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        {/* Only 68px of floor sits below the tyres, which is just enough to
            mirror the wheels and rocker — the most convincing part of a
            reflection anyway, and far cheaper than flipping the whole car. */}
        <linearGradient id={`${uid}-reflfade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${uid}-refl`}>
          <rect x="0" y="432" width="1200" height="68" fill={`url(#${uid}-reflfade)`} />
        </mask>

        <clipPath id={`${uid}-body`}>
          <path d={BODY} />
        </clipPath>
      </defs>

      <ellipse cx="600" cy="250" rx="620" ry="245" fill={`url(#${uid}-halo)`} />

      {/* floor reflection, mirrored about the tyre contact line (y=432) */}
      <g mask={`url(#${uid}-refl)`}>
        <g transform="translate(0 864) scale(1 -1)">
          <path d={BODY} fill="#79838d" />
          {WHEELS.map((cx) => (
            <circle key={cx} cx={cx} cy={WHEEL_Y} r="84" fill="#14171a" />
          ))}
        </g>
      </g>

      <ellipse cx="628" cy="434" rx="440" ry="26" fill={`url(#${uid}-shadow)`} />
      <ellipse cx="628" cy="440" rx="375" ry="11" fill="#2BAFE5" opacity="0.06" />

      {/* ---------- body ---------- */}
      <g clipPath={`url(#${uid}-body)`}>
        <rect x="138" y="113" width="980" height="241" fill={`url(#${uid}-paint)`} />
        <rect x="138" y="113" width="980" height="241" fill={`url(#${uid}-gloss)`} />

        {/* fender crown + rear haunch — the two places light pools on a sedan */}
        <ellipse cx="294" cy="238" rx="150" ry="40" fill="#fff" opacity="0.15" />
        <ellipse cx="956" cy="264" rx="170" ry="70" fill="#fff" opacity="0.12" />

        {/* glass reflects down onto the shoulder */}
        <rect x="464" y="214" width="654" height="28" fill={`url(#${uid}-beltshade)`} />

        {/* wheel openings */}
        <path d={`${ARCH_FRONT} Z`} fill={`url(#${uid}-well)`} />
        <path d={`${ARCH_REAR} Z`} fill={`url(#${uid}-well)`} />

        {/* shoulder + character lines */}
        <path
          d="M472 234 C630 226 860 226 1104 242"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.5"
          strokeWidth="2.5"
        />
        <path
          d="M186 288 C450 276 820 272 1104 284"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.4"
          strokeWidth="2.5"
        />
        <path
          d="M186 293 C450 281 820 277 1104 289"
          fill="none"
          stroke="#000"
          strokeOpacity="0.18"
          strokeWidth="3"
        />

        {/* door shut lines */}
        <path
          d="M490 226 C486 278 484 314 486 350"
          fill="none"
          stroke="#000"
          strokeOpacity="0.32"
          strokeWidth="2"
        />
        <path
          d="M696 216 C692 272 690 312 692 352"
          fill="none"
          stroke="#000"
          strokeOpacity="0.32"
          strokeWidth="2"
        />
        <path
          d="M850 206 C846 260 844 298 846 346"
          fill="none"
          stroke="#000"
          strokeOpacity="0.32"
          strokeWidth="2"
        />

        {/* Panel seams. A car in side profile is mostly read through its shut
            lines — hood to fender, fender to bumper, quarter to bumper — so
            these matter more to the "it's a real car" impression than any
            amount of extra shading. */}
        <path
          d="M252 238 C312 232 400 225 466 218"
          fill="none"
          stroke="#000"
          strokeOpacity="0.2"
          strokeWidth="1.8"
        />
        <path
          d="M190 246 C185 274 186 300 192 326"
          fill="none"
          stroke="#000"
          strokeOpacity="0.26"
          strokeWidth="1.8"
        />
        <path
          d="M1038 250 C1044 280 1044 306 1038 330"
          fill="none"
          stroke="#000"
          strokeOpacity="0.26"
          strokeWidth="1.8"
        />

        {/* fender gill behind the front arch */}
        <path d="M406 272 L446 267 L444 279 L404 283 Z" fill="#0f1214" fillOpacity="0.55" />
        <path d="M406 272 L446 267" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />

        {/* fuel filler door on the rear quarter */}
        <rect
          x="882"
          y="232"
          width="28"
          height="24"
          rx="5"
          fill="none"
          stroke="#000"
          strokeOpacity="0.34"
          strokeWidth="1.6"
        />
        <path d="M882 244 L889 244" stroke="#000" strokeOpacity="0.3" strokeWidth="1.6" />

        {/* rocker / side skirt, with a chrome sliver along its top edge */}
        <path d="M370 338 L840 344 L836 354 L372 352 Z" fill="#000" fillOpacity="0.4" />
        <path
          d="M372 337 L840 343"
          fill="none"
          stroke="#cfd8df"
          strokeOpacity="0.3"
          strokeWidth="2"
        />

        {/* front intake + rear diffuser */}
        <path
          d="M140 306 C166 300 200 298 232 300 L228 328 C192 332 156 326 142 320 Z"
          fill="#0f1214"
          fillOpacity="0.92"
        />
        <path d="M1006 326 L1096 318 L1092 334 L1008 342 Z" fill="#0f1214" fillOpacity="0.85" />

        {/* front splitter lip */}
        <path
          d="M142 326 C174 334 212 337 240 335 L238 343 C208 345 172 342 144 334 Z"
          fill="#0b0e10"
          fillOpacity="0.9"
        />
      </g>

      <path d={BODY} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="2" />

      {/* arch lips sit above the body but below the wheels */}
      <path d={ARCH_FRONT} fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d={ARCH_REAR} fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="2.5" />

      {WHEELS.map((cx) => (
        <ellipse key={`c${cx}`} cx={cx} cy={WHEEL_Y + 84} rx="58" ry="7" fill="#000" opacity="0.55" />
      ))}
      {WHEELS.map((cx) => (
        <Wheel key={cx} cx={cx} cy={WHEEL_Y} uid={uid} />
      ))}

      {/* cyan rim light along the A-pillar and roof — identity accent only */}
      <path
        d="M472 210 L592 128 C650 119 712 118 820 126"
        fill="none"
        stroke="#2BAFE5"
        strokeOpacity="0.28"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* ---------- glass ---------- */}
      <g clipPath={`url(#${uid}-glass)`}>
        <rect x="470" y="118" width="530" height="105" fill={`url(#${uid}-cabin)`} />
        <rect x="530" y="134" width="420" height="34" fill={`url(#${uid}-daylight)`} />
        {/* door cards below the glass line and the rear parcel shelf — the
            cabin needs a floor and a back wall or the seats look like they're
            floating in a void once the film lightens */}
        <rect x="486" y="198" width="504" height="28" fill="#0d1013" fillOpacity="0.6" />
        <rect x="846" y="180" width="144" height="12" fill="#39414a" />
        {/* cabin furniture, so a light tint has something to reveal */}
        <path
          d="M556 216 L600 204 L646 199"
          fill="none"
          stroke="#232a30"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <rect x="648" y="148" width="22" height="10" rx="4" fill="#252c33" />
        <path
          d="M558 216 A22 20 0 0 1 596 207"
          fill="none"
          stroke="#4e5761"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M606 216 L610 192 L648 192 L652 216 Z" fill="#3e4650" />
        <path d="M610 194 L610 170 C610 160 618 154 628 154 C638 154 646 160 646 170 L646 194 Z" fill="#4e5761" />
        <path d="M752 206 L756 188 L790 188 L794 206 Z" fill="#3e4650" />
        <path d="M756 190 L756 168 C756 159 763 154 772 154 C781 154 788 159 788 168 L788 190 Z" fill="#4e5761" />
      </g>

      {/* the film itself — the one animated element */}
      <path
        className="tint-car__film"
        d={GREENHOUSE}
        fill="#04060a"
        style={{ opacity: filmOpacity }}
      />

      {/* reflections sit above the film: dark glass is still glossy */}
      <path d={GREENHOUSE} fill={`url(#${uid}-sheen)`} opacity="0.55" />

      {PILLARS.map((d) => (
        <path key={d} d={d} fill={`url(#${uid}-pillar)`} />
      ))}

      <path
        d={GREENHOUSE}
        fill="none"
        stroke={`url(#${uid}-chrome)`}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />

      {/* ---------- lamps ----------
          Both clusters are built the same way: a dark housing, the lit
          elements inside it, then a glass sheen over the whole lens. A single
          flat shape reads as a sticker; the housing is what gives it depth. */}
      <path
        d="M152 242 C180 236 212 233 238 231 L250 242 C222 249 188 256 156 260 Z"
        fill="#1e262c"
      />
      <ellipse cx="228" cy="241" rx="9.5" ry="7" fill={`url(#${uid}-projector)`} />
      <ellipse cx="203" cy="245" rx="8.5" ry="6.4" fill={`url(#${uid}-projector)`} />
      <ellipse cx="228" cy="241" rx="3.4" ry="2.6" fill="#fff" />
      <ellipse cx="203" cy="245" rx="3" ry="2.3" fill="#fff" />
      <path
        d="M158 245 C184 240 212 237 236 235"
        fill="none"
        stroke="#eaf6ff"
        strokeOpacity="0.95"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M152 242 C180 236 212 233 238 231 L250 242 C222 249 188 256 156 260 Z"
        fill={`url(#${uid}-headlight)`}
        opacity="0.34"
      />
      <path d="M1042 214 L1108 225 L1106 248 L1040 240 Z" fill="#12171a" />
      <path d="M1046 219 L1102 229 L1101 243 L1045 235 Z" fill={`url(#${uid}-taillight)`} />
      <path
        d="M1049 224 L1098 233"
        fill="none"
        stroke="#dfe8ef"
        strokeOpacity="0.8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M1051 237 L1068 240"
        fill="none"
        stroke="#c9d3da"
        strokeOpacity="0.45"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* ---------- trim ---------- */}
      {/* Shark-fin antenna, sitting at the back of the roof where a real one
          goes. Both base points are solved against the roof Bézier (y=123 at
          x=774, y=126 at x=818) — float either one by even a few units and it
          reads as a broken panel hanging off the roof rather than a fin. */}
      <path d="M774 123 C792 112 806 105 814 105 L818 126 Z" fill="#333b43" />
      <path
        d="M774 123 C792 112 806 105 814 105"
        fill="none"
        stroke="#8b939b"
        strokeOpacity="0.35"
        strokeWidth="1.4"
      />

      {/* wiper resting on the cowl */}
      <path
        d="M474 214 L506 207"
        fill="none"
        stroke="#181c20"
        strokeOpacity="0.75"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* door mirror on its stalk */}
      <path d="M474 213 L466 211 L465 221 L476 223 Z" fill="#3d444b" />
      <path
        d="M466 205 C450 203 437 206 434 213 C432 219 440 224 453 224 C464 224 469 219 468 212 Z"
        fill={`url(#${uid}-handle)`}
      />
      <path
        d="M462 208 C450 207 441 209 439 213 C438 217 444 220 453 220 C461 220 465 216 464 211 Z"
        fill="#20262b"
        fillOpacity="0.7"
      />

      {/* recessed door handles */}
      <rect x="616" y="230" width="50" height="13" rx="6" fill="#000" fillOpacity="0.25" />
      <rect x="618" y="232" width="46" height="9" rx="4.5" fill={`url(#${uid}-handle)`} />
      <rect x="764" y="222" width="50" height="13" rx="6" fill="#000" fillOpacity="0.25" />
      <rect x="766" y="224" width="46" height="9" rx="4.5" fill={`url(#${uid}-handle)`} />

      {/* exhaust tips, drawn outside the body clip so they hang below it */}
      {[1036, 1068].map((ex, i) => (
        <g key={ex}>
          <ellipse cx={ex} cy={345 - i * 3} rx="12" ry="5" fill="#15191c" />
          <ellipse
            cx={ex}
            cy={345 - i * 3}
            rx="12"
            ry="5"
            fill="none"
            stroke="#9aa3ab"
            strokeOpacity="0.45"
            strokeWidth="1.8"
          />
        </g>
      ))}
    </svg>
  )
}
