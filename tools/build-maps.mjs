// Builds js/mapdata.js: every map in the deck, already projected to SVG paths.
// Run from tools/:  npm install && npm run maps
import fs from 'fs';
import * as d3 from 'd3-geo';
import * as topo from 'topojson-client';

const R_EARTH = 6371.0088;
const round = n => Math.round(n * 10) / 10;
const pathStr = (gen, f, dp = 1) => (gen(f) || '').replace(/-?\d+\.\d+/g, m => String(dp ? round(+m) : Math.round(+m)));

// d3 wants clockwise rings; GeoJSON (RFC 7946) gives counter-clockwise ones.
function fixRings(geom) {
  const fixPoly = coords => {
    const g = { type: 'Polygon', coordinates: coords };
    return d3.geoArea(g) > 2 * Math.PI ? coords.map(r => r.slice().reverse()) : coords;
  };
  if (geom.type === 'Polygon') geom.coordinates = fixPoly(geom.coordinates);
  if (geom.type === 'MultiPolygon') geom.coordinates = geom.coordinates.map(fixPoly);
  return geom;
}

// ---------- Colombia, by department (DANE MGN 2018) ----------
const depts = JSON.parse(fs.readFileSync('data/dptos-simplified.geojson'));
depts.features.forEach(f => fixRings(f.geometry));
const W = 1000, H = 1150;
const mainland = { type: 'FeatureCollection', features: depts.features.filter(f => f.properties.DPTO_CCDGO !== '88') };
const proj = d3.geoMercator().fitExtent([[20, 20], [W - 20, H - 20]], mainland);
const gen = d3.geoPath(proj);
const P = (lon, lat) => proj([lon, lat]).map(round);

// Natural region and musical axis of each department (by DANE code).
const NAT = { '08':'car','13':'car','23':'car','70':'car','47':'car','20':'car','44':'car',
  '27':'pac','05':'and','17':'and','66':'and','63':'and','76':'and','19':'and','52':'and','41':'and','73':'and',
  '25':'and','11':'and','15':'and','68':'and','54':'and','81':'orin','85':'orin','50':'orin','99':'orin',
  '18':'ama','86':'ama','95':'ama','94':'ama','97':'ama','91':'ama','88':'ins' };
const AXIS = { '08':'caro','13':'caro','23':'caro','70':'caro','47':'care','20':'care','44':'care',
  '27':'pacn','05':'anw','17':'anw','66':'anw','63':'anw','76':'anw','19':'answ','52':'answ','41':'ancs','73':'ancs',
  '25':'ance','11':'ance','15':'ance','68':'anne','54':'anne','81':'llan','85':'llan','50':'llan','99':'llan',
  '18':'amaz','86':'amaz','95':'amaz','94':'amaz','97':'amaz','91':'amaz','88':'insu' };
const deptOut = mainland.features.map(f => ({
  c: f.properties.DPTO_CCDGO, n: f.properties.DPTO_CNMBR, d: pathStr(gen, f),
  nat: NAT[f.properties.DPTO_CCDGO], ax: AXIS[f.properties.DPTO_CCDGO] }));

// Pacific lowlands of Valle, Cauca and Nariño (approximate, west of the Western Cordillera).
const pacClip = fixRings({ type: 'Polygon', coordinates: [[[-80,4.25],[-76.95,4.25],[-76.85,3.6],[-76.95,3.0],[-77.2,2.55],[-77.55,2.0],[-77.95,1.45],[-78.3,1.1],[-78.6,0.9],[-80,0.5],[-80,4.25]]] });

// Stylised mountain ranges and rivers (approximate).
const L = pts => pathStr(gen, { type: 'LineString', coordinates: pts });
const lines = {
  cordW: L([[-77.7,0.9],[-77.0,1.9],[-76.6,2.6],[-76.3,3.6],[-76.1,4.6],[-76.0,5.6],[-75.9,6.6],[-76.0,7.6]]),
  cordC: L([[-77.3,1.0],[-76.6,1.7],[-76.1,2.4],[-75.7,3.3],[-75.4,4.2],[-75.33,4.9],[-75.4,5.7],[-75.3,6.6],[-75.1,7.6]]),
  cordE: L([[-76.6,1.4],[-75.8,2.2],[-75.0,3.1],[-74.3,4.0],[-73.8,5.0],[-73.2,6.0],[-72.8,7.0],[-72.6,7.8],[-72.9,9.0],[-73.0,10.2]]),
  sierra: L([[-74.1,10.7],[-73.7,10.9],[-73.3,10.9]]),
  magdalena: L([[-76.4,1.9],[-75.7,2.6],[-75.2,3.4],[-74.85,4.3],[-74.7,5.4],[-74.3,6.6],[-73.9,7.6],[-74.2,8.8],[-74.7,10.0],[-74.85,11.05]]),
  cauca: L([[-76.6,2.4],[-76.45,3.4],[-76.1,4.3],[-75.85,5.2],[-75.65,6.3],[-75.35,7.5],[-75.0,8.4],[-74.6,9.1]]),
};
// Where the river arrows point, and where their labels sit.
const rivers = {
  magdalena: { at: P(-74.75, 5.0), label: P(-71.6, 7.0) },
  cauca: { at: P(-75.9, 5.0), label: P(-79.4, 7.0) },
};

// Places (lon, lat), checked against the department they must fall in.
const PLACES = {
  manizales: [-75.51, 5.07, 'CALDAS'],
  ruiz: [-75.32, 4.89, 'TOLIMA'],          // Nevado del Ruiz summit, Caldas–Tolima border
  tatacoa: [-75.17, 3.23, 'HUILA'],        // Villavieja, Huila
  lajas: [-77.585, 0.805, 'NARIÑO'],       // Santuario de Las Lajas, Ipiales
  cano: [-73.79, 2.26, 'META'],            // Caño Cristales, La Macarena
  sierra: [-73.7, 10.85, 'MAGDALENA'],     // Sierra Nevada de Santa Marta
  leticia: [-69.94, -4.2, 'AMAZONAS'],
  nuqui: [-77.25, 5.71, 'CHOCÓ'],          // Nuquí, Chocó (whale watching)
};
const raw = JSON.parse(fs.readFileSync('data/dptos.geojson'));
raw.features.forEach(f => fixRings(f.geometry));
const deptOf = (lon, lat) => {
  const f = raw.features.find(f => d3.geoContains(f, [lon, lat]));
  return f ? f.properties.DPTO_CNMBR : null;
};
const pins = {};
for (const [k, [lon, lat, want]] of Object.entries(PLACES)) {
  const got = deptOf(lon, lat);
  if (got && !got.toUpperCase().includes(want.split(' ')[0])) console.warn(`! ${k}: expected ${want}, got ${got}`);
  pins[k] = P(lon, lat);
}

// Indigenous peoples (today) and pre-Columbian cultures, at a representative place of each territory.
// type: 'today' = living people (DANE CNPV 2018), 'past' = archaeological culture.
const PEOPLES = [
  ['Wayuu', -72.27, 11.71, 'today', 'LA GUAJIRA', 'R'],              // Uribia
  ['Kogi · Arhuaco · Wiwa', -73.55, 10.75, 'today', 'CESAR', 'R'],  // Sierra Nevada de Santa Marta
  ['Tayrona', -73.93, 11.04, 'past', 'MAGDALENA', 'L'],             // Ciudad Perdida
  ['Zenú', -75.51, 9.15, 'today', 'CÓRDOBA', 'L'],                  // San Andrés de Sotavento
  ['Emberá', -76.75, 5.95, 'today', 'CHOCÓ', 'L'],                  // Chocó
  ['Quimbaya', -75.68, 4.55, 'past', 'QUINDIO', 'L'],               // Quindío
  ['Muisca', -73.36, 5.53, 'past', 'BOYACÁ', 'R'],                  // Tunja / Bogotá savanna
  ['Nasa', -76.0, 2.55, 'today', 'CAUCA', 'R'],                     // Tierradentro
  ['San Agustín', -76.27, 1.88, 'past', 'HUILA', 'R'],
  ['Pastos', -77.75, 0.95, 'today', 'NARIÑO', 'L'],                 // Cumbal / Ipiales
  ['Sikuani', -69.8, 4.4, 'today', 'VICHADA', 'R'],
  ['Uitoto', -73.0, -1.45, 'today', 'AMAZONAS', 'R'],               // La Chorrera
  ['Tikuna', -70.36, -3.77, 'today', 'AMAZONAS', 'R'],              // Puerto Nariño
];
const peoples = PEOPLES.map(([n, lon, lat, type, want, side]) => {
  const got = deptOf(lon, lat);
  const norm = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  if (!got || !norm(got).includes(norm(want).split(' ')[0])) console.warn(`! ${n}: expected ${want}, got ${got}`);
  return { n, type, side, p: P(lon, lat) };
});

const lab = { caribbean: P(-76.6, 9.0), pacific: P(-77.9, 3.2), andes: P(-75.3, 5.6), llanos: P(-70.8, 5.3),
  amazon: P(-71.5, 0.0), pacOcean: P(-79.6, 1.6), carSea: P(-76.0, 12.1) };

// ---------- World + comparisons ----------
const world = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const countries = topo.feature(world, world.objects.countries).features;
const byName = n => countries.find(f => f.properties.name === n);
const world110 = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json'));
const countries110 = topo.feature(world110, world110.objects.countries).features;
const col = byName('Colombia');
const area = f => Math.round(d3.geoArea(f) * R_EARTH * R_EARTH);
const cc = d3.geoCentroid(col);

// World map (Equal Earth, centred on the Atlantic) for "where is Colombia".
const WW = 1700, WH = 830;
const worldProj = d3.geoEqualEarth().fitExtent([[0, 0], [WW, WH]], { type: 'Sphere' });
const worldGen = d3.geoPath(worldProj);
const worldOut = countries110.filter(f => f.properties.name !== 'Antarctica').map(f => ({ n: f.properties.name, d: pathStr(worldGen, f, 0) }));
const worldSphere = pathStr(worldGen, { type: 'Sphere' });
const colOnWorld = worldProj(cc).map(round);

// Colombia dropped at true scale on a region map (all azimuthal equal-area, same scale).
function overlay(rotate, fitTo, at, w, h) {
  const rp = d3.geoAzimuthalEqualArea().rotate(rotate).fitExtent([[0, 0], [w, h]], { type: 'MultiPoint', coordinates: fitTo }).clipExtent([[-200, -200], [w + 200, h + 200]]);
  const g = d3.geoPath(rp);
  const list = countries.filter(f => { const c = d3.geoCentroid(f); return d3.geoDistance(c, [-rotate[0], -rotate[1]]) < 0.9; })
    .map(f => ({ n: f.properties.name, d: pathStr(g, f, 0) })).filter(c => c.d);
  const cp = d3.geoAzimuthalEqualArea().rotate([-cc[0], -cc[1]]).scale(rp.scale()).translate([0, 0]);
  return { w, h, countries: list, col: pathStr(d3.geoPath(cp), col), at: rp(at).map(round) };
}
const europe = overlay([-12, -50], [[-11,36],[30,36],[30,60],[-11,60],[10,35],[10,61]], [-1.5, 44.0], 1700, 900);
const africa = overlay([-20, -2], [[-18,37],[51,12],[20,-35],[-17,15],[40,-25]], [39.6, 8.6], 1300, 1000);
const china = byName('China');
const ch = d3.geoCentroid(china);
const chProj = d3.geoAzimuthalEqualArea().rotate([-ch[0], -ch[1]]).fitExtent([[0, 0], [900, 700]], china);
const chinaOut = { d: pathStr(d3.geoPath(chProj), china),
  col: pathStr(d3.geoPath(d3.geoAzimuthalEqualArea().rotate([-cc[0], -cc[1]]).scale(chProj.scale()).translate([0, 0])), col),
  shanghai: chProj([121.47, 31.23]).map(round) };

const africaArea = countries.filter(f => { const c = d3.geoCentroid(f); return c[0] > -26 && c[0] < 60 && c[1] > -36 && c[1] < 38 && !['Saudi Arabia','Yemen','Oman','United Arab Emirates','Iraq','Syria','Jordan','Israel','Palestine','Lebanon','Kuwait','Qatar','Bahrain','Iran','Turkey','Cyprus','Spain','Portugal','Italy','Greece','Malta'].includes(f.properties.name); })
  .reduce((s, f) => s + area(f), 0);
console.log('areas km²', { colombia: area(col), ethiopia: area(byName('Ethiopia')), africa: africaArea, china: area(china) });

// Small Pacific-centred map for "Shanghai → Manizales".
const MW = 600, MH = 300;
const miniProj = d3.geoEqualEarth().rotate([170, 0]).fitExtent([[0, 0], [MW, MH]], { type: 'Sphere' });
const miniGen = d3.geoPath(miniProj);
const SH = [121.47, 31.23], MZ = [-75.51, 5.07];
const mini = {
  w: MW, h: MH, sphere: pathStr(miniGen, { type: 'Sphere' }),
  land: countries110.filter(f => f.properties.name !== 'Antarctica').map(f => pathStr(miniGen, f, 0)).join(''),
  china: pathStr(miniGen, china), col: pathStr(miniGen, col),
  arc: pathStr(miniGen, { type: 'LineString', coordinates: [SH, MZ] }),
  sh: miniProj(SH).map(round), mz: miniProj(MZ).map(round),
  km: Math.round(d3.geoDistance(SH, MZ) * R_EARTH / 100) * 100,
};

const data = { W, H, depts: deptOut, pacClipD: pathStr(gen, pacClip), lines, rivers, pins, peoples, lab,
  world: { w: WW, h: WH, sphere: worldSphere, countries: worldOut, col: colOnWorld },
  europe, africa, china: chinaOut, mini };
fs.writeFileSync('../js/mapdata.js', '// Generated by tools/build-maps.mjs — do not edit by hand.\nwindow.MAPDATA = ' + JSON.stringify(data) + ';\n');
console.log('mapdata.js', Math.round(JSON.stringify(data).length / 1024), 'KB; Shanghai–Manizales', mini.km, 'km');
