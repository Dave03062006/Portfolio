import type { Profile } from './types'

// Everything about Dave that isn't a project or an experience entry.
// Edit the text here and the site updates. No layout code needs to change.

export const profile: Profile = {
  firstName: 'Dave Tristian',
  lastName: 'Nurcahyo',
  meta: ['IMT', 'Full Stack Development', 'Universitas Ciputra', 'Class of 2028'],
  oneLiner:
    'I build apps for iPhone, Android and the web, and I lead the teams that run campus events.',
  availability: 'Open to internships',

  about: {
    eyebrow: '02 · About · Core',
    heading: 'Always learning.',
    bio: "I'm a 5th-semester Informatics student at Universitas Ciputra Surabaya, focusing on Full Stack Development. I started with HTML and CSS in 2023 and kept going: Swift, Kotlin, Laravel, and now React, which this site is built with.",
    // Add your photo at public/images/portrait.jpg (portrait, 4:5). A placeholder shows until then.
    photo: { src: '/images/portrait.jpg', alt: 'Portrait of Dave Tristian Nurcahyo' },
    spec: [
      { label: 'Studying', value: 'Information & Multimedia Technology · FSD · 2024–2028' },
      { label: 'GPA', value: '3.77 / 4.00' },
      { label: 'Code', value: 'Swift · Kotlin · TypeScript · JavaScript · Laravel · HTML/CSS' },
      { label: 'Learning', value: 'React · Next.js · Chinese · Korean' },
      { label: 'Speaks', value: 'Indonesian · English' },
      { label: 'Plays', value: 'Guitar · Bass · Drums · Piano · Recorder' },
      { label: 'Award', value: '2nd Place, Anti-Drug Ambassador 2025/26' },
    ],
  },

  // The labels that appear when the logo comes apart. Each one points at its own part.
  teardown: [
    { part: 'T', title: 'Team', detail: 'SU IMT · O-Week · UKM Tabletop · TA' },
    { part: 'core', title: 'Always learning', detail: 'Informatics @ UC · GPA 3.77' },
    { part: 'D', title: 'Developer', detail: 'Swift · Kotlin · TypeScript' },
  ],

  contact: {
    eyebrow: '05 · Contact',
    heading: "Let's build something.",
    lead: 'Open to internships and collaborations. The fastest way to reach me is email.',
    email: 'dtristian@student.ciputra.ac.id',
    // Remove this line to take the phone number off the site.
    phone: { display: '+62 813 3222 7289', number: '+6281332227289' },
    links: [
      {
        label: 'LinkedIn',
        handle: 'dave-nurcahyo-b7780a323',
        href: 'https://www.linkedin.com/in/dave-nurcahyo-b7780a323',
      },
      { label: 'GitHub', handle: 'Dave03062006', href: 'https://github.com/Dave03062006' },
      {
        label: 'Instagram',
        handle: '@dave_tristian.n',
        href: 'https://www.instagram.com/dave_tristian.n',
      },
    ],
    // Your CV lives at public/cv.pdf. Set this to '' to hide the "Download CV" button.
    cvUrl: '/cv.pdf',
  },

  footer: 'Designed and built by Dave Tristian · 2026 · Made with React',
}
