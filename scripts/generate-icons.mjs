import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to create uncompressed or deflated PNG chunk
function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  
  // calculate CRC32
  let crc = 0xffffffff;
  const update = (buf) => {
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) {
          crc = (crc >>> 1) ^ 0xedb88320;
        } else {
          crc = crc >>> 1;
        }
        byte = byte >>> 1;
      }
    }
  };
  update(typeBuf);
  update(data);
  crc = (crc ^ 0xffffffff) >>> 0;
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generatePng(size) {
  const width = size;
  const height = size;

  // Raw RGBA scanlines: (1 byte filter (0) + width * 4 bytes) * height
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.46;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded squircle / circle
      if (dist <= r) {
        // Gradient from bright yellow (#FFD21F) to golden (#F59E0B)
        const t = (y / height);
        let red = 255;
        let green = Math.round(210 - t * 50);
        let blue = Math.round(31 - t * 20);
        let alpha = 255;

        // Grocery basket shape in center
        // basket bounds: cx - 0.28*width to cx + 0.28*width, cy - 0.1*height to cy + 0.25*height
        const bx = (x - cx) / width;
        const by = (y - cy) / height;

        // Basket body: trapezium
        if (by >= 0 && by <= 0.24 && Math.abs(bx) <= (0.24 - by * 0.2)) {
          // Basket warm dark gold / amber
          red = 217;
          green = 119;
          blue = 6;
          // Basket grid pattern
          if ((Math.floor(x / (width / 24)) % 2 === 0) || (Math.floor(y / (height / 24)) % 2 === 0)) {
            red = 245;
            green = 158;
            blue = 11;
          }
        } else if (by >= -0.22 && by < 0.05 && Math.abs(bx) <= 0.24) {
          // Fresh produce inside basket (apples, greens, carrot)
          // Green apple / lettuce on left
          if (bx < -0.05 && Math.hypot(bx + 0.12, by + 0.08) < 0.13) {
            red = 34;
            green = 197;
            blue = 94; // fresh green
          }
          // Red tomato / apple on right
          else if (bx > 0.02 && Math.hypot(bx - 0.1, by + 0.06) < 0.12) {
            red = 239;
            green = 68;
            blue = 68; // bright tomato red
          }
          // Orange carrot in middle
          else if (Math.hypot(bx, by + 0.1) < 0.11) {
            red = 249;
            green = 115;
            blue = 22; // orange
          }
        }
        // Basket handle
        else if (by >= -0.26 && by <= 0.02) {
          const handleDist = Math.hypot(bx, by + 0.05);
          if (handleDist >= 0.20 && handleDist <= 0.25 && by < 0) {
            red = 180;
            green = 83;
            blue = 9;
          }
        }

        rawData[pxOffset] = red;
        rawData[pxOffset + 1] = green;
        rawData[pxOffset + 2] = blue;
        rawData[pxOffset + 3] = alpha;
      } else {
        // Transparent outside
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: 6 (RGBA)
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192
const p192 = generatePng(192);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), p192);
console.log('Generated public/pwa-192x192.png');

// Generate 512x512
const p512 = generatePng(512);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), p512);
fs.writeFileSync(path.join(publicDir, 'maskable-icon-512x512.png'), p512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180));
console.log('Generated public/pwa-512x512.png & apple-touch-icon.png');
