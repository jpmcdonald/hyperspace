// Fisher Iris dataset (Anderson / Fisher, 1936). Public domain.
// Source: canonical 150-flower table (sepal/petal length & width in cm).
// v1: features z-scored per column so 4D axes are commensurate for rotation.
// Axis mapping: x=sepal length, y=sepal width, z=petal length, w=petal width.

export const FEATURE_NAMES = ['sepal length', 'sepal width', 'petal length', 'petal width'];
export const POINT_COUNT = 150;
export const SPECIES_LIST = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];

const RAW = [
  {
    "sepalLength": 5.1,
    "sepalWidth": 3.5,
    "petalLength": 1.4,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.9,
    "sepalWidth": 3,
    "petalLength": 1.4,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.7,
    "sepalWidth": 3.2,
    "petalLength": 1.3,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.6,
    "sepalWidth": 3.1,
    "petalLength": 1.5,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5,
    "sepalWidth": 3.6,
    "petalLength": 1.4,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.4,
    "sepalWidth": 3.9,
    "petalLength": 1.7,
    "petalWidth": 0.4,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.6,
    "sepalWidth": 3.4,
    "petalLength": 1.4,
    "petalWidth": 0.3,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5,
    "sepalWidth": 3.4,
    "petalLength": 1.5,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.4,
    "sepalWidth": 2.9,
    "petalLength": 1.4,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.9,
    "sepalWidth": 3.1,
    "petalLength": 1.5,
    "petalWidth": 0.1,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.4,
    "sepalWidth": 3.7,
    "petalLength": 1.5,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.8,
    "sepalWidth": 3.4,
    "petalLength": 1.6,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.8,
    "sepalWidth": 3,
    "petalLength": 1.4,
    "petalWidth": 0.1,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.3,
    "sepalWidth": 3,
    "petalLength": 1.1,
    "petalWidth": 0.1,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.8,
    "sepalWidth": 4,
    "petalLength": 1.2,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.7,
    "sepalWidth": 4.4,
    "petalLength": 1.5,
    "petalWidth": 0.4,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.4,
    "sepalWidth": 3.9,
    "petalLength": 1.3,
    "petalWidth": 0.4,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.1,
    "sepalWidth": 3.5,
    "petalLength": 1.4,
    "petalWidth": 0.3,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.7,
    "sepalWidth": 3.8,
    "petalLength": 1.7,
    "petalWidth": 0.3,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.1,
    "sepalWidth": 3.8,
    "petalLength": 1.5,
    "petalWidth": 0.3,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.4,
    "sepalWidth": 3.4,
    "petalLength": 1.7,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.1,
    "sepalWidth": 3.7,
    "petalLength": 1.5,
    "petalWidth": 0.4,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.6,
    "sepalWidth": 3.6,
    "petalLength": 1,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.1,
    "sepalWidth": 3.3,
    "petalLength": 1.7,
    "petalWidth": 0.5,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.8,
    "sepalWidth": 3.4,
    "petalLength": 1.9,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5,
    "sepalWidth": 3,
    "petalLength": 1.6,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5,
    "sepalWidth": 3.4,
    "petalLength": 1.6,
    "petalWidth": 0.4,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.2,
    "sepalWidth": 3.5,
    "petalLength": 1.5,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.2,
    "sepalWidth": 3.4,
    "petalLength": 1.4,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.7,
    "sepalWidth": 3.2,
    "petalLength": 1.6,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.8,
    "sepalWidth": 3.1,
    "petalLength": 1.6,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.4,
    "sepalWidth": 3.4,
    "petalLength": 1.5,
    "petalWidth": 0.4,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.2,
    "sepalWidth": 4.1,
    "petalLength": 1.5,
    "petalWidth": 0.1,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.5,
    "sepalWidth": 4.2,
    "petalLength": 1.4,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.9,
    "sepalWidth": 3.1,
    "petalLength": 1.5,
    "petalWidth": 0.1,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5,
    "sepalWidth": 3.2,
    "petalLength": 1.2,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.5,
    "sepalWidth": 3.5,
    "petalLength": 1.3,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.9,
    "sepalWidth": 3.1,
    "petalLength": 1.5,
    "petalWidth": 0.1,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.4,
    "sepalWidth": 3,
    "petalLength": 1.3,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.1,
    "sepalWidth": 3.4,
    "petalLength": 1.5,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5,
    "sepalWidth": 3.5,
    "petalLength": 1.3,
    "petalWidth": 0.3,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.5,
    "sepalWidth": 2.3,
    "petalLength": 1.3,
    "petalWidth": 0.3,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.4,
    "sepalWidth": 3.2,
    "petalLength": 1.3,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5,
    "sepalWidth": 3.5,
    "petalLength": 1.6,
    "petalWidth": 0.6,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.1,
    "sepalWidth": 3.8,
    "petalLength": 1.9,
    "petalWidth": 0.4,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.8,
    "sepalWidth": 3,
    "petalLength": 1.4,
    "petalWidth": 0.3,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.1,
    "sepalWidth": 3.8,
    "petalLength": 1.6,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 4.6,
    "sepalWidth": 3.2,
    "petalLength": 1.4,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5.3,
    "sepalWidth": 3.7,
    "petalLength": 1.5,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 5,
    "sepalWidth": 3.3,
    "petalLength": 1.4,
    "petalWidth": 0.2,
    "species": "Iris-setosa"
  },
  {
    "sepalLength": 7,
    "sepalWidth": 3.2,
    "petalLength": 4.7,
    "petalWidth": 1.4,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.4,
    "sepalWidth": 3.2,
    "petalLength": 4.5,
    "petalWidth": 1.5,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.9,
    "sepalWidth": 3.1,
    "petalLength": 4.9,
    "petalWidth": 1.5,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.5,
    "sepalWidth": 2.3,
    "petalLength": 4,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.5,
    "sepalWidth": 2.8,
    "petalLength": 4.6,
    "petalWidth": 1.5,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.7,
    "sepalWidth": 2.8,
    "petalLength": 4.5,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.3,
    "sepalWidth": 3.3,
    "petalLength": 4.7,
    "petalWidth": 1.6,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 4.9,
    "sepalWidth": 2.4,
    "petalLength": 3.3,
    "petalWidth": 1,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.6,
    "sepalWidth": 2.9,
    "petalLength": 4.6,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.2,
    "sepalWidth": 2.7,
    "petalLength": 3.9,
    "petalWidth": 1.4,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5,
    "sepalWidth": 2,
    "petalLength": 3.5,
    "petalWidth": 1,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.9,
    "sepalWidth": 3,
    "petalLength": 4.2,
    "petalWidth": 1.5,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6,
    "sepalWidth": 2.2,
    "petalLength": 4,
    "petalWidth": 1,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.1,
    "sepalWidth": 2.9,
    "petalLength": 4.7,
    "petalWidth": 1.4,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.6,
    "sepalWidth": 2.9,
    "petalLength": 3.6,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.7,
    "sepalWidth": 3.1,
    "petalLength": 4.4,
    "petalWidth": 1.4,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.6,
    "sepalWidth": 3,
    "petalLength": 4.5,
    "petalWidth": 1.5,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.8,
    "sepalWidth": 2.7,
    "petalLength": 4.1,
    "petalWidth": 1,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.2,
    "sepalWidth": 2.2,
    "petalLength": 4.5,
    "petalWidth": 1.5,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.6,
    "sepalWidth": 2.5,
    "petalLength": 3.9,
    "petalWidth": 1.1,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.9,
    "sepalWidth": 3.2,
    "petalLength": 4.8,
    "petalWidth": 1.8,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.1,
    "sepalWidth": 2.8,
    "petalLength": 4,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.3,
    "sepalWidth": 2.5,
    "petalLength": 4.9,
    "petalWidth": 1.5,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.1,
    "sepalWidth": 2.8,
    "petalLength": 4.7,
    "petalWidth": 1.2,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.4,
    "sepalWidth": 2.9,
    "petalLength": 4.3,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.6,
    "sepalWidth": 3,
    "petalLength": 4.4,
    "petalWidth": 1.4,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.8,
    "sepalWidth": 2.8,
    "petalLength": 4.8,
    "petalWidth": 1.4,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.7,
    "sepalWidth": 3,
    "petalLength": 5,
    "petalWidth": 1.7,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6,
    "sepalWidth": 2.9,
    "petalLength": 4.5,
    "petalWidth": 1.5,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.7,
    "sepalWidth": 2.6,
    "petalLength": 3.5,
    "petalWidth": 1,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.5,
    "sepalWidth": 2.4,
    "petalLength": 3.8,
    "petalWidth": 1.1,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.5,
    "sepalWidth": 2.4,
    "petalLength": 3.7,
    "petalWidth": 1,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.8,
    "sepalWidth": 2.7,
    "petalLength": 3.9,
    "petalWidth": 1.2,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6,
    "sepalWidth": 2.7,
    "petalLength": 5.1,
    "petalWidth": 1.6,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.4,
    "sepalWidth": 3,
    "petalLength": 4.5,
    "petalWidth": 1.5,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6,
    "sepalWidth": 3.4,
    "petalLength": 4.5,
    "petalWidth": 1.6,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.7,
    "sepalWidth": 3.1,
    "petalLength": 4.7,
    "petalWidth": 1.5,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.3,
    "sepalWidth": 2.3,
    "petalLength": 4.4,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.6,
    "sepalWidth": 3,
    "petalLength": 4.1,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.5,
    "sepalWidth": 2.5,
    "petalLength": 4,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.5,
    "sepalWidth": 2.6,
    "petalLength": 4.4,
    "petalWidth": 1.2,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.1,
    "sepalWidth": 3,
    "petalLength": 4.6,
    "petalWidth": 1.4,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.8,
    "sepalWidth": 2.6,
    "petalLength": 4,
    "petalWidth": 1.2,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5,
    "sepalWidth": 2.3,
    "petalLength": 3.3,
    "petalWidth": 1,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.6,
    "sepalWidth": 2.7,
    "petalLength": 4.2,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.7,
    "sepalWidth": 3,
    "petalLength": 4.2,
    "petalWidth": 1.2,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.7,
    "sepalWidth": 2.9,
    "petalLength": 4.2,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.2,
    "sepalWidth": 2.9,
    "petalLength": 4.3,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.1,
    "sepalWidth": 2.5,
    "petalLength": 3,
    "petalWidth": 1.1,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 5.7,
    "sepalWidth": 2.8,
    "petalLength": 4.1,
    "petalWidth": 1.3,
    "species": "Iris-versicolor"
  },
  {
    "sepalLength": 6.3,
    "sepalWidth": 3.3,
    "petalLength": 6,
    "petalWidth": 2.5,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 5.8,
    "sepalWidth": 2.7,
    "petalLength": 5.1,
    "petalWidth": 1.9,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.1,
    "sepalWidth": 3,
    "petalLength": 5.9,
    "petalWidth": 2.1,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.3,
    "sepalWidth": 2.9,
    "petalLength": 5.6,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.5,
    "sepalWidth": 3,
    "petalLength": 5.8,
    "petalWidth": 2.2,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.6,
    "sepalWidth": 3,
    "petalLength": 6.6,
    "petalWidth": 2.1,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 4.9,
    "sepalWidth": 2.5,
    "petalLength": 4.5,
    "petalWidth": 1.7,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.3,
    "sepalWidth": 2.9,
    "petalLength": 6.3,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.7,
    "sepalWidth": 2.5,
    "petalLength": 5.8,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.2,
    "sepalWidth": 3.6,
    "petalLength": 6.1,
    "petalWidth": 2.5,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.5,
    "sepalWidth": 3.2,
    "petalLength": 5.1,
    "petalWidth": 2,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.4,
    "sepalWidth": 2.7,
    "petalLength": 5.3,
    "petalWidth": 1.9,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.8,
    "sepalWidth": 3,
    "petalLength": 5.5,
    "petalWidth": 2.1,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 5.7,
    "sepalWidth": 2.5,
    "petalLength": 5,
    "petalWidth": 2,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 5.8,
    "sepalWidth": 2.8,
    "petalLength": 5.1,
    "petalWidth": 2.4,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.4,
    "sepalWidth": 3.2,
    "petalLength": 5.3,
    "petalWidth": 2.3,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.5,
    "sepalWidth": 3,
    "petalLength": 5.5,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.7,
    "sepalWidth": 3.8,
    "petalLength": 6.7,
    "petalWidth": 2.2,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.7,
    "sepalWidth": 2.6,
    "petalLength": 6.9,
    "petalWidth": 2.3,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6,
    "sepalWidth": 2.2,
    "petalLength": 5,
    "petalWidth": 1.5,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.9,
    "sepalWidth": 3.2,
    "petalLength": 5.7,
    "petalWidth": 2.3,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 5.6,
    "sepalWidth": 2.8,
    "petalLength": 4.9,
    "petalWidth": 2,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.7,
    "sepalWidth": 2.8,
    "petalLength": 6.7,
    "petalWidth": 2,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.3,
    "sepalWidth": 2.7,
    "petalLength": 4.9,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.7,
    "sepalWidth": 3.3,
    "petalLength": 5.7,
    "petalWidth": 2.1,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.2,
    "sepalWidth": 3.2,
    "petalLength": 6,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.2,
    "sepalWidth": 2.8,
    "petalLength": 4.8,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.1,
    "sepalWidth": 3,
    "petalLength": 4.9,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.4,
    "sepalWidth": 2.8,
    "petalLength": 5.6,
    "petalWidth": 2.1,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.2,
    "sepalWidth": 3,
    "petalLength": 5.8,
    "petalWidth": 1.6,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.4,
    "sepalWidth": 2.8,
    "petalLength": 6.1,
    "petalWidth": 1.9,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.9,
    "sepalWidth": 3.8,
    "petalLength": 6.4,
    "petalWidth": 2,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.4,
    "sepalWidth": 2.8,
    "petalLength": 5.6,
    "petalWidth": 2.2,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.3,
    "sepalWidth": 2.8,
    "petalLength": 5.1,
    "petalWidth": 1.5,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.1,
    "sepalWidth": 2.6,
    "petalLength": 5.6,
    "petalWidth": 1.4,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 7.7,
    "sepalWidth": 3,
    "petalLength": 6.1,
    "petalWidth": 2.3,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.3,
    "sepalWidth": 3.4,
    "petalLength": 5.6,
    "petalWidth": 2.4,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.4,
    "sepalWidth": 3.1,
    "petalLength": 5.5,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6,
    "sepalWidth": 3,
    "petalLength": 4.8,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.9,
    "sepalWidth": 3.1,
    "petalLength": 5.4,
    "petalWidth": 2.1,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.7,
    "sepalWidth": 3.1,
    "petalLength": 5.6,
    "petalWidth": 2.4,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.9,
    "sepalWidth": 3.1,
    "petalLength": 5.1,
    "petalWidth": 2.3,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 5.8,
    "sepalWidth": 2.7,
    "petalLength": 5.1,
    "petalWidth": 1.9,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.8,
    "sepalWidth": 3.2,
    "petalLength": 5.9,
    "petalWidth": 2.3,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.7,
    "sepalWidth": 3.3,
    "petalLength": 5.7,
    "petalWidth": 2.5,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.7,
    "sepalWidth": 3,
    "petalLength": 5.2,
    "petalWidth": 2.3,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.3,
    "sepalWidth": 2.5,
    "petalLength": 5,
    "petalWidth": 1.9,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.5,
    "sepalWidth": 3,
    "petalLength": 5.2,
    "petalWidth": 2,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 6.2,
    "sepalWidth": 3.4,
    "petalLength": 5.4,
    "petalWidth": 2.3,
    "species": "Iris-virginica"
  },
  {
    "sepalLength": 5.9,
    "sepalWidth": 3,
    "petalLength": 5.1,
    "petalWidth": 1.8,
    "species": "Iris-virginica"
  }
];

const FEATURE_KEYS = ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth'];

function columnStats(key) {
  const vals = RAW.map(r => r[key]);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const std = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length);
  return { mean, std: std || 1 };
}

const STATS = Object.fromEntries(FEATURE_KEYS.map(k => [k, columnStats(k)]));

function z(value, key) {
  const { mean, std } = STATS[key];
  return (value - mean) / std;
}

export const irisPoints = RAW.map(row => ({
  point: [
    z(row.sepalLength, 'sepalLength'),
    z(row.sepalWidth, 'sepalWidth'),
    z(row.petalLength, 'petalLength'),
    z(row.petalWidth, 'petalWidth'),
  ],
  species: row.species,
}));
