// The shapes ("types") of all the site's content. TypeScript uses these to check the content
// files: if a project is missing its `myPart` line, for example, the build fails and says where.

/** Which part of the logo something is about. D = Developer, T = Team, core = Always learning. */
export type LogoPart = 'core' | 'D' | 'T'

export type ChapterId = 'intro' | 'about' | 'projects' | 'experience' | 'contact'

export type Chapter = {
  id: ChapterId
  /** Shown before the label in the chapter list, e.g. "03". */
  number: string
  label: string
  /** The logo part this chapter brings forward, if any. */
  part?: LogoPart
  /** Caption under the logo, written like a figure in a technical drawing. */
  figure: string
}

/** An image that may not exist yet. Until it does, a styled placeholder shows instead. */
export type Photo = {
  src: string
  /** Describes the image for people who can't see it. */
  alt: string
  /**
   * Which part to keep in view when the frame crops the image, as "x% y%".
   * Leave it out to keep the middle. Example: '66% 50%' keeps the right-hand side.
   */
  focalPoint?: string
}

export type SpecRow = { label: string; value: string }

/** One of the three labels that appear when the logo comes apart. */
export type TeardownLabel = { part: LogoPart; title: string; detail: string }

export type ContactLink = { label: string; handle: string; href: string }

export type Profile = {
  firstName: string
  lastName: string
  /** The line under the name, shown with dots between the items. */
  meta: string[]
  oneLiner: string
  /** The pill in the top bar. Set to '' to hide it. */
  availability: string
  about: {
    eyebrow: string
    heading: string
    bio: string
    photo: Photo
    spec: SpecRow[]
  }
  teardown: TeardownLabel[]
  contact: {
    eyebrow: string
    heading: string
    lead: string
    email: string
    links: ContactLink[]
    /** Path to the CV inside `public/`, e.g. '/cv.pdf'. Set to '' to hide the download button. */
    cvUrl: string
  }
  footer: string
}

export type SectionCopy = { eyebrow: string; heading: string; lead?: string }

export type ProjectLink = { label: string; href: string }

export type Project = {
  /** Short id used in URLs and file names, e.g. 'alp-vp'. */
  slug: string
  name: string
  tagline: string
  /** Large and medium cards get a screenshot. Small cards are text only. */
  size: 'large' | 'medium' | 'small'
  /** Which course the project was a final project for. */
  course: string
  tags: string[]
  description: string
  /** What Dave did on the team. Recruiters always ask. */
  myPart: string
  links: ProjectLink[]
  /** Needed for large and medium cards. */
  image?: Photo
}

export type ExperienceType = 'organization' | 'kepanitiaan' | 'teaching'

/** A committee (kepanitiaan) inside a bigger role. `role` is left out for regular committee members. */
export type Committee = { event: string; role?: string }

export type ExperienceEntry = {
  id: string
  when: string
  type: ExperienceType
  role: string
  org: string
  detail?: string
  committees?: Committee[]
  /** Marks the current role at the top of the climb. */
  now?: boolean
}
