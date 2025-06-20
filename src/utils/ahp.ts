
export const calculateAHPWeights = (matrix: number[][]): number[] => {
  const n = matrix.length;
  let eigenvector = new Array(n).fill(1);
  const maxIterations = 100;
  const tolerance = 1e-10;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const newVector = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        newVector[i] += matrix[i][j] * eigenvector[j];
      }
    }

    const norm = Math.sqrt(
      newVector.reduce((sum, val) => sum + val * val, 0)
    );
    const normalizedVector = newVector.map((val) => val / norm);

    const convergence = eigenvector.reduce(
      (sum, val, i) => sum + Math.abs(val - normalizedVector[i]),
      0
    );

    eigenvector = normalizedVector;

    if (convergence < tolerance) {
      break;
    }
  }

  const sum = eigenvector.reduce((total, weight) => total + weight, 0);
  return eigenvector.map((weight) => weight / sum);
};
