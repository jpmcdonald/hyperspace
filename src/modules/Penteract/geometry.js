// Build the combinatorial structure of a 5-cube (penteract).

export const VERTEX_COUNT = 32;
export const EDGE_COUNT = 80;
export const CELL4_COUNT = 10;

const N = 5;
const AXIS_LABELS = ['x', 'y', 'z', 'w', 'v'];

function coordsFromIndex(i) {
  return [
    (i & 1) ? 1 : -1,
    (i & 2) ? 1 : -1,
    (i & 4) ? 1 : -1,
    (i & 8) ? 1 : -1,
    (i & 16) ? 1 : -1,
  ];
}

export function buildVertices() {
  const v = [];
  for (let i = 0; i < VERTEX_COUNT; i++) {
    v.push(coordsFromIndex(i));
  }
  return v;
}

export function buildEdges() {
  // Two vertices are connected iff they differ in exactly one bit.
  const edges = [];
  for (let i = 0; i < VERTEX_COUNT; i++) {
    for (let j = i + 1; j < VERTEX_COUNT; j++) {
      const diff = i ^ j;
      if ((diff & (diff - 1)) === 0) edges.push([i, j]);
    }
  }
  return edges;
}

export function buildCells() {
  // Each tesseract cell (4-face) is the set of vertices where one
  // coordinate is fixed (at +1 or -1) and the other four vary.
  // That gives 5 axes × 2 signs = 10 cells.
  const cells = [];
  for (let axis = 0; axis < N; axis++) {
    for (const sign of [-1, 1]) {
      const verts = [];
      for (let i = 0; i < VERTEX_COUNT; i++) {
        const coords = coordsFromIndex(i);
        if (coords[axis] === sign) verts.push(i);
      }
      cells.push({
        axis,
        sign,
        verts,
        label: AXIS_LABELS[axis] + (sign > 0 ? '+' : '−'),
      });
    }
  }
  return cells;
}
