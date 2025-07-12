import { DATA } from './data.js';
import { Grid, Piece, piece_from_str, to_grid } from './piece.js';
import { readFileSync } from 'fs';

export function resp() {
  const resp: Record<string, Array<Pattern>> = {};
  // console.log(1);
  for (const line of DATA.split('\n')) {
    const [_, r, id, grid, conts] = (/(\d+):(\w+)=(.+?)#(.*)/.exec(line)
      || []) as RegExpExecArray;
    if (_ === undefined) {
      continue;
    }
    const g2 = grid
      .split('|')
      .map(x => x.split('').map(y => piece_from_str(y)));
    const c2 = conts
      .split(';')
      .filter(x => x !== '')
      .map(x => [
        piece_from_str(x.split(',')[0]),
        {board:x
          .split(',')[1]
          .split('|')
          .map(y => y.split('').map(z => piece_from_str(z)))},
      ] satisfies [Piece, Grid]);
    resp[r] ||= [];
    resp[r].push({ id, grid: {board:g2}, continuations: c2 });
  }

  return resp;
}

export function pcs(): Array<[boolean, number, Array<Piece>, Grid]> {
  const resp: Array<[boolean, number, Array<Piece>, Grid]> = [];
  for (const line of DATA.split('\n')) {
    const [_, ty, r, pieces, grid] = (/p(c|n)(\d+):(\w+)=(.+)/.exec(line)
      || []) as RegExpExecArray;
    if (_ === undefined) {
      continue;
    }

    if (resp.some(x => to_grid(x[3]) === grid)) {
      continue;
    }

    resp.push([
      ty === 'c',
      Number(r),
      pieces.split('').map(x => piece_from_str(x)),
      {board:grid.split('|').map(x => x.split('').map(y => piece_from_str(y)))},
    ] as [boolean, number, Array<Piece>, Grid]);
  }

  return resp;
}

export interface Pattern {
  id: string
  grid: Grid
  continuations: Array<[Piece, Grid]>
}
