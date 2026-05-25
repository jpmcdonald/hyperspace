# Development backlog

Planning artifact for the three stubbed modules: **Penteract**, **Pendulum Phase Space**, **Iris Projection**. No implementation in this document — only sequenced work units.

---

## Conventions

**Structure:** Work is grouped into **epics** (one per module) plus **cross-cutting** tasks and a **deferred** list. Within an epic, tasks are numbered; dependencies are noted inline (`depends on Penteract-2`).

**Sizing:** One task = one focused outcome completable in a single session by someone who has read `docs/MODULES.md` and `docs/ARCHITECTURE.md`. "Implement Penteract" is too big; "Add `buildVertices()` for n=5 in `geometry.js`" is right.

**Done for a module:** All numbered tasks in its epic are complete; module is registered in `App.jsx` with `status: 'ready'` and `component` set; puzzles load; manual smoke test passes (`npm run dev`, open module, rotate, interact, one puzzle answered). No requirement for automated tests unless added explicitly in backlog.

**Out of scope for this backlog:** Automated CI, mobile layout polish, accessibility audit, modules beyond the three named.

---

## Recommended implementation order

1. **Penteract** — Direct extension of the shipped Tesseract pattern: same canvas pipeline, same shared `ProjectionEngine`, only combinatorics and UI density change. Validates that shared infrastructure scales to \(n=5\) before adding unrelated paradigms.

2. **Pendulum Phase Space** — Introduces time integration and 2D phase plotting, a different module archetype. Shared layer may gain `TimeStepper.js`; does not block Iris.

3. **Iris Projection** — Reuses 4D rotation/projection but adds embedded data, species coloring, and point-cloud rendering. Most product copy and normalization decisions; benefits from prior experience with rotation UX from Tesseract/Penteract.

---

## Epic: Penteract

### Penteract-1 — Module scaffold

Create `src/modules/Penteract/` with empty default export `Penteract.jsx` (placeholder canvas + "loading" text). Wire `component: Penteract` in `App.jsx` but leave `status: 'coming'` until Penteract-10.

**Depends on:** nothing.

### Penteract-2 — Geometry: vertices and edges

Create `src/modules/Penteract/geometry.js` with `buildVertices()` (32 points, 5-bit pattern) and `buildEdges()` (single-bit XOR rule). Export counts as constants for puzzles (`VERTEX_COUNT`, etc.).

**Depends on:** Penteract-1.

### Penteract-3 — Geometry: 4-cells

Add `build4Cells()` (or `buildCells()`): 10 tesseract-cells, each 16 vertex indices, labels `w+`, `v−`, etc. Match Tesseract cell object shape `{ axis, sign, verts, label }` extended for 5D.

**Depends on:** Penteract-2.

### Penteract-4 — Canvas renderer (static)

Copy Tesseract render loop structure into `Penteract.jsx`: `rotationPlanes(5)`, project all vertices/edges, draw on canvas **without** interaction. Tune edge alpha for 80-edge legibility.

**Depends on:** Penteract-2, Penteract-3.

### Penteract-5 — Rotation controls + animation

Wire `RotationControls` with `threeDimensionalCount={3}`, `stateRef` angles/spin, RAF loop. Default spin: **decision** — single higher-dim plane (document choice in code comment).

**Depends on:** Penteract-4.

### Penteract-6 — Vertex marking

Click-to-mark gold vertices; persist marks through rotation (combinatorial index). `clear marks` button.

**Depends on:** Penteract-5.

### Penteract-7 — Cell isolation

Side panel: 10 cell buttons; dim non-cell edges/verts when one active. Toggle off on second click.

**Depends on:** Penteract-3, Penteract-5.

### Penteract-8 — Puzzles

Create `src/modules/Penteract/puzzles.js`: at least 5 counting questions (vertices 32, edges 80, faces 80, 4-cells 10, 3-cells 40 or similar). Wire `PuzzlePanel`.

**Depends on:** Penteract-2.

### Penteract-9 — Panel chrome

Match Tesseract layout: hide/show panel, reset view, footer hint text updated for 5D, score display.

**Depends on:** Penteract-6, Penteract-8.

### Penteract-10 — Ship

Set `status: 'ready'` in `App.jsx`. Remove placeholder text. Manual smoke test checklist in commit message or PR notes.

**Depends on:** Penteract-7, Penteract-9.

---

## Epic: Pendulum Phase Space

### Phase-1 — Module scaffold

Create `src/modules/PhaseSpace/PhaseSpace.jsx` placeholder. Register in `App.jsx` (`id: 'phase'`), keep `status: 'coming'`.

**Depends on:** nothing (can parallel Penteract after Penteract-4 if desired).

### Phase-2 — Dynamics core

Create `src/modules/PhaseSpace/dynamics.js`: state `{ theta, omega }`, `deriv(state, params)`, integrator (recommend RK4), params `{ g, L, b, linearized }`.

**Depends on:** Phase-1.

### Phase-3 — Phase canvas

Draw axes, grid, trajectory polyline from integration history. Play/pause toggles integration in RAF loop.

**Depends on:** Phase-2.

### Phase-4 — Set initial condition

Click or drag on canvas to set \((\theta, \omega)\); clear trajectory on new IC.

**Depends on:** Phase-3.

### Phase-5 — Parameter sliders

Sidebar: \(g\), \(L\), \(b\), linearized toggle. Pause integration when params change (design choice — document in UI).

**Depends on:** Phase-3.

### Phase-6 — Pendulum inset (recommended)

Small schematic: bob angle from current \(\theta\). Same RAF tick as phase integration.

**Depends on:** Phase-3.

**Optional skip:** if time-constrained, defer inset to Phase-6b and ship without it — note in MODULES.md if skipped.

### Phase-7 — Energy readout

Compute and display energy when \(b=0\); show numeric drift when damping on.

**Depends on:** Phase-2, Phase-5.

### Phase-8 — Puzzles

Create `puzzles.js`: ellipse vs spiral, effect of damping, dimension of phase space, etc. Wire `PuzzlePanel`.

**Depends on:** Phase-3.

### Phase-9 — Ship

`status: 'ready'`, smoke test, footer copy.

**Depends on:** Phase-4, Phase-5, Phase-8 (Phase-6, Phase-7 optional but listed in MODULES.md as recommended).

---

## Epic: Iris Projection

### Iris-1 — Module scaffold

Create `src/modules/Iris/Iris.jsx` placeholder. Register in `App.jsx` (`id: 'iris'`).

**Depends on:** nothing.

### Iris-2 — Embedded dataset

Create `src/modules/Iris/irisData.js` (or `data/iris.json` + loader): 150 rows, 4 features, species label. Document source (Fisher Iris, public domain). **Decision:** raw vs centered — pick one for v1, note in file header.

**Depends on:** Iris-1.

### Iris-3 — Species color map

Define fixed color table (3 species, colorblind-safe). Export helper `colorForSpecies(name)`.

**Depends on:** Iris-2.

### Iris-4 — Point cloud renderer

Map each row to 4D point, `rotateND` + `projectND`, draw circles on canvas. No edges.

**Depends on:** Iris-2, Iris-3.

### Iris-5 — Rotation controls

Wire `RotationControls` for `n=4`, same spin/slider pattern as Tesseract.

**Depends on:** Iris-4.

### Iris-6 — Legend + species highlight

Sidebar legend; toggle to dim non-selected species.

**Depends on:** Iris-3, Iris-5.

### Iris-7 — Puzzles

Create `puzzles.js` (dimension count, separation, projection intuition). Wire `PuzzlePanel`.

**Depends on:** Iris-2.

### Iris-8 — Ship

`status: 'ready'`, smoke test.

**Depends on:** Iris-6, Iris-7.

### Iris-9 — PCA align button (optional v1.1)

Compute 4×4 covariance eigenvectors; map to rotation angles or apply fixed 4D rotation matrix before projection. **Decision task** before coding — see MODULES.md open questions.

**Depends on:** Iris-5. **May defer** to post-v1.

---

## Cross-cutting tasks

### X-1 — Fix README drift

Root `README.md` lists `Tesseract/math.js`; Tesseract imports `shared/ProjectionEngine.js` instead. Update README project layout to match repo (documentation-only change). **Do not edit in planning pass if following strict "only three doc files" rule — this task is for implementers.**

### X-2 — `docs/` index link

Add one line to root `README.md` pointing to `docs/ARCHITECTURE.md` and `docs/MODULES.md` when docs land (optional polish).

### X-3 — Extract `TimeStepper.js` (when Phase-3 exists)

If Phase Space integration loop exceeds ~40 lines in component, move `stepRK4(state, dt, deriv)` to `src/shared/TimeStepper.js` with JSDoc. Phase module imports it; no second consumer required yet.

**Depends on:** Phase-2.

### X-4 — Extract canvas resize helper (optional)

Tesseract and Penteract duplicate DPR canvas sizing in `drawFrame`. Optional `src/shared/canvasSetup.js` — **only if** three modules duplicate it; not worth preemptive abstraction.

**Depends on:** Penteract-4.

### X-5 — Shared `sectionLabel` style object

Tesseract exports inline `sectionLabel` constant; Penteract/Iris will copy. Optional move to `src/shared/panelStyles.js` after second duplication.

**Depends on:** Penteract-9 or Iris-6.

### X-6 — ProjectionEngine: batch helper audit

Confirm `projectVertices()` in `ProjectionEngine.js` matches Iris/Penteract needs; use it in Iris-4 if it reduces duplication vs inline `rotateND`/`projectND`.

**Depends on:** Iris-4.

---

## Deferred / out-of-scope

| Item | Reason |
|------|--------|
| **Penteract multi-view (3 shadows)** | High layout/sync cost; single view + puzzles delivers core intuition. Revisit after Penteract-10 if user testing asks for it. |
| **40 cubic-cell buttons on Penteract** | UX unusable; 10 four-cells is the planned isolation granularity. |
| **Double pendulum / chaos module** | Different dynamics and phase space topology; executive-function load much higher. |
| **WebGL / Three.js renderer** | Canvas 2D sufficient for point/edge counts in scope; adds dependency and mental model. |
| **Numerical integration library** | RK4 in ~20 lines; no npm package justified. |
| **sklearn-style PCA dependency** | 4×4 eigendecomposition is small enough to hand-roll for optional Iris-9; no Python bridge. |
| **Automated tests (Vitest)** | Valuable later; not in three-module planning scope. Add epic when first bug regressions hurt. |
| **Generic n-cube geometry in `shared/`** | Tesseract and Penteract share bit-pattern logic; extract `hypercube.js` only when a third wireframe module appears or duplication bugs occur. |
| **Module picker routing for `coming` modules** | Already correct — no work until `status: 'ready'`. |
| **Accessibility (keyboard rotation, ARIA)** | Important for production; defer until core modules ship. |
| **Internationalization** | English-only instrument copy for now. |

---

## Suggested first sprint (minimal path to value)

If implementing incrementally:

1. Penteract-1 through Penteract-5 → rotatable 5-cube on screen  
2. Penteract-6, Penteract-8, Penteract-10 → shippable Penteract without cell isolation  
3. Penteract-7 → cell isolation polish  
4. Phase-1 through Phase-5 → shippable phase portrait  
5. Iris-1 through Iris-5 → shippable Iris  
6. Remaining puzzle/chrome tasks in parallel
