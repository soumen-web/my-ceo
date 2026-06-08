const fs = require('node:fs');
const path = require('node:path');
const { PNG } = require('pngjs');

const inputPath = process.argv[2];
const outDir = process.argv[3];

if (!inputPath || !outDir) {
  throw new Error('Usage: node scripts/generate-brand-assets.js <input.png> <outDir>');
}

const source = PNG.sync.read(fs.readFileSync(inputPath));
fs.mkdirSync(outDir, { recursive: true });

const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
const smooth = (edge0, edge1, value) => {
  const x = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
};

const sample = (png, x, y, channel) => {
  const ix = Math.max(0, Math.min(png.width - 1, x));
  const iy = Math.max(0, Math.min(png.height - 1, y));
  return png.data[(iy * png.width + ix) * 4 + channel];
};

const sharpen = (png, amount = 0.72) => {
  const output = new PNG({ width: png.width, height: png.height });

  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const index = (y * png.width + x) * 4;

      for (let channel = 0; channel < 3; channel += 1) {
        let blur = 0;
        for (let yy = -1; yy <= 1; yy += 1) {
          for (let xx = -1; xx <= 1; xx += 1) {
            blur += sample(png, x + xx, y + yy, channel);
          }
        }
        blur /= 9;
        output.data[index + channel] = clamp(png.data[index + channel] + (png.data[index + channel] - blur) * amount);
      }
      output.data[index + 3] = png.data[index + 3];
    }
  }

  return output;
};

const createTransparentLogo = (png) => {
  const output = new PNG({ width: png.width, height: png.height });
  let minX = png.width;
  let minY = png.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const index = (y * png.width + x) * 4;
      const r = png.data[index];
      const g = png.data[index + 1];
      const b = png.data[index + 2];
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const blueScore =
        smooth(0.42, 0.68, b / 255) *
        smooth(0.12, 0.34, (b - r) / 255) *
        smooth(0.04, 0.22, (g - r) / 255);
      const whiteScore =
        smooth(0.48, 0.82, lum) *
        smooth(0.3, 0.9, 1 - (Math.max(r, g, b) - Math.min(r, g, b)) / 255);
      const inLogoBand =
        x > png.width * 0.06 &&
        x < png.width * 0.9 &&
        y > png.height * 0.22 &&
        y < png.height * 0.76;
      const alpha = inLogoBand ? clamp(Math.max(whiteScore, blueScore) * 255) : 0;

      output.data[index] = r;
      output.data[index + 1] = g;
      output.data[index + 2] = b;
      output.data[index + 3] = alpha;

      if (alpha > 12) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return { png: output, bounds: { minX, minY, maxX, maxY } };
};

const crop = (png, bounds, paddingRatio = 0.12) => {
  const contentWidth = bounds.maxX - bounds.minX + 1;
  const contentHeight = bounds.maxY - bounds.minY + 1;
  const padding = Math.round(Math.max(contentWidth, contentHeight) * paddingRatio);
  const minX = Math.max(0, bounds.minX - padding);
  const minY = Math.max(0, bounds.minY - padding);
  const maxX = Math.min(png.width - 1, bounds.maxX + padding);
  const maxY = Math.min(png.height - 1, bounds.maxY + padding);
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const output = new PNG({ width, height });

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceIndex = ((y + minY) * png.width + x + minX) * 4;
      const outIndex = (y * width + x) * 4;
      output.data[outIndex] = png.data[sourceIndex];
      output.data[outIndex + 1] = png.data[sourceIndex + 1];
      output.data[outIndex + 2] = png.data[sourceIndex + 2];
      output.data[outIndex + 3] = png.data[sourceIndex + 3];
    }
  }

  return output;
};

const compositeOnBackground = (png, background) => {
  const output = new PNG({ width: png.width, height: png.height });

  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const index = (y * png.width + x) * 4;
      const alpha = png.data[index + 3] / 255;
      output.data[index] = clamp(png.data[index] * alpha + background[0] * (1 - alpha));
      output.data[index + 1] = clamp(png.data[index + 1] * alpha + background[1] * (1 - alpha));
      output.data[index + 2] = clamp(png.data[index + 2] * alpha + background[2] * (1 - alpha));
      output.data[index + 3] = 255;
    }
  }

  return output;
};

const writePng = (filename, png) => {
  fs.writeFileSync(path.join(outDir, filename), PNG.sync.write(png));
};

const highRes = sharpen(source);
const transparent = createTransparentLogo(highRes);
const transparentCropped = crop(transparent.png, transparent.bounds);
const lightCompatible = compositeOnBackground(transparent.png, [7, 28, 46]);
const darkCompatible = transparentCropped;

writePng('webskitters-logo.png', highRes);
writePng('webskitters-logo-highres.png', highRes);
writePng('webskitters-logo-transparent-square.png', transparent.png);
writePng('webskitters-logo-transparent.png', transparentCropped);
writePng('webskitters-logo-dark.png', darkCompatible);
writePng('webskitters-logo-light.png', lightCompatible);
writePng('webskitters-app-icon.png', highRes);
writePng('webskitters-splash-logo.png', transparent.png);
writePng('webskitters-header-logo.png', transparentCropped);
writePng('webskitters-navigation-logo.png', transparentCropped);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${transparentCropped.width} ${transparentCropped.height}" role="img" aria-label="Webskitters logo">
  <image href="./webskitters-logo-transparent.png" width="${transparentCropped.width}" height="${transparentCropped.height}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;
fs.writeFileSync(path.join(outDir, 'webskitters-logo.svg'), svg);
