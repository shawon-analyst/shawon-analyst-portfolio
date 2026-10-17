/**
 * Builds the brand marks from `img/favicon.png`.
 *
 * One source file drives three files:
 *   app/icon.png       — the browser tab icon (Next's file-based icon metadata)
 *   app/apple-icon.png — the iOS home-screen icon
 *   public/avatar.png  — the avatar in the navbar and the footer
 *
 * The source is 192x192, so nothing here is upscaled. The PNGs are palette
 * quantised because a full-colour PNG of a photograph is needlessly heavy for an
 * icon that mostly renders at 16-40px.
 *
 * Usage:
 *   npm run assets:brand              # only builds what is missing
 *   npm run assets:brand -- --force   # rebuilds and overwrites
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "img", "favicon.png");

const outputs = [
  { file: "app/icon.png", size: 192, note: "browser tab icon" },
  { file: "app/apple-icon.png", size: 180, note: "iOS home screen" },
  { file: "public/avatar.png", size: 192, note: "navbar + footer avatar" },
];

const force = process.argv.includes("--force");

if (!existsSync(SOURCE)) {
  throw new Error(`Missing source image ${path.relative(ROOT, SOURCE)}`);
}

const metadata = await sharp(SOURCE).metadata();
console.log(`Source  ${path.relative(ROOT, SOURCE)}  ${metadata.width}x${metadata.height}`);

let written = 0;

for (const { file, size, note } of outputs) {
  const destination = path.join(ROOT, file);

  if (!force && existsSync(destination)) {
    console.log(`  ${file.padEnd(24)} already present — skipping (use --force to rebuild)`);
    continue;
  }

  await mkdir(path.dirname(destination), { recursive: true });

  const buffer = await sharp(SOURCE)
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9, palette: true, quality: 84, effort: 10 })
    .toBuffer();

  await writeFile(destination, buffer);
  written += 1;

  const upscaled = size > (metadata.width ?? 0) ? "  (upscaled!)" : "";
  console.log(
    `  ${file.padEnd(24)} ${size}x${size}  ${(buffer.length / 1024).toFixed(1).padStart(5)} KB  ${note}${upscaled}`,
  );
}

console.log(`\n${written} brand asset(s) written`);
