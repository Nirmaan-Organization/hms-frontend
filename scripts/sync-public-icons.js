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
const srcImages = path.join(root, "src", "images");
const publicDir = path.join(root, "public");

// Use the same icon everywhere (tab/favicon + PWA icons).
copyIfMissingOrDifferent(
  path.join(srcImages, "hms-icon.png"),
  path.join(publicDir, "hms-icon.png")
);

// Match the header logo for the browser tab/favicon.
copyIfMissingOrDifferent(
  path.join(srcImages, "hms-logo.png"),
  path.join(publicDir, "hms-logo.png")
);

// Some browsers / iOS still look for apple-touch-icon.
copyIfMissingOrDifferent(
  path.join(srcImages, "hms-icon.png"),
  path.join(publicDir, "logo192.png")
);

// Optional extra icon referenced in index.html; keep it if you want.
// If you don't have genrl-icon.png in src/images, this will be skipped.
const genrlSrc = path.join(srcImages, "genrl-icon.png");
if (fs.existsSync(genrlSrc)) {
  copyIfMissingOrDifferent(genrlSrc, path.join(publicDir, "genrl-icon.png"));
}

