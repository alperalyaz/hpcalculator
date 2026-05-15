import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'resim', 'logo.png');
const background = '#111111';

const outputs = [
  { file: 'icon.png', size: 1024 },
  { file: 'adaptive-icon.png', size: 1024 },
  { file: 'splash-icon.png', size: 1024 },
  { file: 'favicon.png', size: 48 },
];

for (const { file, size } of outputs) {
  await sharp(source)
    .resize(size, size, {
      fit: 'contain',
      background,
      position: 'centre',
    })
    .png()
    .toFile(path.join(root, 'assets', file));
}

console.log(`Generated ${outputs.length} app icons from ${source}`);
