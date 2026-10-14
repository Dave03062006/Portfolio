import type { ExperienceEntry, SectionCopy } from './types'

export const experienceCopy: SectionCopy = {
  eyebrow: '04 · Experience · T',
  heading: 'T for Team.',
}

// Oldest first, so the timeline reads as a climb. Mark the current role with `now: true`.
export const experience: ExperienceEntry[] = [
  {
    id: 'imt-pulse-intern',
    when: '2024–25',
    type: 'organization',
    role: 'Intern, IMT Pulse',
    org: 'Student Union IMT',
    detail: 'Event division: timekeeper, MC and event organizer.',
  },
  {
    id: 'oweek-2025',
    when: '2025',
    type: 'kepanitiaan',
    role: 'SID Division Member',
    org: 'O-Week UC',
    detail:
      "Kept new students' discipline and the event flow on track, and mobilized students between sessions.",
  },
  {
    id: 'su-internal',
    when: 'Jun 2025 – Jun 2026',
    type: 'organization',
    role: 'Internal Division',
    org: 'Student Union IMT',
    detail:
      "Organized the department's events. I led Technocamp, the IMT x ISB camp, and coordinated NPLC 13th, a national programming competition.",
    committees: [
      { role: 'Head', event: 'Technocamp 2025' },
      { role: 'Event Coordinator', event: 'NPLC 13th' },
      { event: "Dean's Cup 2025" },
      { event: 'Hackfest 2025' },
      { event: 'Inauguration Night IMT x ISB' },
      { event: 'IMT Pulse 2025' },
    ],
  },
  {
    id: 'teaching-assistant',
    when: '2025–26',
    type: 'teaching',
    role: 'Teaching Assistant, E1',
    org: 'Universitas Ciputra',
    detail: 'Prepared course materials, led class sessions and ran ice-breakers.',
  },
  {
    id: 'oweek-2026',
    when: 'Apr – Aug 2026',
    type: 'kepanitiaan',
    role: 'SID Division Coordinator',
    org: 'O-Week UC',
    detail:
      'Coordinated the division, managed student information and kept operations running during orientation week.',
  },
  {
    id: 'ukm-tabletop',
    when: 'Now',
    type: 'organization',
    role: 'Head of UKM Tabletop',
    org: 'Universitas Ciputra',
    detail: 'Leading the club: running its events and building its community.',
    now: true,
  },
]
