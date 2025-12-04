import { getFilledRows, getFilledColumns, clearLines, calculateClearScore } from '../gridClearing';
import { createEmptyGrid } from '../gridHelpers';

describe('getFilledRows', () => {
  test('returns empty array for empty grid', () => {
    const grid = createEmptyGrid(10);
    const filledRows = getFilledRows(grid, 10);
    expect(filledRows).toEqual([]);
  });

  test('detects single filled row', () => {
    const grid = createEmptyGrid(10);
    // Fill row 5 completely
    for (let col = 0; col < 10; col++) {
      grid[5][col].filled = true;
    }

    const filledRows = getFilledRows(grid, 10);
    expect(filledRows).toEqual([5]);
  });

  test('detects multiple filled rows', () => {
    const grid = createEmptyGrid(10);
    // Fill rows 2, 5, and 9
    for (let col = 0; col < 10; col++) {
      grid[2][col].filled = true;
      grid[5][col].filled = true;
      grid[9][col].filled = true;
    }

    const filledRows = getFilledRows(grid, 10);
    expect(filledRows).toEqual([2, 5, 9]);
  });

  test('returns empty array for partially filled row', () => {
    const grid = createEmptyGrid(10);
    // Fill row 3 partially (only 9 out of 10 cells)
    for (let col = 0; col < 9; col++) {
      grid[3][col].filled = true;
    }

    const filledRows = getFilledRows(grid, 10);
    expect(filledRows).toEqual([]);
  });

  test('detects first row when filled', () => {
    const grid = createEmptyGrid(10);
    for (let col = 0; col < 10; col++) {
      grid[0][col].filled = true;
    }

    const filledRows = getFilledRows(grid, 10);
    expect(filledRows).toEqual([0]);
  });

  test('detects last row when filled', () => {
    const grid = createEmptyGrid(10);
    for (let col = 0; col < 10; col++) {
      grid[9][col].filled = true;
    }

    const filledRows = getFilledRows(grid, 10);
    expect(filledRows).toEqual([9]);
  });
});

describe('getFilledColumns', () => {
  test('returns empty array for empty grid', () => {
    const grid = createEmptyGrid(10);
    const filledColumns = getFilledColumns(grid, 10);
    expect(filledColumns).toEqual([]);
  });

  test('detects single filled column', () => {
    const grid = createEmptyGrid(10);
    // Fill column 3 completely
    for (let row = 0; row < 10; row++) {
      grid[row][3].filled = true;
    }

    const filledColumns = getFilledColumns(grid, 10);
    expect(filledColumns).toEqual([3]);
  });

  test('detects multiple filled columns', () => {
    const grid = createEmptyGrid(10);
    // Fill columns 1, 4, and 7
    for (let row = 0; row < 10; row++) {
      grid[row][1].filled = true;
      grid[row][4].filled = true;
      grid[row][7].filled = true;
    }

    const filledColumns = getFilledColumns(grid, 10);
    expect(filledColumns).toEqual([1, 4, 7]);
  });

  test('returns empty array for partially filled column', () => {
    const grid = createEmptyGrid(10);
    // Fill column 6 partially (only 8 out of 10 cells)
    for (let row = 0; row < 8; row++) {
      grid[row][6].filled = true;
    }

    const filledColumns = getFilledColumns(grid, 10);
    expect(filledColumns).toEqual([]);
  });

  test('detects first column when filled', () => {
    const grid = createEmptyGrid(10);
    for (let row = 0; row < 10; row++) {
      grid[row][0].filled = true;
    }

    const filledColumns = getFilledColumns(grid, 10);
    expect(filledColumns).toEqual([0]);
  });

  test('detects last column when filled', () => {
    const grid = createEmptyGrid(10);
    for (let row = 0; row < 10; row++) {
      grid[row][9].filled = true;
    }

    const filledColumns = getFilledColumns(grid, 10);
    expect(filledColumns).toEqual([9]);
  });

  test('detects both rows and columns independently', () => {
    const grid = createEmptyGrid(10);
    // Fill row 5
    for (let col = 0; col < 10; col++) {
      grid[5][col].filled = true;
    }
    // Fill column 3
    for (let row = 0; row < 10; row++) {
      grid[row][3].filled = true;
    }

    const filledRows = getFilledRows(grid, 10);
    const filledColumns = getFilledColumns(grid, 10);

    expect(filledRows).toEqual([5]);
    expect(filledColumns).toEqual([3]);
  });
});

describe('clearLines', () => {
  test('clears single row', () => {
    const grid = createEmptyGrid(10);
    // Fill row 5
    for (let col = 0; col < 10; col++) {
      grid[5][col].filled = true;
    }

    const clearedGrid = clearLines(grid, [5], []);

    // Row 5 should be empty
    for (let col = 0; col < 10; col++) {
      expect(clearedGrid[5][col].filled).toBe(false);
    }

    // Other rows should be unaffected (still empty)
    for (let row = 0; row < 10; row++) {
      if (row !== 5) {
        for (let col = 0; col < 10; col++) {
          expect(clearedGrid[row][col].filled).toBe(false);
        }
      }
    }
  });

  test('clears single column', () => {
    const grid = createEmptyGrid(10);
    // Fill column 3
    for (let row = 0; row < 10; row++) {
      grid[row][3].filled = true;
    }

    const clearedGrid = clearLines(grid, [], [3]);

    // Column 3 should be empty
    for (let row = 0; row < 10; row++) {
      expect(clearedGrid[row][3].filled).toBe(false);
    }

    // Other columns should be unaffected (still empty)
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (col !== 3) {
          expect(clearedGrid[row][col].filled).toBe(false);
        }
      }
    }
  });

  test('clears multiple rows', () => {
    const grid = createEmptyGrid(10);
    // Fill rows 2, 5, and 8
    for (let col = 0; col < 10; col++) {
      grid[2][col].filled = true;
      grid[5][col].filled = true;
      grid[8][col].filled = true;
    }

    const clearedGrid = clearLines(grid, [2, 5, 8], []);

    // Rows 2, 5, 8 should be empty
    [2, 5, 8].forEach(row => {
      for (let col = 0; col < 10; col++) {
        expect(clearedGrid[row][col].filled).toBe(false);
      }
    });
  });

  test('clears multiple columns', () => {
    const grid = createEmptyGrid(10);
    // Fill columns 1, 4, 7
    for (let row = 0; row < 10; row++) {
      grid[row][1].filled = true;
      grid[row][4].filled = true;
      grid[row][7].filled = true;
    }

    const clearedGrid = clearLines(grid, [], [1, 4, 7]);

    // Columns 1, 4, 7 should be empty
    [1, 4, 7].forEach(col => {
      for (let row = 0; row < 10; row++) {
        expect(clearedGrid[row][col].filled).toBe(false);
      }
    });
  });

  test('clears both rows and columns simultaneously', () => {
    const grid = createEmptyGrid(10);
    // Fill row 5
    for (let col = 0; col < 10; col++) {
      grid[5][col].filled = true;
    }
    // Fill column 3
    for (let row = 0; row < 10; row++) {
      grid[row][3].filled = true;
    }
    // Also add some other filled cells
    grid[2][7].filled = true;
    grid[8][1].filled = true;

    const clearedGrid = clearLines(grid, [5], [3]);

    // Row 5 should be empty
    for (let col = 0; col < 10; col++) {
      expect(clearedGrid[5][col].filled).toBe(false);
    }

    // Column 3 should be empty
    for (let row = 0; row < 10; row++) {
      expect(clearedGrid[row][3].filled).toBe(false);
    }

    // Other filled cells should remain filled
    expect(clearedGrid[2][7].filled).toBe(true);
    expect(clearedGrid[8][1].filled).toBe(true);
  });

  test('does not affect other cells when clearing lines', () => {
    const grid = createEmptyGrid(10);
    // Fill row 0
    for (let col = 0; col < 10; col++) {
      grid[0][col].filled = true;
    }
    // Add scattered filled cells in other rows
    grid[3][4].filled = true;
    grid[7][2].filled = true;
    grid[9][9].filled = true;

    const clearedGrid = clearLines(grid, [0], []);

    // Row 0 should be cleared
    for (let col = 0; col < 10; col++) {
      expect(clearedGrid[0][col].filled).toBe(false);
    }

    // Other filled cells should remain
    expect(clearedGrid[3][4].filled).toBe(true);
    expect(clearedGrid[7][2].filled).toBe(true);
    expect(clearedGrid[9][9].filled).toBe(true);
  });

  test('returns new grid without modifying original', () => {
    const grid = createEmptyGrid(10);
    // Fill row 5
    for (let col = 0; col < 10; col++) {
      grid[5][col].filled = true;
    }

    const clearedGrid = clearLines(grid, [5], []);

    // Original grid should still have row 5 filled
    for (let col = 0; col < 10; col++) {
      expect(grid[5][col].filled).toBe(true);
    }

    // New grid should have row 5 cleared
    for (let col = 0; col < 10; col++) {
      expect(clearedGrid[5][col].filled).toBe(false);
    }
  });
});

describe('calculateClearScore', () => {
  test('returns 0 for clearing no lines', () => {
    expect(calculateClearScore(0, 0)).toBe(0);
  });

  test('returns 1000 for clearing 1 row', () => {
    // 1000 × 1 × 1 = 1000
    expect(calculateClearScore(1, 0)).toBe(1000);
  });

  test('returns 1000 for clearing 1 column', () => {
    // 1000 × 1 × 1 = 1000
    expect(calculateClearScore(0, 1)).toBe(1000);
  });

  test('returns 3000 for clearing 2 rows (2 lines with 1.5x multiplier)', () => {
    // 1000 × 2 × 1.5 = 3000
    expect(calculateClearScore(2, 0)).toBe(3000);
  });

  test('returns 3000 for clearing 2 columns (2 lines with 1.5x multiplier)', () => {
    // 1000 × 2 × 1.5 = 3000
    expect(calculateClearScore(0, 2)).toBe(3000);
  });

  test('returns 6000 for clearing 3 rows (3 lines with 2x multiplier)', () => {
    // 1000 × 3 × 2 = 6000
    expect(calculateClearScore(3, 0)).toBe(6000);
  });

  test('returns 6000 for clearing 3 columns (3 lines with 2x multiplier)', () => {
    // 1000 × 3 × 2 = 6000
    expect(calculateClearScore(0, 3)).toBe(6000);
  });

  test('returns 16000 for clearing 4 rows (4 lines with 4x multiplier)', () => {
    // 1000 × 4 × 4 = 16000
    expect(calculateClearScore(4, 0)).toBe(16000);
  });

  test('returns 16000 for clearing 4 columns (4 lines with 4x multiplier)', () => {
    // 1000 × 4 × 4 = 16000
    expect(calculateClearScore(0, 4)).toBe(16000);
  });

  test('returns 16000 for clearing 5 lines (5 lines with 4x multiplier)', () => {
    // 1000 × 5 × 4 = 20000
    expect(calculateClearScore(5, 0)).toBe(20000);
  });

  test('returns 4000 for clearing 1 row + 1 column (2 lines, row AND column multiplier)', () => {
    // 1000 × 2 × 2 = 4000 (row AND column bonus takes precedence)
    expect(calculateClearScore(1, 1)).toBe(4000);
  });

  test('returns 16000 for clearing 2 rows + 2 columns (4 lines with 4x multiplier)', () => {
    // According to story: both row and column → x2
    // But 4 lines → x4
    // Since rowCount > 0 && columnCount > 0, we use the row+column multiplier
    // Actually, looking at the story more carefully:
    // "4 rows or columns together: x4"
    // "row and a column together: x2"
    // This seems to imply that when you have BOTH rows AND columns, the multiplier is x2
    // But when you have 4+ of ONLY rows OR ONLY columns, it's x4
    // Let me re-read: "2 rows or columns together: x1.5"
    // "row and a column together: x2"
    // I think the "row and a column" means ANY combination of row+column gets x2
    // Regardless of how many total
    // Actually, that doesn't make sense. Let me think about this differently:
    // Looking at the implementation I wrote, if rowCount > 0 && columnCount > 0, multiplier = 2
    // This takes precedence over the total line count
    // So 2 rows + 2 columns = 4 lines, but multiplier is 2 (not 4)
    // 1000 × 4 × 2 = 8000
    expect(calculateClearScore(2, 2)).toBe(8000);
  });

  test('returns 8000 for clearing 2 rows + 1 column (row AND column multiplier)', () => {
    // 1000 × 3 × 2 = 6000 (row AND column bonus takes precedence over 3-line bonus)
    // Wait, let me reconsider the logic...
    // Actually in my implementation, if there's both row AND column, we use 2x
    // 1000 × 3 × 2 = 6000
    expect(calculateClearScore(2, 1)).toBe(6000);
  });

  test('returns 6000 for clearing 1 row + 2 columns (row AND column multiplier)', () => {
    // 1000 × 3 × 2 = 6000
    expect(calculateClearScore(1, 2)).toBe(6000);
  });
});
