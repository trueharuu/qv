export enum Piece {
	I = 'I',
	J = 'J',
	L = 'L',
	O = 'O',
	Z = 'Z',
	S = 'S',
	T = 'T',
	G = 'G',
	E = 'E',
	D = 'D',
}
export type Grid = {board:Array<Array<Piece>>,comment?:string};
export function piece_from_str(f: string): Piece {
	switch (f.toUpperCase()) {
		case 'I':
			return Piece.I;
		case 'J':
			return Piece.J;
		case 'L':
			return Piece.L;
		case 'O':
			return Piece.O;
		case 'Z':
			return Piece.Z;
		case 'S':
			return Piece.S;
		case 'T':
			return Piece.T;
		case 'G':
			return Piece.G;
		case 'D':
			return Piece.D;
		case 'E':
		default:
			return Piece.E;
	}
}

export function piece_to_str(f: Piece): string {
	switch (f) {
		case Piece.I:
			return 'I';
		case Piece.J:
			return 'J';
		case Piece.L:
			return 'L';
		case Piece.O:
			return 'O';
		case Piece.Z:
			return 'Z';
		case Piece.S:
			return 'S';
		case Piece.T:
			return 'T';
		case Piece.G:
			return 'G';
		case Piece.D:
			return 'D';
		case Piece.E:
		default:
			return 'E';
	}
}

export function piece_color(p: Piece): number {
	switch (p) {
		case Piece.I:
			return 0x42afe1ff;
		case Piece.L:
			return 0xf38927ff;
		case Piece.J:
			return 0x1165b5ff;
		case Piece.O:
			return 0xf6d03cff;
		case Piece.Z:
			return 0xeb4f65ff;
		case Piece.S:
			return 0x51b84dff;
		case Piece.T:
			return 0x9739a2ff;
		case Piece.G:
			return 0x868686ff;
		case Piece.D:
			return 0x434343ff;
		case Piece.E:
			return 0;
	}
}

export function piece_color_bright(p: Piece): number {
	switch (p) {
		case Piece.I:
			return 0x6ceaffff;
		case Piece.L:
			return 0xffba59ff;
		case Piece.J:
			return 0x339bffff;
		case Piece.O:
			return 0xffff7fff;
		case Piece.Z:
			return 0xff7f79ff;
		case Piece.S:
			return 0x84f880ff;
		case Piece.T:
			return 0xd958e9ff;
		case Piece.G:
			return 0xddddddff;
		case Piece.D:
			return 0x777777ff;
		case Piece.E:
			return 0;
	}
}



export const COMMENT_SEP = '=';
export function parse_grid(t: string): Grid {
	const [board, comment] = t.split(COMMENT_SEP);
	return {board:board.split('|').map(x=>expandString(x)).map((x) => x.split('').map((y) => piece_from_str(y))),comment};
}

export function expandString(input: string) {
	const regex = /(?:\[(\w+)\]|(\w))(\d*)/g;
	const i = input.replaceAll(regex, ($, $1, $2, $3) => ($1 || $2).repeat(Number($3 || '1')));
	// console.log(i);
	// console.log(input, i);
	if (input === i) {
		return i;
	}

	return expandString(i);
}

export function to_grid(v: Grid) {
	return v.board.map((x) => x.map((y) => piece_to_str(y).toLowerCase()).join('')).join('|') + (v.comment === undefined ? '' : COMMENT_SEP + v.comment);
}

export function mirror_grid(g: Grid) {
	return {board:g.board.map((x) => x.reverse().map((y) => mirror_of(y))),comment:g.comment};
}

export function mirror_of(y: Piece): Piece {
	return (
		(
			{
				[Piece.J]: Piece.L,
				[Piece.L]: Piece.J,
				[Piece.Z]: Piece.S,
				[Piece.S]: Piece.Z,
			} as Record<Piece, Piece>
		)[y] || y
	);
}
