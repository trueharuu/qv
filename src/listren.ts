import { after_line_clear } from './common';
import { resp } from './patterns';
import { Piece, to_grid } from './piece';

export function listren(res: number, filter: string = 'none') {
	let txt = '';
	txt += `<h1>All ${res}-residual patterns</h1>`;
	let p = resp()[res];
	if (filter === 'only-i') {
		p = p
			.map((x) => {
				x.continuations = x.continuations.filter((x) => x[0] === 'I' && !x[1].some((y) => y.every((z) => z === Piece.I)));
				return x;
			})
			.filter((x) => x.continuations.length > 0);
	}

	if (filter === 'side-well') {
		p = p.filter((x) => x.grid.at(-1)?.[0] === Piece.E || x.grid.at(-1)?.[3] === Piece.E);
		p = p
			.map((x) => {
				x.continuations = x.continuations.filter((x) => after_line_clear(x[1], p) === undefined);
				return x;
			})
			.filter((x) => x.continuations.length > 0);
	}
	let v = 0;
	let b = 0;
	// console.log(p.length);
	// console.log(areGridsEqual([], parse_grid('eeee|jeee|jjje')));
	for (const r of p) {
		txt += `<h2><span class=meta>#</span>${r.id}</h2>`;
		v += 1;
		txt += `<a href='/list/ren/${res}/${r.id}'><img src='/render?grid=${to_grid(r.grid)}&clear=true'></a><br>`;
		for (const c of r.continuations.sort((a, b) => a[0].localeCompare(b[0]))) {
			v += 1;
			const leads_to = after_line_clear(c[1], p)?.id || '?';
			if (leads_to === '?') {
				b += 1;
			}
			console.log('dbg', c[1]);
			txt += `<div style='display:inline-block; padding-top: 2%'>
        <a href='/list/ren/${res}/${leads_to}'><img src='/render?grid=${to_grid(c[1])}&clear=true'></a>
        <br><span class='mino' style='color:var(--${c[0].toLowerCase()}b)'>${
				c[0]
			}</span><span class='meta' style='padding-left: 10px'>${leads_to}</span>
      </div>`;
		}
	}

	const rpat = p[~~(Math.random() * p.length)];
	const rcon = rpat.continuations[~~(Math.random() * rpat.continuations.length)];

	return `
  <html>
    <head>
    <meta property="og:type" content="website">
    <meta name="theme-color" content="#2c2d30">
    <meta property="og:title" content="qv | all ${res}-residual patterns">
    <meta property="og:url" content="https://qv.rqft.workers.dev/list/ren/${res}">
    <meta property="og:image" content="https://qv.rqft.workers.dev/render?grid=${to_grid(rcon[1])}&clear=true">
    <meta property="og:description" content="List of all ${res}-residual patterns">
      <link rel=stylesheet href=\'${filter ? '../' : ''}../../css\'>
    </head>
    <body>
      <i class=meta>There are <b>${v}</b> images on this page. It may take some time for your browser to load all of them.</i>
      <br>${txt}
    </body>
  </html>`;
}

export function listren_specific(res: number, pattern: string) {
	let txt = '';

	const p = resp()[res];
	const r = p.find((x) => x.id === pattern);
	if (r === undefined) {
		return 'unknown pattern';
	}

	txt += `<h1><span class=meta>#</span>${r.id}</h2>`;
	txt += `<a class=meta href='/list/ren/${res}'><i>${res}-residual patterns</i></a><br>`;
	txt += `<img src='/render?grid=${to_grid(r.grid)}'><br>`;

	txt += '<h2>Continuations</h2>';
	for (const c of r.continuations.sort((a, b) => a[0].localeCompare(b[0]))) {
		const leads_to = after_line_clear(c[1], p)?.id || '?';
		txt += `<div style='display:inline-block; padding-top: 2%'>
      <a href='/list/ren/${res}/${leads_to}'><img src='/render?grid=${to_grid(c[1])}&clear=true'></a>
      <br><span class='mino' style='color:var(--${c[0].toLowerCase()}b)'>${
			c[0]
		}</span><span class='meta' style='padding-left: 10px'>${leads_to}</span>
    </div>`;
	}
	txt += '<h2>Sources</h2>';
	let srcs = 0;
	for (const b of p) {
		for (const c of b.continuations) {
			const alc = after_line_clear(c[1], p);
			if (alc && alc.id === r.id) {
				srcs += 1;
				txt += `<div style='display:inline-block; padding-top: 2%'>
                  <a href='/list/ren/${res}/${b.id}'><img src='/render?grid=${to_grid(c[1])}&clear=true'></a>
                  <br><span class='mino' style='color:var(--${c[0].toLowerCase()}b)'>${
					c[0]
				}</span><span class='meta' style='padding-left: 10px'>${b.id}</span>
                </div>`;
			}
		}
	}

	return `
    <html>
      <head>
        <link rel=stylesheet href=\'../../../css\'>
        <meta property="og:type" content="website">
        <meta name="theme-color" content="#2c2d30">
        <meta property="og:title" content="qv | ${res} res | ${r.id}">
        <meta property="og:url" content="https://qv.rqft.workers.dev/list/ren/${res}/${r.id}">
        <meta property="og:image" content="https://qv.rqft.workers.dev/render?grid=${to_grid(r.grid)}&clear=true">
        <meta property="og:description" content="${r.continuations.length} continuations, ${srcs} sources\nSupports <b>${[
		...new Set(r.continuations.map((x) => x[0])),
	].join('')}</b>">
      </head>
      <body>${txt}</body>
    </html>`;
}
