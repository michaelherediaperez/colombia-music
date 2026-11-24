# Colombia: a country that sounds like its geography

A 10-minute presentation on Colombian music by region, for the *General View of China* course at Tongji University.
By **Michael Heredia Pérez**.

**Live:** https://michaelherediaperez.github.io/colombia-music/

## Present it

Open `index.html` in a browser (it also works offline, straight from the folder).

| Key | Action |
|---|---|
| → / Space / click | next step or slide |
| ← / click on the left quarter | back |
| F | full screen |
| N | speaker notes with timings |

## Structure

```
index.html        the slides (markup)
css/deck.css      styles and animations
js/deck.js        slide builders + presentation engine
js/media.js       list of every photo and sound — edit names here
js/mapdata.js     generated maps (do not edit by hand)
media/            photos and sounds (see media/README.md)
img/qr.svg        QR code to the live page
fonts/            Fraunces and DM Sans (SIL Open Font License)
tools/            scripts that generate the maps and the QR code
```

Regenerate maps or the QR code:

```
cd tools
npm install
npm run maps
npm run qr          # or: node make-qr.mjs https://your/other/url/
```

## Sources

- Musical axes: “Ejes musicales de Colombia”, Wikipedia (es).
- Instruments: “The sound of music: traditional Colombian instruments”, colombia.co.
- Indigenous peoples: DANE, Censo Nacional de Población y Vivienda 2018 (115 peoples); Ministerio de Cultura / Ministerio de Educación (65 Indigenous languages).
- Map borders: DANE Marco Geoestadístico Nacional 2018 (departments), Natural Earth via `world-atlas` (countries).
- Size comparisons: computed in equal-area projections; idea from thetruesize.com.

## Credits for media

| File | Author / source | License |
|---|---|---|
| | | |

Code: MIT (see LICENSE). Photos and sounds keep their own licenses, listed above.
