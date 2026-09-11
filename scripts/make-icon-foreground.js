/**
 * Lifts the artwork off its teal ground, for the Android adaptive layers.
 *
 *   node scripts/make-icon-foreground.js
 *
 * `assets/source/icon-source.png` is the icon as drawn: full-bleed square,
 * teal gradient behind two speech bubbles and the grade badge. That is exactly
 * what iOS, the splash and the favicon want, and **exactly what the Android
 * adaptive icon does not.**
 *
 * Android composites a launcher icon from two layers and then crops the result
 * to whatever mask the device uses — a circle, a squircle, a rounded square.
 * A full-bleed square handed in as the *foreground* layer produces a square of
 * art sitting on top of the background layer, cropped to a circle, which looks
 * like a mistake because it is one. It also makes the monochrome layer — the
 * white silhouette Android tints for themed icons — a solid filled circle.
 *
 * So the foreground layer needs the same art **with the ground removed**, and
 * this script removes it.
 *
 * ── How, and why not a colour key ─────────────────────────────────────────
 *
 * The ground is a gradient, from about #57C7C0 at the top left to #2E9E9A at
 * the bottom right, so a single key colour does not describe it. What *is* true
 * of every ground pixel is that it is **teal and connected to the edge of the
 * frame**, so the fill starts at the border and walks inwards.
 *
 * Two tests have to both hold for a pixel to be ground:
 *
 *   1. **it is teal-ish** — green clearly above red, and not far below blue.
 *      White (255,255,255) fails on the first clause, coral and orange fail on
 *      it too, and the blue *a* fails on the second. Nothing in the artwork
 *      passes;
 *   2. **it is reachable from the border** without crossing a non-teal pixel,
 *      which is what stops a teal-ish pixel *inside* a shape from being punched
 *      out. There are none in this drawing, and the rule costs nothing.
 *
 * ── The fringe, and why it does not matter ────────────────────────────────
 *
 * An anti-aliased edge ramps from teal to white over two or three pixels, and
 * the last tenth of that ramp is too white to pass test 1. So a hairline of
 * very pale teal survives around each shape.
 *
 * **It is invisible in both places it lands.** In the launcher the foreground
 * is composited straight back onto `#3BB0A6`, the same teal, so the fringe
 * matches its surroundings; in the monochrome layer everything becomes white
 * anyway. Trying to do better here means un-premultiplying an alpha the source
 * never had, and the icon is 48 pixels wide when it matters.
 *
 * The result is then **cropped to its content**, so `make-icons.js` can fit the
 * art to the adaptive safe zone rather than fitting a square of mostly-empty
 * canvas to it.
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ASSETS = path.join(__dirname, '..', 'assets', 'source');
const SOURCE = path.join(ASSETS, 'icon-source.png');
const OUT = path.join(ASSETS, 'icon-foreground.png');
const OUT_MONO = path.join(ASSETS, 'icon-mono.png');

/**
 * The artwork's palette, measured off the source rather than guessed.
 *
 * Two pairs are close enough to be worth naming: the red **A** at (240, 96, 96)
 * against the coral bubble at (255, 138, 126) — separated by green, 96 against
 * 138 — and the coral bubble against the orange badge at (255, 138, 61), which
 * differ only in blue. Both separations are used below.
 */
const isRedGlyph = (r, g, b) => r > 200 && g < 122 && b < 150 && Math.abs(g - b) < 45;
const isBlueGlyph = (r, g, b) => b > r + 40 && b > 150;

/**
 * Pale enough to be part of a white shape — the bubble, the badge's ring, or a
 * white letter. Deliberately generous, so an anti-aliased edge counts.
 */
const isPale = (r, g, b) => r > 200 && g > 200 && b > 200;

/**
 * Green clearly above red, and not far below blue.
 *
 * The margins are deliberately loose. A tight test leaves a thick teal fringe;
 * a loose one eats a little of the anti-aliased edge, which at icon sizes is
 * the better trade.
 */
function isGround(r, g, b) {
  return g > r + 18 && g > b - 24 && g > 90;
}

function main() {
  const png = PNG.sync.read(fs.readFileSync(SOURCE));
  const { width, height, data } = png;
  const idx = (x, y) => ((width * y + x) << 2);

  /* ---- 1. flood the ground, starting from every border pixel ------------ */
  const ground = new Uint8Array(width * height);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const flat = width * y + x;
    if (ground[flat]) return;
    const i = flat << 2;
    if (!isGround(data[i], data[i + 1], data[i + 2])) return;
    ground[flat] = 1;
    stack.push(x, y);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }
  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }

  /* ---- 2. cut it out, and find what is left ----------------------------- */
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const flat = width * y + x;
      if (ground[flat]) {
        data[idx(x, y) + 3] = 0;
        continue;
      }
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) {
    console.error('Every pixel read as ground. Check isGround() against the artwork.');
    process.exit(1);
  }

  /* ---- 3. crop to the content, so the safe zone is spent on art --------- */
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const side = Math.max(cropW, cropH);
  const out = new PNG({ width: side, height: side });
  out.data.fill(0);
  const offX = Math.round((side - cropW) / 2);
  const offY = Math.round((side - cropH) / 2);

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const from = idx(minX + x, minY + y);
      const to = ((side * (offY + y)) + (offX + x)) << 2;
      out.data[to] = data[from];
      out.data[to + 1] = data[from + 1];
      out.data[to + 2] = data[from + 2];
      out.data[to + 3] = data[from + 3];
    }
  }

  fs.writeFileSync(OUT, PNG.sync.write(out));

  /* ---- 4. the monochrome layer, with the letters knocked out ------------ */
  const holes = monochrome(out);
  fs.writeFileSync(OUT_MONO, PNG.sync.write(holes.png));

  const kept = ground.reduce((sum, flag) => sum + (flag ? 0 : 1), 0);
  console.log(`  read  assets/source/icon-source.png   ${width}x${height}`);
  console.log(`  ground removed: ${(100 - (kept / ground.length) * 100).toFixed(1)}% of the frame`);
  console.log(`  content: ${cropW}x${cropH} at (${minX}, ${minY})`);
  console.log(`  wrote assets/source/icon-foreground.png  ${side}x${side}`);
  console.log(`  wrote assets/source/icon-mono.png        ${side}x${side}`);
  console.log(`  pale regions: ${holes.regions}, of which ${holes.sealed} sealed inside a shape -> knocked out (${holes.knocked} px)`);
  console.log('\nNext: ICON_BG=#3BB0A6 node scripts/make-icons.js \\');
  console.log('        assets/source/icon-source.png \\');
  console.log('        assets/source/icon-foreground.png assets/source/icon-mono.png');
}

/**
 * The themed-icon layer: **a silhouette with the letters as holes.**
 *
 * Android tints this one flat and draws it on a ground of the system's
 * choosing, so **every pixel of it ends up one colour.** Handing it the
 * artwork's own alpha — which is what a naive monochrome layer does — turns two
 * speech bubbles carrying *Aa* and *Bb* into two featureless slabs and a disc.
 * It compiles, it ships, and on a themed launcher the app has no icon anybody
 * can recognise.
 *
 * So the letters have to be **subtracted** from the silhouette rather than
 * painted onto it, which is exactly what the vector icon this replaces did when
 * it drew the badge glyph as a hole in the disc.
 *
 * Two tests find them, and the second is the one worth explaining:
 *
 *   1. **the red *A* and the blue *a*** are found by colour. The red is
 *      separated from the coral bubble by green — 96 against 138 — and the blue
 *      is the only thing in the drawing with more blue in it than red.
 *   2. **the white *Bb* and the white *5* cannot be found by colour at all**,
 *      because the big bubble is the same white. What separates them is
 *      **enclosure**, and the reliable way to ask that is not to walk outwards
 *      from each pixel testing what it hits — that was the first attempt, and
 *      it failed in stripes, because a pixel part-way between white and coral
 *      is neither, so the walk stopped on a colour no test claimed.
 *
 *      Instead: take every pale region as a **connected component**, and ask
 *      whether it touches transparency anywhere. The bubble does, and so does
 *      the badge's white ring. A letter, sealed inside coral or orange, does
 *      not. No thresholds sit between the two answers, so there is nothing left
 *      to fall through.
 */
function monochrome(src) {
  const { width, height, data } = src;
  const png = new PNG({ width, height });
  png.data.fill(0);
  const at = (x, y) => ((width * y + x) << 2);

  const opaque = (x, y) => data[at(x, y) + 3] >= 40;
  const pale = (x, y) => {
    const i = at(x, y);
    return data[i + 3] >= 40 && isPale(data[i], data[i + 1], data[i + 2]);
  };

  /* ---- label every pale region, and note which ones meet transparency ---- */
  const label = new Int32Array(width * height).fill(-1);
  const openToAir = [];

  for (let y0 = 0; y0 < height; y0++) {
    for (let x0 = 0; x0 < width; x0++) {
      if (label[width * y0 + x0] !== -1 || !pale(x0, y0)) continue;

      const id = openToAir.length;
      openToAir.push(false);
      label[width * y0 + x0] = id;
      const stack = [x0, y0];

      while (stack.length) {
        const y = stack.pop();
        const x = stack.pop();
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
            // The frame edge counts as air: a shape running off it is not
            // sealed inside anything.
            openToAir[id] = true;
            continue;
          }
          if (!opaque(nx, ny)) {
            openToAir[id] = true;
            continue;
          }
          if (!pale(nx, ny)) continue;
          const flat = width * ny + nx;
          if (label[flat] !== -1) continue;
          label[flat] = id;
          stack.push(nx, ny);
        }
      }
    }
  }

  /* ---- paint the silhouette, minus the letters -------------------------- */
  let knocked = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = at(x, y);
      const a = data[i + 3];
      if (a < 40) continue;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const id = label[width * y + x];

      const isLetter =
        isRedGlyph(r, g, b) || isBlueGlyph(r, g, b) || (id !== -1 && !openToAir[id]);

      if (isLetter) {
        knocked += 1;
        continue;
      }
      png.data[i] = 255;
      png.data[i + 1] = 255;
      png.data[i + 2] = 255;
      png.data[i + 3] = a;
    }
  }

  const sealed = openToAir.filter((open) => !open).length;
  return { png, knocked, regions: openToAir.length, sealed };
}

main();
