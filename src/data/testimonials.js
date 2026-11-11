/*
 * Real Google reviews for Blow Dust Zone Ltd., supplied by the client.
 *
 * Transcribed VERBATIM from the Google Business Profile — spelling and grammar
 * are the reviewers' own and must not be "cleaned up": these are attributed to
 * named real people, and editing their words would misrepresent them. The only
 * changes made are the removal of trailing emoji/stray punctuation and the
 * insertion of a missing space after a full stop.
 *
 * `service` is NOT part of the original review — it is inferred from what each
 * reviewer describes (truck, seats, headlights, fleet) so the cards can be
 * labelled. Where a review doesn't say, it's the neutral "Mobile Detailing".
 * Worth a quick check with the client before launch.
 *
 * `localGuide` mirrors Google's own badge. Review dates are deliberately not
 * stored: Google shows them relative ("a month ago"), and hardcoding a
 * converted date would silently go stale or be wrong. See CLAUDE.md §9.
 *
 * Order is deliberate — semi-truck and fleet reviews lead, because the Home
 * page surfaces the first three and semi-truck is the flagship service.
 */

export const TESTIMONIALS = [
  {
    id: 'charanjit-singh',
    author: 'Charanjit Singh',
    service: 'Semi-Truck Detailing',
    rating: 5,
    localGuide: false,
    quote:
      'These guys did an amazing job on my Semi-Truck. They detailed is fantasticly with professionalism. Highly recommend these guys if someone is looking for Mobile detailing in Calgary.',
  },
  {
    id: 'serhii-chorpita',
    author: 'Serhii Chorpita',
    service: 'Fleet Detailing',
    rating: 5,
    localGuide: false,
    quote:
      'The team did an amazing job cleaning the cabins of our 5-ton trucks. They look brand new again. It’s a huge difference for our drivers to have a clean workspace. Highly recommend their services if you need fleet cleaning done right!',
  },
  {
    id: 'yograj-singh',
    author: 'Yograj Singh',
    service: 'Semi-Truck Detailing',
    rating: 5,
    localGuide: true,
    quote:
      'I got my truck cleaned by them. They did a fabulous job. They will come to your truck wherever it is parked. Rates are very genuine and their work is very neat and most importantly these guys are very puntual, will not waste your time.',
  },
  {
    id: 'ranjit-aujla',
    author: 'Ranjit Aujla',
    service: 'Interior Detailing',
    rating: 5,
    localGuide: true,
    quote:
      'I bought used truck which was covered in dog hair and coffee stains. Harpreet & Dhruv was incredibly thorough and reached every nook and cranny they did amazing detailing job. It smells brand new and looks immaculate. Highly recommend!',
  },
  {
    id: 'tarun-sarout',
    author: 'Tarun Sarout',
    service: 'Semi-Truck Detailing',
    rating: 5,
    localGuide: false,
    // TODO(client): the supplied screenshot cuts off mid-sentence after
    // "Highly recommend for anyone…". Quoted to the last complete sentence
    // rather than guessing the ending — pull the full text from Google.
    quote:
      'Great truck cleaning service. Very professional, on time, and detail-oriented. My truck looked almost brand new after the wash. They cleaned areas most people usually miss.',
  },
  {
    id: 'jag-singh',
    author: 'Jag Singh',
    service: 'Semi-Truck Detailing',
    rating: 5,
    localGuide: false,
    quote:
      'These guys doing great job. My truck interior shining like new. I give them 5 stars because they deserve it',
  },
  {
    id: 'harpreet-singh',
    author: 'Harpreet Singh',
    service: 'Semi-Truck Detailing',
    rating: 5,
    localGuide: false,
    quote:
      'I am really glad to give my review about ( Blow dust zone) they are very professional detailer they did my truck detail and did amazing job I want to reffer everyone who want to change there auto life contact (Blow dust zone)',
  },
  {
    id: 'sony-mundi',
    author: 'sony mundi',
    service: 'Interior Detailing',
    rating: 5,
    localGuide: false,
    quote:
      'Amazing detailing job. The seats look brand new again. He was super professional, great attention to detail, and definitely worth it. I would highly recommend!',
  },
  {
    id: 'jotinder-singh',
    author: 'Jotinder Singh',
    service: 'Headlight Restoration',
    rating: 5,
    localGuide: false,
    quote:
      'Excellent work with genuine price. I do my headlight polish. Too much clean after work.',
  },
  {
    id: 'priyanka-rana',
    author: 'Priyanka Rana',
    service: 'Mobile Detailing',
    rating: 5,
    localGuide: true,
    quote:
      'The best experience- was quick and perfect. Would love to get service from here again. Recommend to everyone.',
  },
  {
    id: 'jp-brar',
    author: 'JP BRAR',
    service: 'Mobile Detailing',
    rating: 5,
    localGuide: false,
    quote:
      'Best detailing service in Calgary AB I am happy with job done highly recommended thank so much',
  },
]

/** Every supplied review is 5★ — surfaced as a headline stat, not hardcoded. */
export const REVIEW_COUNT = TESTIMONIALS.length

export const AVERAGE_RATING =
  Math.round(
    (TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length) *
      10,
  ) / 10
