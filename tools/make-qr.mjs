// Writes img/qr.svg pointing to the published presentation.
import fs from 'fs';
import QRCode from 'qrcode';
const URL = process.argv[2] || 'https://michaelherediaperez.github.io/colombia-music/';
const svg = await QRCode.toString(URL, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#0F1B2D', light: '#F5EFE3' } });
fs.mkdirSync('../img', { recursive: true });
fs.writeFileSync('../img/qr.svg', svg);
console.log('QR ->', URL);
