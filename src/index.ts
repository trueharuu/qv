import { PNG } from 'pngjs';
import { Bitmap, encodePNGToStream } from 'pureimage/dist';
import { Readable, Writable, Transform } from 'stream';
import { render_grid } from './render';
import { listren, listren_specific } from './listren';
import { CSS } from './data';
import { board_editor, combo_finder, home, pc_finder, renderguide, view } from './static';
import { prerender_combo, prerender_pc, prerender_pc_list } from './prerender';
import { decoder, encoder, Field } from 'tetris-fumen';
import { fumenToGrid, gridToFumen } from './fumen';
import { COMMENT_SEP } from './piece';
export default {
	async fetch(request) {
		const u = new URL(request.url);
		console.log(request.url);
		const path = u.pathname;

		if (path === '/') {
			return new Response(home, { headers: { 'Content-Type': 'text/html' } });
		} else if (path === '/echo') {
			return new Response(u.search)
		}
		else if (path === '/render/guide') {
			return new Response(renderguide, { headers: { 'Content-Type': 'text/html' } });
		} else if (path === '/render.gif' || path === '/render.png' || path === '/render') {
			const p = u.searchParams.get('grid') || '';
			const scale = Number(u.searchParams.get('scale') || '5');
			const lc = u.searchParams.get('clear') == 'true' || u.searchParams.get('lcs') == 'true';
			const mir = u.searchParams.get('mirror') == 'true';
			const lp = u.searchParams.get('loop') !== 'false';
			const spec = u.searchParams.get('spec') !== 'false';
			const delay = Number(u.searchParams.get('delay') || '500');

			const is_many_frames = p.includes(';');

			const b = await render_grid(p, spec, lc, scale, mir, delay, lp);

			return new Response(b, { headers: { 'Content-Type': is_many_frames ? 'image/gif' : 'image/png' } });
		} else if (path === '/fumen.gif' || path === '/fumen.png' || path === '/fumen') {
			const z = u.searchParams.get('data') || '';

			const p = fumenToGrid(z);
			// console.log(p);
			const scale = Number(u.searchParams.get('scale') || '5');
			const lc = u.searchParams.get('clear') != 'false' && u.searchParams.get('lcs') != 'false';
			const mir = u.searchParams.get('mirror') == 'true';
			const lp = u.searchParams.get('loop') !== 'false';
			const spec = u.searchParams.get('spec') !== 'false';
			const delay = Number(u.searchParams.get('delay') || '500');

			const is_many_frames = p.includes(';');

			const b = await render_grid(p, spec, lc, scale, mir, delay, lp);

			return new Response(b, { headers: { 'Content-Type': is_many_frames ? 'image/gif' : 'image/png' } });
		} else if (path === '/convert') {
			const p = u.searchParams.get('data') || '';
			const is_grid = !/^[vmd]\d+?@/.test(p);
			if (is_grid) {
				return new Response(gridToFumen(p), { headers: { 'Content-Type': 'text/plain' } });
			} else {
				return new Response(fumenToGrid(p), { headers: { 'Content-Type': 'text/plain' } });
			}
		} else if (path === '/decode') {
			const p = u.searchParams.get('data') || '';
			const is_grid = !/^[vmd]\d+?@/.test(p);
			if (is_grid) {
				return new Response(JSON.stringify(p.split(';').map(x=>x.split(COMMENT_SEP)).map((x) => ({ data: x[0], comment: x[1]||'' }))), {
					headers: { 'Content-Type': 'text/json' },
				});
			} else {
				return new Response(
					JSON.stringify(decoder.decode(p).map((x) => ({ data: fumenToGrid(encoder.encode([x])), comment: x.comment }))),
					{ headers: { 'Content-Type': 'text/plain' } }
				);
			}
		} else if (path.startsWith('/list/ren')) {
			const parts = path.slice('/list/ren/'.length).split('/');
			// console.log(parts);

			if (parts.length === 1) {
				return new Response(listren(+parts[0]), { headers: { 'Content-Type': 'text/html' } });
			} else if (parts.length === 2) {
				if (parts[1] === "only-i") {
					return new Response(listren(+parts[0], 'only-i'), { headers: { 'Content-Type': 'text/html' } });
				}

				if (parts[1] === "side-well") {
					return new Response(listren(+parts[0], 'side-well'), { headers: { 'Content-Type': 'text/html' } });
				}
				return new Response(listren_specific(+parts[0], parts[1]), { headers: { 'Content-Type': 'text/html' } });
			} else {
				return new Response();
			}
		} else if (path === '/css') {
			return new Response(CSS, { headers: { 'Content-Type': 'text/css' } });
		} else if (path === '/tools/combo-finder') {
			return new Response(combo_finder, { headers: { 'Content-Type': 'text/html' } });
		} else if (path === '/board' || path === '/edit') {
			let i = u.search.slice(1);
			if (/^[vmd]\d+?@/.test(i)) {
				i = fumenToGrid(i);
			}

			// console.log('path', i);
			return new Response(board_editor(i), { headers: { 'Content-Type': 'text/html' } });
		} else if (path === '/view') {
			console.log(u);
			let i = u.search.slice(1);
			if (!/^[vmd]\d+?@/.test(i)) {

				console.log(i);
				i = gridToFumen(i);
			}
			return new Response(view(decoder.decode(i)), { headers: { 'Content-Type': 'text/html' } });
		} else if (path.startsWith('/pre-render/combo')) {
			return new Response(
				await prerender_combo(
					+u.searchParams.get('res')!,
					u.searchParams.get('pattern')!,
					u.searchParams.get('queue')!,
					u.searchParams.get('hold')!
				),
				{ headers: { 'Content-Type': 'text/html' } }
			);
		} else if (path === '/tools/pc-finder') {
			return new Response(pc_finder, { headers: { 'Content-Type': 'text/html' } });
		} else if (path === '/pre-render/pc-list') {
			return new Response(prerender_pc_list(), { headers: { 'Content-Type': 'text/html' } });
		} else if (path.startsWith('/pre-render/pc')) {
			return new Response(prerender_pc(u.searchParams.get('queue')!), { headers: { 'Content-Type': 'application/json' } });
		} else {
			return new Response('404', { headers: { 'Content-Type': 'text/plain' }, status: 404 });
		}
	},
} satisfies ExportedHandler;
