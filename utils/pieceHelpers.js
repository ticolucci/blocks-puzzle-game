/**
 * Calculate the center offset of a piece shape
 * Since the piece is centered under the touch location, we need to know
 * where the center is relative to the top-left corner
 *
 * @param {number[][]} shape - The piece shape matrix
 * @returns {{rowOffset: number, colOffset: number}} The center offset
 * @example
 * const shape = [[1, 1], [1, 1]]; // 2x2 square
 * const center = getPieceCenter(shape);
 * // Returns: { rowOffset: 0.5, colOffset: 0.5 }
 */
export const getPieceCenter = (shape) => {
  const height = shape.length;
  const width = shape[0]?.length || 0;

  return {
    rowOffset: (height - 1) / 2,
    colOffset: (width - 1) / 2,
  };
};

/**
 * Convert a center grid position to the top-left anchor position
 * Since the touch location represents the center of the piece, we need to
 * calculate where the top-left corner should be
 *
 * @param {{row: number, col: number}} centerPosition - Grid position at piece center
 * @param {number[][]} shape - The piece shape matrix
 * @returns {{row: number, col: number}} The top-left anchor position
 * @example
 * const centerPos = { row: 5, col: 5 };
 * const shape = [[1, 1], [1, 1]]; // 2x2 square
 * const anchor = centerToAnchor(centerPos, shape);
 * // For 2x2 piece centered at (5,5), anchor is at (4.5, 4.5) -> rounds to (4, 4)
 */
export const centerToAnchor = (centerPosition, shape) => {
  const center = getPieceCenter(shape);

  return {
    row: Math.round(centerPosition.row - center.rowOffset),
    col: Math.round(centerPosition.col - center.colOffset),
  };
};
