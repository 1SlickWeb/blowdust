/**
 * Build WebP derivatives for the client's photo drop and emit two data
 * files: src/data/cabWork.js (semi-truck cab interiors) and
 * src/data/carCabinWork.js (the smaller, separately-curated car-interior
 * set — see CAR_CABIN below). Re-runnable — skips nothing, just regenerates.
 *
 *   npm run gallery
 */
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'public/images/gallery')
const OUT_DIR = path.join(SRC_DIR, 'opt')
const CAB_DATA_FILE = path.join(ROOT, 'src/data/cabWork.js')
const CAR_CABIN_DATA_FILE = path.join(ROOT, 'src/data/carCabinWork.js')

const THUMB_W = 700 // grid tile
const FULL_W = 1400 // lightbox

/*
 * Photos in the drop that are NOT semi-truck cab interiors, and so must stay
 * out of the truck wall on /gallery. The set arrived unlabelled and a few
 * frames from other jobs travelled with it — six are the same tan-leather
 * SUV (a real auto-detail job, wrong gallery); two are rooms in a house, not
 * vehicles at all. Keyed by lower-cased filename stem.
 *
 * Two are not vehicles at all — excluded everywhere, permanently.
 */
const NOT_A_VEHICLE = new Set([
  'img-20260729-wa0048', // living room — sofa and coffee table, no vehicle
  'img-20260729-wa0038', // home bedroom — bed, dresser, area rug on hardwood
])

/*
 * The six SUV frames, individually reviewed for the new "car cabins" wall —
 * not every real photo is fit to publish, even excluding stock. Three make
 * the cut; three are held back (not deleted — see the comments):
 *
 *  - wa0016 has its own bespoke, pre-cropped derivatives already
 *    (src/assets/photos/auto-interior*.webp, used as the Auto Detailing hero
 *    on the home card and /services) — reusing it again here would repeat the
 *    same photo across the site. wa0028 is a near-duplicate of it anyway
 *    (same vehicle, same angle), so it stands in for both.
 *  - wa0043 shows a child car-seat in the back — real personal/family
 *    information about the client's customer, not just an interior shot.
 *  - wa0053 is a debris-covered floor mat — a "before" not an "after"; there
 *    is no matching clean shot of the same area to pair it with (see the
 *    before/after investigation elsewhere in this file's history), so on its
 *    own it undercuts the showcase rather than adding to it.
 *
 * wa0028 needs CROP_TOP below: the source shows a rear-view-mirror pendant
 * hanging in frame, the same issue the hero photo had — see CROP_TOP.
 */
const CAR_CABIN = new Set([
  'img-20260729-wa0014', // SUV cargo area, rear seats folded
  'img-20260729-wa0028', // SUV front seats + dash (cropped — see CROP_TOP)
  'img-20260729-wa0056', // SUV front seats, passenger-side angle
])

const HELD_BACK = new Set([
  'img-20260729-wa0016', // used elsewhere already — see comment above
  'img-20260729-wa0043', // child car-seat visible — personal/family info
  'img-20260729-wa0053', // debris-covered floor mat, not showcase material
])

// Pixels to trim off the TOP of a source photo before it's resized, keyed by
// stem. Only wa0028 needs it right now: the crop clears a rear-view-mirror
// pendant near the top of the frame while keeping the wheel and dash intact
// (worked out empirically — see the session history for the wa0016 hero crop
// this mirrors). Baked into the generated derivative itself, not CSS, so the
// pendant can't resurface at some width/aspect this file wasn't checked at —
// and the lightbox, which shows the "full" derivative with no further crop,
// stays clean too.
const CROP_TOP = {
  'img-20260729-wa0028': 260,
}

await fs.mkdir(OUT_DIR, { recursive: true })

const stemOf = (f) => path.basename(f, path.extname(f)).toLowerCase()

// The client's phone exports filenames as e.g. "IMG-20260729-WA0026.jpg" (already
// URL-safe once lower-cased) but a raw share/forward comes through as
// "WhatsApp Image 2026-09-09 at 22.58.49 (1).jpeg" — spaces and parentheses,
// which is not a name a browser can be trusted to fetch un-encoded and not a
// name any other asset on this site uses. Derivative filenames (and therefore
// the URLs written into the data file) are built from this slug, never the
// raw stem — NOT_A_VEHICLE/CAR_CABIN/HELD_BACK/CROP_TOP stay keyed by stem
// since every existing entry there is already slug-shaped.
const slugOf = (stem) => stem.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const allJpegs = (await fs.readdir(SRC_DIR))
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort()

const bytes = { thumb: 0, full: 0 }

/** Generate thumb+full WebP derivatives for one file, honouring CROP_TOP. */
async function processFile(file) {
  const stem = stemOf(file)
  const slug = slugOf(stem)
  const abs = path.join(SRC_DIR, file)
  const cropTop = CROP_TOP[stem]

  const thumbPath = path.join(OUT_DIR, `${slug}-${THUMB_W}.webp`)
  const fullPath = path.join(OUT_DIR, `${slug}-${FULL_W}.webp`)

  // .rotate() with no args applies the EXIF orientation (phone photos). A
  // CROP_TOP entry is baked in here, before either derivative is cut, so a
  // trimmed frame (see the wa0028 comment above) can never be undone by
  // resizing the "original" — there is no other copy once this runs. sharp
  // needs the post-rotation pixel dimensions to build a valid extract region
  // (rotate() is lazy — it doesn't report the rotated size until read back),
  // so this reads metadata once up front rather than guessing a width.
  let cropRegion = null
  if (cropTop) {
    const rotated = await sharp(abs).rotate().toBuffer({ resolveWithObject: true })
    cropRegion = {
      left: 0,
      top: cropTop,
      width: rotated.info.width,
      height: rotated.info.height - cropTop,
    }
  }
  const base = () => {
    const img = sharp(abs).rotate()
    return cropRegion ? img.extract(cropRegion) : img
  }

  const thumbInfo = await base()
    .resize({ width: THUMB_W, withoutEnlargement: true })
    .webp({ quality: 70, effort: 5 })
    .toFile(thumbPath)

  const fullInfo = await base()
    .resize({ width: FULL_W, withoutEnlargement: true })
    .webp({ quality: 76, effort: 5 })
    .toFile(fullPath)

  bytes.thumb += thumbInfo.size
  bytes.full += fullInfo.size

  return {
    id: slug,
    thumb: `/images/gallery/opt/${slug}-${THUMB_W}.webp`,
    full: `/images/gallery/opt/${slug}-${FULL_W}.webp`,
    w: thumbInfo.width,
    h: thumbInfo.height,
  }
}

function writeDataFile(dataFile, { varName, pageSizeName, entries, description }) {
  const body = entries
    .map(
      (e) =>
        `  { id: '${e.id}', thumb: '${e.thumb}', full: '${e.full}', w: ${e.w}, h: ${e.h} },`,
    )
    .join('\n')

  const out = `// AUTO-GENERATED from public/images/gallery/*.jpg — do not hand-edit.
// Regenerate with \`npm run gallery\` after dropping new photos in
// (scripts/gen-gallery.mjs — see NOT_A_VEHICLE / CAR_CABIN / HELD_BACK there
// for which photos land in which file, and why).
//
// ${description}
// (${entries.length} shots). The originals are 1200x1600 phone JPEGs
// averaging ~260KB; these are EXIF-rotated WebP derivatives at ${THUMB_W}px
// (grid tile) and ${FULL_W}px (lightbox). \`w\`/\`h\` are the real thumb
// dimensions so every tile can reserve its exact aspect ratio before the
// bytes arrive — no layout shift, and the skeleton occupies the same box the
// photo will.

export const ${varName} = [
${body}
]

/** Tiles revealed per "View more" press (and on first paint). */
export const ${pageSizeName} = ${entries.length > 12 ? 12 : entries.length}
`
  return fs.writeFile(dataFile, out, 'utf8')
}

// ---------- semi-truck cab interiors (the large set) ----------
const truckFiles = allJpegs.filter((f) => {
  const stem = stemOf(f)
  return !NOT_A_VEHICLE.has(stem) && !CAR_CABIN.has(stem) && !HELD_BACK.has(stem)
})
const truckEntries = []
for (const file of truckFiles) truckEntries.push(await processFile(file))
await writeDataFile(CAB_DATA_FILE, {
  varName: 'CAB_WORK',
  pageSizeName: 'CAB_WORK_PAGE_SIZE',
  entries: truckEntries,
  description: "Client's semi-truck cab-interior photo set",
})

// ---------- car cabins (the small, hand-curated set) ----------
const carCabinFiles = allJpegs.filter((f) => CAR_CABIN.has(stemOf(f)))
const carCabinEntries = []
for (const file of carCabinFiles) carCabinEntries.push(await processFile(file))
await writeDataFile(CAR_CABIN_DATA_FILE, {
  varName: 'CAR_CABIN_WORK',
  pageSizeName: 'CAR_CABIN_WORK_PAGE_SIZE',
  entries: carCabinEntries,
  description:
    "Client's auto-detailing car-interior photos, hand-picked from a larger drop",
})

/*
 * Prune derivatives whose source is gone or now excluded from both sets.
 * Without this an excluded (or held-back) photo keeps its WebP pair in
 * opt/, which still ships — the build plugin only strips the raw JPEGs.
 */
const keep = new Set(
  [...truckEntries, ...carCabinEntries].flatMap((e) => [
    path.basename(e.thumb),
    path.basename(e.full),
  ]),
)
let pruned = 0
for (const f of await fs.readdir(OUT_DIR)) {
  if (!f.endsWith('.webp') || keep.has(f)) continue
  await fs.unlink(path.join(OUT_DIR, f))
  pruned++
}

const totalEntries = truckEntries.length + carCabinEntries.length
const skipped = allJpegs.length - totalEntries
const mb = (n) => (n / 1048576).toFixed(1)
console.log(
  `generated ${truckEntries.length} truck + ${carCabinEntries.length} car-cabin pairs ` +
    `(${skipped} excluded/held back, pruned ${pruned} stale)`,
)
console.log(`thumbs ${mb(bytes.thumb)}MB  full ${mb(bytes.full)}MB`)
console.log(`avg thumb ${(bytes.thumb / totalEntries / 1024).toFixed(0)}KB`)
console.log(`orientations:`, JSON.stringify(
  [...truckEntries, ...carCabinEntries].reduce((a, e) => {
    const k = `${e.w}x${e.h}`
    a[k] = (a[k] || 0) + 1
    return a
  }, {}),
))
