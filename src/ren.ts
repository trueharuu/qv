import { parallel, after_line_clear } from './common.js';
import { Pattern } from './patterns.js';
import { Grid, Piece } from './piece.js';

export interface State {
  patterns: Array<Pattern>
  board: Pattern
  queue: Array<Piece>
  hold?: Piece
}

export type Output = Array<[Pattern, Piece, Grid]>;
export const pathmemo = new Map<string, Output>();
export function memoize_state(state: State) {
  return `${state.board.id}@${state.queue.join('')}#${state.hold}`;
}
export async function pathfind(state: State): Promise<Output> {
  const s = memoize_state(state);
  if (pathmemo.has(s)) {
    return pathmemo.get(s)!;
  }
  // Base case: if the queue is empty
  if (state.queue.length === 0) {
    if (state.hold) {
      // console.log('Empty queue; using hold piece');
      return await pathfind({
        queue: [state.hold],
        board: state.board,
        patterns: state.patterns,
        hold: undefined, // No more hold piece since it's being used
      });
    }
    // Return the current state as the end of the path with an empty grid.
    return [];
  }

  const currentPiece = state.queue[0];
  const nextPiece = state.queue[1];
  const holdPiece = state.hold;

  // Generate possible continuations
  const possible_continuations: Array<[UsedPiece, [Piece, Grid]]>
    = state.board.continuations
      .filter(x => x[0] === currentPiece)
      .map(x => [UsedPiece.Current, x] as [UsedPiece, [Piece, Grid]])
      .concat(
        holdPiece
          ? state.board.continuations
            .filter(x => x[0] === holdPiece)
            .map(x => [UsedPiece.Hold, x])
          : [],
      )
      .concat(
        nextPiece && holdPiece === undefined
          ? state.board.continuations
            .filter(x => x[0] === nextPiece)
            .map(x => [UsedPiece.Next, x])
          : [],
      );

  let max: Output = [];
  await parallel(possible_continuations, async ([used, cont]) => {
    const board = after_line_clear(cont[1], state.patterns);
    if (board === undefined) {
      return;
    }
    const ns: State = {
      patterns: state.patterns,
      board,
      queue: state.queue.slice(used === UsedPiece.Next ? 2 : 1),
      hold: used === UsedPiece.Current ? state.hold : currentPiece,
    };

    const sf = await pathfind(ns);
    const nw = [[state.board, cont[0], cont[1]], ...sf] as [
      Pattern,
      Piece,
      Grid,
    ][];
    // console.log('nw', nw, 'max', max);
    if (nw.length > max.length) {
      max = nw;
    }
  });

  pathmemo.set(s, max);
  return max;
}

enum UsedPiece {
  Current, // hold was not used
  Hold, // hold was used and there was a piece in the hold slot
  Next, // hold was used and it was empty, advancing the queue
}
