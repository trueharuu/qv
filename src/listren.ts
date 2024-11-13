import { after_line_clear } from './common';
import { resp } from './patterns';
import { to_grid } from './piece';

export function listren(res: number) {
	let txt = '';
	txt += `<h1>All ${res}-residual patterns</h1>`;
	const p = resp()[res];
	let v = 0;
	let b = 0;
	// console.log(p.length);
	// console.log(areGridsEqual([], parse_grid('eeee|jeee|jjje')));
	for (const r of p) {
		txt += `<h2><span class=meta>#</span>${r.id}</h2>`;
		v += 1;
		txt += `<a href='/list/ren/${res}/${r.id}'><img src='/render?grid=${to_grid(r.grid)}'></a><br>`;
		for (const c of r.continuations.sort((a, b) => a[0].localeCompare(b[0]))) {
			v += 1;
			const leads_to = after_line_clear(c[1], p)?.id || '?';
			if (leads_to === '?') {
				b += 1;
			}
			txt += `<div style='display:inline-block; padding-top: 2%'>
        <a href='/list/ren/${res}/${leads_to}'><img src='/render?grid=${to_grid(c[1])}'></a>
        <br><span class='mino' style='color:var(--${c[0].toLowerCase()}b)'>${
				c[0]
			}</span><span class='meta' style='padding-left: 10px'>${leads_to}</span>
      </div>`;
		}
	}
	return `<html><head><link rel=stylesheet href=\'../../css\'></head><body><i class=meta>There are <b>${v}</b> images on this page. It may take some time for your browser to load all of them.</i><br>${txt}</body></html>`;
}

export function listren_specific(res: number, pattern: string) {
	let txt = '';

  const p = resp()[res];
  const r = p.find(x => x.id === pattern);
  if (r === undefined) {
    return 'unknown pattern'
  }

  txt += `<h1><span class=meta>#</span>${r.id}</h2>`;
  txt += `<a class=meta href='/list/ren/${res}'><i>${res}-residual patterns</i></a><br>`;
  txt += `<img src='/render?grid=${to_grid(r.grid)}'><br>`;

  txt += '<h2>Continuations</h2>';
  for (const c of r.continuations.sort((a, b) => a[0].localeCompare(b[0]))) {
    const leads_to = after_line_clear(c[1], p)?.id || '?';
    txt += `<div style='display:inline-block; padding-top: 2%'>
      <a href='/list/ren/${res}/${leads_to}'><img src='/render?grid=${to_grid(c[1])}'></a>
      <br><span class='mino' style='color:var(--${c[0].toLowerCase()}b)'>${c[0]}</span><span class='meta' style='padding-left: 10px'>${leads_to}</span>
    </div>`;
  }
  txt += '<h2>Sources</h2>';
  for (const b of p) {
    for (const c of b.continuations) {
      const alc = after_line_clear(c[1], p);
      if (alc && alc.id === r.id) {
        txt += `<div style='display:inline-block; padding-top: 2%'>
                  <a href='/list/ren/${res}/${b.id}'><img src='/render?grid=${to_grid(c[1])}'></a>
                  <br><span class='mino' style='color:var(--${c[0].toLowerCase()}b)'>${c[0]}</span><span class='meta' style='padding-left: 10px'>${b.id}</span>
                </div>`;
      }
    }
  }

  return `<html><head><link rel=stylesheet href=\'../../../css\'></head><body>${txt}</body></html>`;
}
