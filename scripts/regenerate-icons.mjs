import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const src = 'assets/optimized/icon (2).png';
const outDir = 'assets';
const targets = [
  { file: 'icon.png', size: 1024 },
  { file: 'splash-icon.png', size: 1024 },
  { file: 'android-icon-foreground.png', size: 1024 },
  { file: 'android-icon-background.png', size: 1024, fill: '#7E57C2' },
  { file: 'android-icon-monochrome.png', size: 1024 },
  { file: 'favicon.png', size: 512 },
];

for (const t of targets) {
  const out = path.join(outDir, t.file);
  let pipeline = sharp(src)
    .resize(t.size, t.size, { fit: 'contain', background: t.fill || { r: 0, g: 0, b: 0, alpha: 0 } });

  if (t.file === 'android-icon-monochrome.png') {
    pipeline = pipeline.grayscale().threshold(128);
  }

  await pipeline
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
    .toFile(out + '.tmp');

  fs.renameSync(out + '.tmp', out);

  const stats = fs.statSync(out);
  const { width, height } = await sharp(out).metadata();
  console.log(`${t.file}: ${(stats.size / 1024).toFixed(2)} KB, ${width}x${height}`);
}

console.log('All assets regenerated from icon (2).png');
