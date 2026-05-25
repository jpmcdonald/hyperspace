# Hyperspace

An n-dimensional visualization sandbox. Built for exploring shapes and systems that don't fit in 3D.

The premise: 3D is your rendering budget. Everything above 3D has to be expressed through projection choices, motion, color, and interaction. Each module is one self-contained exploration of something that lives in higher-dimensional space — a 4-cube, a 5-cube, a phase space, a data point cloud.

## Running it

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in a browser. Hot reload is on — edits to any source file refresh the page automatically.

## Modules

- **Tesseract (4-cube)** — 16 vertices, 32 edges, 24 faces, 8 cubic cells. Six rotation planes (XY, XZ, YZ are 3D-style; XW, YW, ZW move things through the 4th dimension). Click a vertex to mark it gold and watch it persist through rotations. Click a cell button to isolate one of the 8 cubes. Six counting puzzles.

More modules will live alongside this one. Each is a folder under `src/modules/`.

## Project layout

```
src/
├── main.jsx                  Vite entry
├── App.jsx                   Module picker (the landing page)
├── modules/
│   └── Tesseract/
│       ├── Tesseract.jsx     The full sandbox component
│       ├── geometry.js       Vertex / edge / cell construction for the 4-cube
│       ├── math.js           4D rotation and projection
│       └── puzzles.js        Counting puzzle definitions
├── shared/
│   ├── ProjectionEngine.js   n-D → 3D → 2D pipeline (reusable across modules)
│   ├── RotationControls.jsx  Slider UI for any number of rotation planes
│   └── PuzzlePanel.jsx       Puzzle UI used by all modules
└── styles/
    └── global.css
```

The shared/ directory is where the n-D infrastructure lives. Each new module reuses it — a 5-cube module just supplies a vertex/edge generator and a list of 10 rotation planes, and the shared code does the rest.

## Adding a module

1. Create `src/modules/<Name>/`.
2. Build a default-exported React component there.
3. Register it in `src/App.jsx` by adding an entry to the `modules` array.

That's it. The picker handles navigation.

## Aesthetic notes

Dark background, monospace UI, restrained color (cool blue for normal 3D rotations, warm gold for rotations that involve a higher-dimensional axis). The intent is "instrument," not "game UI." Nothing celebrates, nothing gates progress. Score counts what you've done; it doesn't reward.
