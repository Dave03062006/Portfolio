# Portfolio site: design

**Owner:** Dave Tristian Nurcahyo
**Date:** 2026-10-14
**Status:** Approved by Dave on 2026-10-14. He may adjust section wording after seeing the built site.

## In plain words

This is a one-page portfolio site for Dave. As you scroll, his DT logo turns, comes apart and brings one piece forward per section, like the AirPods Pro page on apple.com. The logo's pieces are also the site's table of contents:

| Logo part | Stands for | Section |
|---|---|---|
| **D** | Developer: what he builds | Projects |
| **T** | Team: how he leads | Experience |
| **Core** (the glowing chip inside) | Always learning: what powers both | About |

The look is black with neon-red accents, styled like a product teardown: labels with thin leader lines, monospace captions, a faint grid and a numbered chapter list. Claude builds the whole site. Afterwards, Claude writes `docs/code-tour.md`, a guide that teaches React using this site's own code.

## 1. Goals and non-goals

**Goals**
- Within about a minute, a recruiter knows who Dave is, what he built (and which part was his), and how his leadership grew. Contacting him takes one click.
- It feels distinctive and personal, not like a template. Every animation means something.
- Dave can update text, projects and experience by editing data files, without touching layout code.
- Text is readable before the 3D loads. The site works with reduced motion, keyboard-only use, phones, and browsers without 3D support.
- The code is readable for a React beginner.

**Non-goals (not building these)**
- Blog, multiple pages, CMS or backend
- Contact form (the email link and a copy button cover it)
- Bahasa Indonesia version. The site is English only, but Indonesian names like *Kepanitiaan*, *UKM* and *O-Week* stay as they are.
- Light mode, custom cursor, sound, analytics

## 2. Brand

### 2.1 Logo: "Solid Mark"

A DT monogram made of two machined pieces that meet along an angled seam. The D has a window cut into it.

Geometry on a 200×200 grid, as SVG path data:

| Piece | Path |
|---|---|
| D (outer) | `M24,44 H92 L120,72 V128 L92,156 H24 Z` |
| D window (hole) | `M48,68 V132 H84 L96,120 V80 L84,68 Z` |
| T | `M97.66,44 H174.34 V68 H148 V156 H124 V68 H121.66 Z` |

The seam is 4 units wide. The T's left edge is the D's top-right chamfer moved 4 units outward, and the T's stem starts 4 units right of the D.

**Versions**
- **Flat** (navbar, favicon, CV): one color, `#ff2d3d`, with the window cut out so the background shows through. No white version. White disappears on light-mode browser tabs.
- **3D**: dark brushed-metal pieces. Red light leaks out of the seam and the D's window. A glowing "core" chip sits between the pieces and is visible when the logo comes apart.

**Meaning (keep consistent everywhere):** D = Developer → Projects. T = Team → Experience. Core = Always learning → About. Labels must always point at the part they describe.

### 2.2 Colors (CSS variables in `src/styles/tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#050505` | page background |
| `--surface` | `#0a0a0c` | cards |
| `--line` | `#1c1c20` | dividers, grid |
| `--line-strong` | `#2a2a2f` | chip and pill borders |
| `--text` | `#f4f4f5` | headings, primary text |
| `--text-2` | `#a6a6ae` | body text |
| `--text-3` | `#5d5d65` | inactive chapter labels, captions |
| `--red` | `#ff2d3d` | brand, accents, active states |
| `--red-label` | `#ff4d5b` | monospace labels |
| `--red-hot` | `#ffb1b8` | hottest part of glows |

Red on black has a contrast of about 5.7:1. Use it for labels, accents and large text, never for long body text.

### 2.3 Type

- **Headings:** Archivo, expanded width (`font-stretch: 125%`), weight 800
- **Body:** Archivo, normal width, weights 400 and 600
- **Labels and metadata:** JetBrains Mono, uppercase, letter-spaced

Fonts are self-hosted through Fontsource packages, so there are no Google Fonts requests while the site runs.

## 3. Content and sections

The site is one page with five chapters. The chapter list reads **01 Intro, 02 About, 03 Projects, 04 Experience, 05 Contact**. The top bar shows the flat logo, `DT / PORTFOLIO` and an **"Open to internships"** pill.

### 3.1 Intro

- **Name:** DAVE TRISTIAN / NURCAHYO (on two lines)
- **Meta line:** IMT · FULL STACK DEVELOPMENT · UNIVERSITAS CIPUTRA · CLASS OF 2028
- **One-liner:** "I build apps for iPhone, Android and the web, and I lead the teams that run campus events."
- **Scroll cue:** `SCROLL ↓`
- **Layout:** the intro is two screens tall. The hero stays pinned for one screen of scrolling, which is when the logo turns and comes apart.
- **Exploded-view labels**, shown after the first scroll as HTML text with SVG leader lines (on screens narrower than 1200px, a compact row of tags under the logo instead):
  - **D · DEVELOPER:** Swift · Kotlin · TypeScript
  - **T · TEAM:** SU IMT · O-Week · UKM Tabletop · TA
  - **CORE · ALWAYS LEARNING:** Informatics @ UC · GPA 3.77

### 3.2 About (the core)

- **Eyebrow:** `02 · ABOUT · CORE`. **Heading:** "Always learning."
- **Bio:** "I'm a 5th-semester Informatics student at Universitas Ciputra Surabaya, focusing on Full Stack Development. I started with HTML and CSS in 2023 and kept going: Swift, Kotlin, Laravel, and now React, which this site is built with."
- **Photo:** placeholder until Dave adds `public/images/portrait.jpg` (4:5)
- **Spec sheet:**

| Label | Value |
|---|---|
| STUDYING | Information & Multimedia Technology · FSD · 2024–2028 |
| GPA | 3.77 / 4.00 |
| CODE | Swift · Kotlin · TypeScript · JavaScript · Laravel · HTML/CSS |
| LEARNING | React · Next.js · Chinese · Korean |
| SPEAKS | Indonesian · English |
| PLAYS | Guitar · Bass · Drums · Piano · Recorder |
| AWARD | 2nd Place, Anti-Drug Ambassador 2025/26 |

### 3.3 Projects (the D)

- **Eyebrow:** `03 · PROJECTS · D`. **Heading:** "D for Developer."
- **Lead:** "Mostly team projects, so each one says which part was mine."
- Every card shows a **MY PART** line. Screenshots are placeholders until Dave adds `public/images/projects/<slug>.jpg` (16:10).

| Size | Project | Tagline | Tags | Description | My part | Links |
|---|---|---|---|---|---|---|
| Large | **ALP_VP** | Gamer spending tracker | Android, Kotlin, TypeScript, Prisma | Gamers log what they spend on each game. Keeping it up earns points to spend in a gacha or on vouchers. | All of it: the backend, the Android app, and the API that connects them. | [App code](https://github.com/Dave03062006/ALP_VP_Frontend), [API code](https://github.com/Dave03062006/ALP_Backend) |
| Medium | **Larva** | Fitness, for iPhone + Apple Watch | Swift, watchOS, Firebase | Strava meets Duolingo: track steps and workouts, earn points for cosmetic effects, climb the friends leaderboard. | All front-end design, the leaderboard and shop screens, and the logic that applies unlocked customizations. | [Code](https://github.com/E-Fredrik/Larva) |
| Medium | **Imperial Kost** | Boarding house website | Next.js, TypeScript, Vercel | Room listings with 360° views and a map for a kost in Surabaya. | The interactive map. | [Live site](https://imperialf7.vercel.app), [Code](https://github.com/E-Fredrik/imperialStatic) |
| Small | **ShutterSpace** | Fiverr for photographers | iOS, UIKit, Firebase, Midtrans | A marketplace for booking photographers. | Front-end design support. | [Code](https://github.com/E-Fredrik/ShutterSpace) |
| Small | **ALP-OOP** | Java clinic system | Java | Booking, prescriptions and medical history. A binary search tree finds free appointment slots. | Booking, appointment and stock functions. | [Code](https://github.com/Dave03062006/ALP-OOP) |

Each card shows its course as a small caption. Every project here was a course's final project: ALP_VP for Visual Programming, Larva for Mobile Application Development, Imperial Kost for Website Development (built with a partner), ShutterSpace for Software Engineering, and ALP-OOP for Object Oriented Programming.

### 3.4 Experience (the T)

- **Eyebrow:** `04 · EXPERIENCE · T`. **Heading:** "T for Team."
- **Filter tabs:** ALL · ORGANIZATIONS · KEPANITIAAN · TEACHING (default: ALL)
- **Timeline**, oldest first so it reads as a climb. The latest role is marked **NOW**.

| # | When | Type | Role · Where | Detail |
|---|---|---|---|---|
| 1 | 2024–25 | Organization | Intern, IMT Pulse · Student Union IMT | Event division: timekeeper, MC and event organizer. |
| 2 | 2025 | Kepanitiaan | SID Division Member · O-Week UC | Kept new students' discipline and the event flow on track, and mobilized students between sessions. |
| 3 | Jun 2025 – Jun 2026 | Organization (+ committees) | Internal Division · Student Union IMT | Committee chips: **Head** · Technocamp 2025 (IMT x ISB Camp); **Event Coordinator** · NPLC 13th (national programming competition); core committee: Dean's Cup 2025, Hackfest 2025, Inauguration Night IMT x ISB, IMT Pulse 2025. |
| 4 | 2025–26 | Teaching | Teaching Assistant, E1 · Universitas Ciputra | Prepared course materials, led class sessions and ran ice-breakers. |
| 5 | Apr – Aug 2026 | Kepanitiaan | SID Division Coordinator · O-Week UC | Coordinated the division, managed student information and kept operations running during orientation week. |
| 6 | Now | Organization | Head of UKM Tabletop · Universitas Ciputra | Leading the club: running its events and building its community. |

**Filter rule:** an entry shows when its type matches the active tab. The Student Union entry (#3) also shows under KEPANITIAAN, because the events it ran were committees. In that tab it shows only its committee chips.

### 3.5 Contact

- **Eyebrow:** `05 · CONTACT`. **Heading:** "Let's build something."
- **Lead:** "Open to internships and collaborations. The fastest way to reach me is email."

| Label | Shows | Action |
|---|---|---|
| EMAIL | dtristian@student.ciputra.ac.id | `mailto:` link, plus a COPY button that shows "Copied ✓" |
| LINKEDIN | dave-nurcahyo-b7780a323 | https://www.linkedin.com/in/dave-nurcahyo-b7780a323 |
| GITHUB | Dave03062006 | https://github.com/Dave03062006 |
| INSTAGRAM | @dave_tristian.n | https://www.instagram.com/dave_tristian.n |

- **DOWNLOAD CV ↓** links to `/cv.pdf`. Dave drops his CV PDF into `public/`. The button hides when `profile.cvUrl` is empty.
- **Phone:** +62 813 3222 7289, with a WhatsApp link. (Added at Dave's request on 2026-10-15, after first leaving it off for privacy.)
- **Footer:** "Designed and built by Dave Tristian · 2026 · Made with React"

## 4. Layout

- **Desktop (1024px and wider):** a fixed chapter list on the left, a content column of about 42% of the width, and a sticky 3D stage on the right (about 38%) with a faint grid behind it. The top bar is fixed. The whole screen is framed as a drawing sheet (section 6.4).
- **Tablet (768–1023px):** the chapter list moves into the top bar as "03 PROJECTS" with a menu button. The content column gets wider and the stage gets smaller. The drawing sheet frames the screen here too.
- **Phone (under 768px):** the top bar shows the current chapter, and its menu button opens a sheet with all five chapters. The 3D canvas is pinned to roughly the top 40% of the screen. Each section starts with a see-through spacer, so its logo state is visible, and then its content scrolls up over the logo on a solid background.

## 5. The 3D logo

- **Geometry:** the logo paths become `THREE.Shape`s, then `ExtrudeGeometry` with a depth of about 24 units on the 200 grid and a small bevel for machined edges. The D window is a red emissive plane set behind the hole. The seam is a thin emissive strip that follows the seam path. The core is a chip-shaped box with a grid of glowing squares on its face.
- **Materials:** the metal is near-black (`#2a2a30`) with high metalness (about 0.9) and medium roughness (about 0.35). The glowing parts use `#ff2d3d`, emissive and not tone-mapped, so that bloom catches them.
- **Lighting:** a procedural studio environment (drei `Environment` with `Lightformer`s), so there's no HDR file to download, plus a red rim light from behind.
- **Post-processing:** bloom (`@react-three/postprocessing`) with a luminance threshold, so only the emissive red parts glow.
- **Pose model:** at any moment the logo's state is
  `{ rotX, rotY, explode: 0–1, focus: 'none' | 'core' | 'D' | 'T', focusAmount: 0–1, glow: 0–1 }`.
  Poses are keyframes in `src/motion/choreography.ts`, and scroll progress interpolates between them.
- **Mouse tilt:** on desktop with a mouse, the logo tilts up to about 4° toward the cursor, smoothed. It's off for touch screens and reduced motion.
- **Performance:** the canvas draws only when something changes (scrolling, the mouse, the startup flicker), so an idle or hidden tab costs nothing. Device pixel ratio is capped to [1, 1.75]. The 3D code is loaded lazily, in its own chunk after first paint, and the flat SVG logo shows until it's ready.

## 6. Motion

### 6.1 Choreography (tied to scroll position)

| Moment | What happens |
|---|---|
| Page load | The seam flickers on once, like a neon tube starting (about 700 ms). It never loops. The drawing sheet's border draws itself in, and the chapter number is scanned in behind the logo (section 6.4). |
| Intro → About | The logo turns like a turntable, then comes apart. Leader lines draw in and the three labels appear. |
| Every chapter change | A red scan line sweeps the whole screen in the direction of travel, the big chapter number behind the logo is redrawn by a thin scan line, and the title block rolls to the new chapter. |
| About | Focus on the **core**: its glow rises while the D and T dim and move back. |
| Projects | Focus on the **D**: it moves toward the viewer with a red edge light. The T and core dim. |
| Experience | Focus on the **T**: same treatment. |
| Contact | The pieces reassemble, decelerating into place. The glow peaks and the logo faces front. |

Every scroll animation follows one number, **story time** (`src/motion/storyTime.ts`): 0 → 1 while the intro's hero is pinned and the logo comes apart, then 1 → 2 through About, 2 → 3 through Projects, and so on. The logo follows it like a well-damped spring (about a second, easing in and out, no overshoot), and rewinds exactly when scrolling back. Scrolling moves from chapter to chapter (section 6.5). *(Built with a small scroll listener and pure functions instead of GSAP: same result, one less library.)*

**Small feedback:** the chapter list's red marker slides to the active chapter (about 250 ms). Project cards get a red border and a brighter screenshot on hover. COPY becomes "Copied ✓" for 1.5 s. UI transitions take 200–400 ms with one "ease-out" curve family (`power3.out`).

### 6.2 Rules

- Motion has to mean something: it tells the logo story or answers something the visitor did.
- Banned: fade-up on every paragraph, floating blobs or particles, typewriter text, custom cursors, and bouncy or overshooting easing.
- Scrolling moves chapter to chapter at Dave's request (section 6.5). It stays as close to normal scrolling as it can: chapters taller than the screen scroll normally inside, every input works (wheel, touchpad, touch, keyboard, scrollbar), and it's off with reduced motion.
- Content never waits for an animation. All text is in the HTML and readable right away.

### 6.3 Reduced motion and fallbacks

- **`prefers-reduced-motion`:** the 3D logo still renders, but it never moves through space. Each section has a fixed pose: assembled for Intro and Contact, exploded with that section's part highlighted for About, Projects and Experience. Changing sections swaps poses with a short crossfade (fade out, switch pose, fade in, about 200 ms each). There's no flicker, no rotation and no mouse tilt, and leader lines and labels appear without drawing in.
- **No WebGL or 3D error:** an error boundary swaps in the flat SVG drawings of each state, the same ones used in the mockups.
- **Hidden tab:** rendering pauses.

### 6.4 The drawing sheet and chapter moments (added 2026-10-15)

After seeing the finished site, Dave liked the design but found the effects "a bit lackluster", especially the mostly black outer edges. He compared four live demos (a drawing sheet, a neon frame, chapter moments, and live readouts) and picked **drawing sheet + chapter moments**, on one condition: the big effect mustn't repeat at every chapter, or it gets annoying.

**Drawing sheet** (tablet and up, `SheetFrame.tsx`). The screen is framed like the technical drawing the logo is drawn on:
- A 1rem margin (`--sheet` in `tokens.css`) with a thin border, red registration marks on the corners, and grid letters A–H in the top margin. Content scrolls under solid strips in the top and bottom margins.
- Rulers in the side margins. They're part of the page, so the browser scrolls them in exact step with the content. Each chapter puts a red mark with its number on the left ruler where it begins, and a small red pointer marks the middle of the screen, the line that decides the active chapter.
- A title block in the bottom-right corner: sheet number (03 / 05), chapter, the logo part in focus (DT, Core, D, T) and "Drawn Dave Tristian". Its values roll over like a counter when the chapter changes.
- The right border fills with red as you scroll down the page, with a glowing tip.
- On load, the border draws itself in from two opposite corners (about 1 s). The rulers, letters and title block fade in after it.

**Chapter moments:**
- A giant outlined chapter number sits behind the logo, tucked behind the top of the pieces. At every chapter change, a thin scan line redraws it (0.9 s).
- At every chapter change, a scan line sweeps the whole screen (1.5 s), and everything it passes turns red, then cools back down. It travels the way the page did: top to bottom when scrolling down, bottom to top when going back up. The number's scan and the title block's roll follow the same direction. Never on load or after a deep link (`sweepDirection` in `src/lib/sheet.ts`).
- *History:* the first version played the full sweep only once per visit, because Dave worried it would get annoying. After trying it, he asked for it at every chapter, direction-aware.

**Phones:** the lighter version Dave agreed to. There's no border or rulers: just a thin progress line down the right edge, the chapter number behind the logo, and the sweep.

**Reduced motion:** the sheet, rulers and progress line stay, since they follow the scroll directly. Nothing draws in, the title block and number swap instantly, and the sweep never plays.

Lighthouse after the change (Oct 2026): accessibility, best practices and SEO still 100; performance 94 on desktop and 70–74 on mobile, within run-to-run noise of before.

### 6.5 Chapter-to-chapter scrolling (added 2026-10-15)

Dave found free scrolling awkward: you could stop between two chapters, with the logo caught halfway between poses. Now the page never rests between chapters.

- **Stops** (`src/motion/paging.ts`): the name, the logo taken apart with its labels (story time 0.95, `EXPLODED_STOP`), the start of every chapter (just below the top bar), and the end of every chapter that is clearly taller than the screen. In between those two, a tall chapter scrolls normally.
- **Wheel, touchpad, keyboard** (`useSectionPaging.ts`): one gesture at a stop glides the page to the next stop (about 0.9–1.2 s, easing in and out); the rest of that gesture, including a touchpad's coasting, is ignored. Inside a tall chapter, scrolling is normal but stops at the chapter's edge first. Going back up from a chapter lands on the end of the chapter above, so nothing is skipped.
- **Touch and the scrollbar** scroll as usual. If the page comes to rest between chapters, it glides on in the direction it was moving.
- **The logo** follows the scroll position, so each glide plays that part of the story. It moves like a critically damped spring (`spring.ts`), easing in and out.
- **Tall chapters change pose near their edges.** A chapter's arrival and departure (the first and last 0.15 of its story time) are kept within 30% of a screen of its edges (`storyTime.ts`), so the logo has finished changing at every stop, even for the long Projects chapter on phones.
- **Not used:** CSS scroll snapping. In testing, a small touchpad-style scroll snapped back to where it started instead of moving on, which would feel stuck on laptops.
- **Reduced motion:** off; the page scrolls normally.

## 7. Navigation and accessibility

- The chapter list is a `<nav>` of anchor links (`#intro`, `#about`, `#projects`, `#experience`, `#contact`). The active chapter gets `aria-current`. Clicking scrolls smoothly, or instantly with reduced motion.
- A "Skip to content" link is the first thing focusable.
- Everything interactive works with the keyboard and shows a visible focus ring (2 px red outline with offset).
- The 3D canvas is decorative (`aria-hidden`). Everything it shows is also in HTML text, and the labels are HTML, not drawn in WebGL.
- The timeline filters are toggle buttons (`aria-pressed`).
- The COPY button uses the Clipboard API, with a fallback that selects the text. It announces "Copied" through an `aria-live` region.
- Contrast meets WCAG AA. Images have alt text.

## 8. Code architecture

**Tools:** Vite, React, TypeScript, React Three Fiber with drei and postprocessing, CSS Modules with global CSS variables, Vitest, and Oxlint (the Vite template's default linter).

```
src/
  content/       profile.ts, projects.ts, experience.ts, types.ts   ← edit these to update the site
  sections/      Intro.tsx, About.tsx, Projects.tsx, Experience.tsx, Contact.tsx
  components/    TopBar, ChapterRail, ChapterSheet (phone), ProjectCard, SpecSheet,
                 TimelineItem, TimelineFilters, CopyButton, ImageSlot (placeholder-aware image),
                 SheetFrame + SheetRulers (drawing sheet), ScanSweep, RollingText
  three/         LogoCanvas.tsx (canvas, lights, bloom), LogoModel.tsx (the pieces),
                 shapes.ts (logo path data → THREE shapes), FallbackLogo.tsx (SVG states)
  motion/        choreography.ts (pose keyframes + interpolation, pure functions),
                 storyTime.ts (scroll → story time), useScrollStory.ts, useStoryTime.ts,
                 ChapterProvider.tsx (active chapter)
  styles/        tokens.css, global.css
  App.tsx
public/          images/, cv.pdf, favicon.svg
docs/            superpowers/specs/ (this file), code-tour.md
```

**Data flow**
- Content files → section components → cards and rows. Adding a project means adding one object to `projects.ts`.
- Scroll → `useScrollStory` → one shared "story" value `{ chapter, progress }`:
  - The **chapter** goes into React state through `ChapterContext`. It only changes when a section boundary is crossed, which re-renders the chapter list and top bar.
  - The **progress** goes into a ref that the 3D render loop reads every frame. No React re-renders happen per frame.

**Error handling:** WebGL detection and an error boundary around the canvas fall back to the SVG logo. `ImageSlot` shows a styled placeholder when an image is missing. Missing optional links (like `cvUrl`) hide their button.

## 9. Testing and verification

- `npm run check`: TypeScript (`tsc -b`) and Oxlint
- **Vitest unit tests:**
  - choreography: the pose at each keyframe, interpolation, clamping outside 0–1
  - experience filter rule, including the Student Union entry showing under KEPANITIAAN
  - content sanity: every project has a "my part" line and valid link URLs
  - drawing sheet: scroll progress, the title block's part names, and when and which way the sweep plays
  - chapter-to-chapter scrolling: the stops, where each gesture goes, settling after a swipe, the spring
- `npm run build` must pass.
- **Visual check:** headless-browser screenshots of every section at 1440×900 and 390×844, plus reduced-motion and no-WebGL runs.
- **Targets** (aims, not hard gates): Lighthouse Accessibility, Best Practices and SEO ≥ 95, Performance ≥ 80 on mobile. Initial JavaScript before the lazily loaded 3D chunk stays under about 150 KB gzipped.

## 10. Setup and deployment

- **Location:** `C:\Users\DAVE TRISTIAN\Projects\portfolio`, outside OneDrive so `node_modules` doesn't sync.
- **Git:** this repo. `.gitignore` covers `node_modules/`, `dist/`, `.superpowers/` and `.env*`.
- **Hosting:** GitHub repo → Vercel, which deploys automatically on every push to `main`. Dave signs in to both, and the code tour walks him through it. The free URL looks like `<name>.vercel.app`.
- **Meta:** title "Dave Tristian Nurcahyo · Portfolio", a description, an Open Graph preview image (the logo with his name), and favicons from the flat logo (SVG plus PNG fallbacks).

## 11. Assets Dave adds later (placeholders until then)

- `public/images/portrait.jpg` (4:5)
- `public/images/projects/alp-vp.jpg`, `larva.jpg`, `imperial-kost.jpg`, `shutterspace.jpg`, `alp-oop.jpg` (16:10)
- `public/cv.pdf`

## 12. The code tour (delivered after the build)

`docs/code-tour.md` teaches React using this codebase:
- components and JSX (the sections)
- props (`ProjectCard`)
- lists and keys (the projects list)
- state (`TimelineFilters`)
- effects and cleanup (`CopyButton`, scroll setup)
- refs (per-frame 3D updates)
- context (the active chapter)
- conditional rendering (optional links)
- TypeScript types for content
- the basics of React Three Fiber, and how scrolling drives the animation (story time)

It ends with step-by-step recipes: add a project, add an experience, change the red, swap in photos, and deploy.

## 13. Notes

- The email is a student address, which may stop working after graduation. It lives in one place (`profile.ts`), so it's easy to change later.
- The brainstorming mockups are in `OneDrive\Documents\Personal Project\Profile\.superpowers\brainstorm\` for reference.
