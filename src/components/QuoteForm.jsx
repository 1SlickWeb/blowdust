import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PACKAGE_NAMES } from '../data/packages'
import { TINT_VLT_VALUES } from '../data/tintLevels'
import { TINT_PACKAGE_NAMES } from '../data/tintPricing'
import { SEMI_TRUCK_PACKAGE_NAMES } from '../data/semiTruckPricing'
import './QuoteForm.css'

const VEHICLE_TYPES = [
  'Semi-truck / rig',
  'Car / sedan',
  'SUV / crossover',
  'Pickup truck',
  'Van',
  'Fleet (multiple vehicles)',
  'Other',
]

const SERVICES_NEEDED = [
  'Semi-Truck Detailing',
  'Auto Detailing',
  'Window Tinting',
  'Multiple services',
  'Not sure — advise me',
]

const INITIAL = {
  name: '',
  phone: '',
  email: '',
  vehicleType: '',
  service: '',
  preferredDate: '',
  notes: '',
}

/*
 * Deep links into this form arrive as /contact?service=…#quote plus one of:
 *   &package=…      from the Services package menu ("Request this package")
 *   &tint=…         from the tint visualiser ("Get a quote for 20% tint")
 *   &tintPackage=…  from the tint price list ("Full Car", "2 Windows"…)
 *   &truckPackage=… from the semi-truck price list ("Complete Rig Detail"…)
 * Every param is matched against known values before use, so a hand-edited URL
 * can't inject arbitrary text into a submission — an unrecognised value is
 * simply ignored. These note sources are mutually exclusive in practice (each
 * belongs to a different service); if more than one turns up, the first
 * match below wins.
 */
function noteFor(pkg, tint, tintPackage, truckPackage) {
  if (PACKAGE_NAMES.includes(pkg)) return `I’m interested in the ${pkg}.`
  if (TINT_PACKAGE_NAMES.includes(tintPackage)) {
    return `I’m interested in window tint — ${tintPackage}.`
  }
  if (TINT_VLT_VALUES.includes(tint)) return `I’m interested in ${tint}% window tint.`
  if (SEMI_TRUCK_PACKAGE_NAMES.includes(truckPackage)) {
    return `I’m interested in semi-truck detailing — ${truckPackage}.`
  }
  return ''
}

function prefillFrom(searchParams) {
  const service = searchParams.get('service')
  return {
    ...INITIAL,
    service: SERVICES_NEEDED.includes(service) ? service : '',
    notes: noteFor(
      searchParams.get('package'),
      searchParams.get('tint'),
      searchParams.get('tintPackage'),
      searchParams.get('truckPackage'),
    ),
  }
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please tell us your name.'
  if (!values.phone.trim()) {
    errors.phone = 'We need a phone number to reach you.'
  } else if (!/^[\d\s()+-.]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'That phone number doesn’t look right.'
  }
  if (!values.email.trim()) {
    errors.email = 'We need an email for the written quote.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'That email address doesn’t look right.'
  }
  if (!values.vehicleType) errors.vehicleType = 'Select a vehicle type.'
  if (!values.service) errors.service = 'Select the service you’re after.'
  return errors
}

export default function QuoteForm() {
  const [searchParams] = useSearchParams()
  // Lazy initialiser: the prefill seeds the first render only, so it never
  // clobbers what the visitor has since typed.
  const [values, setValues] = useState(() => prefillFrom(searchParams))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((err) => ({ ...err, [field]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // TODO(client): submission endpoint. Options to confirm with the client:
    //   1. Formspree/Basin-style form service (fastest, no backend)
    //   2. Google Apps Script → email to blowdustzoneltd@gmail.com
    //   3. Real backend (overkill for v1)
    // Until then the form validates and confirms locally, but sends nothing.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="quote-form__success" role="status" data-testid="quote-success">
        <h3>Request received</h3>
        <p>
          Thanks, {values.name.split(' ')[0]} — we’ll get back to you with a
          quote as soon as we can, usually the same day.
        </p>
      </div>
    )
  }

  return (
    <form className="quote-form" onSubmit={onSubmit} noValidate data-testid="quote-form">
      <div className="quote-form__row">
        <div className="field">
          <label htmlFor="qf-name">Name *</label>
          <input
            id="qf-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={set('name')}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'qf-name-error' : undefined}
          />
          {errors.name && (
            <p className="error" id="qf-name-error">{errors.name}</p>
          )}
        </div>
        <div className="field">
          <label htmlFor="qf-phone">Phone *</label>
          <input
            id="qf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={set('phone')}
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={errors.phone ? 'qf-phone-error' : undefined}
          />
          {errors.phone && (
            <p className="error" id="qf-phone-error">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="qf-email">Email *</label>
        <input
          id="qf-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={set('email')}
          aria-invalid={errors.email ? 'true' : undefined}
          aria-describedby={errors.email ? 'qf-email-error' : undefined}
        />
        {errors.email && (
          <p className="error" id="qf-email-error">{errors.email}</p>
        )}
      </div>

      <div className="quote-form__row">
        <div className="field">
          <label htmlFor="qf-vehicle">Vehicle type *</label>
          <select
            id="qf-vehicle"
            name="vehicleType"
            value={values.vehicleType}
            onChange={set('vehicleType')}
            aria-invalid={errors.vehicleType ? 'true' : undefined}
          >
            <option value="">Select…</option>
            {VEHICLE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.vehicleType && <p className="error">{errors.vehicleType}</p>}
        </div>
        <div className="field">
          <label htmlFor="qf-service">Service needed *</label>
          <select
            id="qf-service"
            name="service"
            value={values.service}
            onChange={set('service')}
            aria-invalid={errors.service ? 'true' : undefined}
          >
            <option value="">Select…</option>
            {SERVICES_NEEDED.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.service && <p className="error">{errors.service}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="qf-date">Preferred date</label>
        <input
          id="qf-date"
          name="preferredDate"
          type="date"
          value={values.preferredDate}
          onChange={set('preferredDate')}
        />
      </div>

      <div className="field">
        <label htmlFor="qf-notes">Notes</label>
        <textarea
          id="qf-notes"
          name="notes"
          rows="4"
          placeholder="Anything we should know — condition, location, fleet size…"
          value={values.notes}
          onChange={set('notes')}
        />
      </div>

      <button className="btn quote-form__submit" type="submit">
        Send quote request
      </button>
    </form>
  )
}
