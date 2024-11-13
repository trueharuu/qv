import { after_line_clear, contains_all_of } from './common';
import { pcs, resp } from './patterns';
import { Piece, piece_from_str, to_grid } from './piece';
import { pathfind } from './ren';

export async function prerender_combo(res: number, pattern: string, queue: string, hold?: string) {
	const q = String(queue)
		.split('')
		.map((x) => piece_from_str(x));
	const h = hold ? piece_from_str(String(hold)) : undefined;
	const rs = Number(res || '6');
	const pt = String(pattern || '1').toUpperCase();
	const k = resp()[rs];

	// console.log(q, h, rs, pt);

	const not_found = `<span class=meta>Pattern <b>${pt}</b> with <b>${rs}</b> residuals was not found.`;

	if (k === undefined) {
		return not_found;
	}

	const b = k.find((x) => x.id === pt);
	if (b === undefined) {
		return not_found;
	}

	const pcnt = q.length + (h ? 1 : 0);

	const path = await pathfind({ board: b, patterns: k, queue: q, hold: h });

	let htm = '';
	htm += `<span class=meta>Longest path used <b>${path.length}/${pcnt}</b> pieces</span>`;

	htm += '<h3>Starting Pattern</h3>';
	htm += `<a href='list/ren/${rs}/${pt}'><div style='display:inline-block; padding-top: 2%; padding-left 2%;'>
  <img src='/render?grid=${to_grid(b.grid)}&lcs=false'><br><span style='padding-left: 12px'><span class=meta>${b.id}</span></div></a>`;
	htm += '<h3>Path</h3>';
	for (const [, c, g] of path) {
		const bc = after_line_clear(g, k)?.id;
		htm += `<a href=/list/ren/${rs}/${bc}><div style='display:inline-block; padding-top: 2%; padding-left 2%;'>
  <img src='/render?grid=${to_grid(g)}&lcs=false'><br><span class='mino' style='color:var(--${c.toLowerCase()}b)'>${c}</span>
        <span class=meta style='padding-left: 10px'>${bc || '?'}</span></div></a>`;
	}

	return htm;
}

export function prerender_pc(queue: string) {
	const q = String(queue).toUpperCase();
	const searchpcs = pcs().filter((x) => contains_all_of(x[2], q.split('') as never as Piece[]) && q.length > 0);

	return JSON.stringify([
		searchpcs.length,
		searchpcs
			.map(
				([, , pieces, grid]) => `<div style='display:inline-block; padding-top: 2%; padding-left 2%;'>
    <img src='/render?grid=${to_grid(grid)}&lcs=false'><br><span style='padding-left: 12px'>${pieces
					.map((x) => `<span class=mino style='color:var(--${x.toLowerCase()}b);font-size: 14px;'>${x}</span>`)
					.join(' ')}</div>`
			)
			.join(''),
	]);
}

export function prerender_pc_list(): string {
	let txt = '';
	for (let i = 1; i <= 4; i++) {
		txt += `<h2>${i}-Height</h2><br>`;
		for (const [unique, height, pieces, grid] of pcs()) {
			if (!unique) {
				continue;
			}
			if (i !== height) {
				continue;
			}
			txt += `<div style='display:inline-block; padding-top: 2%; padding-left 2%;'>
    <img src='/render?grid=${to_grid(grid)}&lcs=false'><br><span style='padding-left: 12px'>${pieces
				.map((x) => `<span class=mino style='color:var(--${x.toLowerCase()}b); font-size: 14px'>${x}</span>`)
				.join(' ')}</span></div>`;
			// ic++;
		}
	}

	txt += '<h2>Non-Unique PCs</h2>';
	for (const [unique, , pieces, grid] of pcs()) {
		if (unique) {
			continue;
		}
		txt += `<div style='display:inline-block; padding-top: 2%; padding-left 2%;'>
  <img src='/render?grid=${to_grid(grid)}&lcs=false'><br><span style='padding-left: 12px'>${pieces
			.map((x) => `<span class=mino style='color:var(--${x.toLowerCase()}b); font-size: 14px'>${x}</span>`)
			.join(' ')}</span></div>`;
		// ic++;
	}

	return txt;
}
