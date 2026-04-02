const fs = require("fs");
const path = require("path");

function copyIfMissingOrDifferent(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Missing source asset: ${src}`);
  }

  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });

  const srcBuf = fs.readFileSync(src);
  const destBuf = fs.existsSync(dest) ? fs.readFileSync(dest) : null;
  if (!destBuf || !srcBuf.equals(destBuf)) {
    fs.writeFileSync(dest, srcBuf);
  }
}

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

// Use favicon.png as the single source of truth for all public icons.
// This keeps old/legacy filenames working (social previews + cached clients).
const faviconPng = path.join(publicDir, "favicon.png");

copyIfMissingOrDifferent(faviconPng, path.join(publicDir, "hms-icon.png"));
copyIfMissingOrDifferent(faviconPng, path.join(publicDir, "logo192.png"));
copyIfMissingOrDifferent(faviconPng, path.join(publicDir, "hms-logo.png"));

// Optional extra icon referenced in index.html; keep it if you want.
// If you don't have genrl-icon.png in src/images, this will be skipped.
const genrlSrc = path.join(root, "src", "images", "genrl-icon.png");
if (fs.existsSync(genrlSrc)) {
  copyIfMissingOrDifferent(genrlSrc, path.join(publicDir, "genrl-icon.png"));
}

