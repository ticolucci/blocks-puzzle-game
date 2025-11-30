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

/**
 * Rotates a 2D matrix by specified degrees clockwise
 * @param {number[][]} matrix - Non-empty rectangular 2D array to rotate
 * @param {number} degrees - Rotation angle (0, 90, 180, or 270)
 * @returns {number[][]} Rotated matrix
 */
export function rotateMatrix(matrix, degrees) {
  const rotations = degrees / 90;
  let result = matrix;

  for (let i = 0; i < rotations; i++) {
    result = rotateMatrixClockwise(result);
  }

  return result;
}
