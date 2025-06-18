# PWA Icon Generation Instructions

## Generated SVG Icon
The base icon is located at `/public/icons/calculator.svg` - a calculator with a home symbol representing mortgage calculations.

## Required Icon Sizes
To complete the PWA setup, generate PNG icons from the SVG in these sizes:

- 72x72px → `/public/icons/icon-72x72.png`
- 96x96px → `/public/icons/icon-96x96.png`
- 128x128px → `/public/icons/icon-128x128.png`
- 144x144px → `/public/icons/icon-144x144.png`
- 152x152px → `/public/icons/icon-152x152.png`
- 192x192px → `/public/icons/icon-192x192.png`
- 384x384px → `/public/icons/icon-384x384.png`
- 512x512px → `/public/icons/icon-512x512.png`

## Generation Methods

### Using ImageMagick (if available):
```bash
for size in 72 96 128 144 152 192 384 512; do
  convert public/icons/calculator.svg -resize ${size}x${size} public/icons/icon-${size}x${size}.png
done
```

### Using Node.js with sharp (after installing):
```bash
npm install sharp
```

```javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  sharp('public/icons/calculator.svg')
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}x${size}.png`)
    .then(() => console.log(`Generated ${size}x${size} icon`))
    .catch(err => console.error(`Error generating ${size}x${size}:`, err));
});
```

### Online Tools:
1. Use an online SVG to PNG converter
2. Upload `/public/icons/calculator.svg`
3. Generate each required size
4. Save to the appropriate paths

## Screenshots
For the PWA manifest screenshots, take screenshots of:
1. Desktop view (1280x720) → `/public/screenshots/desktop.png`
2. Mobile view (390x844) → `/public/screenshots/mobile.png`

These screenshots help users understand what the app looks like when installing from app stores.