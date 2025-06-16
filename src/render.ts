import { PNG } from 'pngjs';
import GIF from 'gif-encoder';
import { Grid, mirror_grid, parse_grid, Piece, piece_color, piece_color_bright, piece_from_str } from './piece';
import { inspect } from 'util';

export async function parallel<T, U>(v: Array<T>, f: (t: T, idx: number) => Promise<U>): Promise<Array<U>> {
	return await Promise.all(v.map((x, i) => f(x, i)));
}

const BW = 20 / 4;
const BH = 20 / 4;
const HL = 4 / 4;
const SHADING = 4 / 4;
const PADDING = 0 / 4;
const SHADOW = 0x26262aff;
export const rmemo = new Map();
export async function render_grid(
	g: string,
	spec: boolean = true,
	lcs: boolean = true,
	scale: number = 5,
	mir: boolean = false,
	delay: number = 500,
	loop: boolean = true,
	pad: number = 2,
): Promise<Buffer> {
	// console.log(scale);
	const t = g.split(';');
	const f = t.map((g) => parse_grid(g)).map(x=>preprocess_grid(x)).map((grid) => (mir ? mirror_grid(grid) : grid));

	const id = `${f.map((ng) => ng.board.map((x) => x.join('')).join('|')).join(',')}@${spec}@${lcs}@${scale}@${loop}@${delay}@${pad}`;
	if (rmemo.has(id)) {
		return rmemo.get(id)!;
	}

	if (f.length > 1) {
		const wi = Math.max(...f.map((ng) => scale * Math.max(ng.board[0].length * BW + 2 * pad, 0)));
		const mw = Math.max(...f.map((ng) => Math.max(...ng.board.map((x) => x.length))));
		// console.log('mw', mw);
		const hi = Math.max(...f.map((ng) => scale * (ng.board.length * BH + 2 * pad + HL)));
		const mh = Math.max(...f.map((x) => x.board.length));
		const gif = new GIF(wi, hi);

		gif.setRepeat(loop ? 0 : -1);
		gif.writeHeader();
		gif.setDelay(delay);
		// gif.setImagePalette(
		// 	Object.values(Piece)
		// 		.filter((x) => typeof x === 'number')
		// 		.map(piece_color)
		// 		.map(to_rgba)
		// 		.flat()
		// );
		gif.setTransparent(0x000000);
		const chunks: Buffer[] = [];

		gif.on('data', (chunk) => {
			// console.log(chunk);
			chunks.push(chunk);
		});
		for (let ng of f) {
			// const width = scale * Math.max(ng[0].length * BW + 2 * PADDING, 0);
			// const height = scale * (ng.length * BH + 2 * PADDING + HL);
			// console.log(ng.length, mh);
			while (ng.board.length < mh) {
				ng.board = [[], ...ng.board];
			}
			const buf = new Array(4 * wi * hi).fill(0);
			render_frame(ng, buf, wi, lcs, spec, scale, mw);
			gif.addFrame(buf);
		}

		gif.setQuality(1);
		gif.finish();
		const gb = Buffer.concat(chunks);
		rmemo.set(id, gb);
		return gb;
		// throw 'todo';
	} else {
		const ng = f[0];
		const img = new PNG({
			width: scale * Math.max(ng.board[0].length * BW + 2 * pad, 0),
			height: scale * (ng.board.length * BH + 2 * pad + HL),
		});
		render_frame(ng, img.data, img.width, lcs, spec, scale, pad);
		const buf = PNG.sync.write(img);
		rmemo.set(id, buf);
		return buf;
	}
}

export function render_frame(
	ng: Grid,
	buf: any,
	width: number,
	lcs: boolean,
	spec: boolean,
	scale: number,
	PADDING: number,
	maxwidth: number = Math.max(...ng.board.map((x) => x.length)),
) {
	for (let i = 0; i < ng.board.length; i++) {
		const r = ng.board[i];
		for (let j = 0; j < r.length; j++) {
			const c = r[j];
			const has_air = ng.board[i - 1]?.[j] === Piece.E || ng.board[i - 1]?.[j] === undefined;
			// console.log(ng[i][j], ng[i - 1]?.[j]);
			// console.log('len', maxwidth);

			const is_line_clear = !r.includes(Piece.E) && r.length == maxwidth && lcs;
			let col = is_line_clear ? applyFilters(piece_color(c), 1.2, 0.8) : piece_color(c);
			for (let pi = i * BW; pi < (i + 1) * BW; pi++) {
				for (let pj = j * BW; pj < (j + 1) * BW; pj++) {
					setPixelAt(buf, width, pj + PADDING, pi + PADDING + HL, scale, col);
				}
			}

			if (has_air && spec) {
				for (let pi = i * BW; pi < i * BW + HL; pi++) {
					for (let pj = j * BW; pj < (j + 1) * BW; pj++) {
						setPixelAt(buf, width, pj + PADDING, pi + PADDING, scale, piece_color_bright(c));
					}
				}
			}
		}
	}
}



export function preprocess_grid(grid: Grid): Grid {
	const grid2 = grid.board;
	// console.log(grid, grid2);
	const ng: Array<Array<string>> = [];
	for (const i of grid2) {
		const nr = [];
		for (let j = 0; j < i.length; j++) {
			const c = i[j];

			nr.push(c);
		}

		ng.push(nr);
	}

	const longest = Math.max(...ng.map((x) => x.length));
	for (const i of ng) {
		while (i.length < longest) {
			i.push('e');
		}
	}
	return {board:[
		// Array(longest).fill(Piece.E) as Piece[],
		// Array(longest).fill(Piece.E) as Piece[],
		...ng.map((x) => x.map((y) => piece_from_str(y))),
	], comment:grid.comment};
}

export function setSinglePixelAt(p: Array<number>, width: number, x: number, y: number, c: number) {
	const i = (width * y + x) * 4;
	const [r, g, b, a] = to_rgba(c);
	p[i] = r;
	p[i + 1] = g;
	p[i + 2] = b;
	p[i + 3] = a;
}

export function setPixelAt(p: Array<number>, w: number, x: number, y: number, scale: number, c: number) {
	if (scale === 1) {
		return setSinglePixelAt(p, w, x, y, c);
	}
	for (let i = x * scale; i < (x + 1) * scale; i++) {
		for (let j = y * scale; j < (y + 1) * scale; j++) {
			setSinglePixelAt(p, w, i, j, c);
		}
	}
}

export function to_rgba(t: number): [number, number, number, number] {
	return [(t >> 24) & 0xff, (t >> 16) & 0xff, (t >> 8) & 0xff, (t >> 0) & 0xff];
}

export function applyFilters(color: number, brightness: number, saturation: number): number {
	// Extract the RGBA components
	const r: number = (color >> 24) & 0xff;
	const g: number = (color >> 16) & 0xff;
	const b: number = (color >> 8) & 0xff;
	const a: number = color & 0xff;

	const [r2, g2, b2, a2] = [r * brightness, g * brightness, b * brightness, a];

	// Convert RGB to HSL
	// eslint-disable-next-line prefer-const
	let [h, s, l]: [number, number, number] = rgbToHsl(r2, g2, b2);

	// Apply brightness and saturation adjustments
	s = Math.min(Math.max(s * saturation, 0), 100); // Clamping between 0 and 100

	// Convert HSL back to RGB
	const [newR, newG, newB]: [number, number, number] = hslToRgb(h, s, l);

	// Recombine the components into a single color value
	const newColor: number = (newR << 24) | (newG << 16) | (newB << 8) | a2;

	return newColor;
}

// Helper function to convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	r /= 255;
	g /= 255;
	b /= 255;
	const max: number = Math.max(r, g, b);
	const min: number = Math.min(r, g, b);
	const l: number = (max + min) / 2;

	let h: number, s: number;
	if (max === min) {
		h = s = 0; // Achromatic
	} else {
		const delta: number = max - min;
		s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
		switch (max) {
			case r:
				h = (g - b) / delta + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / delta + 2;
				break;
			case b:
				h = (r - g) / delta + 4;
				break;
			default:
				h = 0;
				break;
		}
		h /= 6;
	}
	return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Helper function to convert HSL back to RGB
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	h /= 360;
	s /= 100;
	l /= 100;
	let r: number, g: number, b: number;

	if (s === 0) {
		r = g = b = l; // Achromatic
	} else {
		const hue2rgb = (p: number, q: number, t: number): number => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p: number = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
