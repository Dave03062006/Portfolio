import type { Project, SectionCopy } from './types'

export const projectsCopy: SectionCopy = {
  eyebrow: '03 · Projects · D',
  heading: 'D for Developer.',
  lead: 'Mostly team projects, so each one says which part was mine.',
}

// The cards appear in this order. Card images live in public/images/projects/ (16:10).
// They're illustrations drawn in design/project-art/. Edit those, then run `node scripts/render-art.mjs`.
export const projects: Project[] = [
  {
    slug: 'alp-vp',
    name: 'ALP_VP',
    tagline: 'Gamer spending tracker',
    size: 'large',
    course: 'Final project · Visual Programming',
    tags: ['Android', 'Kotlin', 'TypeScript', 'Prisma'],
    description:
      'Gamers log what they spend on each game. Keeping it up earns points to spend in a gacha or on vouchers.',
    myPart: 'All of it: the backend, the Android app, and the API that connects them.',
    links: [
      { label: 'App code', href: 'https://github.com/Dave03062006/ALP_VP_Frontend' },
      { label: 'API code', href: 'https://github.com/Dave03062006/ALP_Backend' },
    ],
    image: {
      src: '/images/projects/alp-vp.jpg',
      alt: 'Illustration: the ALP_VP Android app charting spending per game, its points turning into gacha rewards and vouchers, and the TypeScript API and database behind it',
    },
  },
  {
    slug: 'larva',
    name: 'Larva',
    tagline: 'Fitness, for iPhone + Apple Watch',
    size: 'medium',
    course: 'Final project · Mobile Application Development',
    tags: ['Swift', 'watchOS', 'Firebase'],
    description:
      'Strava meets Duolingo: track steps and workouts, earn points for cosmetic effects, climb the friends leaderboard.',
    myPart:
      'All front-end design, the leaderboard and shop screens, and the logic that applies unlocked customizations.',
    links: [{ label: 'Code', href: 'https://github.com/E-Fredrik/Larva' }],
    image: {
      src: '/images/projects/larva.jpg',
      alt: 'Illustration: Larva on an Apple Watch and an iPhone, showing activity rings, a workout route, the friends leaderboard and the cosmetics shop',
    },
  },
  {
    slug: 'imperial-kost',
    name: 'Imperial Kost',
    tagline: 'Boarding house website',
    size: 'medium',
    course: 'Final project · Website Development · with a partner',
    tags: ['Next.js', 'TypeScript', 'Vercel'],
    description: 'Room listings with 360° views and a map for a kost in Surabaya.',
    myPart: 'The interactive map.',
    links: [
      { label: 'Live site', href: 'https://imperialf7.vercel.app' },
      { label: 'Code', href: 'https://github.com/E-Fredrik/imperialStatic' },
    ],
    image: {
      src: '/images/projects/imperial-kost.jpg',
      alt: 'Illustration: the Imperial Kost website, with a floor plan of nine rooms, a 360° room view and the interactive map with distances to nearby landmarks',
      focalPoint: '66% 50%', // keep the map (Dave's part) in view when the card crops the image
    },
  },
  {
    slug: 'shutterspace',
    name: 'ShutterSpace',
    tagline: 'Fiverr for photographers',
    size: 'small',
    course: 'Final project · Software Engineering',
    tags: ['iOS', 'UIKit', 'Firebase', 'Midtrans'],
    description: 'A marketplace for booking photographers.',
    myPart: 'Front-end design support.',
    links: [{ label: 'Code', href: 'https://github.com/E-Fredrik/ShutterSpace' }],
  },
  {
    slug: 'alp-oop',
    name: 'ALP-OOP',
    tagline: 'Java clinic system',
    size: 'small',
    course: 'Final project · Object Oriented Programming',
    tags: ['Java'],
    description:
      'Booking, prescriptions and medical history. A binary search tree finds free appointment slots.',
    myPart: 'Booking, appointment and stock functions.',
    links: [{ label: 'Code', href: 'https://github.com/Dave03062006/ALP-OOP' }],
  },
]
