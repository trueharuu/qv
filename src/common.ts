import { Pattern } from './patterns';
import { Grid, Piece } from './piece';

export async function parallel<T, U>(v: Array<T>, f: (t: T, idx: number) => Promise<U>): Promise<Array<U>> {
	return await Promise.all(v.map((x, i) => f(x, i)));
}

export const alcmemo = new Map<string, Pattern>();
export function after_line_clear(g: Grid, patterns: Array<Pattern>): Pattern | undefined {
	const s = g.join('|');
	if (alcmemo.has(s)) {
		return alcmemo.get(s);
	}

	const v = g.filter((x) => x.includes(Piece.E));

	const grey = v.map((x) => x.map((y) => (y === Piece.E ? Piece.E : Piece.G)));

	const t = patterns.find((x) => areGridsEqual(x.grid, grey));
	if (t !== undefined) {
		alcmemo.set(s, t);
		return t;
	}
}

export function areGridsEqual(grid1: Grid, grid2: Grid): boolean {
	// console.log(grid1, grid2);
	if (grid1.length === 0) {
		return grid2.length === 0;
	}
	if (grid2.length === 0) {
		return grid1.length === 0;
	}
	while (grid1[0] && grid1[0].every((x) => x === Piece.E)) {
		grid1 = grid1.slice(1);
	}
	while (grid2[0] && grid2[0].every((x) => x === Piece.E)) {
		grid2 = grid2.slice(1);
	}
	for (let i = 0; i < grid1.length; i++) {
		if (grid1[i].length !== grid2[i].length) return false;
		for (let j = 0; j < grid1[i].length; j++) {
			if (grid1[i][j] !== grid2[i][j]) return false;
		}
	}
	return true;
}

export function contains_all_of<T>(haystack: Array<T>, needle: Array<T>) {
  let copy = [...haystack];
  for (const value of needle) {
    const idx = copy.indexOf(value);
    if (idx === -1) {
      return false;
    }

    copy = copy.slice(0, idx).concat(copy.slice(idx + 1));
  }

  return true;
}
