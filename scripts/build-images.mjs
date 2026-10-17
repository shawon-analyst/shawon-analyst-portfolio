/**
 * Builds the dashboard images in `public/images`.
 *
 * Sources can be a file from a GitHub repository (`github`), a file from the
 * local `img/` folder (`local`), or a generated SVG graphic (`svg`). Every
 * source is fitted inside a 16:9 canvas — padding instead of cropping, so no KPI
 * card or axis label is ever cut off — and the letterbox bars are filled with
 * the colour of the source image's own corner pixel.
 *
 * Because a light corner would put a bright frame around a screenshot in dark
 * mode, any corner brighter than `LIGHT_THRESHOLD` falls back to the site's dark
 * surface colour instead. That is the fix for "white borders in dark mode".
 *
 * Usage:
 *   npm run assets:images              # only builds what is missing
 *   npm run assets:images -- --force   # rebuilds everything
 */
import sharp from "sharp";
import { mkdir, writeFile, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bankLoanHeroSvg } from "./graphics/bank-loan-hero.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "images");
const KEEP = new Set(["README.md"]);

/** Site dark-mode surface token, used when a corner is too light to letterbox with. */
const SURFACE = { r: 0x11, g: 0x1a, b: 0x2e, alpha: 1 };
const LIGHT_THRESHOLD = 0.55;

const MAX_W = 1920;
const MAX_H = 1080;

const RAW = "https://raw.githubusercontent.com/shawon-analyst";

/**
 * `crop` removes a non-dashboard backdrop from a local mockup screenshot.
 * `bg` overrides the automatic corner colour when it would look wrong.
 * `svg` is a function returning a generated graphic — no source file at all.
 */
const assets = [
  // ---- BanglaLedger (Power BI) ---------------------------------------------
  {
    file: "banglaledger-cover.jpg",
    github: `${RAW}/BanglaLedger-Financial-Transaction-Analytics-Dashboard/main/Dashboard_Img/Overview.jpg`,
  },
  {
    file: "banglaledger-1.jpg",
    github: `${RAW}/BanglaLedger-Financial-Transaction-Analytics-Dashboard/main/Dashboard_Img/Transactions.jpg`,
  },

  // ---- Sales Performance (Excel) -------------------------------------------
  {
    file: "sales-performance-cover.jpg",
    local: "img/Sales Performance img.png",
  },
  {
    file: "sales-performance-1.png",
    github: `${RAW}/sales-performance-dashboard-excel/main/dashboard-sales-view.png`,
    bg: { r: 0, g: 0, b: 0, alpha: 1 },
  },
  {
    file: "sales-performance-2.png",
    github: `${RAW}/sales-performance-dashboard-excel/main/dashboard-cross-filter-view.png`,
    bg: { r: 0, g: 0, b: 0, alpha: 1 },
  },

  // ---- Bank Loan (Python) --------------------------------------------------
  {
    file: "bank-loan-cover.png",
    local: "img/Bank_loan.png",
    // Trim the light mockup backdrop so only the dark dashboard panel remains.
    crop: { left: 141, top: 132, width: 1222, height: 865 },
  },
  {
    file: "bank-loan-1.png",
    github: `${RAW}/Bank-Loan-Data-Analysis/main/images/images/Total%20Funded%20Amount%20by%20Home%20Ownership.png`,
  },
  {
    file: "bank-loan-2.png",
    github: `${RAW}/Bank-Loan-Data-Analysis/main/images/images/Total%20Funded%20Amount%20by%20Term.png`,
  },
  {
    // Generated, not sourced — see scripts/graphics/bank-loan-hero.mjs.
    // Case-study hero only; the card thumbnail above stays the real dashboard.
    file: "bank-loan-hero.png",
    svg: bankLoanHeroSvg,
  },

  // ---- FoodPanda (Power BI) -------------------------------------------------
  // The Overview page is the case-study cover; the other three are the gallery.
  // These exports are on a light template, so the corner-colour fallback gives
  // them a dark frame rather than a white one.
  {
    file: "foodpanda-cover.jpg",
    github: `${RAW}/FoodPanda-Sales-Customer-Analytics-Dashboard/main/Dashboard_Img/Overview.jpg`,
  },
  {
    file: "foodpanda-1.jpg",
    github: `${RAW}/FoodPanda-Sales-Customer-Analytics-Dashboard/main/Dashboard_Img/User_Performance.jpg`,
  },
  {
    file: "foodpanda-2.jpg",
    github: `${RAW}/FoodPanda-Sales-Customer-Analytics-Dashboard/main/Dashboard_Img/City_Perfomance.jpg`,
  },
  {
    file: "foodpanda-3.jpg",
    github: `${RAW}/FoodPanda-Sales-Customer-Analytics-Dashboard/main/Dashboard_Img/Home.jpg`,
  },
];

const force = process.argv.includes("--force");

const luminance = ({ r, g, b }) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** Colour of the top-left pixel, so letterbox bars blend with the screenshot. */
async function cornerColour(buffer) {
  const { data, info } = await sharp(buffer)
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.channels >= 4 && data[3] === 0) return SURFACE;

  const corner = { r: data[0], g: data[1], b: data[2], alpha: 1 };
  return luminance(corner) > LIGHT_THRESHOLD ? SURFACE : corner;
}

/** Fit the image inside a 16:9 canvas, padding rather than cropping. */
function canvasFor(width, height) {
  const scale = Math.min(MAX_W / width, MAX_H / height, 1);
  const scaledW = Math.round(width * scale);
  const scaledH = Math.round(height * scale);
  const even = (value) => Math.max(2, value - (value % 2));

  if (scaledW / scaledH > 16 / 9) {
    return { width: even(scaledW), height: even((scaledW * 9) / 16) };
  }
  return { width: even((scaledH * 16) / 9), height: even(scaledH) };
}

async function loadSource(asset) {
  if (asset.svg) {
    return Buffer.from(asset.svg());
  }

  if (asset.local) {
    const file = path.join(ROOT, asset.local);
    if (!existsSync(file)) throw new Error(`${asset.file}: missing local source ${asset.local}`);
    const { readFile } = await import("node:fs/promises");
    return readFile(file);
  }

  const response = await fetch(asset.github);
  if (!response.ok) {
    throw new Error(`${asset.file}: GitHub responded ${response.status} for ${asset.github}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

await mkdir(OUT_DIR, { recursive: true });

let written = 0;

for (const asset of assets) {
  const destination = path.join(OUT_DIR, asset.file);

  if (!force && existsSync(destination)) {
    console.log(`  ${asset.file.padEnd(28)} already present — skipping (use --force to rebuild)`);
    continue;
  }

  const source = await loadSource(asset);
  const sourceMeta = await sharp(source).metadata();

  const cropped = asset.crop
    ? sharp(source).extract(asset.crop)
    : sharp(source);

  const croppedBuffer = await cropped.png().toBuffer();
  const meta = await sharp(croppedBuffer).metadata();
  const canvas = canvasFor(meta.width, meta.height);
  const background = asset.bg ?? (await cornerColour(croppedBuffer));

  const pipeline = sharp(croppedBuffer).resize({
    width: canvas.width,
    height: canvas.height,
    fit: "contain",
    background,
  });

  const output = asset.file.endsWith(".jpg")
    ? await pipeline.jpeg({ quality: 90, mozjpeg: true }).toBuffer()
    : await pipeline.png({ compressionLevel: 9 }).toBuffer();

  await writeFile(destination, output);
  written += 1;

  const cropNote = asset.crop
    ? ` (cropped ${sourceMeta.width}x${sourceMeta.height} -> ${meta.width}x${meta.height})`
    : "";
  const barColour = `#${[background.r, background.g, background.b]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;

  console.log(
    `  ${asset.file.padEnd(28)} ${canvas.width}x${canvas.height}  ${(output.length / 1024).toFixed(0)} KB  bars ${barColour}${cropNote}`,
  );
}

// Drop anything in public/images that the manifest no longer produces.
const expected = new Set(assets.map((asset) => asset.file));
for (const entry of await readdir(OUT_DIR)) {
  if (KEEP.has(entry) || expected.has(entry)) continue;
  await rm(path.join(OUT_DIR, entry), { force: true });
  console.log(`  removed stale ${entry}`);
}

console.log(`\n${written} image(s) written to public/images`);
