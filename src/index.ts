import { PNG } from 'pngjs';
import { Bitmap, encodePNGToStream } from 'pureimage/dist';
import { Readable, Writable, Transform } from 'stream';
import { render_grid } from './render';
import { listren, listren_specific } from './listren';
import { CSS } from './data';
import { combo_finder, pc_finder } from './static';
import { prerender_combo, prerender_pc, prerender_pc_list } from './prerender';
export default {
	async fetch(request) {
		const u = new URL(request.url);
		const path = u.pathname;

		if (path === '/render') {
			const p = u.searchParams.get('grid')!;
			const scale = Number(u.searchParams.get('scale') || '4');
			const lc = u.searchParams.get('clear') == 'true';

			const b = await render_grid(p, true, lc, scale);

			return new Response(b, { headers: { 'Content-Type': 'image/png' } });
		} else if (path.startsWith('/list/ren')) {
			const parts = path.slice('/list/ren/'.length).split('/');
			console.log(parts);

			if (parts.length === 1) {
				return new Response(listren(+parts[0]), { headers: { 'Content-Type': 'text/html' } });
			} else if (parts.length === 2) {
				return new Response(listren_specific(+parts[0], parts[1]), { headers: { 'Content-Type': 'text/html' } });
			} else {
				return new Response();
			}
		} else if (path === '/css') {
			return new Response(CSS, { headers: { 'Content-Type': 'text/css' } });
		} else if (path === '/tools/combo-finder') {
			return new Response(combo_finder, { headers: { 'Content-Type': 'text/html' } });
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
			return new Response('404', { headers: { 'Content-Type': 'text/plain' } });
		}
	},
} satisfies ExportedHandler;
