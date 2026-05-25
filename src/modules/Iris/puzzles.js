export const irisPuzzles = [
  {
    id: 'dimension',
    prompt: 'How many measurements does each flower have?',
    options: [2, 3, 4, 5],
    answer: 4,
    reveal: 'Four: sepal length, sepal width, petal length, petal width. Each flower is a point in 4D.',
  },
  {
    id: 'species_count',
    prompt: 'How many species are in this dataset?',
    options: [2, 3, 4, 5],
    answer: 3,
    reveal: 'Three: setosa, versicolor, and virginica — 50 flowers each.',
  },
  {
    id: 'points_count',
    prompt: 'How many flowers (data points) are shown?',
    options: [100, 120, 150, 200],
    answer: 150,
    reveal: '150 flowers total. Fisher\'s classic table is small enough to see every point.',
  },
  {
    id: 'projection',
    prompt: 'Why do species clusters change shape when you rotate the view?',
    options: [
      'the data changes',
      'projection hides dimensions',
      'colors swap randomly',
      'points move in 4D',
    ],
    answer: 'projection hides dimensions',
    reveal: 'The 4D cloud is fixed; the 2D scatter is a shadow. Different rotations reveal or hide separation.',
  },
  {
    id: 'pca_vs_rotate',
    prompt: 'Is manually rotating the same as PCA (principal components)?',
    options: ['yes', 'no', 'only for setosa', 'only after z-score'],
    answer: 'no',
    reveal: 'No. PCA picks directions of maximal variance automatically. Manual rotation explores arbitrary 4D views.',
  },
  {
    id: 'setosa_separation',
    prompt: 'Which species is often easiest to separate from the others?',
    options: ['setosa', 'versicolor', 'virginica', 'all equally hard'],
    answer: 'setosa',
    reveal: 'Setosa (blue) often splits cleanly — especially in views that emphasize petal size.',
  },
];
