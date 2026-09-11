/* eslint-disable no-console */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync, inflateSync } from 'node:zlib';

/**
 * The launcher icons — PRD §14.2, §16.2, §16.6 finding 5, §17 test 8.
 *
 * **The master is `assets/source/icon-master.png`, supplied by the product
 * owner, and this script only ever derives from it.** It does not draw and it
 * does not decide: it resizes the master, and — for Android's adaptive layer —
 * it lifts the mark off its blue background so the launcher can mask it.
 *
 * ```bash
 * node scripts/make-icons.mjs
 * ```
 *
 * ── The mark ──────────────────────────────────────────────────────────────
 *
 * A white rounded card carrying the four operations — a green plus, a red
 * minus, a blue times, a purple divide — on the subject's blue, with the shared
 * orange grade badge in the corner. The blue is `#3F7FD6`, the Mathematics
 * colour (PRD §14.2). **The badge carries the digit, and the digit is the thing
 * that does the work when five Thuto apps sit on one home screen** (§17 test 8).
 *
 * ── Why there is a PNG codec in here ──────────────────────────────────────
 *
 * The adaptive foreground needs the mark **without its background** — Android
 * draws the background as its own layer and masks the foreground to a circle.
 * So the script decodes the master, models the blue as a bilinear gradient
 * between the master's four corners, and makes every pixel that matches that
 * model transparent. A linear gradient is subtracted exactly, so the white card
 * and the coloured glyphs survive and only the blue is removed.
 *
 * **Nothing is hand-traced and nothing is hard-coded.** Replace the master and
 * re-run: that is the whole maintenance story.
 */

/* ------------------------------------------------------------ png reading */

function readPng(file) {
  const buf = readFileSync(file);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error(`${file}: not a PNG`);
  let pos = 8;
  let width = 0;
  let height = 0;
  let colourType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colourType = data[9];
      if (data[8] !== 8) throw new Error('only 8-bit PNGs are supported');
      if (data[12] !== 0) throw new Error('interlaced PNGs are not supported');
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const channels = colourType === 6 ? 4 : colourType === 2 ? 3 : 0;
  if (!channels) throw new Error(`unsupported colour type ${colourType}`);
  const stride = width * channels;
  const rgba = new Uint8ClampedArray(width * height * 4);
  const prev = new Uint8Array(stride);
  const cur = new Uint8Array(stride);
  let p = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[p];
    p += 1;
    for (let x = 0; x < stride; x += 1) {
      const rawv = raw[p + x];
      const a = x >= channels ? cur[x - channels] : 0; // left
      const b = prev[x]; // up
      const c = x >= channels ? prev[x - channels] : 0; // up-left
      let val;
      switch (filter) {
        case 1: val = rawv + a; break;
        case 2: val = rawv + b; break;
        case 3: val = rawv + ((a + b) >> 1); break;
        case 4: {
          const pp = a + b - c;
          const pa = Math.abs(pp - a);
          const pb = Math.abs(pp - b);
          const pc = Math.abs(pp - c);
          val = rawv + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default: val = rawv;
      }
      cur[x] = val & 0xff;
    }
    p += stride;
    for (let x = 0; x < width; x += 1) {
      const o = (y * width + x) * 4;
      const s = x * channels;
      rgba[o] = cur[s];
      rgba[o + 1] = cur[s + 1];
      rgba[o + 2] = cur[s + 2];
      rgba[o + 3] = channels === 4 ? cur[s + 3] : 255;
    }
    prev.set(cur);
  }
  return { width, height, rgba };
}

/* ------------------------------------------------------------ png writing */

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function writePng(file, w, h, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y += 1) {
    raw[y * (w * 4 + 1)] = 0;
    for (let x = 0; x < w * 4; x += 1) raw[y * (w * 4 + 1) + 1 + x] = rgba[y * w * 4 + x];
  }
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  writeFileSync(file, png);
  console.log(`  ${file.split(/[\\/]/).slice(-2).join('/')}  ${w}×${h}`);
}

/* --------------------------------------------------------------- resizing */

/** Bilinear resize of an RGBA image to `dw×dh`. */
function resize(src, dw, dh) {
  const { width: sw, height: sh, rgba } = src;
  const out = new Uint8ClampedArray(dw * dh * 4);
  for (let y = 0; y < dh; y += 1) {
    const sy = ((y + 0.5) * sh) / dh - 0.5;
    const y0 = Math.max(0, Math.floor(sy));
    const y1 = Math.min(sh - 1, y0 + 1);
    const fy = Math.max(0, Math.min(1, sy - y0));
    for (let x = 0; x < dw; x += 1) {
      const sx = ((x + 0.5) * sw) / dw - 0.5;
      const x0 = Math.max(0, Math.floor(sx));
      const x1 = Math.min(sw - 1, x0 + 1);
      const fx = Math.max(0, Math.min(1, sx - x0));
      const o = (y * dw + x) * 4;
      for (let k = 0; k < 4; k += 1) {
        const p00 = rgba[(y0 * sw + x0) * 4 + k];
        const p10 = rgba[(y0 * sw + x1) * 4 + k];
        const p01 = rgba[(y1 * sw + x0) * 4 + k];
        const p11 = rgba[(y1 * sw + x1) * 4 + k];
        const top = p00 + (p10 - p00) * fx;
        const bot = p01 + (p11 - p01) * fx;
        out[o + k] = top + (bot - top) * fy;
      }
    }
  }
  return { width: dw, height: dh, rgba: out };
}

/* -------------------------------------------------------- background keying */

/** The four corner colours of the master, for the gradient model. */
function corners(src) {
  const { width: w, height: h, rgba } = src;
  const at = (x, y) => {
    const i = (y * w + x) * 4;
    return [rgba[i], rgba[i + 1], rgba[i + 2]];
  };
  return { tl: at(2, 2), tr: at(w - 3, 2), bl: at(2, h - 3), br: at(w - 3, h - 3) };
}

/**
 * Return a copy of `src` with the blue background made transparent — removed by
 * **flood fill from the four edges**, not by global colour keying.
 *
 * Global keying would also eat the blue *times* glyph, because it is close to
 * the background blue. Flooding from the border only removes blue that is
 * *connected to the edge*: the blue × sits inside the white card, the flood
 * never reaches it, and it keeps its full opacity. The card, the glyphs and the
 * badge are all enclosed and survive.
 *
 * `dist` is measured against the bilinear gradient between the four corners, so
 * a linear gradient is matched exactly. Edge pixels between the card and the
 * background get a soft alpha for a clean outline.
 */
function keyOut(src) {
  const { width: w, height: h, rgba } = src;
  const { tl, tr, bl, br } = corners(src);
  const T0 = 42; // fully background at/under this colour distance
  const T1 = 110; // a pixel this far from the model is certainly foreground

  const bgDist = (x, y) => {
    const fx = x / (w - 1);
    const fy = y / (h - 1);
    const i = (y * w + x) * 4;
    let d = 0;
    for (let k = 0; k < 3; k += 1) {
      const top = tl[k] + (tr[k] - tl[k]) * fx;
      const bot = bl[k] + (br[k] - bl[k]) * fx;
      const bg = top + (bot - top) * fy;
      d += (rgba[i + k] - bg) ** 2;
    }
    return Math.sqrt(d);
  };

  const out = new Uint8ClampedArray(rgba.length);
  out.set(rgba);
  const visited = new Uint8Array(w * h);
  const stack = [];
  const pushIf = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (visited[p]) return;
    if (bgDist(x, y) >= T1) return; // hit the card / a glyph / the badge
    visited[p] = 1;
    stack.push(p);
  };
  for (let x = 0; x < w; x += 1) {
    pushIf(x, 0);
    pushIf(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    pushIf(0, y);
    pushIf(w - 1, y);
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    const y = (p - x) / w;
    // Soft alpha for the transition band; 0 for solid background.
    const d = bgDist(x, y);
    const a = Math.max(0, Math.min(1, (d - T0) / (T1 - T0)));
    out[p * 4 + 3] = Math.round(rgba[p * 4 + 3] * a);
    pushIf(x + 1, y);
    pushIf(x - 1, y);
    pushIf(x, y + 1);
    pushIf(x, y - 1);
  }
  return { width: w, height: h, rgba: out };
}

/** Place `mark` scaled by `scale` onto a transparent canvas of `size`. */
function place(mark, size, scale) {
  const inner = Math.round(size * scale);
  const scaled = resize(mark, inner, inner);
  const out = new Uint8ClampedArray(size * size * 4);
  const off = Math.round((size - inner) / 2);
  for (let y = 0; y < inner; y += 1) {
    for (let x = 0; x < inner; x += 1) {
      const s = (y * inner + x) * 4;
      const d = ((y + off) * size + (x + off)) * 4;
      out[d] = scaled.rgba[s];
      out[d + 1] = scaled.rgba[s + 1];
      out[d + 2] = scaled.rgba[s + 2];
      out[d + 3] = scaled.rgba[s + 3];
    }
  }
  return { width: size, height: size, rgba: out };
}

/** A solid fill of the brand blue, sampled from the master's gradient. */
function backgroundOnly(src, size) {
  const { tl, tr, bl, br } = corners(src);
  const out = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    const fy = y / (size - 1);
    for (let x = 0; x < size; x += 1) {
      const fx = x / (size - 1);
      const i = (y * size + x) * 4;
      for (let k = 0; k < 3; k += 1) {
        const top = tl[k] + (tr[k] - tl[k]) * fx;
        const bot = bl[k] + (br[k] - bl[k]) * fx;
        out[i + k] = top + (bot - top) * fy;
      }
      out[i + 3] = 255;
    }
  }
  return { width: size, height: size, rgba: out };
}

/** A white silhouette of whatever is opaque in `img`. */
function silhouette(img) {
  const out = new Uint8ClampedArray(img.rgba.length);
  for (let i = 0; i < img.rgba.length; i += 4) {
    out[i] = 0xff;
    out[i + 1] = 0xff;
    out[i + 2] = 0xff;
    out[i + 3] = img.rgba[i + 3];
  }
  return { width: img.width, height: img.height, rgba: out };
}

/* ------------------------------------------------------------------- main */

const assets = join(process.cwd(), 'assets');
const master = readPng(join(assets, 'source', 'icon-master.png'));
console.log(`master: assets/source/icon-master.png  ${master.width}×${master.height}`);

const mark = keyOut(master); // the card + operations + badge on transparency
const c = corners(master);
console.log(`  keyed the blue background out (corners ~ ${c.tl.map(Math.round).join(',')})`);

// 1. icon.png — the master itself, full bleed. This is the app's face.
writePng(join(assets, 'icon.png'), 1024, 1024, resize(master, 1024, 1024).rgba);

// 2. splash — the mark only, on transparency; splash paints its own blue.
writePng(join(assets, 'splash-icon.png'), 1024, 1024, place(mark, 1024, 0.7).rgba);

// 3. adaptive background — the blue.
writePng(join(assets, 'android-icon-background.png'), 1024, 1024, backgroundOnly(master, 1024).rgba);

// 4. adaptive foreground — the mark inside the safe zone so the badge survives.
const foreground = place(mark, 1024, 0.62);
writePng(join(assets, 'android-icon-foreground.png'), 1024, 1024, foreground.rgba);

// 5. monochrome — a white silhouette of the foreground.
writePng(join(assets, 'android-icon-monochrome.png'), 1024, 1024, silhouette(foreground).rgba);

// 6. favicon — the master, small.
writePng(join(assets, 'favicon.png'), 96, 96, resize(master, 96, 96).rgba);

console.log('Done. Six files written to assets/.');
