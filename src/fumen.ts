import { decoder, encoder, Field } from 'tetris-fumen';
import { preprocess_grid } from './render';

export function gridToFumen(grid: string): string {
	return encoder.encode(
		grid.split(';').map((x) => {
			return {
				field: Field.create(
					preprocess_grid(grid.split('|').map((y) => y.split('')))
						.map((x) => x.join(''))
						.join('|')
						.replaceAll('E', '_')
						.replaceAll('G', 'X')
						.split('|')
						.map((y) => y.padEnd(10, '_').slice(0, 10))
						.join('')
				),
			};
		})
	);
}

export function fumenToGrid(z: string): string {
	return decoder
		.decode(z)
		.map((x) => {
			return x.field
				.str({ reduced: true, garbage: false })
				.split('\n')
				.map((y) =>
					y
						.replaceAll('_', 'E')
						.replaceAll('X', 'G')
						.replace(/E*?$/g, '')
						.replace(/(.)\1+/g, (match, char) => `${char}${match.length}`)
				)
				.join('|');
		})
		.join(';');
}
