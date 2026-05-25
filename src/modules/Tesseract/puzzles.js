export const tesseractPuzzles = [
  {
    id: 'vertices',
    prompt: 'How many corners (vertices) does this shape have?',
    options: [8, 12, 16, 24, 32],
    answer: 16,
    reveal: 'A tesseract has 16 vertices — every combination of (±1, ±1, ±1, ±1).',
  },
  {
    id: 'edges',
    prompt: 'How many edges?',
    options: [12, 24, 32, 48, 64],
    answer: 32,
    reveal: 'Each of the 16 vertices connects to 4 others (one per axis flip). 16 × 4 ÷ 2 = 32.',
  },
  {
    id: 'faces',
    prompt: 'How many flat square faces?',
    options: [6, 12, 18, 24, 36],
    answer: 24,
    reveal: '24 squares. Formula for n-cube k-faces: C(n,k) · 2^(n−k). Here: C(4,2)·2² = 6·4 = 24.',
  },
  {
    id: 'cells',
    prompt: 'How many 3D cubic cells make up this shape?',
    options: [4, 6, 8, 10, 16],
    answer: 8,
    reveal: 'Eight cubes. Two per axis (the "front" and "back" cube along each of x, y, z, w).',
  },
  {
    id: 'opposite',
    prompt: 'Of a vertex\'s 15 partners, how many are NOT connected to it by an edge?',
    options: [3, 8, 11, 12, 15],
    answer: 11,
    reveal: 'Each vertex has 4 edge-neighbors (one per axis flip). 15 − 4 = 11 non-neighbors.',
  },
  {
    id: 'shareface',
    prompt: 'How many other cubic cells does each cell share a face with?',
    options: [2, 3, 6, 7, 8],
    answer: 6,
    reveal: 'Each cell shares a square face with 6 others — it only fails to touch its "opposite" cell along the same axis.',
  },
];
