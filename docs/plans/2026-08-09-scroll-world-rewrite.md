# MyCV Scroll-World Portfolio Rewrite Implementation Plan

> **For Hermes:** Use the subagent-driven-development skill to implement this plan task-by-task, with specification review and code-quality review after each task.

**Goal:** Rebuild `abdulshakoor02/mycv` from a conventional stacked portfolio into a performant, accessible, scroll-driven Three.js portfolio inspired by the architecture of Meng To's Kage site, while preserving Abdulshakoor's real experience, projects, technical credibility, and contact paths.

**Architecture:** Keep one persistent React Three Fiber renderer and one semantic HTML document. Native document scroll is converted into a deterministic fractional chapter state; exact state drives navigation/accessibility and smoothed state drives camera/world interpolation. The 3D world is a technical systems landscape rather than a copy of Kage's Kyoto visual language.

**Tech Stack:** Next.js App Router, React, TypeScript, React Three Fiber, Three.js, Drei, Framer Motion only for DOM micro-interactions, CSS/Tailwind for layout, optional postprocessing only after the base scene is profiled. Current project is Next.js `15.4.1`, React `19.1.0`, Three `0.178.0`, R3F `9.2.0`; registry latests observed during planning are Next `16.3.0`, React `19.2.8`, Three `0.185.1`, R3F `9.7.0`, Drei `10.7.8`. Do not upgrade major dependencies as part of the first rewrite unless a compatibility issue requires it.

---

## 1. Existing System Review

The current application is a conventional client-heavy portfolio:

- `src/app/page.tsx` renders `Navigation`, `Hero`, `Experience`, `Skills`, `Projects`, `Contact`, and `Footer` as stacked sections.
- `Hero.tsx` contains the only 3D scene, with a fixed-height `500px` R3F canvas, an avatar/blister-pack scene, `OrbitControls`, auto-rotation, and an apartment environment.
- `Scene.tsx` owns the renderer and scene locally; it is not persistent across the document and is not connected to page scroll.
- `Avatar.tsx` is a billboard-style avatar image plus simple geometry and technology-colored squares.
- Existing section components contain the portfolio content that must be preserved and reorganized, not discarded.
- `Navigation.tsx` independently listens to `scroll` and performs `scrollIntoView`; it has no shared chapter state.
- `globals.css` currently uses a generic dark blue/purple/cyan glassmorphism theme with duplicated base layers.
- The contact form is currently visual only and has no submission handler/backend; the rewrite must not falsely represent it as functional.
- Project action buttons currently have no real URLs and must become either real links or clearly disabled/removed actions.

The rewrite should therefore replace the presentation architecture while retaining and improving the content/data layer.

## 2. Product Direction

### Visual concept: “Systems in Motion”

Do not clone Kage's subject matter, assets, copy, or code. Reuse the proven interaction architecture and quality principles only.

The portfolio world should communicate:

- senior technical leadership;
- distributed systems and microservices;
- real-time event and payment flows;
- cloud infrastructure and reliability;
- applied ML/trading systems as a current technical focus;
- disciplined engineering rather than generic “tech neon” decoration.

Suggested visual grammar:

- dark graphite/navy base;
- restrained cyan/amber/green signal accents;
- thin grid, nodes, paths, data packets, service blocks, and restrained atmospheric particles;
- warm amber for active systems and milestones;
- cool cyan for infrastructure and architecture;
- green for healthy/live state;
- red only for warnings or inactive/failure states;
- typography: existing Geist/Space Grotesk may remain initially; add a compact mono face only if it materially improves technical labels.

### Chapters

Use six authored chapters initially. ML/trading is intentionally not a public first-class chapter; it can be mentioned only where it truthfully supports the broader software-engineering story.

| Index | ID | Story | 3D composition |
|---:|---|---|---|
| 0 | `identity` | Who I am and what I build | Wide system horizon, abstract personal signal, quiet boot state |
| 1 | `leadership` | Senior technical leadership and delivery | Architecture control plane, branching team/service routes, moving signal paths |
| 2 | `systems` | Backend, cloud, data, and distributed systems | Microservice clusters, event streams, database/storage landmarks |
| 3 | `engineering` | Engineering craft across the stack | Layered runtime: API, frontend, data, infrastructure, observability, and deployment nodes |
| 4 | `projects` | Selected work and measurable impact | Four project landmarks focused through DOM cards; no live-demo/source-code buttons |
| 5 | `contact` | Collaboration and next step | Calm launch/connection state, email and LinkedIn CTA, footer and fallback poster |

Each chapter must differ in camera composition and world state, not just copy. The 3D scene must remain one world; no per-section renderer or visible object teleportation.

### Original world concept: “The Systems Observatory”

The experience should feel like moving through a quiet, nocturnal operations observatory rather than a generic neon dashboard. Kage's useful principles are retained — persistent spatial continuity, authored camera chapters, atmospheric depth, foreground layering, restrained typography, and native reversible scroll — but the subject and art direction are original.

The world is a monumental dark observatory built from engineering abstractions:

- a central **signal spine** carries small illuminated packets through the entire journey;
- **service monoliths** and smaller modular nodes represent systems without pretending to be literal production diagrams;
- thin bridges and cable-like paths connect layers of the stack;
- translucent architectural plates represent interfaces, contracts, and boundaries;
- a distant amber “horizon” represents shipped outcomes and human impact;
- cool cyan infrastructure lights, warm amber event pulses, and restrained green health indicators form the palette;
- fog, depth planes, sparse dust/particles, and foreground framing create a cinematic sense of scale;
- the scene should feel deliberate, calm, and senior — not like a crypto dashboard or a cyberpunk game.

The existing avatar image is deliberately removed from the 3D world. Identity is communicated through typography, copy, a subtle abstract personal marker, and the quality of the systems landscape rather than a billboard portrait.

### Chapter art direction

- **Identity:** camera starts beyond the observatory threshold; the signal spine is dormant, then a single packet travels toward the horizon as the name and role resolve in the DOM.
- **Leadership:** camera passes a branching control structure where several routes converge into one stable path; this visualizes coordination, architecture decisions, review, and delivery without literal office/team avatars.
- **Systems:** camera descends between service towers. Events travel across bridges toward storage cores; lights, fog, and packet density change continuously as the story moves.
- **Engineering:** camera rotates through a layered cross-section of the stack — interface, application, data, infrastructure, and observability — with each layer becoming the focal plane in sequence.
- **Projects:** camera reaches a gallery-like terminal platform. Four project landmarks have distinct silhouettes and material accents; selecting a DOM card focuses the corresponding landmark without taking control away from scroll.
- **Contact:** camera rises above the system and looks toward the amber horizon. Activity quiets, leaving a clear invitation to connect by email or LinkedIn.

Each chapter has a different spatial relationship and emotional beat. The 3D scene must not merely recolor the same object between sections.

### Content truth requirements

Before implementation, confirm or correct:

- current title and preferred positioning;
- exact employment dates and company names;
- whether the phone number should be displayed fully;
- whether any additional verified project metadata should be included in the project cards.

Do not invent metrics, employers, responsibilities, project links, or performance claims.

---

## 3. Target Architecture

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    world/
      ScrollWorld.tsx          # client boundary and Canvas host
      WorldCanvas.tsx          # persistent R3F renderer/scene
      WorldLighting.tsx
      WorldAtmosphere.tsx
      WorldLandmarks.tsx
      CameraRig.tsx
      WorldState.ts
      useScrollWorld.ts
    scroll/
      ScrollConductor.ts       # exact/smooth native-scroll state
      ChapterSections.tsx      # semantic sections and DOM story
      chapter-config.ts        # single chapter ledger
      chapter-navigation.tsx
    sections/
      IdentityChapter.tsx
      LeadershipChapter.tsx
      SystemsChapter.tsx
      MlTradingChapter.tsx
      ProjectsChapter.tsx
      ContactChapter.tsx
      Footer.tsx
    content/
      profile.ts
      experience.ts
      skills.ts
      projects.ts
    accessibility/
      WebGLFallback.tsx
      MotionPreferences.tsx
  lib/
    math.ts
    performance.ts
    analytics.ts (optional; only if required)
  types/
    portfolio.ts
public/
  avatar.png
  poster-system-world.webp (or png)
  models/ (only if approved assets exist)
  textures/ (compressed/local assets only)
docs/
  plans/2026-08-09-scroll-world-rewrite.md
```

### Single source of truth

`chapter-config.ts` must define, for each chapter:

- ID and DOM anchor;
- scroll weight;
- eyebrow/title/body copy;
- desktop and mobile camera position/target/FOV;
- world lighting/fog/particle/material state;
- visible landmark set;
- interactive IDs;
- asset group and prefetch group;
- DOM transition behavior.

No component may compare raw `scrollY` against unrelated magic thresholds.

### Renderer ownership

Create exactly one canvas/renderer for the route. `ScrollWorld` owns the canvas and semantic document wrapper. The renderer must:

- use `outputColorSpace = THREE.SRGBColorSpace`;
- use a conservative DPR cap (`1.25–1.5` mobile, `1.5–2` desktop initially);
- pause on hidden tab and when the world is outside the viewport if the implementation allows it;
- handle resize without distortion;
- expose a WebGL fallback and context-loss state;
- dispose resources on unmount.

Do not use `OrbitControls` in the production scroll journey. If a debug camera is needed, gate it behind a development-only flag.

---

## 4. Implementation Phases

### Phase 0: Content and design lock

**Objective:** Freeze the content contract and visual direction before touching the renderer.

**Files:**
- Create `src/components/content/profile.ts`
- Create `src/components/content/experience.ts`
- Create `src/components/content/skills.ts`
- Create `src/components/content/projects.ts`
- Create `src/types/portfolio.ts`
- Modify existing section components only after data extraction

**Tasks:**

1. Extract existing hard-coded profile, experience, skills, and project data into typed modules.
2. Add stable IDs for experience entries, skills, projects, and chapters.
3. Mark every project action as `href: string | null` and render only verified links.
4. Add a `contentStatus` or `verified` convention for claims that still need user confirmation.
5. Record the final six-chapter story and visual grammar in this plan or a companion world-bible document.

**Verification:** TypeScript compiles; rendered text matches the current source content; no fabricated links or metrics appear.

### Phase 1: Baseline and dependency safety

**Objective:** Establish a clean baseline before the rewrite.

**Tasks:**

1. Run `npm ci` in `/root/apps/mycv`.
2. Run the available type/build checks and record current failures before changes.
3. Add a `typecheck` script (`tsc --noEmit`) if absent.
4. Decide whether lint uses the existing ESLint setup; do not assume `next lint` is available in future Next versions.
5. Add a minimal browser smoke-test strategy (Playwright if already available, otherwise browser verification through the running dev server).
6. Create a git checkpoint before architectural changes.

**Commands:**

```bash
cd /root/apps/mycv
npm ci
npm run build
npx tsc --noEmit
npm run lint
```

**Verification:** Baseline results are recorded; later failures can be attributed to the rewrite.

### Phase 2: Build the native-scroll conductor

**Objective:** Implement framework-independent deterministic scroll state before connecting Three.js.

**Files:**
- Create `src/components/scroll/ScrollConductor.ts`
- Create `src/components/scroll/useScrollWorld.ts`
- Create `src/components/scroll/chapter-config.ts`
- Create `src/components/scroll/ChapterSections.tsx`
- Create tests for progress and segment calculations

**Required behavior:**

- Measure section anchors after fonts/layout settle.
- Convert native `scrollY` into `exact` fractional chapter progress.
- Maintain `smooth` progress using frame-rate-independent exponential damping.
- Track direction.
- Re-measure after ResizeObserver, width resize, orientation changes, hash changes, and content/layout changes.
- Use exact state for active nav, chapter IDs, accessibility, and interaction gating.
- Use smooth state only for visual interpolation.
- Support `goToChapter(index)` using native `window.scrollTo`.
- Never integrate wheel delta as the story position.
- Pause RAF work while the document is hidden.
- Respect `prefers-reduced-motion` by making smooth equal exact and stopping ambient motion.

**Unit cases:**

- top of document maps to chapter `0`;
- bottom maps to final chapter;
- anchors remain monotonic;
- mid-anchor maps to expected local progress;
- reverse scroll updates direction correctly;
- reduced motion removes damping;
- resize/re-measure preserves current logical progress;
- empty sections fail clearly.

### Phase 3: Semantic DOM chapter layer

**Objective:** Replace the current stacked visual sections with accessible chapter sections that remain complete without WebGL.

**Files:**
- Create `src/components/sections/IdentityChapter.tsx`
- Create `src/components/sections/LeadershipChapter.tsx`
- Create `src/components/sections/SystemsChapter.tsx`
- Create `src/components/sections/MlTradingChapter.tsx`
- Create `src/components/sections/ProjectsChapter.tsx`
- Create `src/components/sections/ContactChapter.tsx`
- Modify `src/components/layout/Navigation.tsx`
- Modify `src/components/layout/Footer.tsx`
- Modify `src/app/page.tsx`

**Requirements:**

- Real `main`, `nav`, headings, paragraphs, lists, links, buttons, and footer.
- Each chapter has a stable `id` and `data-chapter`/`data-cam` marker.
- Full content remains in the DOM regardless of visual animation state.
- Navigation uses the conductor's exact active chapter, not an independent scroll listener.
- `aria-current` follows exact state.
- Keyboard users can navigate chapters and activate project/contact actions.
- Every important 3D hotspot has an equivalent DOM link/button.
- Avoid putting essential copy inside the canvas.
- The footer must remain reachable through normal native scrolling.

### Phase 4: Persistent R3F world shell

**Objective:** Replace the hero-only OrbitControls scene with one persistent world mounted for the entire page.

**Files:**
- Create `src/components/world/ScrollWorld.tsx`
- Create `src/components/world/WorldCanvas.tsx`
- Create `src/components/world/WorldLighting.tsx`
- Create `src/components/world/WorldAtmosphere.tsx`
- Create `src/components/world/CameraRig.tsx`
- Replace `src/components/3d/Scene.tsx`
- Remove the avatar-specific scene path from `src/components/3d/Avatar.tsx` (delete it if no remaining consumer exists)

**Initial world implementation:**

- Procedural geometry first; no large model download in the first milestone.
- Persistent environment group, landmarks group, chapter-set group, interactive proxy group, and atmosphere group.
- Identity landmark can reuse `avatar.png`, but it must be integrated as a world object rather than a standalone blister-pack hero.
- Add a ground/grid or spatial platform, service nodes, links, data packets, and a small number of focal objects.
- Use real lighting and materials with a restrained palette.
- Add a static poster/fallback before adding particles or postprocessing.

**Camera rig:**

- Store camera endpoint position, target, and FOV per chapter.
- Resolve mobile endpoints separately.
- Interpolate position and target; do not interpolate Euler angles.
- Add pointer parallax only after the scroll camera works and clamp it heavily.
- Preserve exact progress across resize and breakpoint changes.

### Phase 5: Chapter world-state interpolation

**Objective:** Make the 3D world evolve continuously with the same chapter state as the DOM.

**Files:**
- Modify `src/components/world/WorldCanvas.tsx`
- Modify `src/components/world/WorldLighting.tsx`
- Modify `src/components/world/WorldAtmosphere.tsx`
- Create `src/components/world/WorldState.ts`
- Modify `src/components/scroll/chapter-config.ts`

**Interpolated channels:**

- camera position/target/FOV;
- key/fill/rim light intensity and color;
- fog density/color;
- node/packet activity;
- landmark scale/visibility/opacity where appropriate;
- material emissive intensity;
- particle density and speed;
- active project landmark emphasis.

Use named channels and resolve adjacent chapter states once per frame. Avoid scattered `if (progress > ...)` checks.

**Seam rules:**

- no visible teleportation in open space;
- hide unavoidable swaps behind fog, darkness, occlusion, or a continuous material/transform transition;
- previous chapter assets remain resident until reverse scrolling is safe.

### Phase 6: Interactive project landmarks

**Objective:** Add meaningful local interaction without fighting macro scroll.

**Files:**
- Create `src/components/world/InteractiveRegistry.ts`
- Create `src/components/world/ProjectLandmarks.tsx`
- Create `src/components/sections/ProjectDetail.tsx` or a DOM detail panel
- Modify `src/components/sections/ProjectsChapter.tsx`

**Requirements:**

- Raycast only against simple named proxy objects.
- Interaction states: unavailable, idle, hover, focused, active.
- Gate each interaction using exact chapter progress.
- Hover may brighten a node or reveal a label; it must not move the scroll camera off its authored path.
- Keyboard/focus interaction uses the same state setter as pointer interaction.
- Touch uses a sufficiently large DOM control and tap-to-focus where necessary.
- Scrolling away retires active detail state gracefully.

### Phase 7: Performance, loading, and failure paths

**Objective:** Make the world usable on mobile and robust under failure.

**Files:**
- Create `src/lib/performance.ts`
- Create `src/components/accessibility/WebGLFallback.tsx`
- Modify `src/components/world/WorldCanvas.tsx`
- Modify `src/app/globals.css`
- Add local poster asset under `public/`

**Starting budgets:**

| Budget | Mobile | Desktop |
|---|---:|---:|
| DPR cap | 1.25–1.5 | 1.5–2 |
| visible triangles | 150k–300k | 500k–1.2m |
| draw calls | 50–90 | 90–160 |
| dynamic shadow lights | 1–2 | 2–4 |
| initial transfer | 3–6 MB | 5–10 MB |
| steady frame time | <=25 ms fallback | <=16.7 ms target |

**Requirements:**

- Start with one quality tier and add conservative downgrade controls only after measurement.
- Lower DPR/post effects before deleting authored landmarks.
- Cap `dt` after stalls.
- Pause rendering on hidden tabs.
- Add WebGL unavailable fallback with poster and complete DOM content.
- Handle `webglcontextlost` without silently blanking the portfolio.
- Dispose geometries, materials, textures, render targets, observers, listeners, and RAF on teardown.
- Lazy-load optional assets one or two chapters ahead only if the first implementation needs them.

### Phase 8: Visual system and responsive composition

**Objective:** Replace the generic glassmorphism theme with a coherent technical editorial system.

**Files:**
- Rewrite `src/app/globals.css`
- Modify all chapter components
- Modify `src/app/layout.tsx` only if font changes are approved

**Requirements:**

- Establish CSS variables for background, ink, muted text, grid, cyan signal, amber event, green health, and warning red.
- Use stable reading panels/scrims only where needed for contrast.
- Avoid excessive blur and gradient noise.
- Author desktop, tablet, and mobile camera compositions separately.
- Keep copy readable against changing world backgrounds.
- Verify 390×844, 768×1024, and 1440×900.
- Provide visible focus states and sufficient contrast.
- Reduced-motion mode removes ambient loops, cursor trails, and large transitional effects while preserving content and navigation.

### Phase 9: Contact and external links

**Objective:** Make the closing chapter trustworthy and functional.

**Files:**
- Create `src/components/sections/ContactChapter.tsx`
- Modify `src/components/layout/Footer.tsx`

**Requirements:**

- Replace the non-functional contact form with two prominent, real CTAs:
  - `mailto:shakoor.ansari@hotmail.com`
  - `https://www.linkedin.com/in/abdul-ansari-a271ba40`
- Do not create a form backend in this rewrite.
- Keep phone/email details accurate and only display the phone number according to the approved content decision.
- Open LinkedIn externally with appropriate `target` and `rel="noreferrer"` behavior.
- Verify the email and LinkedIn links manually.
- The contact chapter should feel like the observatory's calm connection/launch state, not a generic form card.

### Phase 10: Verification and release

**Objective:** Prove the entire journey works, not just that the build passes.

**Build checks:**

```bash
npm run typecheck
npm run build
npm run lint
```

**Browser checks:**

- initial load at top;
- slow scroll through every chapter;
- fast scroll and scrollbar drag;
- reverse scroll through every seam;
- reload at a deep scroll position;
- anchor navigation from nav/footer;
- resize between chapters;
- mobile viewport and coarse pointer;
- keyboard-only navigation;
- reduced-motion media query;
- WebGL disabled/fallback;
- hidden-tab pause/resume;
- contact links and project links;
- clean browser console.

**Performance checks:**

- record renderer calls, triangles, DPR, and frame time;
- check network transfer and image/model sizes;
- identify shader compilation hitching;
- confirm no steady-state memory growth after repeated route mount/unmount if tested in a host shell;
- confirm all teardown listeners/RAF are removed.

**Visual evidence:**

Capture representative screenshots at each chapter for:

- 1440×900 desktop;
- 768×1024 tablet;
- 390×844 mobile;
- reduced motion/fallback state.

Do not claim success based only on DOM/build checks; visual and interaction verification are required.

---

## 5. Out of Scope for the First Rewrite

- Copying Kage's assets, source, visual theme, or Kyoto content.
- Adding a backend/CMS for portfolio content.
- Adding audio, video, complex GLTF environments, or full postprocessing before the procedural world is stable.
- Replacing native scrolling with Lenis or a custom scrollbar.
- Adding speculative claims, fake project metrics, or unverified links.
- Upgrading the entire Next/React dependency stack solely because newer registry versions exist.
- Building a trading/ML dashboard or making ML/trading a public first-class chapter; any such experience should remain outside this general software-development portfolio.

## 6. Recommended Delivery Order

1. Content lock and baseline.
2. Scroll conductor with tests.
3. Semantic chapter DOM.
4. Persistent canvas and camera rig.
5. Procedural world landmarks.
6. World-state interpolation.
7. Project interactions.
8. Performance/fallback/reduced motion.
9. Visual polish.
10. Full browser/performance verification.

Each phase should end with a small commit and a working build. Do not proceed to visual polish while scroll determinism, semantic content, or fallback behavior is broken.

## 7. Acceptance Criteria

The rewrite is complete only when:

- one persistent Three.js/R3F world remains alive across the full native-scroll document;
- exact and smooth chapter state are separate and deterministic;
- camera, lighting, atmosphere, landmarks, DOM navigation, and interactions derive from the same chapter ledger;
- desktop and mobile have intentional camera compositions;
- all original truthful portfolio content is preserved or explicitly revised;
- the page remains useful with reduced motion and without WebGL;
- project/contact actions are real or clearly not presented as functional;
- no visible chapter seam teleports objects in open space;
- build/type/lint checks pass;
- browser verification covers forward, reverse, fast, reload-at-depth, resize, keyboard, mobile, reduced-motion, and fallback paths;
- performance measurements are recorded and within the agreed budget.

## 8. Decisions Recorded

The following product decisions are confirmed for implementation:

1. “Systems in Motion” is the approved visual direction.
2. ML/trading is not a first-class public chapter; the public story is software development in general.
3. Project URL/source buttons are removed. Project cards remain explanatory and factual; verified metadata may be added later without inventing links.
4. The current non-functional contact form is replaced with direct email and LinkedIn CTAs.
5. LinkedIn CTA URL: `https://www.linkedin.com/in/abdul-ansari-a271ba40`.
6. Email CTA: `mailto:shakoor.ansari@hotmail.com`.
7. The existing avatar image is not used as a 3D landmark. Identity is represented through typography, copy, and the Systems Observatory world.
8. The first 3D milestone uses procedural geometry before external models, large textures, or full postprocessing.

Still to confirm during content lock:

- exact current role/title and whether “Senior Technical Lead” remains the primary headline;
- whether the phone number should be displayed fully;
- any additional verified project metadata to include in the cards.

---

## Suggested Commit Sequence

```text
chore: establish rewrite baseline and typed portfolio content
feat: add deterministic native scroll conductor
feat: add semantic portfolio chapter document
feat: add persistent R3F world shell and camera rig
feat: add procedural systems-world landmarks
feat: interpolate world state across authored chapters
feat: add accessible project landmark interactions
feat: add performance governor and WebGL fallback
style: apply systems-in-motion visual language
feat: finalize contact links and responsive navigation
test: verify scroll-world journey across viewports
```

## Plan Status

This document is a planning artifact only. No application source files were changed while creating it.
