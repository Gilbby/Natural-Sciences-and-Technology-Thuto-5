/**
 * Regenerates every launcher/splash asset from one square source image.
 *
 *   node scripts/make-icons.js <source.png> [foreground.png] [monochrome.png]
 *
 * `source.png`      full-bleed square artwork (1024x1024 recommended).
 * `foreground.png`  optional transparent artwork for the Android adaptive
 *                   foreground layer. Falls back to `source.png`.
 * `monochrome.png`  optional transparent silhouette for the Android themed
 *                   icon. Falls back to the foreground's own alpha.
 *
 * Android crops adaptive icons to a circle/squircle, so foreground art is
 * scaled into the centre 66% safe zone (Material adaptive-icon spec).
 *
 * ── Why the third argument exists ─────────────────────────────────────────
 *
 * **The fallback is wrong for any artwork with detail inside a solid shape.**
 * Flattening the foreground's alpha to white turns a speech bubble carrying a
 * letter into a plain slab: the letter is opaque, the bubble is opaque, and one
 * colour cannot tell them apart. The layer has to be built by *subtracting* the
 * detail, which needs to know what the detail is — so it is built next to the
 * artwork, in `make-icon-foreground.js`, and handed in here.
 *
 * The fallback stays for sources that are a silhouette already.
 */
const path = require('path');
const Jimp = require('jimp-compact');

const BG = process.env.ICON_BG || '#3F7FD6';
const ASSETS = path.join(__dirname, '..', 'assets');

/**
 * How much of the adaptive canvas the foreground art is allowed to fill.
 *
 * **The number that matters is not this one — it is how far the furthest pixel
 * of the art sits from the centre**, and that depends on the composition. Art
 * that reaches into a corner needs a smaller box than art that fills a circle.
 *
 * Android draws adaptive icons on a 108dp canvas: a circle mask shows the
 * central **72dp**, and the guaranteed-visible safe zone is **66dp**. This
 * artwork's furthest pixel is 1.26 half-widths from centre — the badge and the
 * white bubble sit at opposite corners — so:
 *
 * | box | what happens on a circle launcher |
 * | ---: | --- |
 * | 66% | the inherited value. **The grade badge is clipped**, and the badge is the only thing distinguishing this icon from *Thuto 4*'s |
 * | **53%** | **nothing clips.** The art fills 80% of the 72dp circle the user actually sees, which is a normal icon size |
 * | 48% | nothing clips under even the 66dp safe zone, at the cost of looking small beside its siblings on one home screen |
 *
 * 53% is the default because the circle is the tightest mask any mainstream
 * launcher uses. Override with `ICON_SAFE` if a different drawing wants it.
 */
const SAFE = Number(process.env.ICON_SAFE || 0.53);

function bgInt(hex) {
  return parseInt(hex.replace('#', '').padEnd(6, '0').slice(0, 6) + 'ff', 16);
}

/** Source art centred on a solid tile, alpha removed (iOS rejects alpha). */
async function flattened(src, size) {
  const tile = new Jimp(size, size, bgInt(BG));
  const art = src.clone().cover(size, size);
  return tile.composite(art, 0, 0);
}

/** Source art contained inside the adaptive-icon safe zone, alpha kept. */
async function safeZone(src, size) {
  const canvas = new Jimp(size, size, 0x00000000);
  const inner = Math.round(size * SAFE);
  const art = src.clone().contain(inner, inner);
  return canvas.composite(art, Math.round((size - inner) / 2), Math.round((size - inner) / 2));
}

/** White silhouette driven by the foreground alpha; Android tints it. */
function monochrome(fg) {
  const out = fg.clone();
  out.scan(0, 0, out.bitmap.width, out.bitmap.height, (x, y, idx) => {
    out.bitmap.data[idx] = 255;
    out.bitmap.data[idx + 1] = 255;
    out.bitmap.data[idx + 2] = 255;
  });
  return out;
}

async function main() {
  const [srcPath, fgPath, monoPath] = process.argv.slice(2);
  if (!srcPath) {
    console.error(
      'usage: node scripts/make-icons.js <source.png> [foreground.png] [monochrome.png]',
    );
    process.exit(1);
  }

  const src = await Jimp.read(srcPath);
  if (src.bitmap.width !== src.bitmap.height) {
    console.warn(`! ${srcPath} is ${src.bitmap.width}x${src.bitmap.height}, not square - it will be centre-cropped.`);
  }
  if (src.bitmap.width < 1024) {
    console.warn(`! ${srcPath} is only ${src.bitmap.width}px wide; 1024x1024 gives the best result.`);
  }

  const fgSrc = fgPath ? await Jimp.read(fgPath) : src;
  if (!fgPath && !src.hasAlpha()) {
    console.warn('! Source has no transparency, so the Android foreground layer will be a square of art.');
    console.warn('  Pass a transparent PNG as the second argument for a proper adaptive icon.');
  }

  const write = (img, name) => img.writeAsync(path.join(ASSETS, name)).then(() => {
    console.log(`  wrote assets/${name}  ${img.bitmap.width}x${img.bitmap.height}`);
  });

  const fg = await safeZone(fgSrc, 432);
  // The themed layer is fitted through the same safe zone as the foreground,
  // so the two line up pixel for pixel on a launcher that shows both.
  const mono = monoPath
    ? await safeZone(await Jimp.read(monoPath), 432)
    : monochrome(fg);

  await write(await flattened(src, 1024), 'icon.png');
  await write(src.clone().contain(1024, 1024), 'splash-icon.png');
  await write(await flattened(src, 64), 'favicon.png');
  await write(new Jimp(432, 432, bgInt(BG)), 'android-icon-background.png');
  await write(fg, 'android-icon-foreground.png');
  await write(mono, 'android-icon-monochrome.png');

  console.log(`\nBackground colour: ${BG} (override with ICON_BG=#RRGGBB)`);
  console.log('Next: npx expo prebuild --platform android');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
