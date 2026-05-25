export const penteractPuzzles = [
  {
    id: 'vertices',
    prompt: 'How many corners (vertices) does this shape have?',
    options: [16, 24, 32, 48, 64],
    answer: 32,
    reveal: 'A penteract has 32 vertices — every combination of (±1, ±1, ±1, ±1, ±1).',
  },
  {
    id: 'edges',
    prompt: 'How many edges?',
    options: [32, 48, 64, 80, 96],
    answer: 80,
    reveal: 'Each of the 32 vertices connects to 5 others (one per axis flip). 32 × 5 ÷ 2 = 80.',
  },
  {
    id: 'faces',
    prompt: 'How many flat square faces?',
    options: [40, 60, 80, 100, 120],
    answer: 80,
    reveal: '80 squares. Formula for n-cube k-faces: C(n,k) · 2^(n−k). Here: C(5,2)·2³ = 10·8 = 80.',
  },
  {
    id: 'cells3',
    prompt: 'How many 3D cubic cells make up this shape?',
    options: [10, 20, 32, 40, 80],
    answer: 40,
    reveal: 'Forty cubes. Two per axis pair (fix three coordinates, vary two) — C(5,3)·2² = 10·4 = 40.',
  },
  {
    id: 'cells4',
    prompt: 'How many 4D tesseract cells make up this shape?',
    options: [5, 8, 10, 16, 32],
    answer: 10,
    reveal: 'Ten tesseract-cells. Two per axis (the "front" and "back" tesseract along each of x, y, z, w, v).',
  },
  {
    id: 'nonneighbors',
    prompt: 'Of a vertex\'s 31 partners, how many are NOT connected to it by an edge?',
    options: [5, 16, 21, 26, 31],
    answer: 26,
    reveal: 'Each vertex has 5 edge-neighbors (one per axis flip). 31 − 5 = 26 non-neighbors.',
  },
];
