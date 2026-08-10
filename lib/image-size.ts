import { readFileSync } from "node:fs";
import path from "node:path";

export type ImageSize = { width: number; height: number };

// Build-time only: reads an image's intrinsic pixel size out of /public so
// next/image can reserve the correct aspect-ratio box before the file loads.
// Without this the case-study images collapse to zero height until they lazy-
// load, which (a) causes layout shift and (b) makes in-page "#anchor" jumps
// (the "Jump to result" button) land on the wrong section, because the browser
// computes the target's position against a document that then grows underneath
// it. Runs on the server during static generation — never shipped to the client.
const cache = new Map<string, ImageSize>();

export function getImageSize(src: string): ImageSize {
  const cached = cache.get(src);
  if (cached) return cached;

  const file = path.join(process.cwd(), "public", src);
  const buf = readFileSync(file);
  const size = readPng(buf) ?? readJpeg(buf);
  if (!size) {
    throw new Error(`Could not read image dimensions (expected PNG/JPEG): ${src}`);
  }
  cache.set(src, size);
  return size;
}

// PNG: signature (8 bytes) followed by the IHDR chunk, whose width and height
// are big-endian uint32s at byte offsets 16 and 20.
function readPng(buf: Buffer): ImageSize | null {
  const PNG_SIGNATURE = "89504e470d0a1a0a";
  if (buf.length < 24 || buf.subarray(0, 8).toString("hex") !== PNG_SIGNATURE) {
    return null;
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// JPEG: starts with SOI (0xFFD8); scan segment markers until a Start-Of-Frame
// (SOF0–SOF15, excluding the non-frame markers), which carries height then
// width as big-endian uint16s.
function readJpeg(buf: Buffer): ImageSize | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;

  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buf[offset + 1];
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 && // DHT
      marker !== 0xc8 && // JPG
      marker !== 0xcc; // DAC
    if (isSof) {
      return {
        height: buf.readUInt16BE(offset + 5),
        width: buf.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + buf.readUInt16BE(offset + 2); // skip this segment
  }
  return null;
}
