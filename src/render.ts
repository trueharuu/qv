import { PNG } from 'pngjs';
import { Grid, mirror_grid, Piece, piece_color, piece_color_bright, piece_from_str } from './piece';

export async function parallel<T, U>(v: Array<T>, f: (t: T, idx: number) => Promise<U>): Promise<Array<U>> {
	return await Promise.all(v.map((x, i) => f(x, i)));
}
const BW = 20 / 4;
const BH = 20 / 4;
const HL = 4 / 4;
const SHADING = 4 / 4;
const PADDING = 8 / 4;
const SHADOW = 0x26262aff;
export const rmemo = new Map();
export async function render_grid(
	g: string,
	spec: boolean = true,
	lcs: boolean = true,
	scale: number = 4,
	mir: boolean = false
): Promise<Buffer> {
	const grid = g.split('|').map((x) => [...x]);
	const ng = mir ? mirror_grid(preprocess_grid(grid)) : preprocess_grid(grid);

	const id = `${ng.map((x) => x.join('')).join('|')}@${spec}@${lcs}@${scale}`;
	if (rmemo.has(id)) {
		return rmemo.get(id)!;
	}

	console.log(ng);

	const img = new PNG({
		width: scale * Math.max(ng[0].length * BW + 2 * PADDING, 0),
		height: scale * (ng.length * BH + 2 * PADDING + HL),
	});

	for (let i = 0; i < ng.length; i++) {
		const r = ng[i];
		for (let j = 0; j < r.length; j++) {
			const c = r[j];
			const has_air = (i - 1 >= 0 ? ng[i - 1][j] : Piece.E) == Piece.E;
			const is_line_clear = !r.includes(Piece.E);
			const p = c;
			const pix = piece_color(p);
			const col = lcs && is_line_clear ? applyFilters(pix, 1.2, 0.8) : pix;
			for (let pi = i * BW; pi < (i + 1) * BW; pi++) {
				for (let pj = j * BW; pj < (j + 1) * BW; pj++) {
					setPixelAt(img, pj + PADDING + 1, pi + PADDING, scale, col);
				}
			}

			const hl = piece_color_bright(p);
			if (has_air && spec) {
				for (let pi = i * BW; pi < i * BW + HL; pi++) {
					for (let pj = j * BW; pj < (j + 1) * BW; pj++) {
						setPixelAt(img, pj + PADDING + 1, pi + PADDING - HL, scale, hl);
					}
				}
			}
		}
	}

	const buf = PNG.sync.write(img);
	rmemo.set(id, buf);
	return buf;
}

export function preprocess_grid(grid: Array<Array<string>>): Grid {
	const ng: Array<Array<string>> = [];
	for (const i of grid) {
		const nr = [];
		for (let j = 0; j < i.length; j++) {
			const c = i[j];
			const t = Number(c);
			if (!Number.isNaN(t)) {
				if (t === 0) {
					continue;
				}

				for (let v = 0; v < t - 1; v++) {
					nr.push(i[j - 1]);
				}
			} else {
				nr.push(c);
			}
		}

		ng.push(nr);
	}

	const longest = Math.max(...ng.map((x) => x.length));
	for (const i of ng) {
		while (i.length < longest) {
			i.push('e');
		}
	}
	return [
		// Array(longest).fill(Piece.E) as Piece[],
		// Array(longest).fill(Piece.E) as Piece[],
		...ng.map((x) => x.map((y) => piece_from_str(y))),
	];
}

export function setSinglePixelAt(p: PNG, x: number, y: number, c: number) {
	const i = (p.width * y + x) << 2;
	const [r, g, b, a] = to_rgba(c);
	p.data[i] = r;
	p.data[i + 1] = g;
	p.data[i + 2] = b;
	p.data[i + 3] = a;
}

export function setPixelAt(p: PNG, x: number, y: number, scale: number, c: number) {
	if (scale === 1) {
		return setSinglePixelAt(p, x, y, c);
	}
	for (let i = x * scale; i < (x + 1) * scale; i++) {
		for (let j = y * scale; j < (y + 1) * scale; j++) {
			setSinglePixelAt(p, i, j, c);
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
