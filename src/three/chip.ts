// The core chip's design, shared by the flat logo and the 3D logo.
// Units are the logo's grid units (the whole logo is 200 wide).

/** Where the chip sits in the flat drawing (260 × 220 units): its top-left corner. */
export const CHIP_ORIGIN = { x: 122, y: 82 }
export const CHIP_SIZE = { width: 64, height: 56 }
export const CELL_SIZE = 6

/** The 3 × 4 grid of glowing squares on the chip's face. The middle one burns hottest. */
export const CHIP_CELLS = [0, 1, 2, 3].flatMap((row) =>
  [0, 1, 2].map((col) => ({ x: 20 + col * 9, y: 8 + row * 9, hot: row === 1 && col === 1 })),
)
