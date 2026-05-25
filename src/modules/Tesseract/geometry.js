// Build the combinatorial structure of a 4-cube (tesseract).

export function buildVertices() {
  const v = [];
  for (let i = 0; i < 16; i++) {
    v.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1,
    ]);
  }
  return v;
}

export function buildEdges() {
  // Two vertices are connected iff they differ in exactly one bit.
  const edges = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const diff = i ^ j;
      if ((diff & (diff - 1)) === 0) edges.push([i, j]);
    }
  }
  return edges;
}

export function buildCells() {
  // Each cubic cell of the tesseract is the set of vertices where one
  // coordinate is fixed (at +1 or -1) and the other three vary.
  // That gives 4 axes × 2 signs = 8 cells.
  const cells = [];
  for (let axis = 0; axis < 4; axis++) {
    for (const sign of [-1, 1]) {
      const verts = [];
      for (let i = 0; i < 16; i++) {
        const coords = [
          (i & 1) ? 1 : -1,
          (i & 2) ? 1 : -1,
          (i & 4) ? 1 : -1,
          (i & 8) ? 1 : -1,
        ];
        if (coords[axis] === sign) verts.push(i);
      }
      cells.push({ axis, sign, verts, label: ['x', 'y', 'z', 'w'][axis] + (sign > 0 ? '+' : '−') });
    }
  }
  return cells;
}
