const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, colorGenerator) {
  // 4 bytes per pixel (RGBA) + 1 filter byte per row
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = colorGenerator(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // Helper to build PNG chunks
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);

    // CRC32 calculation
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // Color type 6 (RGBA)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressedData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdr, idat, iend]);
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate cool arcade icon colors
function arcadeColor(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = w * 0.42;

  // Background deep dark indigo
  if (dist > radius) {
    if (dist < radius + 6) return [0, 243, 255, 255]; // Neon cyan border
    return [10, 15, 29, 255]; // Deep dark bg
  }

  // Inner ring
  if (dist > radius - 12 && dist <= radius) {
    return [255, 0, 127, 255]; // Neon pink inner ring
  }

  // Center ball gradient
  const grad = (x + y) / (w + h);
  const r = Math.floor(15 + grad * 120);
  const g = Math.floor(25 + grad * 60);
  const b = Math.floor(60 + grad * 190);

  // Center bright highlight
  const hlDx = x - (cx - radius * 0.3);
  const hlDy = y - (cy - radius * 0.3);
  if (Math.sqrt(hlDx * hlDx + hlDy * hlDy) < radius * 0.28) {
    return [255, 255, 255, 220];
  }

  return [r, g, b, 255];
}

const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPng(192, 192, arcadeColor));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPng(512, 512, arcadeColor));
console.log('Successfully generated valid PNG icons for PWA: icon-192.png and icon-512.png!');
