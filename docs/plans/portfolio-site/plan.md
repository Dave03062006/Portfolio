# Implementation plan: portfolio site

## Overview

Build the one-page portfolio described in [the design spec](../../superpowers/specs/2026-10-14-portfolio-design.md). It's a Vite + React + TypeScript site with five sections, content in data files, and Dave's DT logo as a live 3D object (React Three Fiber) that follows the visitor's scroll. It includes fallbacks for reduced motion and missing WebGL, tests, and a beginner code tour at the end.

## Requirements summary

The spec is the source of truth. In short:
- Sections 01 Intro, 02 About, 03 Projects, 04 Experience and 05 Contact, with the exact copy in spec §3
- Logo meaning: D = Developer → Projects, T = Team → Experience, Core = Always learning → About
- Motion is scrubbed to scroll and never hijacks it. Spec §6.2 bans the AI-slop patterns.
- Fallbacks: reduced motion (fixed poses with crossfades), no WebGL (SVG states), hidden tab (paused)
- Code must be readable for a beginner. `docs/code-tour.md` comes last.

## Investigation findings (2026-10-14)

Current npm versions, all compatible with each other:

| Package | Version | Note |
|---|---|---|
| create-vite | 9.2.1 | `react-ts` template: React 19.2+, Vite 8.3, TypeScript ~6.0, **Oxlint** as the default linter |
| react / react-dom | 19.3.0 | R3F 9.8 supports `>=19 <19.4` |
| three | 0.186.1 | |
| @react-three/fiber | 9.8.1 | |
| @react-three/drei | 10.7.9 | needs fiber ^9 |
| @react-three/postprocessing | 3.2.0 | needs fiber >= 9.7, postprocessing ^6.36 |
| gsap / @gsap/react | 3.15.0 / 2.1.2 | installed at first, then removed in Task 3 (see Key decisions) |
| @fontsource-variable/archivo | 5.3.0 | ships `wdth.css`, so the width axis for expanded headings is available |
| @fontsource-variable/jetbrains-mono | 5.3.0 | |
| vitest | 5.0.4 | needs vite ^8 |

- TypeScript 7 exists, but typescript-eslint doesn't support it yet. The template pins TS ~6.0 and uses Oxlint, which sidesteps the problem.
- npm on this machine uses the npmmirror registry. That's fine, it mirrors npm.
- Edge and Chrome are installed, so the screenshot scripts use `playwright-core` with Edge instead of downloading browsers.

## Tasks

### Task 1: Foundation
**What:**
- Scaffold the `react-ts` template into the repo and merge its `.gitignore` with ours. Delete the demo files.
- Install the libraries above, plus dev tools: `@types/three`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/dom` and `playwright-core`.
- Scripts: `dev`, `build`, `preview`, `lint` (Oxlint), `typecheck`, `check` (typecheck + lint), `test`, `shots` (screenshots).
- Add `.gitattributes` with LF line endings.
- Design tokens and global CSS: fonts, reset, focus ring, skip link.
- `src/brand/logoPaths.ts` holds the logo geometry. It's the only source of truth, used by the SVG logo and the 3D logo alike.
- Flat-logo favicon, plus page title and meta in `index.html`.

**Files:** `package.json`, `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`, `.gitattributes`, `index.html`, `public/favicon.svg`, `src/main.tsx`, `src/App.tsx`, `src/styles/tokens.css`, `src/styles/global.css`, `src/brand/logoPaths.ts`
**Done when:** `npm run check`, `npm test` and `npm run build` pass, and the dev server serves the empty shell.
**Dependencies:** none

### Task 2: Content, components and sections (a complete static site)
**What:**
- Typed content files with the exact copy from spec §3.
- A pure function for the experience filter rule, with tests. Content sanity tests: every project has "my part" and valid URLs.
- Components: TopBar, ChapterRail, ChapterSheet (phone), SpecSheet, ProjectCard, ImageSlot (placeholder-aware), TimelineFilters, TimelineItem, CopyButton, TeardownLabels (HTML labels + SVG leader lines), and FallbackLogo (SVG states for each focus).
- Sections: Intro, About, Projects, Experience, Contact and the footer.
- Desktop, tablet and phone layouts, with the sticky stage showing the SVG logo.
- ChapterContext for the active chapter.

**Files:** `src/content/*`, `src/lib/experienceFilter.ts` (+ test), `src/components/*`, `src/sections/*`, `src/motion/ChapterContext.tsx`, `src/three/FallbackLogo.tsx`
**Done when:** every section matches the approved mockups at 1440×900 and 390×844, keyboard navigation works, and tests pass.
**Dependencies:** Task 1

### Task 3: Scroll story and motion
**What:**
- `choreography.ts` defines the `Pose` type, keyframes for each scroll moment, and `poseAt(progress)` with interpolation. It's pure and unit-tested.
- `storyTime.ts` turns the scroll position into story time (a pure function, unit-tested). `useScrollStory` writes it into a plain shared object (`story.ts`) that the renderers read every frame. The active chapter stays with the IntersectionObserver from Task 2.
- Teardown leader lines that draw in, the seam ignition flicker on load, the sliding chapter-rail marker, card hover states and the copy feedback.
- Reduced motion: fixed poses with crossfades and no flicker. The SVG logo follows the active section's pose, so every fallback path also tells the story.

**Files:** `src/motion/choreography.ts` (+ test), `src/motion/storyStore.ts`, `src/motion/useScrollStory.ts`, `src/motion/useReducedMotion.ts`, updates to components and sections
**Done when:** scripted scroll screenshots at each keyframe show the right pose and labels, the reduced-motion run shows fixed poses, and scrolling back reverses everything.
**Dependencies:** Task 2

### Task 4: The 3D logo
**What:**
- `shapes.ts` turns `logoPaths` into `THREE.Shape`s: the D with its window hole, the T, and the seam strip. Tests check the bounds.
- `LogoModel` contains the extruded, beveled D and T in brushed metal, the emissive window plane, the seam strip, and the core chip with its grid of glowing squares.
- `LogoCanvas` sets DPR to [1, 2] and adds the procedural studio environment (Lightformers), a red rim light and bloom. Its `useFrame` reads the story store, then calls `poseAt` and eases toward the result. It also adds mouse tilt (fine pointers only), the ignition flicker, and pausing when the tab is hidden or the canvas is off screen.
- A WebGL check plus an error boundary fall back to FallbackLogo. The canvas is lazy-loaded and crossfades in once its first frame is ready.
- Phone stage: the canvas is pinned to the top ~40% of the screen, with section spacers.

**Files:** `src/three/shapes.ts` (+ test), `src/three/LogoModel.tsx`, `src/three/LogoCanvas.tsx`, `src/three/Stage.tsx`, `src/three/webgl.ts`, `src/components/ErrorBoundary.tsx`
**Done when:** WebGL screenshots match the storyboard, the no-WebGL run shows SVG states, and the 3D chunk loads separately from the initial JS.
**Dependencies:** Task 3

### Task 5: Polish, verification and docs
**What:**
- Open Graph preview image and PNG icons.
- Lighthouse runs (desktop and mobile) and a bundle-size check against the spec §9 targets. Fix what they find.
- `README.md` covering run, build, test and deploy.
- `docs/code-tour.md`: React concepts taught through this codebase, ending with recipes.
- Final self-review.
- Deployment (GitHub repo + Vercel) happens **with Dave**, because it needs his accounts.

**Files:** `public/og.png`, `public/apple-touch-icon.png`, `scripts/shots.mjs`, `README.md`, `docs/code-tour.md`
**Done when:** all checks pass, targets are met or the gaps are explained, and the docs are written.
**Dependencies:** Task 4

## Parallelization

None. The tasks run in order, because each one builds on the last: the static site, then motion, then 3D. Running them in order also keeps the code consistent for Dave's code tour.

## Integration points

- External links: GitHub repos, LinkedIn, Instagram, the Imperial Kost live site
- Assets Dave adds later: `public/images/portrait.jpg`, `public/images/projects/*.jpg`, `public/cv.pdf`. Placeholders show until then.
- Vercel deploys from GitHub, set up with Dave.

## Testing strategy

- **Unit (Vitest):** `poseAt` keyframes, interpolation and clamping. The experience filter, including the Student Union entry under KEPANITIAAN. Content sanity. Logo shape bounds.
- **Static:** `tsc -b` and Oxlint (`npm run check`). `npm run build` must pass.
- **Visual:** `npm run shots` scrolls through the built site in headless Edge and saves screenshots of each keyframe at 1440×900 and 390×844, plus runs with reduced motion and with WebGL disabled.
- **Quality targets:** Lighthouse A11y, Best Practices and SEO ≥ 95, mobile Performance ≥ 80. Initial JS under ~150 KB gzipped.

## Risks

| Risk | Mitigation |
|---|---|
| Headless Edge may not render WebGL | Try SwiftShader flags (`--use-angle=swiftshader --enable-unsafe-swiftshader`) early in Task 4. If that fails, Dave checks the 3D visually. |
| Low-end phones struggle with bloom and metal materials | drei `PerformanceMonitor` lowers DPR and turns bloom off. The SVG fallback is always available. |
| Mobile address-bar resizes break scroll pinning | Use CSS `position: sticky/fixed` instead of GSAP pinning, and re-measure sections with a ResizeObserver. |
| Bevels look wrong on the sharp chamfers | Tune `bevelSegments` and size. Fall back to no bevel plus an edge-highlight material. |
| Library versions are newer than my training data | Check against installed type definitions, docs and real builds rather than memory. |

## Key decisions

- **Oxlint instead of ESLint.** It's the template default, it's fast, and it avoids the typescript-eslint/TS 7 conflict. The spec is updated to match.
- **The logo geometry lives in one file** (`logoPaths.ts`), shared by the SVG and the 3D logo.
- **Native scroll, no GSAP.** A scroll listener plus pure functions (`storyTime`, `poseAt`) replaced GSAP ScrollTrigger in Task 3: the same effect, a smaller download, and one less library for Dave to learn. No smooth-scroll library and no drei `ScrollControls` either, so scrolling always feels normal.
- **CSS sticky positioning for the stage** instead of scroll-pinning code. It's simpler and more reliable on phones.
- **A ref-based story store for per-frame values.** React state is used only for the active chapter. This keeps 60 fps without re-rendering, and it's a good lesson for the code tour.
- **No subagents.** I do the work in this session, as the session guidelines require.
