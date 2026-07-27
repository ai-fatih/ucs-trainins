import * as Phaser from 'phaser';
import BallColor from '../consts/BallColor';

const COLS = 7;
const BALL_RADIUS = 14;
const BALL_DIAMETER = 28;
const ROW_HEIGHT = 24;
const GRID_X = 30;
const GRID_Y = 50;

export interface GridPos {
  col: number;
  row: number;
}

export default class BallGrid {
  grid: (BallColor | null)[][] = [];
  maxRow = 0;

  constructor(private scene: Phaser.Scene) {
    this.grid = [];
  }

  getStartRows(): number {
    return 6;
  }

  initGrid(): void {
    this.grid = [];
    const rows = this.getStartRows();
    for (let r = 0; r < rows; r++) {
      this.grid.push(this.createRow(r));
    }
    this.maxRow = rows;
  }

  private createRow(row: number): (BallColor | null)[] {
    const cols = row % 2 === 0 ? COLS : COLS - 1;
    const arr: (BallColor | null)[] = [];
    for (let c = 0; c < cols; c++) {
      arr.push(Phaser.Math.Between(0, 3) as BallColor);
    }
    return arr;
  }

  getCols(row: number): number {
    return row % 2 === 0 ? COLS : COLS - 1;
  }

  getPosition(col: number, row: number): { x: number; y: number } {
    const x = GRID_X + col * BALL_DIAMETER + (row % 2 === 1 ? BALL_RADIUS : 0);
    const y = GRID_Y + row * ROW_HEIGHT;
    return { x, y };
  }

  getBall(col: number, row: number): BallColor | null {
    if (row < 0 || row >= this.grid.length) return null;
    const cols = this.getCols(row);
    if (col < 0 || col >= cols) return null;
    return this.grid[row][col];
  }

  setBall(col: number, row: number, color: BallColor | null): void {
    if (row < 0 || row >= this.grid.length) return;
    const cols = this.getCols(row);
    if (col < 0 || col >= cols) return;
    this.grid[row][col] = color;
  }

  findNearestColRow(x: number, y: number): GridPos {
    let bestCol = 0;
    let bestRow = 0;
    let bestDist = Infinity;

    for (let r = 0; r < this.grid.length; r++) {
      const cols = this.getCols(r);
      for (let c = 0; c < cols; c++) {
        if (this.grid[r][c] !== null) continue;
        const pos = this.getPosition(c, r);
        const dist = Phaser.Math.Distance.Between(x, y, pos.x, pos.y);
        if (dist < bestDist) {
          bestDist = dist;
          bestCol = c;
          bestRow = r;
        }
      }
    }

    return { col: bestCol, row: bestRow };
  }

  findNeighbors(col: number, row: number): GridPos[] {
    const even = row % 2 === 0;
    const offsets: [number, number][] = even
      ? [[-1, -1], [0, -1], [-1, 0], [1, 0], [-1, 1], [0, 1]]
      : [[0, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [1, 1]];

    const result: GridPos[] = [];
    for (const [dc, dr] of offsets) {
      const nc = col + dc;
      const nr = row + dr;
      if (nr >= 0 && nr < this.grid.length && nc >= 0 && nc < this.getCols(nr)) {
        result.push({ col: nc, row: nr });
      }
    }
    return result;
  }

  findMatch(col: number, row: number): GridPos[] {
    const color = this.getBall(col, row);
    if (color === null) return [];

    const visited = new Set<string>();
    const matched: GridPos[] = [];
    const queue: GridPos[] = [{ col, row }];
    const key = (c: number, r: number) => `${c},${r}`;

    while (queue.length > 0) {
      const cur = queue.shift()!;
      const k = key(cur.col, cur.row);
      if (visited.has(k)) continue;
      visited.add(k);

      if (this.getBall(cur.col, cur.row) === color) {
        matched.push(cur);
        const neighbors = this.findNeighbors(cur.col, cur.row);
        for (const n of neighbors) {
          if (!visited.has(key(n.col, n.row)) && this.getBall(n.col, n.row) === color) {
            queue.push(n);
          }
        }
      }
    }

    return matched.length >= 3 ? matched : [];
  }

  isOrphan(col: number, row: number): boolean {
    if (this.getBall(col, row) === null) return false;
    const visited = new Set<string>();
    const queue: GridPos[] = [{ col, row }];
    const key = (c: number, r: number) => `${c},${r}`;

    while (queue.length > 0) {
      const cur = queue.shift()!;
      const k = key(cur.col, cur.row);
      if (visited.has(k)) continue;
      visited.add(k);

      if (cur.row === 0) return false;

      const neighbors = this.findNeighbors(cur.col, cur.row);
      for (const n of neighbors) {
        if (!visited.has(key(n.col, n.row)) && this.getBall(n.col, n.row) !== null) {
          queue.push(n);
        }
      }
    }

    return true;
  }

  removeOrphans(): GridPos[] {
    const orphans: GridPos[] = [];
    for (let r = this.grid.length - 1; r >= 0; r--) {
      const cols = this.getCols(r);
      for (let c = 0; c < cols; c++) {
        if (this.grid[r][c] !== null && this.isOrphan(c, r)) {
          orphans.push({ col: c, row: r });
          this.grid[r][c] = null;
        }
      }
    }
    return orphans;
  }

  addBallsToGrid(): number {
    this.grid.unshift(this.createRow(-1));
    this.maxRow++;
    return this.grid.length;
  }

  isGameOver(): boolean {
    return this.grid.length > 14;
  }

  isEmpty(): boolean {
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell !== null) return false;
      }
    }
    return true;
  }

  getCellCount(): number {
    let count = 0;
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell !== null) count++;
      }
    }
    return count;
  }
}