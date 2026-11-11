// Central place for business facts. Everything marked TODO(client) must be
// confirmed before launch — see CLAUDE.md §9.

export const SITE = {
  name: 'Blowdust — The Auto Avenue',
  shortName: 'Blowdust',
  email: 'blowdustzoneltd@gmail.com',

  phoneDisplay: '(403) 313-7803',
  phoneHref: 'tel:+14033137803',

  address: '176 Martinvalley Crescent NE, Calgary, AB T3J 4L6',
  serviceArea: 'Calgary and surrounding areas',
  founded: 2025,

  // Confirmed against the client's Google Business Profile: open 9 am – 8 pm
  // every day. All seven rows on the listing are identical, so they collapse
  // to a single line here rather than repeating the same time seven times.
  hours: [{ days: 'Monday – Sunday', time: '9:00 AM – 8:00 PM' }],
  hoursNote: 'Open 7 days a week',

  // TODO(client): real profile URLs — client said "Facebook, insta" with no links.
  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
  },

  mapEmbedUrl:
    'https://www.google.com/maps?q=176%20Martinvalley%20Crescent%20NE%2C%20Calgary%2C%20AB%20T3J%204L6&output=embed',
}
