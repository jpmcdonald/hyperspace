export const SPECIES_COLORS = {
  'Iris-setosa': '#8fbfff',      // cool blue
  'Iris-versicolor': '#ffd166',   // gold
  'Iris-virginica': '#c77dff',    // violet — distinct from versicolor gold on dark canvas
};

export const SPECIES_DISPLAY = {
  'Iris-setosa': 'setosa',
  'Iris-versicolor': 'versicolor',
  'Iris-virginica': 'virginica',
};

export function colorForSpecies(name) {
  return SPECIES_COLORS[name] ?? '#aaaaaa';
}

export function displayName(species) {
  return SPECIES_DISPLAY[species] ?? species;
}
