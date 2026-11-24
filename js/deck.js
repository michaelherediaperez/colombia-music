/* Colombia: a country that sounds like its geography — presentation engine and slide builders. */
(() => {
const D = window.MAPDATA, M = window.MEDIA;
const $ = (q, r = document) => r.querySelector(q);
const $$ = (q, r = document) => [...r.querySelectorAll(q)];
const css = t => { const s = document.createElement('style'); s.textContent = t; document.head.appendChild(s); };
const ph = (key, label, cls = '', style = '') =>
  `<div class="ph ${cls}" data-photo="${key}" style="${style}"><span class="lbl">${label}<small>${M.photo[key] || ''}</small></span></div>`;

/* ---------- colours ---------- */
const NAT = {
  car: { c: '#F2B33D', n: 'Caribbean', d: 'Hot coast, savannas, the Sierra Nevada' },
  and: { c: '#C47A52', n: 'Andean', d: 'Three mountain ranges, most of the cities' },
  pac: { c: '#2BA39A', n: 'Pacific', d: 'Rainforest coast, one of the rainiest on Earth' },
  orin: { c: '#A6C25A', n: 'Orinoquía (Llanos)', d: 'Endless grass plains and cowboys' },
  ama: { c: '#2F8550', n: 'Amazon', d: 'Rainforest and rivers, about a third of the country' },
  ins: { c: '#49A9DE', n: 'Insular', d: 'San Andrés & Providencia, in the Caribbean Sea' },
};
const AX = {
  caro: { c: '#F08A3C', n: 'Western Caribbean' }, care: { c: '#F6CF45', n: 'Eastern Caribbean' },
  pacn: { c: '#3FBFAE', n: 'Northern Pacific' }, pacs: { c: '#1C8C9E', n: 'Southern Pacific' },
  anw: { c: '#D9A06B', n: 'Andean North-west' }, ance: { c: '#B9664A', n: 'Andean Centre-east' },
  anne: { c: '#E7C59A', n: 'Andean North-east' }, ancs: { c: '#8E3B46', n: 'Andean Centre-south' },
  answ: { c: '#8D6AA8', n: 'Andean South-west' }, llan: { c: '#A6C25A', n: 'Llanos (plains)' },
  amaz: { c: '#2F8550', n: 'Amazon & borders' }, insu: { c: '#4FB3E8', n: 'Islands' },
};
const PAC_SPLIT = ['76', '19', '52']; // only the coastal part of these departments is Pacific
const INSET = [102, 148];            // San Andrés inside the map's inset box

/* ---------- Colombia map builder ---------- */
function mapSVG(el, o) {
  const fill = o.fill || (() => '#2A3753');
  let s = `<defs><clipPath id="pc-${el.id}"><path d="${D.pacClipD}"/></clipPath></defs>`;
  D.depts.forEach((d, i) => {
    s += `<path class="dp ${o.anim ? 'fillin' : ''}" style="fill:${fill(d)};--i:${o.order ? o.order(d) : i % 12}" d="${d.d}"/>`;
  });
  if (o.pacFill) {
    s += `<g clip-path="url(#pc-${el.id})">`;
    D.depts.filter(d => PAC_SPLIT.includes(d.c)).forEach(d => {
      s += `<path class="dp ${o.anim ? 'fillin' : ''}" style="fill:${o.pacFill};--i:${o.pacOrder || 3}" d="${d.d}"/>`;
    });
    s += `</g>`;
  }
  if (o.inset) {
    const st = o.insetStroke || '#3A4A6B';
    s += `<g transform="translate(40,40)"><rect width="170" height="170" rx="12" fill="none" stroke="${st}" stroke-width="2"/>` +
      `<ellipse cx="62" cy="108" rx="16" ry="26" fill="${o.inset}"/><ellipse cx="120" cy="44" rx="11" ry="15" fill="${o.inset}"/>` +
      `<text x="85" y="160" text-anchor="middle" fill="${st}" style="font:600 22px 'DM Sans',Arial">San Andrés</text></g>`;
  }
  if (o.extra) s += o.extra;
  el.innerHTML = s;
}

/* 1 · title */
mapSVG($('#titleMap'), {});
$$('#titleMap path.dp').forEach(p => { p.style.fill = 'rgba(244,180,26,.04)'; p.style.stroke = 'rgba(244,180,26,.35)'; p.style.strokeWidth = '1.5'; });

/* 2 · who am I */
{
  const [x, y] = D.pins.manizales;
  mapSVG($('#meMap'), { fill: d => d.c === '17' ? '#D64933' : '#D9CFBB',
    extra: `<circle class="pulse" cx="${x}" cy="${y}" r="10" fill="none" stroke="#D64933" stroke-width="6"/><circle cx="${x}" cy="${y}" r="16" fill="#D64933" stroke="#F5EFE3" stroke-width="4"/>` });
  const m = D.mini;
  $('#miniMap').innerHTML =
    `<path d="${m.sphere}" fill="#E4DAC6"/><path d="${m.land}" fill="#CBBFA6"/>` +
    `<path d="${m.china}" fill="#9AA9C4"/><path d="${m.col}" fill="#D64933"/>` +
    `<path class="draw auto" d="${m.arc}" fill="none" stroke="#D64933" stroke-width="3.5" stroke-dasharray="3000" style="transition-delay:.9s"/>` +
    `<circle cx="${m.sh[0]}" cy="${m.sh[1]}" r="7" fill="#0F1B2D"/><circle cx="${m.mz[0]}" cy="${m.mz[1]}" r="7" fill="#D64933"/>` +
    `<text x="${m.sh[0]}" y="${m.sh[1] + 30}" text-anchor="middle" style="font:600 20px 'DM Sans',Arial" fill="#0F1B2D">Shanghai</text>` +
    `<text x="${m.mz[0]}" y="${m.mz[1] + 30}" text-anchor="middle" style="font:600 20px 'DM Sans',Arial" fill="#D64933">Manizales</text>`;
  $('#kmText').textContent = m.km.toLocaleString('en-US') + ' km';
}

/* 3 · world */
{
  const w = D.world;
  let s = `<path d="${w.sphere}" fill="#16243B"/>`;
  w.countries.forEach(c => { s += `<path d="${c.d}" fill="${c.n === 'Colombia' ? '#F4B41A' : '#2A3A5A'}" stroke="#0F1B2D" stroke-width="1"/>`; });
  s += `<circle class="pulse" cx="${w.col[0]}" cy="${w.col[1]}" r="10" fill="none" stroke="#F4B41A" stroke-width="5"/>`;
  $('#worldMap').innerHTML = s;
  // label next to Colombia (map is drawn at 1440/1700 scale)
  const k = 1300 / 1700, lx = 580 + w.col[0] * k, ly = 190 + w.col[1] * k;
  $('#s-world').insertAdjacentHTML('beforeend',
    `<div class="lbl-pill in" style="--i:2;left:${lx + 120}px;top:${ly - 50}px;font:700 30px/1 var(--sans);color:var(--gold);translate:0 0">Colombia</div>`);
}

/* 4 · how big: Europe, Africa, China */
{
  const hiEU = ['Spain', 'France', 'Portugal'];
  const ov = (o, hi) => o.countries.map(c => `<path class="ov ${hi.includes(c.n) ? 'ovhi' : ''}" d="${c.d}"/>`).join('') +
    `<g transform="translate(${o.at[0]},${o.at[1]})"><g class="colfly"><path d="${o.col}"/></g></g>`;
  $('#euMap').innerHTML = ov(D.europe, hiEU);
  $('#afMap').innerHTML = ov(D.africa, ['Ethiopia']);
  const c = D.china;
  $('#chMap').innerHTML = `<path class="ch" d="${c.d}"/><g transform="translate(450,330)"><path class="c2" d="${c.col}"/></g><circle class="sh" cx="${c.shanghai[0]}" cy="${c.shanghai[1]}" r="9"/>`;
  css(`
   #s-size .ov{fill:#22314D;stroke:#0F1B2D;stroke-width:1.2;transition:fill .8s}
   #s-size .colfly path{fill:rgba(244,180,26,.55);stroke:#F4B41A;stroke-width:4}
   #s-size .colfly{opacity:0;transform:translate(-1400px,300px);transition:transform 1.6s cubic-bezier(.3,.8,.2,1),opacity .6s}
   #s-size[data-s="1"] #euMap .colfly, #s-size[data-s="2"] #euMap .colfly{opacity:1;transform:none}
   #s-size[data-s="2"] #euMap .ovhi{fill:#5A79B8}
   #afMap .colfly{transform:translate(-900px,0)}
   #s-size[data-s="3"] #afMap .colfly{opacity:1;transform:none;transition-delay:.5s}
   #s-size[data-s="3"] #afMap .ovhi{fill:#5A79B8;transition-delay:1.6s}
   #chMap .ch{fill:#22314D;stroke:#5A79B8;stroke-width:3}
   #chMap .c2{fill:#F4B41A;stroke:#0F1B2D;stroke-width:2}
   #chMap .sh{fill:#D64933}`);
}

/* 5 · geography */
{
  const L = D.lines, R = D.rivers;
  const arrow = (r, at) => `<g class="st" data-at="${at}"><line x1="${r.label[0]}" y1="${r.label[1]}" x2="${r.at[0]}" y2="${r.at[1]}" stroke="#BFE3F5" stroke-width="4" marker-end="url(#arr)"/></g>`;
  const ex =
    `<defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#BFE3F5"/></marker></defs>
    <g class="st" data-at="1">
      <path class="draw" d="${L.cordW}" fill="none" stroke="#E9B98B" stroke-width="16" stroke-linecap="round" opacity=".9"/>
      <path class="draw" d="${L.cordC}" fill="none" stroke="#E9B98B" stroke-width="16" stroke-linecap="round" opacity=".9"/>
      <path class="draw" d="${L.cordE}" fill="none" stroke="#E9B98B" stroke-width="16" stroke-linecap="round" opacity=".9"/>
      <path class="draw" d="${L.sierra}" fill="none" stroke="#E9B98B" stroke-width="22" stroke-linecap="round"/>
    </g>
    <g class="st" data-at="2">
      <path class="draw" d="${L.magdalena}" fill="none" stroke="#7FC4E8" stroke-width="7" stroke-linecap="round"/>
      <path class="draw" d="${L.cauca}" fill="none" stroke="#7FC4E8" stroke-width="7" stroke-linecap="round"/>
    </g>${arrow(R.magdalena, 2)}${arrow(R.cauca, 2)}`;
  mapSVG($('#geoMap'), { fill: () => '#22314D', extra: ex });
  $$('#geoMap path.dp').forEach(p => { p.style.stroke = '#2E3E5E'; p.style.strokeWidth = '1'; });
  const s = 0.9, host = $('#geoLabels');
  const lab = (pt, txt, font, at, color) => host.insertAdjacentHTML('beforeend',
    `<div class="lbl-pill st" data-at="${at}" style="left:${pt[0] * s}px;top:${pt[1] * s}px;font:${font};color:${color};text-align:center">${txt}</div>`);
  lab(D.lab.pacOcean, 'Pacific<br>Ocean', 'italic 500 28px/1.2 var(--sans)', 0, '#6E8BC0');
  lab(D.lab.carSea, 'Caribbean Sea', 'italic 500 28px/1.2 var(--sans)', 0, '#6E8BC0');
  lab(D.lab.andes, 'ANDES', '700 30px/1 var(--sans)', 1, '#E9B98B');
  lab(R.magdalena.label, 'Magdalena<br>River', '700 28px/1.1 var(--sans)', 2, '#BFE3F5');
  lab(R.cauca.label, 'Cauca<br>River', '700 28px/1.1 var(--sans)', 2, '#BFE3F5');
  lab(D.lab.llanos, 'Plains', '600 32px/1 var(--sans)', 3, '#A6C25A');
  lab(D.lab.amazon, 'Amazon', '600 32px/1 var(--sans)', 3, '#5FBF7F');
  lab(D.lab.caribbean, 'Caribbean coast', '600 28px/1 var(--sans)', 3, 'var(--gold)');
  lab(D.lab.pacific, 'Pacific<br>coast', '600 26px/1.1 var(--sans)', 3, '#3FBFAE');
}

/* 6 · natural regions */
{
  const order = { car: 0, and: 1, pac: 2, orin: 3, ama: 4, ins: 5 };
  mapSVG($('#regMap'), { anim: true, fill: d => NAT[d.nat].c, order: d => order[d.nat] * 2,
    pacFill: NAT.pac.c, pacOrder: 4, inset: NAT.ins.c, insetStroke: '#B8AA90' });
  Object.entries(NAT).forEach(([k, v], i) => $('#regLegend').insertAdjacentHTML('beforeend',
    `<div class="in" style="--i:${i + 2};display:flex;gap:18px;align-items:flex-start">
      <span style="flex:none;width:30px;height:30px;border-radius:50%;background:${v.c};margin-top:4px"></span>
      <div><p style="font:600 32px/1.2 var(--sans);color:var(--ink)">${v.n}</p><p class="small" style="margin-top:6px">${v.d}</p></div></div>`));
}

/* 7 · postcards — one place per natural region, plus my Andean favourites */
{
  mapSVG($('#postMap'), { fill: d => NAT[d.nat].c, pacFill: NAT.pac.c, inset: NAT.ins.c });
  $$('#postMap path.dp').forEach(p => { p.style.opacity = '.85'; });
  const box = { l: 620, t: 90, s: 680 / 1000 };
  const stage = pt => [box.l + pt[0] * box.s, box.t + pt[1] * box.s];
  const pin = k => stage(k === 'sanandres' ? INSET : D.pins[k]);
  // Cards on each side are sorted top-to-bottom by their pin, so leader lines never cross.
  const left = [
    { k: 'sanandres', t: 'San Andrés', s: 'The “sea of seven colours”' },
    { k: 'pacific', p: 'nuqui', t: 'Pacific coast', s: 'Jungle, rain and humpback whales' },
    { k: 'tatacoa', t: 'Tatacoa Desert', s: 'A desert in the middle of the Andes' },
    { k: 'lajas', t: 'Las Lajas, Nariño', s: 'A church built across a canyon' },
  ];
  const right = [
    { k: 'sierra', t: 'Sierra Nevada de Santa Marta', s: 'Snowy peaks next to the Caribbean' },
    { k: 'ruiz', t: 'Nevado del Ruiz', s: 'The volcano above my city' },
    { k: 'cano', t: 'Caño Cristales', s: '“River of five colours”' },
    { k: 'amazon', p: 'leticia', t: 'Amazon rainforest', s: 'Leticia, where Colombia, Brazil and Peru meet' },
  ];
  const RAD = 160;
  let order = [], lines = '', html = '';
  left.forEach((c, i) => order.push({ ...c, side: 'left', cx: 470, cy: 330 + i * 192 }));
  right.forEach((c, i) => order.push({ ...c, side: 'right', cx: 1450, cy: 170 + i * 238 }));
  // click order: walk the map from north to south, alternating sides
  order.sort((a, b) => pin(a.p || a.k)[1] - pin(b.p || b.k)[1]);
  order.forEach((c, i) => {
    const [px, py] = pin(c.p || c.k);
    const edgeX = c.side === 'left' ? c.cx + RAD / 2 : c.cx - RAD / 2;
    lines += `<g class="st fade" data-at="${i + 1}"><line x1="${px}" y1="${py}" x2="${edgeX}" y2="${c.cy}" stroke="#F4B41A" stroke-width="2.5" stroke-dasharray="6 6"/><circle cx="${px}" cy="${py}" r="9" fill="#F4B41A" stroke="#0F1B2D" stroke-width="3"/></g>`;
    const circle = ph(c.k, 'photo', 'rel', `width:${RAD}px;height:${RAD}px;border-width:5px;flex:none`);
    const tx = `<div class="tx"><b>${c.t}</b><span>${c.s}</span></div>`;
    const left0 = c.side === 'left' ? c.cx - RAD / 2 - 22 - 260 : c.cx - RAD / 2;
    html += `<div class="pc st ${c.side}" data-at="${i + 1}" style="left:${left0}px;top:${c.cy - RAD / 2}px;--dx:${px - c.cx}px;--dy:${py - c.cy}px">${c.side === 'left' ? tx + circle : circle + tx}</div>`;
  });
  $('#postLines').innerHTML = lines;
  $('#postcards').innerHTML = html;
}

/* 8 · peoples */
{
  mapSVG($('#pplMap'), { fill: () => '#DCD1BC', pacFill: '#DCD1BC' });
  const s = 0.9;
  $('#pplLabels').innerHTML = D.peoples.map((g, i) => {
    const today = g.type === 'today';
    const mark = today
      ? `<div style="position:absolute;left:-10px;top:-10px;width:20px;height:20px;border-radius:50%;background:#D64933;border:3px solid #F5EFE3"></div>`
      : `<div style="position:absolute;left:-9px;top:-9px;width:18px;height:18px;transform:rotate(45deg);background:#C9922E;border:3px solid #F5EFE3"></div>`;
    const side = g.side === 'L' ? 'right:18px' : 'left:18px';
    const style = today ? 'font:600 25px/1 var(--sans);color:var(--ink)' : 'font:italic 600 25px/1 var(--serif);color:#8A5A12';
    return `<div class="abs pop" style="--i:${i + 3};left:${g.p[0] * s}px;top:${g.p[1] * s}px">${mark}
      <p style="position:absolute;${side};top:-16px;white-space:nowrap;${style};background:rgba(245,239,227,.88);padding:4px 8px;border-radius:6px">${g.n}</p></div>`;
  }).join('');
}

/* 9 · three roots, with instrument pictures */
{
  const roots = [
    { n: 'Indigenous', c: '#E9A23B', t: 'Flutes like the <b>gaita</b> and the <b>quena</b>, maracas, rattles — and ritual songs for the land.',
      pics: [['gaita', 'Gaita'], ['quena', 'Quena'], ['maracas', 'Maracas']] },
    { n: 'African', c: '#D64933', t: 'Drums like the <b>tambor alegre</b> and <b>cununo</b>, the <b>marimba</b>, call-and-response singing.',
      pics: [['tamboralegre', 'Tambor alegre'], ['cununo', 'Cununo'], ['marimba', 'Marimba']] },
    { n: 'European', c: '#4F86D9', t: 'The <b>guitar</b> and string family, sung verses (coplas, décimas), brass bands and later the <b>accordion</b>.',
      pics: [['guitar', 'Guitar'], ['clarinet', 'Clarinet'], ['accordion', 'Accordion']] },
  ];
  $('#rootsGrid').innerHTML = roots.map((r, i) => `<div class="pop root" style="--i:${i + 2};--c:${r.c}">
    <div class="rc">${r.n}</div><p class="body" style="min-height:135px">${r.t}</p>
    <div class="pics">${r.pics.map(([k, cap]) => `<div>${ph(k, cap, 'rel', 'width:150px;height:150px;border-width:4px')}<p class="cap" style="font-size:21px;color:var(--paper)">${cap}</p></div>`).join('')}</div></div>`).join('');
}

/* 11 · five more instruments (colombia.co) */
{
  const inst = [
    { k: 'accordion', n: 'Accordion', r: 'Caribbean', c: '#F6CF45', d: 'The lead voice of vallenato' },
    { k: 'guacharaca', n: 'Guacharaca', r: 'Caribbean', c: '#F6CF45', d: 'Ribbed cane scraped with a fork' },
    { k: 'marimba', n: 'Marimba', r: 'Pacific', c: '#3FBFAE', d: 'Palm-wood keys over bamboo tubes' },
    { k: 'cununo', n: 'Cununo', r: 'Pacific', c: '#3FBFAE', d: 'Hand drums played in pairs' },
    { k: 'arpa', n: 'Arpa llanera', r: 'Llanos', c: '#A6C25A', d: 'The harp of the plains and joropo' },
  ];
  $('#instGrid').innerHTML = inst.map((x, i) => `<div class="pop" style="--i:${i + 2};text-align:center">
    ${ph(x.k, x.n, 'rel', `width:250px;height:250px;margin:0 auto;border-color:${x.c}`)}
    <h3 style="font:600 40px/1.1 var(--serif);margin-top:26px">${x.n}</h3>
    <p style="font:700 20px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:${x.c};margin-top:12px">${x.r}</p>
    <p class="small" style="margin-top:12px;min-height:68px">${x.d}</p>
    <div class="aud sm" data-audio="${x.k}" style="margin-top:14px"></div></div>`).join('');
}

/* 12 · twelve axes */
{
  const order = Object.keys(AX);
  mapSVG($('#axMap'), { anim: true, fill: d => AX[d.ax].c, order: d => order.indexOf(d.ax), pacFill: AX.pacs.c, pacOrder: 3, inset: AX.insu.c });
  order.forEach((k, i) => $('#axLegend').insertAdjacentHTML('beforeend', `<div class="in" style="--i:${i + 3};display:flex;gap:14px;align-items:center">
      <span style="flex:none;width:24px;height:24px;border-radius:50%;background:${AX[k].c}"></span>
      <p style="font:500 26px/1.15 var(--sans);color:var(--paper)">${AX[k].n}</p></div>`));
}

/* 13–18 · region spotlights */
const REGIONS = [
  { id: 'caribe', axes: ['caro', 'care'], es: 'Región Caribe', name: 'Caribbean', theme: 'dark',
    tag: 'Where Indigenous flutes, African drums and Spanish verse first met.',
    rhythms: ['Cumbia', 'Porro', 'Fandango', 'Bullerengue', 'Mapalé', 'Champeta', 'Vallenato'],
    inst: ['Gaitas', 'Caña de millo', 'Tambor alegre', 'Maracas', 'Accordion', 'Caja vallenata', 'Guacharaca'],
    dress: 'Pollera colorá', fact: 'Vallenato — accordion, caja and guacharaca — is UNESCO heritage in need of urgent safeguarding (2015).' },
  { id: 'pacifico', axes: ['pacn', 'pacs'], es: 'Región Pacífica', name: 'Pacific', theme: 'light',
    tag: 'Rainforest, rivers and the strongest African roots in the country.',
    rhythms: ['Currulao', 'Bunde', 'Juga', 'Berejú', 'Alabao', 'Chirimía', 'Abozao'],
    inst: ['Marimba de chonta', 'Cununos', 'Bombo', 'Guasá', 'Clarinet', 'Tambora'],
    dress: 'Currulao dancers', fact: 'The marimba music and chants of the South Pacific are UNESCO Intangible Cultural Heritage (2010, extended 2015).' },
  { id: 'andes', axes: ['anw', 'ance', 'anne', 'ancs', 'answ'], es: 'Región Andina', name: 'Andes', theme: 'dark',
    tag: 'Five musical axes in the mountains — where most Colombians live.',
    rhythms: ['Bambuco', 'Pasillo', 'Guabina', 'Torbellino', 'Sanjuanero', 'Rajaleña', 'Carranga', 'Sanjuanito'],
    inst: ['Tiple', 'Bandola', 'Guitar', 'Requinto', 'Chucho', 'Quena & zampoña'],
    dress: 'Sanjuanero dress (Huila)', fact: 'Bambuco is often called Colombia’s national rhythm. In the south, near Ecuador, Andean flutes and the sanjuanito take over.' },
  { id: 'llanos', axes: ['llan'], es: 'Llanos Orientales', name: 'Plains', theme: 'light',
    tag: 'Cowboys, horses and a harp — music shared with Venezuela.',
    rhythms: ['Joropo', 'Pasaje', 'Golpe', 'Contrapunteo'],
    inst: ['Arpa llanera', 'Cuatro', 'Maracas', 'Bandola llanera'],
    dress: 'Joropo dancers', fact: 'The llano work songs — sung alone, to herd and milk cattle — are UNESCO heritage in need of urgent safeguarding (2017).' },
  { id: 'amazonia', axes: ['amaz'], es: 'Amazonía', name: 'Amazon', theme: 'dark',
    tag: 'Indigenous ritual music, mixed with sounds from Brazil and Peru.',
    rhythms: ['Ritual songs & dances', 'Cumbia amazónica', 'Forró', 'Samba'],
    inst: ['Flutes', 'Maguaré drums', 'Seed rattles', 'Guitar', 'Accordion'],
    dress: 'Ceremonial dress', fact: 'In Leticia, three countries meet — Colombia, Brazil and Peru — and so do their rhythms.' },
  { id: 'islas', axes: ['insu'], es: 'San Andrés y Providencia', name: 'Islands', theme: 'light',
    tag: 'Closer to Central America than to Bogotá — Caribbean islands with English Creole roots.',
    rhythms: ['Calypso', 'Mento', 'Schottische', 'Polka', 'Mazurka', 'Reggae'],
    inst: ['Mandolin', 'Guitar', 'Washtub bass', 'Jawbone (quijada)', 'Maracas'],
    dress: 'Raizal traditional dress', fact: 'The Raizal islanders speak an English-based Creole, and their music sounds more like Jamaica and Trinidad than mainland Colombia.' },
];
{
  $('#spots').outerHTML = REGIONS.map((r, ri) => {
    const rc = AX[r.axes[0]].c;
    const capColor = r.theme === 'dark' ? 'var(--paper)' : 'var(--ink)';
    return `<section class="slide ${r.theme} spot" id="s-${r.id}" style="--rc:${rc}">
      <svg class="abs map" id="m-${r.id}" style="left:110px;top:110px;width:640px;height:736px" viewBox="0 0 1000 1150"></svg>
      <div class="aud in abs" data-audio="${r.id}" style="--i:5;left:128px;top:880px;width:640px"></div>
      <div class="abs" style="left:860px;top:110px;width:640px">
        <p class="eyebrow in" style="--i:0;color:var(--rc)">${String(ri + 1).padStart(2, '0')} · ${r.es}</p>
        <h2 class="title in" style="--i:1;margin-top:18px;font-size:100px">${r.name}</h2>
        <p class="body in" style="--i:2;margin-top:18px;font-family:var(--serif);font-style:italic;font-size:34px">${r.tag}</p>
        <p class="small in" style="--i:3;margin-top:36px;letter-spacing:.14em;text-transform:uppercase;font-weight:600">Rhythms</p>
        <div class="chips in" style="--i:3;margin-top:14px">${r.rhythms.map(x => `<span class="chip" style="border-color:var(--rc)">${x}</span>`).join('')}</div>
        <p class="small in" style="--i:4;margin-top:30px;letter-spacing:.14em;text-transform:uppercase;font-weight:600">Instruments</p>
        <div class="chips in" style="--i:4;margin-top:14px">${r.inst.map(x => `<span class="chip">${x}</span>`).join('')}</div>
      </div>
      <div class="abs pop" style="--i:3;left:1550px;top:100px;width:250px">
        ${ph('region-' + r.id, 'landscape', 'rel', 'width:250px;height:250px')}
        <p class="cap" style="color:${capColor}">The land</p></div>
      <div class="abs pop" style="--i:4;left:1550px;top:440px;width:250px">
        ${ph('dress-' + r.id, 'costume', 'rel', 'width:250px;height:250px;border-color:var(--rc)')}
        <p class="cap" style="color:${capColor}">The dance<small>${r.dress}</small></p></div>
      <p class="abs st" data-at="1" style="left:860px;top:860px;width:940px;font:400 26px/1.4 var(--sans);opacity:.85;border-left:5px solid var(--rc);padding-left:20px">${r.fact}</p>
      <aside class="notes">${r.name}: point to the region, name 2–3 rhythms, show the costume (how it is danced), play the clip (~15 s). Click once for the fact. (~50 s)</aside>
    </section>`;
  }).join('');
  REGIONS.forEach(r => {
    const light = r.theme === 'light', off = light ? '#DCD1BC' : '#22314D';
    mapSVG($('#m-' + r.id), { anim: true, fill: d => r.axes.includes(d.ax) ? AX[d.ax].c : off,
      pacFill: r.axes.includes('pacs') ? AX.pacs.c : off, inset: r.axes.includes('insu') ? AX.insu.c : off,
      insetStroke: light ? '#B8AA90' : '#3A4A6B',
      extra: r.axes.includes('insu') ? `<circle class="pulse" cx="${INSET[0]}" cy="${INSET[1]}" r="10" fill="none" stroke="${AX.insu.c}" stroke-width="6"/>` : '' });
  });
}

/* closing */
mapSVG($('#endMap'), { anim: true, fill: d => AX[d.ax].c, pacFill: AX.pacs.c, inset: AX.insu.c });

/* ---------- media ---------- */
$$('.ph[data-photo]').forEach(el => {
  const src = M.photo[el.dataset.photo]; if (!src) return;
  const im = new Image();
  im.onload = () => { el.style.backgroundImage = `url("${src}")`; el.classList.add('has'); };
  im.src = src;
});
const PLAY = '<svg class="play" viewBox="0 0 40 40"><path d="M12 6 L34 20 L12 34 Z" fill="#0F1B2D"/></svg>';
$$('.aud[data-audio]').forEach(a => {
  const k = a.dataset.audio, lab = M.audioLabel[k] || ['Listen', ''];
  a.innerHTML = `<div class="btn">${PLAY}<div class="eq"><i></i><i></i><i></i><i></i></div></div><div><p class="t">${lab[0]}</p><p class="s">${lab[1]}</p></div>`;
  const au = new Audio(); au.preload = 'auto'; au.src = M.audio[k] || '';
  au.addEventListener('error', () => { a.classList.add('missing'); $('.s', a).textContent = 'add ' + (M.audio[k] || ''); });
  au.addEventListener('ended', () => a.classList.remove('playing'));
  a._au = au;
  a.addEventListener('click', e => {
    e.stopPropagation();
    if (a.classList.contains('missing')) return;
    if (!au.paused) { au.pause(); a.classList.remove('playing'); return; }
    stopAudio(); au.currentTime = 0;
    const p = au.play(); if (p) p.catch(() => a.classList.remove('playing'));
    a.classList.add('playing');
  });
});
function stopAudio() { $$('.aud').forEach(a => { if (a._au && !a._au.paused) a._au.pause(); a.classList.remove('playing'); }); }

/* ---------- engine ---------- */
const slides = $$('#stage > section.slide');
let idx = 0, step = 0;
const maxStep = s => Math.max(0, ...$$('[data-at]', s).map(e => +e.dataset.at));
function applySteps(s, n) {
  s.dataset.s = n;
  $$('[data-at]', s).forEach(e => e.classList.toggle('on', n >= +e.dataset.at));
  $$('[data-until]', s).forEach(e => e.classList.toggle('off', n >= +e.dataset.until));
}
function go(i, n = 0) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  if (i !== idx) stopAudio();
  slides.forEach((s, j) => s.classList.toggle('active', j === i));
  idx = i; step = n; applySteps(slides[i], n);
  $('#bar').style.width = ((i + 1) / slides.length * 100) + '%';
  $('#count').textContent = (i + 1) + ' / ' + slides.length;
  const nt = $('aside.notes', slides[i]);
  $('#notes').innerHTML = '<b>Notes · slide ' + (i + 1) + ':</b> ' + (nt ? nt.innerHTML : '');
  try { history.replaceState(null, '', '#' + (i + 1)); } catch (_) {}
}
function next() { const s = slides[idx]; if (step < maxStep(s)) { step++; applySteps(s, step); } else if (idx < slides.length - 1) go(idx + 1, 0); }
function prev() { const s = slides[idx]; if (step > 0) { step--; applySteps(s, step); } else if (idx > 0) go(idx - 1, maxStep(slides[idx - 1])); }
document.addEventListener('keydown', e => {
  if (['ArrowRight', 'PageDown', ' ', 'Enter', 'ArrowDown'].includes(e.key)) { e.preventDefault(); next(); }
  else if (['ArrowLeft', 'PageUp', 'ArrowUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
  else if (e.key === 'f' || e.key === 'F') {
    try { const p = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); if (p) p.catch(() => {}); } catch (_) {}
  }
  else if (e.key === 'n' || e.key === 'N') { const n = $('#notes'); n.style.display = n.style.display === 'block' ? 'none' : 'block'; }
  else if (e.key === 'Home') go(0); else if (e.key === 'End') go(slides.length - 1);
});
document.addEventListener('click', e => { if (e.target.closest('#notes, a')) return; (e.clientX < innerWidth * 0.25) ? prev() : next(); });
let tx = null;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) (dx < 0 ? next : prev)(); tx = null; });
function fit() { $('#stage').style.setProperty('--k', Math.min(innerWidth / 1920, innerHeight / 1080)); }
addEventListener('resize', fit); fit();
const start = parseInt(location.hash.slice(1)); go(isNaN(start) ? 0 : start - 1, 0);
window.deck = { go, slides, maxStep };
})();
