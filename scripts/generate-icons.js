import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ICONS_DIR = path.resolve('public/icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 1. Full Emblem Vector (Standard Icon 512x512, with corner radius & full aesthetic)
const standardIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e" />
      <stop offset="60%" stop-color="#115e59" />
      <stop offset="100%" stop-color="#042f2e" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="flaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ccfbf1" />
      <stop offset="100%" stop-color="#99f6e4" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#021f1e" flood-opacity="0.6"/>
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="512" height="512" rx="108" fill="url(#bgGrad)" />
  
  <!-- Outer Decorative Ring -->
  <circle cx="256" cy="256" r="226" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-opacity="0.4" stroke-dasharray="6 6"/>
  <circle cx="256" cy="256" r="212" fill="#042f2e" stroke="url(#goldGrad)" stroke-width="4" filter="url(#shadow)"/>

  <!-- Inner Surveillance Radar / Pulse lines -->
  <circle cx="256" cy="256" r="160" fill="none" stroke="#0d9488" stroke-width="1.5" stroke-opacity="0.5" stroke-dasharray="4 4"/>
  <circle cx="256" cy="256" r="110" fill="none" stroke="#0d9488" stroke-width="1.5" stroke-opacity="0.3"/>

  <!-- Surveillance EKG / Epizootic Wave -->
  <path d="M 90 256 L 155 256 L 175 210 L 195 295 L 220 180 L 245 310 L 270 200 L 295 285 L 315 225 L 335 256 L 422 256" 
        fill="none" stroke="#34d399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>

  <!-- Veterinary Laboratory Flask Emblem (Centered) -->
  <g transform="translate(256, 238) scale(1.1)" filter="url(#shadow)">
    <!-- Flask Outline Glass -->
    <path d="M -22 -85 L 22 -85 M -15 -85 L -15 -42 L -68 52 C -78 68 -64 88 -42 88 L 42 88 C 64 88 78 68 68 52 L 15 -42 L 15 -85" 
          fill="#0f766e" stroke="url(#flaskGrad)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Liquid in Flask with Emerald glow -->
    <path d="M -54 30 L -38 10 C -22 18 0 -2 22 10 L 54 30 C 62 44 58 78 38 80 L -38 80 C -58 78 -62 44 -54 30 Z" 
          fill="url(#emeraldGrad)" opacity="0.9" filter="url(#glow)"/>
    
    <!-- Bubbles in Liquid -->
    <circle cx="-14" cy="48" r="5.5" fill="#ffffff" opacity="0.75"/>
    <circle cx="16" cy="34" r="7" fill="#ffffff" opacity="0.85"/>
    <circle cx="-4" cy="20" r="4" fill="#ffffff" opacity="0.6"/>
    
    <!-- Veterinary Rod of Asclepius & Medical Cross -->
    <path d="M 0 -22 L 0 54 M -16 16 L 16 16" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <!-- Asclepius Serpent wrap -->
    <path d="M -12 -8 Q 0 -18 12 -8 Q 0 4 -12 16 Q 0 28 12 38" fill="none" stroke="#fef08a" stroke-width="3.5" stroke-linecap="round"/>
  </g>

  <!-- Typography / Brand Seal -->
  <text x="256" y="416" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="30" font-weight="900" fill="#ffffff" letter-spacing="4">HRVL</text>
  <text x="256" y="442" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="#5eead4" letter-spacing="2.5">VETERINARY LABORATORY</text>
</svg>
`;

// 2. Maskable Icon SVG (Android adaptive icon: full bleed background, ALL content within safe central circle 80% = r:180)
const maskableIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="maskBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e" />
      <stop offset="50%" stop-color="#115e59" />
      <stop offset="100%" stop-color="#042f2e" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="flaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ccfbf1" />
      <stop offset="100%" stop-color="#99f6e4" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#021f1e" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Full-bleed Solid Background without rounded corners (for Android masking) -->
  <rect width="512" height="512" fill="url(#maskBg)" />

  <!-- Safe Zone Circular Seal (Radius 175px = sits safely within 80% circle) -->
  <circle cx="256" cy="256" r="172" fill="#042f2e" stroke="url(#goldGrad)" stroke-width="4" filter="url(#shadow)"/>
  <circle cx="256" cy="256" r="158" fill="none" stroke="#0d9488" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.6"/>

  <!-- Pulse EKG in safe zone -->
  <path d="M 115 256 L 160 256 L 180 215 L 205 290 L 225 190 L 250 310 L 275 205 L 300 280 L 320 230 L 340 256 L 397 256" 
        fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>

  <!-- Centered Scaled Flask & Medical Rod (Scaled to fit strictly in safe area) -->
  <g transform="translate(256, 235) scale(0.95)" filter="url(#shadow)">
    <path d="M -22 -85 L 22 -85 M -15 -85 L -15 -42 L -68 52 C -78 68 -64 88 -42 88 L 42 88 C 64 88 78 68 68 52 L 15 -42 L 15 -85" 
          fill="#0f766e" stroke="url(#flaskGrad)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    
    <path d="M -54 30 L -38 10 C -22 18 0 -2 22 10 L 54 30 C 62 44 58 78 38 80 L -38 80 C -58 78 -62 44 -54 30 Z" 
          fill="url(#emeraldGrad)" opacity="0.9"/>
    
    <circle cx="-14" cy="48" r="5.5" fill="#ffffff" opacity="0.75"/>
    <circle cx="16" cy="34" r="7" fill="#ffffff" opacity="0.85"/>
    <circle cx="-4" cy="20" r="4" fill="#ffffff" opacity="0.6"/>
    
    <path d="M 0 -22 L 0 54 M -16 16 L 16 16" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <path d="M -12 -8 Q 0 -18 12 -8 Q 0 4 -12 16 Q 0 28 12 38" fill="none" stroke="#fef08a" stroke-width="3.5" stroke-linecap="round"/>
  </g>

  <!-- Clean Safe Typography -->
  <text x="256" y="388" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="26" font-weight="900" fill="#ffffff" letter-spacing="3">HRVL</text>
  <text x="256" y="408" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700" fill="#5eead4" letter-spacing="1.5">REGIONAL VET LAB</text>
</svg>
`;

// 3. Apple Touch Icon SVG (180x180 square canvas, full bleed #0f766e, centered emblem)
const appleTouchIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <defs>
    <linearGradient id="appleBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e" />
      <stop offset="100%" stop-color="#042f2e" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>

  <rect width="180" height="180" fill="url(#appleBg)" />
  <circle cx="90" cy="90" r="76" fill="#042f2e" stroke="url(#goldGrad)" stroke-width="2"/>
  <circle cx="90" cy="90" r="70" fill="none" stroke="#0d9488" stroke-width="1" stroke-dasharray="3 3"/>

  <g transform="translate(90, 83) scale(0.42)">
    <path d="M -22 -85 L 22 -85 M -15 -85 L -15 -42 L -68 52 C -78 68 -64 88 -42 88 L 42 88 C 64 88 78 68 68 52 L 15 -42 L 15 -85" 
          fill="#0f766e" stroke="#ccfbf1" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M -54 30 L -38 10 C -22 18 0 -2 22 10 L 54 30 C 62 44 58 78 38 80 L -38 80 C -58 78 -62 44 -54 30 Z" 
          fill="url(#emeraldGrad)"/>
    <path d="M 0 -22 L 0 54 M -16 16 L 16 16" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <path d="M -12 -8 Q 0 -18 12 -8 Q 0 4 -12 16 Q 0 28 12 38" fill="none" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
  </g>

  <text x="90" y="148" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#ffffff" letter-spacing="2">HRVL</text>
</svg>
`;

// 4. Favicon SVG (High contrast, clean geometry at small sizes)
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="favBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e" />
      <stop offset="100%" stop-color="#042f2e" />
    </linearGradient>
    <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#favBg)" />
  <circle cx="32" cy="32" r="28" fill="#042f2e" stroke="#eab308" stroke-width="1.5" />
  
  <g transform="translate(32, 28) scale(0.18)">
    <path d="M -22 -85 L 22 -85 M -15 -85 L -15 -42 L -68 52 C -78 68 -64 88 -42 88 L 42 88 C 64 88 78 68 68 52 L 15 -42 L 15 -85" 
          fill="#0f766e" stroke="#ccfbf1" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M -54 30 L -38 10 C -22 18 0 -2 22 10 L 54 30 C 62 44 58 78 38 80 L -38 80 C -58 78 -62 44 -54 30 Z" 
          fill="url(#emGrad)"/>
    <path d="M 0 -22 L 0 54 M -16 16 L 16 16" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  </g>
  <text x="32" y="55" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="900" fill="#ffffff" letter-spacing="1">HRVL</text>
</svg>
`;

// ICO Builder: creates a valid multi-image ICO binary buffer (16x16, 32x32, 48x48 PNG frames inside ICO)
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  let offset = 6 + count * 16;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Image count

  const directoryEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // Image byte size
    entry.writeUInt32LE(offset, 12); // Image data offset
    directoryEntries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...directoryEntries, ...pngBuffers.map(p => p.buffer)]);
}

async function run() {
  console.log('Generating high-precision PWA assets...');

  // 1. icon-512.png (512x512)
  const icon512Buf = await sharp(Buffer.from(standardIconSvg))
    .resize(512, 512)
    .png()
    .toBuffer();
  fs.writeFileSync(path.resolve('public/icons/icon-512.png'), icon512Buf);
  console.log('Created public/icons/icon-512.png (512x512)');

  // Also write public/hrvl-emblem.png and public/pwa-512x512.png for backwards compatibility
  fs.writeFileSync(path.resolve('public/hrvl-emblem.png'), icon512Buf);
  fs.writeFileSync(path.resolve('public/pwa-512x512.png'), icon512Buf);

  // 2. icon-192.png (192x192)
  const icon192Buf = await sharp(Buffer.from(standardIconSvg))
    .resize(192, 192)
    .png()
    .toBuffer();
  fs.writeFileSync(path.resolve('public/icons/icon-192.png'), icon192Buf);
  fs.writeFileSync(path.resolve('public/pwa-192x192.png'), icon192Buf);
  console.log('Created public/icons/icon-192.png (192x192)');

  // 3. maskable-512.png (512x512)
  const maskable512Buf = await sharp(Buffer.from(maskableIconSvg))
    .resize(512, 512)
    .png()
    .toBuffer();
  fs.writeFileSync(path.resolve('public/icons/maskable-512.png'), maskable512Buf);
  fs.writeFileSync(path.resolve('public/pwa-maskable-512x512.png'), maskable512Buf);
  console.log('Created public/icons/maskable-512.png (512x512 maskable)');

  // 4. apple-touch-icon.png (180x180)
  const apple180Buf = await sharp(Buffer.from(appleTouchIconSvg))
    .resize(180, 180)
    .png()
    .toBuffer();
  fs.writeFileSync(path.resolve('public/icons/apple-touch-icon.png'), apple180Buf);
  fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), apple180Buf);
  console.log('Created public/icons/apple-touch-icon.png (180x180)');

  // 5. favicon.ico (Multi-size: 16x16, 32x32, 48x48)
  const fav16Buf = await sharp(Buffer.from(faviconSvg)).resize(16, 16).png().toBuffer();
  const fav32Buf = await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toBuffer();
  const fav48Buf = await sharp(Buffer.from(faviconSvg)).resize(48, 48).png().toBuffer();

  const icoBuf = createIco([
    { width: 16, height: 16, buffer: fav16Buf },
    { width: 32, height: 32, buffer: fav32Buf },
    { width: 48, height: 48, buffer: fav48Buf }
  ]);
  fs.writeFileSync(path.resolve('public/favicon.ico'), icoBuf);
  console.log('Created public/favicon.ico (Multi-size ICO: 16, 32, 48)');

  // 6. Update public/icon.svg
  fs.writeFileSync(path.resolve('public/icon.svg'), standardIconSvg);
  console.log('Updated public/icon.svg');

  console.log('All PWA assets generated successfully!');
}

run().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
