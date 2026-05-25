# Planned modules

Three modules are registered on the landing page (`App.jsx`) with `status: 'coming'`. None have implementation yet. This document specifies what each module is for, how it should behave, and what is still undecided.

The reference implementation is **Tesseract** (`src/modules/Tesseract/`). New geometry modules should compose the same shared pieces unless there is a concrete reason not to.

---

## Penteract (5-cube)

### Concept

A **penteract** is the five-dimensional analogue of a cube: the set of points \((x_1,\ldots,x_5)\) with each coordinate in \(\{-1,+1\}\). You cannot see it all at once. The module shows one 3D shadow at a time while the user rotates in **10** independent planes, building the same intuition the Tesseract module builds for 4D — except the combinatorics are larger and the "inside-out" motion involves two extra axes ( \(v\) and \(u\) in the shared label scheme).

The landing-page pitch ("three different 3D shadows — find which 5D shape is consistent with all three") is a **design direction**, not a settled feature. See Open design questions.

### Mathematical content

An \(n\)-**cube** (hypercube) has \(2^n\) vertices, \(n \cdot 2^{n-1}\) edges, and face/cell counts from the standard formula: the number of \(k\)-faces is \(\binom{n}{k} 2^{n-k}\).

For \(n=5\):

| Object | Count |
|--------|------:|
| Vertices | 32 |
| Edges | 80 |
| Square faces | 80 |
| Cubic 3-cells | 40 |
| 4-cells (tesseract cells) | 10 |

**Rotation:** In \(n\) dimensions, rotation happens in **planes** (pairs of axes), not around single axes. There are \(\binom{n}{2} = n(n-1)/2\) planes. For \(n=5\), that is 10 planes: `xy`, `xz`, `yz`, `xw`, `yv`, `zu`, `xv`, `xu`, `yu`, `zu` (using `ProjectionEngine`'s label scheme: `x,y,z,w,v` for indices 0–4).

**Projection:** Same pipeline as Tesseract: `rotateND` then successive perspective collapse `projectND` from axis index 4 down to 3, then 3→2. Higher-index axes use perspective distance parameters (`dists`, `defaultDist`, `zDist`).

**Vertex construction:** Same bit-pattern as Tesseract, extended to 5 bits: vertex \(i\) has coordinate \(\pm 1\) on axis \(k\) according to bit \(k\) of \(i\).

**Edge construction:** Vertices \(i,j\) are adjacent iff `popcount(i XOR j) === 1`.

**4-cells (optional interaction):** A 4-cell fixes one coordinate at \(\pm 1\); the remaining four vary — 16 vertices per cell, 10 cells total (5 axes × 2 signs). Isolating one cell should dim everything else, mirroring Tesseract's cubic-cell buttons.

### Visual design

Match Tesseract: dark canvas (`#0a0a12`), faint grid, monospace/sidebar instrument aesthetic.

- **Edges:** Cool blue (`--accent-3d`) when both endpoints are "3D-like" in the slice being emphasized; warm gold tint when average \(w,v\) depth suggests higher-dimensional separation. Same edge-color interpolation by average 4th/5th coordinate as Tesseract uses for \(w\).
- **Vertices:** Small dots; marked vertices gold (`#ffd166`) with black stroke, same click-to-mark behavior.
- **Density:** 80 edges is visually busy. Default line alpha may need to be lower than Tesseract, or edges farther in 5D may fade more aggressively. **Design choice:** tune for legibility over completeness.
- **Side panel:** 10 rotation sliders — first 3 planes blue (touch only \(x,y,z\)), planes involving \(w,v\) gold. Panel will scroll; keep section labels identical to Tesseract ("Rotation planes").

### Interaction model

| Control | Effect |
|---------|--------|
| Rotation sliders + spin checkboxes | Same as Tesseract; `threeDimensionalCount={3}` on `RotationControls` |
| Click vertex | Toggle gold mark; mark persists through rotation (identity is combinatorial index, not screen position) |
| Cell isolate buttons (if shipped) | One of 10 tesseract-cells highlighted; others dimmed |
| reset view / clear marks | Same as Tesseract |
| Puzzle panel | Counting puzzles at \(n=5\) (see puzzles shape in Tesseract) |

Optional multi-projection mode (three synchronized views with different fixed projection presets) is **not** in the minimum viable module; see backlog.

### Educational payload

The **aha:** dimension is not "one more direction you could walk." It is **more independent rotations** and **more nested cells**. A 5-cube is not "a bigger cube"; it is a cube made of tesseract-cells the way a tesseract is a cube made of cubic cells. Watching a marked vertex survive a `wv` rotation while the wireframe appears to fold through itself makes "the object is stable; the shadow is not" visceral.

Secondary payload: combinatorial growth (\(2^n\), \(\binom{n}{2}\)) stops being memorized formulas and becomes something you can verify by marking and counting.

### Reuse vs new

| Reuse as-is | Extend | New in module |
|-------------|--------|---------------|
| `ProjectionEngine.js` (`rotationPlanes`, `rotateND`, `projectND`) | Possibly lower default edge alpha in renderer | `geometry.js`: `buildVertices`, `buildEdges`, `build4Cells` (or `buildCells` for 4-faces) |
| `RotationControls.jsx` | — | `Penteract.jsx`: canvas loop copied/adapted from Tesseract |
| `PuzzlePanel.jsx` | — | `puzzles.js`: 5-cube counting set |
| Layout pattern (canvas + 340px panel) | Scroll styling for 10 sliders | Module-specific cell button row (10 items) |

No changes to `ProjectionEngine` are **required** for \(n=5\); labels `v` and `u` are already supported for indices 4 and 5.

### Open design questions

1. **Multi-shadow puzzle vs single view:** Is the "three shadows" interaction essential for v1, or is a single rotatable projection plus counting puzzles enough? Multi-view adds layout and synchronization work.
2. **Cell isolation granularity:** Tesseract isolates **3-cubes** (8 cells). Penteract could isolate **4-cubes** (10 cells) or **3-cubes** (40 cells). Forty buttons is unusable; 10 is borderline. Default recommendation: 10 tesseract-cells, defer 3-cube isolation.
3. **Performance:** 32 vertices × 80 edges is fine on canvas. Auto-spin on multiple planes simultaneously may look chaotic — default spin on one higher-dim plane only (mirror Tesseract's default `xw` spin)?
4. **Label fatigue:** Ten planes in a scroll panel vs grouped "3D / 4D / 5D" sections — UX choice for executive-function load.

---

## Pendulum Phase Space

### Concept

A pendulum has **two numbers** that matter at each instant: angle \(\theta\) and angular velocity \(\dot\theta\). Together they are a single **point** in a 2D **phase space**. The pendulum's motion is a **curve** through that space, not just back-and-forth in the room.

This module is not a higher-dimensional wireframe. It is a **dynamical system** visualization: state → derivative → integration → draw trajectory. AP Physics (simple harmonic motion, damping, energy) meets geometry (ellipses, spirals, fixed points).

### Mathematical content

**State:** \(\mathbf{x} = (\theta, \omega)\) where \(\omega = \dot\theta\).

**Simple pendulum** (nonlinear, with optional damping):

\[
\dot\theta = \omega, \qquad
\dot\omega = -\frac{g}{L}\sin\theta - b\,\omega
\]

- \(g\): gravitational acceleration (scaled for visualization)
- \(L\): effective length
- \(b\): damping coefficient (\(b=0\) → closed orbits in phase space for small energy; \(b>0\) → spiral to origin)

**Small-angle linearization** (\(\sin\theta \approx \theta\)): harmonic oscillator in phase space — elliptical trajectories, period independent of amplitude (in the linear model).

**Energy** (undamped): \(E = \frac{1}{2}m L^2 \omega^2 + m g L(1 - \cos\theta)\). Contours of \(E\) in the \((\theta,\omega)\) plane are the orbits.

**Integration:** Fixed time step (e.g. RK4 or semi-implicit Euler). No external library required at AP level; RK4 is ~20 lines. **Design choice:** document accuracy vs simplicity in backlog.

**Phase portrait extras (optional):** Nullclines (\(\omega=0\), \(\dot\omega=0\)), vector field grid — pedagogically strong but not required for v1.

### Visual design

Same global dark theme and sidebar instrument. Main canvas is **2D phase space**, not a 3D projection.

- **Axes:** \(\theta\) horizontal (label `\(\theta\)` or `angle`), \(\omega\) vertical (`\(\dot\theta\)` or `velocity`). Center origin or \(\theta \in [-\pi,\pi]\) with wrap indicator — **open question**.
- **Trajectory:** Single continuous path, cool blue (`--accent-3d`), alpha builds over time or full path at low alpha with bright "head" dot.
- **Pendulum inset (optional):** Small schematic top or corner — rod + bob animating from current \(\theta\). Links abstract state to physical motion. **Design choice:** strongly recommended for intuition, adds a second drawing context.
- **Energy readout:** Monospace numeric \(E\) when undamped; watch \(E\) drift when damping off vs numerical error — teaching moment.
- **Grid:** Light axis lines through origin; optional faint energy contour overlay at low alpha (advanced).

### Interaction model

| Control | Effect |
|---------|--------|
| Click / drag in phase canvas | Set initial \((\theta, \omega)\) |
| Play / pause | Integrate forward in time |
| Reset | Clear trajectory; keep or reset initial state — **design choice** |
| Sliders: \(g\), \(L\), \(b\) | Change dynamics; optionally pause-on-change |
| Toggle: linearized \(\sin\theta \approx \theta\) | Compare nonlinear vs AP small-angle model |
| Step (optional) | Single fixed \(\Delta t\) step for inspection |

**No** `RotationControls` for the main portrait (nothing to rotate in 4D). May reuse `PuzzlePanel` for conceptual questions ("What shape is the undamped orbit?" "What happens to energy when \(b>0\)?").

### Educational payload

The **aha:** the pendulum is not "moving in a circle in the room." Its **state** moves on a shape in \((\theta,\omega)\) space — an ellipse when linear and undamped, a spiral when damped. Position and velocity are not two separate stories; they are coordinates of one point.

Secondary: nonlinear vs linear (same starting point, different long-term path); damping as "forgetting velocity" geometrically (attraction toward origin in phase space).

### Reuse vs new

| Reuse as-is | Extend | New in module |
|-------------|--------|---------------|
| `PuzzlePanel.jsx` | — | `dynamics.js`: \(\dot{\mathbf{x}}\), RK4 step |
| Layout pattern (canvas + panel) | — | `PhaseSpace.jsx`: 2D canvas, integration loop |
| `global.css` tokens | — | Optional `src/shared/TimeStepper.js` if extracted |
| — | — | Optional pendulum schematic renderer |

**Does not use** `ProjectionEngine` for core behavior (2D native plot). Could reuse `projectVertices` only if a 3D embedding of the pendulum is added later — out of scope for v1.

### Open design questions

1. **\(\theta\) wrapping:** Plot \(\theta\) on \([-\pi,\pi]\) with discontinuity jumps in trajectory, or unwrap \(\theta\) for continuous paths? Unwrapped is clearer for orbits; wrapped matches periodic physical identification.
2. **Vector field overlay:** Full direction field on canvas vs trajectory-only v1?
3. **Double pendulum:** Rich chaos, much harder UX — defer (see backlog Deferred).
4. **Library vs hand-rolled integrator:** Hand-rolled RK4 keeps dependencies zero; a tiny library would not buy much at this scale.

---

## Iris Projection

### Concept

The **Iris** dataset (Fisher, 1936): 150 flowers, 3 species, **4 measurements** per flower (sepal length/width, petal length/width). Each flower is a **point in 4D**. Humans see a 2D scatter plot because projection throws away information.

The module rotates the **view** (equivalently: applies a 4D rotation then projects to 2D) and shows species **clustering and separation change** with angle — PCA as a physical rotation rather than a matrix on a worksheet.

### Mathematical content

**Data:** 150 points \(\mathbf{p}_i \in \mathbb{R}^4\). Store raw features; optionally center (subtract mean) before rotation so the cloud is centered at origin — **design choice** (centered rotation feels more like PCA; raw preserves units).

**Species labels:** 3 classes → 3 colors (distinct, colorblind-safe palette — not only red/green).

**Rotation:** Same `rotateND` on each point with 6 planes (`n=4`). User spins `xw`, `yw`, etc.

**Projection:** `projectND` to screen. This is **not** identical to sklearn PCA (which picks directions of maximal variance). The module teaches **general linear views** of 4D data; optional sidebar note can mention PCA as a special choice of angles.

**Optional enhancement:** Button "align to PCA" sets rotation angles to eigenvectors of covariance matrix (requires 4×4 eigendecomposition — implement manually for 4×4 or defer). **Design choice** for v1 vs v2.

### Visual design

Dark canvas; **points only** (no wireframe).

- **Points:** ~3px radius; species colors (e.g. setosa cool, versicolor mid, virginica warm) with slight alpha overlap where dense.
- **No connecting edges** between flowers.
- **Rotation controls:** Same 6 planes as Tesseract; gold for planes involving \(w\) (4th feature axis).
- **Legend:** Fixed species → color mapping in sidebar.
- **Optional:** faint axis labels on projected axes ("sepal L", "petal W") when projection aligns roughly with original coordinate planes — fragile when rotated; may be static text listing feature names on data axes instead.

### Interaction model

| Control | Effect |
|---------|--------|
| Rotation sliders + spin | Rotate 4D cloud; real-time redraw |
| Highlight species (toggle) | Dim two species; isolate one |
| reset view | Zero angles |
| Optional: PCA align | Snap to principal components |
| Puzzle panel | e.g. "Which species separates best in this view?" "How many dimensions does each point have?" |

No vertex marking (150 points); click could select nearest point and show measurement tooltip — **optional v2**.

### Educational payload

The **aha:** clusters are not properties of the data "in 2D." They are properties of **4D structure** that some 2D slices reveal and others hide. Rotating the projection is the same class of move as choosing which columns to plot — except all four columns stay in the mix.

Secondary: motivates **why** dimensionality reduction is a choice with consequences, not a neutral picture of "the data."

### Reuse vs new

| Reuse as-is | Extend | New in module |
|-------------|--------|---------------|
| `ProjectionEngine.js` | Maybe `projectVertices` helper | `irisData.js` or `data/iris.json` — 150×4 + labels |
| `RotationControls.jsx` | — | `Iris.jsx`: point cloud canvas loop |
| `PuzzlePanel.jsx` | — | `puzzles.js` |
| Tesseract color language for 4D planes | — | `src/shared/dataLoader.js` (optional shared CSV/JSON fetch) |

**New shared code candidate:** `loadEmbeddedJson`, CSV parser — only if second data module is likely; for v1 embedded JSON is enough.

### Open design questions

1. **Data source:** Embed JSON in repo vs fetch CSV at runtime? Embed is simpler, offline-safe, no new deps.
2. **Normalization:** Raw mm vs z-score per feature? Rotation interacts with scaling; z-score makes features commensurate but loses "real units" tooltips.
3. **PCA button:** v1 or defer? Without it, module still works; with it, name collision with "rotate manually" must be explained in one sentence in UI.
4. **Feature axis labeling:** Map \(x,y,z,w\) to sepal/petal names in code comments only, or expose in UI?
5. **150 points performance:** Trivial on canvas; no WebGL required for v1.

---

## Cross-module notes

- All three modules should register in `App.jsx` with `status: 'ready'` only when the component exists and loads without error.
- Puzzle data shape is fixed: `{ id, prompt, options, answer, reveal }` (see `src/modules/Tesseract/puzzles.js`).
- Aesthetic: instrument, not game. Score counts attempts; no celebration animations.
