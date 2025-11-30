/**
 * Rotates a 2D matrix 90 degrees clockwise
 * @param {number[][]} matrix - Non-empty rectangular 2D array to rotate
 * @returns {number[][]} Rotated matrix
 */
export function rotateMatrixClockwise(matrix) {
  // Transpose: swap rows ↔ columns
  const transposed = matrix[0].map((_, colIndex) =>
    matrix.map(row => row[colIndex])
  );

  // Reverse each row
  return transposed.map(row => [...row].reverse());
}
