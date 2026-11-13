const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Function to generate a simple solid PNG with RGBA buffer
function createPNG(width, height, r, g, b, a = 255) {
  // Construct uncompressed scanlines
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // create a subtle gradient and rounded corner look
      const cx = width / 2;
      const cy = height / 2;
      const dist = Math.hypot(x - cx, y - cy);
      const isInner = dist < width * 0.45;
      
      if (isInner) {
        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = Math.min(255, g + Math.floor((x / width) * 40));
        rawData[pxOffset + 2] = b;
        rawData[pxOffset + 3] = a;
      } else {
        rawData[pxOffset] = Math.floor(r * 0.85);
        rawData[pxOffset + 1] = Math.floor(g * 0.85);
        rawData[pxOffset + 2] = Math.floor(b * 0.9);
        rawData[pxOffset + 3] = a;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crc]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // non-interlaced

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pub = path.join(__dirname, '..', 'public');
if (!fs.existsSync(pub)) fs.mkdirSync(pub, { recursive: true });

fs.writeFileSync(path.join(pub, 'pwa-192x192.png'), createPNG(192, 192, 59, 130, 246));
fs.writeFileSync(path.join(pub, 'pwa-512x512.png'), createPNG(512, 512, 59, 130, 246));
fs.writeFileSync(path.join(pub, 'pwa-maskable-512x512.png'), createPNG(512, 512, 16, 185, 129));
fs.writeFileSync(path.join(pub, 'apple-touch-icon.png'), createPNG(180, 180, 59, 130, 246));
fs.writeFileSync(path.join(pub, 'favicon.ico'), createPNG(32, 32, 59, 130, 246));

console.log('PNG icons created successfully in public/');
