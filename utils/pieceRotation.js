/**
 * Rotates a 2D matrix 90 degrees clockwise
 * @param {number[][]} matrix - 2D array to rotate
 * @returns {number[][]} Rotated matrix
 */
export function rotateMatrixClockwise(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const rotated = [];
  for (let i = 0; i < cols; i++) {
    rotated[i] = [];
    for (let j = 0; j < rows; j++) {
      rotated[i][j] = matrix[rows - 1 - j][i];
    }
  }

  return rotated;
}
