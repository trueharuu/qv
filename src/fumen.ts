import { decoder, encoder, Field } from 'tetris-fumen';
import { preprocess_grid } from './render';
import { parse_grid, Piece, to_grid } from './piece';
import { Rotation, parsePiece, parseRotation } from 'tetris-fumen/lib/defines';
import { getBlockXYs } from 'tetris-fumen/lib/inner_field';
import { inspect } from 'util';

export function gridToFumen(grid: string): string {
	const t = grid.split(';').map((x) => parse_grid(x));
	const u = t.map((x) => ({
		board: x.board
			.map((x) =>
				x
					.map((y) => (y === 'G' ? 'X' : y === 'E' ? '_' : y))
					.join('')
					.padEnd(10, '_')
					.slice(0, 10)
			)
			.join(''),
		comment: x.comment,
	}));
	console.log(u);
	const st = u.map((x) => ({ field: Field.create(x.board), comment: x.comment }));
	return encoder.encode(st);
}

export function fumenToGrid(z: string, compress: boolean = true): string {
	const fumen = decoder.decode(z);
	const pages = [];
	for (const page of fumen) {
		// console.log(page);
		const field = page.field;

		if (page.operation) {
			for (const { x, y } of getBlockXYs(
				parsePiece(page.operation.type),
				parseRotation(page.operation.rotation),
				page.operation.x,
				page.operation.y
			)) {
				field.set(x, y, page.operation.type);
			}
		}
		const s = parse_grid(
			field.str({ reduced: true, garbage: false, separator: '|' }).replace(/_/g, 'E').replace(/X/g, 'G') || 'EEEEEEEEEE'
		);

		pages.push({ board: s.board, comment: page.comment || undefined });
	}

	return pages.map((x) => to_grid(x)).join(';');
}
