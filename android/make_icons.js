const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'binary');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makePng(width, height, pixelFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((width * 4 + 1) * height);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    raw[pos++] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      raw[pos++] = r;
      raw[pos++] = g;
      raw[pos++] = b;
      raw[pos++] = a;
    }
  }

  const idatData = zlib.deflateSync(raw);
  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', idatData),
    createChunk('IEND', Buffer.alloc(0))
  ]);
}

function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const v0x = cx - ax, v0y = cy - ay;
  const v1x = bx - ax, v1y = by - ay;
  const v2x = px - ax, v2y = py - ay;
  const dot00 = v0x * v0x + v0y * v0y;
  const dot01 = v0x * v1x + v0y * v1y;
  const dot02 = v0x * v2x + v0y * v2y;
  const dot11 = v1x * v1x + v1y * v1y;
  const dot12 = v1x * v2x + v1y * v2y;
  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
  return (u >= 0) && (v >= 0) && (u + v < 1);
}

function isQuote(nx, ny) {
  // Left quote
  const d1 = Math.hypot(nx - 0.38, ny - 0.40);
  if (d1 < 0.08) return true;
  if (pointInTriangle(nx, ny, 0.32, 0.40, 0.46, 0.40, 0.30, 0.60)) return true;

  // Right quote
  const d2 = Math.hypot(nx - 0.62, ny - 0.40);
  if (d2 < 0.08) return true;
  if (pointInTriangle(nx, ny, 0.56, 0.40, 0.70, 0.40, 0.54, 0.60)) return true;

  return false;
}

function pixelLogic(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;

  // Transparent quote cutouts
  if (isQuote(nx, ny)) {
    return [0, 0, 0, 0];
  }

  // Speech bubble circle
  const dist = Math.hypot(nx - 0.50, ny - 0.48);
  if (dist <= 0.42) {
    return [255, 255, 255, 255];
  }

  // Speech bubble pointer tail
  if (pointInTriangle(nx, ny, 0.22, 0.68, 0.40, 0.85, 0.08, 0.92)) {
    return [255, 255, 255, 255];
  }

  return [0, 0, 0, 0];
}

const resDir = path.join(__dirname, 'app', 'src', 'main', 'res');
const targets = [
  { dir: 'drawable-mdpi', size: 24 },
  { dir: 'drawable-hdpi', size: 36 },
  { dir: 'drawable-xhdpi', size: 48 },
  { dir: 'drawable-xxhdpi', size: 72 },
  { dir: 'drawable-xxxhdpi', size: 96 }
];

for (const t of targets) {
  const folder = path.join(resDir, t.dir);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  const pngBuf = makePng(t.size, t.size, pixelLogic);
  fs.writeFileSync(path.join(folder, 'ic_notification_motiqo.png'), pngBuf);
  console.log(`Saved ${t.dir}/ic_notification_motiqo.png (${t.size}x${t.size})`);
}
