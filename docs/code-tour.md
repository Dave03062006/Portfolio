# Code tour: learn React through your own site

This guide walks through the portfolio's code in the order that makes React click. It assumes you know HTML, CSS and some JavaScript (you've done Swift, Kotlin and a TypeScript backend, so the ideas will feel familiar). Everything here points at real files in this project.

**How to use it.** Keep the site running while you read (`npm run dev`, then open http://localhost:5173). Open each file it mentions side by side with this guide. The **Try it** boxes are small changes you can make and watch happen live. Undo them afterwards with `Ctrl+Z` or `git checkout -- <file>`.

**VS Code tips.** `Ctrl+P` opens a file by typing its name. `F12` on a name jumps to where it's defined. Hovering over anything shows its type. For the browser, install the **React Developer Tools** extension (Edge or Chrome). It adds a "Components" tab to `F12` that shows your components as a tree.

Contents:
1. [The big picture](#1-the-big-picture)
2. [Components and JSX](#2-components-and-jsx)
3. [Props](#3-props)
4. [Lists and keys](#4-lists-and-keys)
5. [TypeScript, the content's safety net](#5-typescript-the-contents-safety-net)
6. [State](#6-state)
7. [Effects](#7-effects)
8. [Context](#8-context)
9. [Refs](#9-refs)
10. [Your own hooks](#10-your-own-hooks)
11. [Styling: CSS Modules and design tokens](#11-styling-css-modules-and-design-tokens)
12. [The scroll story](#12-the-scroll-story)
13. [The logo, flat and 3D](#13-the-logo-flat-and-3d)
14. [Tests](#14-tests)
15. [Recipes](#15-recipes)
16. [Glossary](#16-glossary)

---

## 1. The big picture

Open [`index.html`](../index.html). Apart from the `<head>`, the page is almost empty:

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

That empty `<div>` is where React draws the whole site. Open [`src/main.tsx`](../src/main.tsx):

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

"Find the `#root` div, and draw `<App />` inside it." `App` is the whole site. Open [`src/App.tsx`](../src/App.tsx) and you'll see the page as a tree of pieces:

```
App
├── ChapterProvider        works out which chapter is on screen (section 8)
│   ├── TopBar             the bar at the top
│   ├── ChapterRail        the numbered list on the left (laptops)
│   ├── Stage              the logo area (section 13)
│   └── main
│       ├── Intro          01
│       ├── About          02
│       ├── Projects       03
│       ├── Experience     04
│       └── Contact        05
```

**The one idea behind React:** you don't change the page by hand, as in `element.textContent = 'Copied'`. Instead, you describe what the page *should* look like for the current data, and React works out the changes. When the data changes, React redraws the parts that depend on it. That redraw is called a **render**.

> **Try it.** In `App.tsx`, move `<About />` below `<Projects />`. Save. The browser updates instantly, and About now comes third. Notice two things: the chapter list still says "02 About", because it reads `src/content/chapters.ts`, not the page order; and the logo's scroll animation gets muddled, because it expects the chapters in that same order (section 12). Move it back.

---

## 2. Components and JSX

Open [`src/sections/Intro.tsx`](../src/sections/Intro.tsx). A **component** is just a function that returns what should appear on screen:

```tsx
export function Intro() {
  return (
    <section id="intro" aria-labelledby="intro-title" className={styles.intro}>
      ...
      <h1 id="intro-title" className={`${text.display} ${styles.name}`}>
        <span>{profile.firstName}</span> <span>{profile.lastName}</span>
      </h1>
      ...
    </section>
  )
}
```

The HTML-looking part is **JSX**. It's almost HTML, with a few differences:

- `className` instead of `class`, because `class` is a reserved word in JavaScript.
- Curly braces `{ }` mean "run this JavaScript here". `{profile.firstName}` inserts the name from the content file.
- Tags written with a capital letter, like `<AvailabilityPill />`, are *your* components. Lowercase tags, like `<section>`, are plain HTML.
- Every tag must close. A tag with nothing inside closes itself: `<AvailabilityPill />`.
- A component returns **one** outer element. To return two side by side without a wrapper, use an empty "fragment" `<> … </>`, as [`CopyButton.tsx`](../src/components/CopyButton.tsx) does.

Using a component works like using an HTML tag. `App` writes `<Intro />`, and the function runs and its JSX appears in that spot.

> **Try it.** In `Intro.tsx`, change `Scroll ↓` to `Keep scrolling ↓`. Then open `src/content/profile.ts` and change `oneLiner`. Both appear immediately.

---

## 3. Props

Components get their inputs through **props**, the same way functions get arguments. Open [`src/components/ProjectCard.tsx`](../src/components/ProjectCard.tsx):

```tsx
export function ProjectCard({ project }: { project: Project }) {
  const { name, tagline, size, course, tags, description, myPart, links, image } = project
  ...
```

Whoever uses `ProjectCard` passes one project in: `<ProjectCard project={project} />`. One component, five different cards, depending on what it's given.

There's a special prop called **`children`**: whatever you put *between* a component's tags. Open [`src/components/Section.tsx`](../src/components/Section.tsx). Every chapter after the intro uses it for the shared eyebrow and heading, then puts its own content inside:

```tsx
// in Projects.tsx
<Section id="projects" copy={projectsCopy}>
  <ul className={styles.list}>…the cards…</ul>
</Section>

// inside Section.tsx, the cards appear where {children} is
<div className={styles.body}>{children}</div>
```

Props only flow **down**, from parent to child. A child can't reach up and change its parent's data. When a child needs to say "something happened", the parent passes it a function to call. You'll see that in section 6.

> **Try it.** In `src/content/projects.ts`, change ShutterSpace's `myPart` text. The card updates, because the card only displays whatever it's given.

---

## 4. Lists and keys

Open [`src/sections/Projects.tsx`](../src/sections/Projects.tsx):

```tsx
{projects.map((project) => (
  <li key={project.slug} className={styles[project.size]}>
    <ProjectCard project={project} />
  </li>
))}
```

`.map()` is ordinary JavaScript: it turns the array of projects into an array of `<li>` elements. That's how React shows lists.

The `key` gives each item a stable name, so if the list changes (reordered, filtered, one removed), React knows which card is which instead of redrawing everything. Use something unique and stable, like an id or slug. Avoid the array position, since that changes when the list does.

> **Try it.** In `projects.ts`, move the Larva object above ALP_VP. The cards reorder. (Larva is a "medium" card, so it keeps its side-by-side layout. The `size` field decides the layout, not the position.)

---

## 5. TypeScript, the content's safety net

Open [`src/content/types.ts`](../src/content/types.ts). It describes the *shape* of the content, for example:

```ts
export type Project = {
  slug: string
  name: string
  ...
  /** What Dave did on the team. Recruiters always ask. */
  myPart: string
  links: ProjectLink[]
  /** Needed for large and medium cards. */
  image?: Photo
}
```

`image?:` with a question mark means "optional". Everything else is required. Because `projects.ts` says `export const projects: Project[] = [...]`, TypeScript checks every project against this shape as you type.

> **Try it.** Delete the `myPart` line from one project. VS Code underlines it in red and tells you what's missing, and `npm run check` fails. Undo. You can't publish a project without saying what you did on it.

The `/** … */` comments above each field show up when you hover over that field anywhere in the code.

---

## 6. State

So far everything has been fixed content. **State** is data that changes while the page is open and should redraw the page when it does. Open [`src/sections/Experience.tsx`](../src/sections/Experience.tsx):

```tsx
const [filter, setFilter] = useState<ExperienceFilter>('all')
const visible = filterExperience(experience, filter)
```

- `useState('all')` creates a piece of state that starts as `'all'`. It gives you two things: the current value (`filter`) and a function to change it (`setFilter`).
- Calling `setFilter('kepanitiaan')` stores the new value **and re-runs the component**. The second line then filters again, and the timeline redraws.
- `visible` is *not* state. It's calculated from state on every render. A good rule: keep the smallest amount of state you can, and calculate everything else.

Now open [`src/components/TimelineFilters.tsx`](../src/components/TimelineFilters.tsx). The tabs don't keep their own state. They receive the current value and a function to call:

```tsx
<TimelineFilters value={filter} onChange={setFilter} />
```

```tsx
<button aria-pressed={value === option.value} onClick={() => onChange(option.value)}>
```

This is how a child "talks up" to its parent. The parent owns the state and passes down both the value and a way to change it. It's called **lifting state up**, and it means one place (Experience) is in charge, so the tabs and the list can never disagree.

The filtering rule lives in its own plain function, [`src/lib/experienceFilter.ts`](../src/lib/experienceFilter.ts), with no React in it at all. That makes it easy to test (section 14) and easy to read: under KEPANITIAAN, the Student Union entry also shows, with only its committee chips.

> **Try it.** Change `useState<ExperienceFilter>('all')` to `useState<ExperienceFilter>('kepanitiaan')`. Reload. The Kepanitiaan tab starts selected.

---

## 7. Effects

Rendering should only *describe* the page. Anything that reaches outside React, like timers, browser features or listening to scrolling, goes in an **effect**. Open [`src/components/CopyButton.tsx`](../src/components/CopyButton.tsx):

```tsx
const [copied, setCopied] = useState(false)

useEffect(() => {
  if (!copied) return
  const timer = window.setTimeout(() => setCopied(false), 1500)
  return () => window.clearTimeout(timer)
}, [copied])
```

Read it as: "after the page has been drawn, whenever `copied` changes: if it just became true, set a 1.5-second timer that switches it back."

- **The array at the end** (`[copied]`) lists what the effect depends on. React re-runs the effect only when one of those values changes. An empty array `[]` means "only once, after the first render".
- **The returned function is the cleanup.** It runs before the effect runs again, and when the component disappears. Here it cancels the timer, so a timer can never fire after the button is gone.

In development, React runs every effect twice when the page first loads, on purpose, to flush out effects that forgot their cleanup. That's what `<StrictMode>` in `main.tsx` does. It doesn't happen on the published site.

A second example: [`src/motion/ChapterProvider.tsx`](../src/motion/ChapterProvider.tsx) uses an effect to set up an `IntersectionObserver`, a browser feature that reports when an element crosses a line. Its cleanup calls `observer.disconnect()`.

> **Try it.** Change `1500` to `4000` in `CopyButton.tsx` and click Copy next to your email. The "Copied ✓" stays longer.

---

## 8. Context

Several components need to know which chapter is on screen: the chapter list, the top bar, the phone menu and the logo. Passing it down as a prop through every layer would be tedious. That's called "prop drilling". **Context** lets components read a shared value directly.

1. [`src/motion/chapterContext.ts`](../src/motion/chapterContext.ts) creates the context, plus a small hook to read it:

   ```ts
   export const ChapterContext = createContext<ChapterId>('intro')
   export function useActiveChapter(): ChapterId {
     return useContext(ChapterContext)
   }
   ```

2. [`src/motion/ChapterProvider.tsx`](../src/motion/ChapterProvider.tsx) works out the active chapter (with the observer from section 7), keeps it in state, and **provides** it:

   ```tsx
   return <ChapterContext.Provider value={active}>{children}</ChapterContext.Provider>
   ```

3. `App` wraps everything in `<ChapterProvider>`, so anything inside can call `useActiveChapter()`. See [`ChapterRail.tsx`](../src/components/ChapterRail.tsx):

   ```tsx
   const active = useActiveChapter()
   ...
   aria-current={chapter.id === active ? 'location' : undefined}
   ```

When the active chapter changes, every component that reads it re-renders. That's what slides the red marker in the chapter list.

---

## 9. Refs

A **ref** is a box (`ref.current`) that keeps its value between renders, *without* causing a re-render when you change it. There are two common uses.

**1. Holding on to a real page element.** Open [`src/components/ChapterSheet.tsx`](../src/components/ChapterSheet.tsx). The phone menu uses the browser's `<dialog>` element, which needs `dialog.showModal()` called on it. React gives you the element through a ref:

```tsx
const dialogRef = useRef<HTMLDialogElement>(null)
...
<dialog ref={dialogRef} ...>
...
if (open && !dialog.open) dialog.showModal()
```

**2. Values that change too often to be state.** In [`src/three/Stage.tsx`](../src/three/Stage.tsx), `stateRef` holds the logo's current pose for the 3D scene to read on every frame. Putting it in state would redraw React components 60 times a second for no visible benefit. Mouse position in [`LogoModel.tsx`](../src/three/LogoModel.tsx) works the same way.

The rule of thumb: if changing a value should change what's on screen, use **state**. If it's bookkeeping, or something outside React reads it, use a **ref**.

---

## 10. Your own hooks

Functions that start with `use` (`useState`, `useEffect`, `useContext`, `useRef`) are **hooks**. You can write your own by combining them, which is how this project keeps components short. Look at:

- [`src/motion/useReducedMotion.ts`](../src/motion/useReducedMotion.ts) answers "has this visitor asked their device to reduce motion?" and updates if they change the setting.
- [`src/motion/useCrossfade.ts`](../src/motion/useCrossfade.ts) changes a value with a fade-out → swap → fade-in instead of instantly.
- [`src/motion/useStoryTime.ts`](../src/motion/useStoryTime.ts) gives the current scroll "story time", eased smoothly (section 12).

Two **rules of hooks**:
1. Only call hooks at the top level of a component or of another hook. Never inside an `if`, a loop, or a nested function.
2. Only call them from components or hooks.

React keeps track of hooks by their order, so the order must be the same on every render. That's why [`Stage.tsx`](../src/three/Stage.tsx) calls `useCrossfade` every time, even when reduced motion is off. The comment there says so.

---

## 11. Styling: CSS Modules and design tokens

Every component has a `.module.css` file next to it, like [`ProjectCard.module.css`](../src/components/ProjectCard.module.css). The `.module` part turns on **CSS Modules**: class names are made unique per file. So `.card` in one file can never clash with `.card` in another, and you use them like this:

```tsx
import styles from './ProjectCard.module.css'
<article className={`${styles.card} ${styles[size]}`}>
```

Open the page in the browser's Elements tab: the real class names look like `_card_1j8ge_1`. That's the uniqueness at work.

All colors, fonts, sizes and timings live as CSS variables in [`src/styles/tokens.css`](../src/styles/tokens.css). Components use `var(--red)`, `var(--text-2)` and so on, so a change there changes the whole site.

Layouts are written **phone first**: the plain rules are for phones, and `@media (min-width: 768px)` (tablet) and `(min-width: 1024px)` (laptop) blocks adjust them for bigger screens. See [`Section.module.css`](../src/components/Section.module.css) for a clear example.

> **Try it.** In `tokens.css`, change `--red` to `#3d7bff`. Every red accent turns blue, including the small logo in the top bar, but the big logo stays red. The big logo's colors live in [`src/brand/colors.ts`](../src/brand/colors.ts), because SVG gradients and 3D materials can't read CSS variables. (Change it back!)

---

## 12. The scroll story

This is the heart of the AirPods-style effect, and it's simpler than it looks. **Every animation follows one number: story time.**

| Story time | What's happening |
|---|---|
| 0 → 1 | The intro: your name stays pinned while the logo turns and comes apart |
| 1 → 2 | About (the core lights up) |
| 2 → 3 | Projects (the D comes forward) |
| 3 → 4 | Experience (the T comes forward) |
| 4 → 5 | Contact (everything comes back together) |

Follow it through four files:

1. [`storyTime.ts`](../src/motion/storyTime.ts) is a **pure function**: given the scroll position and where each section sits, it returns story time. Pure means it only calculates and never touches the page, which makes it easy to test.
2. [`useScrollStory.ts`](../src/motion/useScrollStory.ts) listens to scrolling, measures the sections (again whenever they change size), and writes the result into a plain shared object, [`story.ts`](../src/motion/story.ts). It's not state, on purpose: scrolling changes it constantly.
3. [`useStoryTime.ts`](../src/motion/useStoryTime.ts) reads `story.time` on every animation frame and **glides** toward it, so a mouse wheel's big jumps still look smooth. `CATCH_UP` controls how quickly it follows.
4. [`choreography.ts`](../src/motion/choreography.ts) is the script. `KEYFRAMES` is a list of moments and the pose the logo should be in at each one. `poseAt(time)` blends between the two nearest keyframes.

A **pose** ([`pose.ts`](../src/motion/pose.ts)) describes the logo at one moment: how far apart the pieces are (`spread`), which part is in focus, how bright the glow is, and the rotation.

> **Try it.** In `choreography.ts`, change the second keyframe's `rotY: -28` to `rotY: -60`. Scroll slowly through the intro: the logo now swings much further as it turns. Then try `CATCH_UP = 2` in `useStoryTime.ts` for a lazier, floatier feel.

---

## 13. The logo, flat and 3D

Open [`src/three/Stage.tsx`](../src/three/Stage.tsx). The stage computes the pose from story time and hands it to **two** logos:

- **The flat logo** ([`FallbackLogo.tsx`](../src/three/FallbackLogo.tsx)) is plain SVG. It shows straight away while the 3D loads, and stays for good in browsers without 3D. [`fallbackLayout.ts`](../src/three/fallbackLayout.ts) turns a pose into positions and brightness for each piece.
- **The 3D logo** ([`LogoCanvas.tsx`](../src/three/LogoCanvas.tsx) and [`LogoModel.tsx`](../src/three/LogoModel.tsx)) uses the *same* `fallbackLayout` numbers, so the two always match, and the switch from flat to 3D can be a quiet crossfade.

Both draw the same shapes, from one file: [`src/brand/logoPaths.ts`](../src/brand/logoPaths.ts).

**How the 3D part loads**, which is also good practice in general:
- `lazy(() => import('./LogoCanvas'))` keeps the large 3D library out of the first download. It's fetched separately, and only once the browser is idle (`requestIdleCallback`).
- `<Suspense>` says what to show while it loads (nothing here, since the flat logo is already visible).
- `<ErrorBoundary>` ([`ErrorBoundary.tsx`](../src/components/ErrorBoundary.tsx)) catches any 3D crash and keeps the flat logo instead of breaking the page.
- [`webgl.ts`](../src/three/webgl.ts) checks first whether the browser can do 3D at all.

**React Three Fiber in one paragraph.** It lets you write three.js scenes as JSX. `<Canvas>` creates the 3D view and camera. Lowercase tags like `<mesh>`, `<pointLight>` and `<boxGeometry>` become three.js objects. `useFrame(callback)` runs your function before every frame is drawn, which is where `LogoModel` moves pieces, tilts toward the mouse and updates glows, by changing the objects directly instead of through React state. `useThree()` hands you the renderer, scene and camera. [`shapes.ts`](../src/three/shapes.ts) turns the flat logo outlines into solid 3D pieces with `ExtrudeGeometry`.

**Why it's light on devices:**
- The canvas only draws when something changes (`frameloop="demand"`).
- Its graphics programs compile in the background before the first frame (`compileAsync`, in `LogoCanvas.tsx`).
- The lighting is plain lamps ([`Studio.tsx`](../src/three/Studio.tsx)). Fancier lighting looked similar but froze phones for seconds while it prepared.
- The neon glow is a "bloom" filter ([`Glow.tsx`](../src/three/Glow.tsx)) that only affects the brightest red parts.

**The labels** ([`TeardownLabels.tsx`](../src/three/TeardownLabels.tsx)) are plain HTML. When the 3D logo is showing, it works out where each part is on screen every frame and writes that into [`labelLayout.ts`](../src/three/labelLayout.ts), so the leader lines stay attached as the logo turns.

> **Try it.** In `Studio.tsx`, change the last lamp's `intensity: 9` to `intensity: 25`. The red rim light from behind gets much stronger. Look at the edges of the T.

---

## 14. Tests

Run `npm test`. 78 checks run in a couple of seconds. Tests live next to what they test, in files ending in `.test.ts(x)`. Open [`src/lib/experienceFilter.test.ts`](../src/lib/experienceFilter.test.ts):

```ts
it('shows only teaching under TEACHING', () => {
  expect(ids('teaching')).toEqual(['teaching-assistant'])
})
```

- `describe` groups related tests, and `it` is one test, named as a sentence.
- `expect(actual).toEqual(expected)` fails the test if they differ.

Pure functions, like the filter, `storyTime`, `poseAt` and the logo geometry, are the easiest things to test. That's one reason the project keeps logic out of components.

[`src/components/CopyButton.test.tsx`](../src/components/CopyButton.test.tsx) tests a component like a user would: render it, click it, read what's on screen. It also fakes the clock, so it can skip 1.5 seconds instantly.

[`src/content/content.test.ts`](../src/content/content.test.ts) checks your content: every project says what you did, every link is a real https address, and the CV button only turns on when the CV file exists.

`npm run test:watch` re-runs the tests every time you save.

---

## 15. Recipes

**Before publishing anything,** run these four. If all pass, you're safe:

```bash
npm run check   # TypeScript + linter
npm test        # unit tests
npm run build   # makes sure the site builds
npm run shots   # screenshots at laptop, tablet and phone sizes, in shots/
```

### Add a project
1. In `src/content/projects.ts`, copy an existing project object and edit it. Small cards (`size: 'small'`) need no image.
2. For a large or medium card, add an image: either a screenshot at `public/images/projects/<slug>.webp` (16:10, about 1200 × 750), or copy an illustration in `design/project-art/`, edit it, and run `node scripts/render-images.mjs`.
3. Set `image: { src: '/images/projects/<slug>.webp', alt: 'What the image shows' }`.

### Add an experience entry
1. In `src/content/experience.ts`, add an object in the right place. The list is oldest first.
2. If it's your new current role, move `now: true` onto it (the tests check there's exactly one).
3. Committees inside a role go in `committees: [{ role: 'Head', event: '…' }, { event: '…' }]`.

### Change any text
Everything is in `src/content/`: `profile.ts` (name, one-liner, bio, spec sheet, contact, logo labels, footer), `projects.ts`, `experience.ts` and `chapters.ts` (chapter names and figure captions).

### Add your photo
Save it as `public/images/portrait.jpg`, in portrait shape (4:5). That's it.

### Show or hide the CV button
`public/cv.pdf` plus `cvUrl: '/cv.pdf'` in `profile.ts` shows it. `cvUrl: ''` hides it. To update your CV, replace the file and push.

### Hide "Open to internships"
In `profile.ts`, set `availability: ''`. The pill disappears from the top bar, the phone menu and the intro.

### Change the brand color
1. `src/styles/tokens.css`: `--red`, `--red-label` and `--red-hot`.
2. `src/brand/colors.ts`: the logo's reds.
3. `public/favicon.svg` and the drawings in `design/` (then run `node scripts/render-images.mjs`).

### Change the logo's labels
`teardown` in `profile.ts`. Keep each label about its own part: D is Developer, T is Team, and the core is Always learning.

### Update the live site
Once the site is connected to Vercel (see the README), every `git push` to `main` publishes automatically:

```bash
git add -A
git commit -m "Describe what you changed"
git push
```

---

## 16. Glossary

| Term | Meaning |
|---|---|
| **Component** | A function that returns what should appear on screen. Written with a capital letter. |
| **JSX** | The HTML-like syntax inside components. `{ }` inserts JavaScript. |
| **Props** | A component's inputs, passed like HTML attributes. They flow down from parent to child. |
| **children** | The prop holding whatever is between a component's opening and closing tags. |
| **Render** | React running a component to work out what it should show. It happens again whenever its state, props or context change. |
| **State** | Data a component remembers that, when changed, redraws the component (`useState`). |
| **Effect** | Code that runs after rendering, to deal with things outside React like timers and browser features (`useEffect`). Can return a cleanup. |
| **Hook** | A function starting with `use` that adds a React feature to a component. You can write your own. |
| **Context** | A value that components deep in the tree can read without it being passed through every layer. |
| **Ref** | A box that keeps a value between renders without causing renders. Also how you get hold of a real page element. |
| **Key** | A stable id on each item in a list, so React can tell the items apart. |
| **Pure function** | A function that only calculates from its inputs and changes nothing else. Easy to test. |
| **CSS Module** | A `.module.css` file whose class names are made unique to one component. |
| **Design token** | A named value (color, size, timing) in `tokens.css`, used everywhere instead of raw numbers. |
| **Build** | Turning the source code into the small, fast files a browser downloads (`npm run build` → `dist/`). |
| **Lazy loading** | Downloading part of the code only when it's needed (`lazy(() => import(...))`). |
| **WebGL** | The browser feature for drawing 3D with the graphics card. |
| **Shader** | A small program that runs on the graphics card to draw pixels. It must be "compiled" before first use. |
| **React Three Fiber** | A library that lets you build three.js 3D scenes with React components. |
| **Story time** | This project's single number for "how far along the page you are", which every animation follows. |
| **Pose** | How the logo looks at one moment: spread, focus, glow and rotation. |

### Where to go next
- [react.dev/learn](https://react.dev/learn), React's official tutorial. Its "Thinking in React" page fits this project well.
- The [three.js manual](https://threejs.org/manual/) and [React Three Fiber docs](https://r3f.docs.pmnd.rs), if you want to change the 3D.
- [Next.js](https://nextjs.org/learn), which you're learning, is React plus page routing and server rendering. Everything in this tour carries straight over.
