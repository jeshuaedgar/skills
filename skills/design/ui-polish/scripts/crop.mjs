#!/usr/bin/env node
// Crop a PNG using page (CSS pixel) coordinates. Node built-ins only.
// Usage: node crop.mjs <in.png> <out.png> <x> <y> <width> <height> [--viewport <css-width> | --scale <n>]
// --viewport sets the scale to image width / viewport width; --scale sets it directly (default 1).
// Supports 8-bit, non-interlaced PNGs, which is what browsers produce.
import { readFileSync, writeFileSync } from "node:fs";
import { deflateSync, inflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const CHANNELS = { 0: 1, 2: 3, 4: 2, 6: 4 };

function fail(message) {
  console.error(`crop.mjs: ${message}`);
  process.exit(1);
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function decode(file) {
  if (!file.subarray(0, 8).equals(SIGNATURE)) fail("input is not a PNG");
  let offset = 8;
  let header;
  const idat = [];
  while (offset < file.length) {
    const length = file.readUInt32BE(offset);
    const type = file.toString("ascii", offset + 4, offset + 8);
    const data = file.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }
  if (!header) fail("missing IHDR chunk");
  const channels = CHANNELS[header.colorType];
  if (header.bitDepth !== 8 || !channels || header.interlace !== 0) {
    fail(
      `unsupported PNG (bit depth ${header.bitDepth}, colour type ${header.colorType}, interlace ${header.interlace})`,
    );
  }

  const raw = inflateSync(Buffer.concat(idat));
  const bpp = channels;
  const stride = header.width * bpp;
  const pixels = Buffer.alloc(stride * header.height);
  for (let y = 0; y < header.height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const out = pixels.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? out[i - bpp] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= bpp ? prev[i - bpp] : 0;
      let value;
      switch (filter) {
        case 0:
          value = line[i];
          break;
        case 1:
          value = line[i] + a;
          break;
        case 2:
          value = line[i] + b;
          break;
        case 3:
          value = line[i] + ((a + b) >> 1);
          break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          value = line[i] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default:
          fail(`unknown filter type ${filter} on row ${y}`);
      }
      out[i] = value & 0xff;
    }
  }
  return { ...header, channels, stride, pixels };
}

function encode(image, x, y, width, height) {
  const stride = width * image.channels;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let row = 0; row < height; row++) {
    const start = (y + row) * image.stride + x * image.channels;
    image.pixels.copy(raw, row * (stride + 1) + 1, start, start + stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = image.colorType;
  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = Number(args[index + 1]);
  args.splice(index, 2);
  if (!(value > 0)) fail(`${name} needs a positive number`);
  return value;
};
const viewport = option("--viewport");
const scaleOption = option("--scale");
if (args.length !== 6) {
  fail(
    "usage: node crop.mjs <in.png> <out.png> <x> <y> <width> <height> [--viewport <css-width> | --scale <n>]",
  );
}
const [input, output, ...box] = args;
const [cssX, cssY, cssWidth, cssHeight] = box.map(Number);
if ([cssX, cssY, cssWidth, cssHeight].some((n) => !Number.isFinite(n)))
  fail("x, y, width and height must be numbers");

let file;
try {
  file = readFileSync(input);
} catch (error) {
  fail(`cannot read ${input}: ${error.message}`);
}
const image = decode(file);
const scale = scaleOption ?? (viewport ? image.width / viewport : 1);
const x = Math.max(0, Math.floor(cssX * scale));
const y = Math.max(0, Math.floor(cssY * scale));
const width = Math.min(image.width, Math.ceil((cssX + cssWidth) * scale)) - x;
const height = Math.min(image.height, Math.ceil((cssY + cssHeight) * scale)) - y;
if (width <= 0 || height <= 0) fail("crop region is outside the image");

writeFileSync(output, encode(image, x, y, width, height));
console.log(`${output}: ${width}x${height} px (scale ${scale})`);
