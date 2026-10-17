/**
 * Generates public/Md-Idris-Resume.pdf.
 *
 * The content is derived from the figures and projects documented in the
 * portfolio itself, so the resume and the website never contradict each other.
 * Replace the PDF with your own export whenever you like — every download link
 * on the site points at this same file.
 *
 * The PDF is written by hand (no dependencies): Helvetica base fonts, a dark
 * header band matching the site palette, and /Link annotations with /URI actions
 * so the email, GitHub, LinkedIn and portfolio entries are clickable.
 *
 * Usage: npm run assets:resume
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = 56;
const CONTENT_WIDTH = PAGE.width - MARGIN * 2;

const FONT = { regular: "F1", bold: "F2", italic: "F3" };

/* Palette lifted from app/globals.css so the PDF matches the site. */
const COLOR = {
  ink: [0.043, 0.071, 0.125], // #0B1220
  muted: [0.29, 0.353, 0.447], // #4A5A72
  accent: [0.231, 0.51, 0.965], // #3B82F6
  accent2: [0.133, 0.827, 0.933], // #22D3EE
  rule: [0.886, 0.91, 0.945], // #E2E8F1
  bandMuted: [0.58, 0.639, 0.722], // #94A3B8
  bandLink: [0.643, 0.847, 1], // #A4D8FF
};

/**
 * Helvetica advance widths in em fractions — the PDF base-14 font. Index 0 is
 * the space character (ASCII 32); Helvetica-Oblique shares the regular widths.
 * Arial is metric-compatible with Helvetica, so these were measured from it
 * rather than guessed, which is what keeps wrapped lines inside the margin.
 */
const WIDTHS_REGULAR = [
  0.278, 0.278, 0.355, 0.556, 0.556, 0.889, 0.667, 0.191, 0.333, 0.333, 0.389, 0.584, 0.278,
  0.333, 0.278, 0.278, 0.556, 0.556, 0.556, 0.556, 0.556, 0.556, 0.556, 0.556, 0.556, 0.556,
  0.278, 0.278, 0.584, 0.584, 0.584, 0.556, 1.015, 0.667, 0.667, 0.722, 0.722, 0.667, 0.611,
  0.778, 0.722, 0.278, 0.5, 0.667, 0.556, 0.833, 0.722, 0.778, 0.667, 0.778, 0.722, 0.667,
  0.611, 0.722, 0.667, 0.944, 0.667, 0.667, 0.611, 0.278, 0.278, 0.278, 0.469, 0.556, 0.333,
  0.556, 0.556, 0.5, 0.556, 0.556, 0.278, 0.556, 0.556, 0.222, 0.222, 0.5, 0.222, 0.833,
  0.556, 0.556, 0.556, 0.556, 0.333, 0.5, 0.278, 0.556, 0.5, 0.722, 0.5, 0.5, 0.5,
  0.334, 0.26, 0.334, 0.584,
];

const WIDTHS_BOLD = [
  0.278, 0.333, 0.474, 0.556, 0.556, 0.889, 0.722, 0.238, 0.333, 0.333, 0.389, 0.584, 0.278,
  0.333, 0.278, 0.278, 0.556, 0.556, 0.556, 0.556, 0.556, 0.556, 0.556, 0.556, 0.556, 0.556,
  0.333, 0.333, 0.584, 0.584, 0.584, 0.611, 0.975, 0.722, 0.722, 0.722, 0.722, 0.667, 0.611,
  0.778, 0.722, 0.278, 0.556, 0.722, 0.611, 0.833, 0.722, 0.778, 0.667, 0.778, 0.722, 0.667,
  0.611, 0.722, 0.667, 0.944, 0.667, 0.667, 0.611, 0.333, 0.278, 0.333, 0.584, 0.556, 0.333,
  0.556, 0.611, 0.556, 0.611, 0.556, 0.333, 0.611, 0.611, 0.278, 0.278, 0.556, 0.278, 0.889,
  0.611, 0.611, 0.611, 0.611, 0.389, 0.556, 0.333, 0.611, 0.556, 0.778, 0.556, 0.556, 0.5,
  0.389, 0.28, 0.389, 0.584,
];

/** escapeText strips everything outside ASCII 32-126, so this is a safety net. */
const FALLBACK_WIDTH = 0.556;

function textWidth(text, size, bold = false) {
  const table = bold ? WIDTHS_BOLD : WIDTHS_REGULAR;
  let units = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    units += code >= 32 && code <= 126 ? table[code - 32] : FALLBACK_WIDTH;
  }
  return units * size;
}

function wrap(text, size, maxWidth, bold = false) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (textWidth(candidate, size, bold) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function escapeText(value) {
  return String(value)
    .replace(/[\u2013\u2014\u2011\u2012]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u00B7/g, "-")
    .replace(/\u2022/g, "-")
    .replace(/\u2192/g, "->")
    .replace(/\u21C4/g, "<->")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

/** URI strings inside a PDF literal string only need escaping. */
function escapeUri(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

class PdfBuilder {
  constructor() {
    this.pages = [];
    this.ops = [];
    this.links = [];
    this.y = PAGE.height - MARGIN;
    this.startPage();
  }

  startPage() {
    if (this.ops.length > 0) this.pages.push({ ops: this.ops, links: this.links });
    this.ops = [];
    this.links = [];
    this.y = PAGE.height - MARGIN;
  }

  ensure(space) {
    if (this.y - space < MARGIN + 34) {
      this.startPage();
      return true;
    }
    return false;
  }

  color(rgb) {
    return `${rgb[0]} ${rgb[1]} ${rgb[2]}`;
  }

  text(value, x, y, { size = 10, font = FONT.regular, color = COLOR.ink, tracking = 0 } = {}) {
    this.ops.push(
      `BT ${this.color(color)} rg /${font} ${size} Tf ${tracking} Tc 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escapeText(value)}) Tj ET`,
    );
  }

  /** Registers a clickable region. Rect is [llx, lly, urx, ury] in page space. */
  addLink(rect, uri) {
    this.links.push({ rect, uri });
  }

  line(x1, y1, x2, y2, { width = 0.7, color = COLOR.rule } = {}) {
    this.ops.push(
      `${this.color(color)} RG ${width} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`,
    );
  }

  rect(x, y, w, h, color) {
    this.ops.push(`${this.color(color)} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
  }
}

const pdf = new PdfBuilder();

/* ------------------------------- content ------------------------------- */

const NAME = "Md Idris";
const ROLE = "Data Analyst";
const LOCATION = "Bangladesh - open to remote";

const PORTFOLIO_URL = "https://shawon-analyst-portfolio.vercel.app";

const CONTACT_LINKS = [
  { text: "idris.shawon@gmail.com", uri: "mailto:idris.shawon@gmail.com" },
  { text: "github.com/shawon-analyst", uri: "https://github.com/shawon-analyst" },
  { text: "linkedin.com/in/shawonanalyst", uri: "https://www.linkedin.com/in/shawonanalyst" },
  { text: "shawon-analyst-portfolio.vercel.app", uri: PORTFOLIO_URL },
];

/** Draws text and registers a clickable area over it. Returns the width used. */
function linkText(value, x, y, { size = 9, font = FONT.regular, color = COLOR.accent, uri }) {
  const width = textWidth(value, size, font === FONT.bold);
  pdf.text(value, x, y, { size, font, color });
  pdf.addLink([x, y - size * 0.28, x + width, y + size * 0.84], uri);
  return width;
}

function heading(title) {
  pdf.ensure(46);
  pdf.y -= 6;
  pdf.rect(MARGIN, pdf.y - 1.1, 4, 4, COLOR.accent);
  pdf.text(title.toUpperCase(), MARGIN + 12, pdf.y, {
    size: 10,
    font: FONT.bold,
    color: COLOR.accent,
    tracking: 0.9,
  });
  pdf.y -= 7;
  pdf.line(MARGIN, pdf.y, MARGIN + CONTENT_WIDTH, pdf.y);
  pdf.y -= 13;
}

function paragraph(value, { size = 9.8, indent = 0 } = {}) {
  const lines = wrap(value, size, CONTENT_WIDTH - indent);
  for (const lineText of lines) {
    pdf.ensure(size + 4);
    pdf.text(lineText, MARGIN + indent, pdf.y, { size, color: COLOR.muted });
    pdf.y -= size + 3.2;
  }
}

function bullet(value, { size = 9.5 } = {}) {
  const indent = 13;
  const lines = wrap(value, size, CONTENT_WIDTH - indent);
  lines.forEach((lineText, index) => {
    pdf.ensure(size + 4);
    if (index === 0) {
      pdf.text("-", MARGIN + 1, pdf.y, { size, color: COLOR.accent, font: FONT.bold });
    }
    pdf.text(lineText, MARGIN + indent, pdf.y, { size, color: COLOR.muted });
    pdf.y -= size + 3;
  });
}

/**
 * Label on the left, value aligned into its own column. Falls back to wrapping
 * under the label when the value is too long for the remaining width, so a long
 * skill list can never run off the page.
 */
function definitionLine(labelText, value) {
  pdf.ensure(15);
  pdf.text(labelText, MARGIN, pdf.y, { size: 9.6, font: FONT.bold });
  const offset = textWidth(labelText, 9.6, true) + 8;
  const available = CONTENT_WIDTH - offset;

  if (textWidth(value, 9.6) <= available) {
    pdf.text(value, MARGIN + offset, pdf.y, { size: 9.6, color: COLOR.muted });
    pdf.y -= 15;
    return;
  }

  pdf.y -= 13;
  for (const lineText of wrap(value, 9.6, available)) {
    pdf.ensure(13);
    pdf.text(lineText, MARGIN + offset, pdf.y, { size: 9.6, color: COLOR.muted });
    pdf.y -= 13;
  }
  pdf.y -= 2;
}

function projectBlock({ title, tools, points }) {
  pdf.ensure(70);
  pdf.y -= 2;
  pdf.text(title, MARGIN, pdf.y, { size: 10.8, font: FONT.bold });
  pdf.y -= 12;
  pdf.text(tools, MARGIN, pdf.y, { size: 8.8, font: FONT.italic, color: COLOR.accent });
  pdf.y -= 14;
  for (const point of points) bullet(point);
  pdf.y -= 4;
}

/* -------------------------------- header -------------------------------- */

const BAND_HEIGHT = 100;

pdf.rect(0, PAGE.height - BAND_HEIGHT, PAGE.width, BAND_HEIGHT, COLOR.ink);
/* Hairline in the accent colour, so the band reads as part of the site theme. */
pdf.rect(0, PAGE.height - BAND_HEIGHT, PAGE.width, 1.2, COLOR.accent);

pdf.text(NAME, MARGIN, PAGE.height - 42, { size: 21, font: FONT.bold, color: [1, 1, 1] });
pdf.text(ROLE, MARGIN, PAGE.height - 61, { size: 11.5, color: COLOR.accent2 });

const locationWidth = textWidth(LOCATION, 8.6);
pdf.text(LOCATION, PAGE.width - MARGIN - locationWidth, PAGE.height - 61, {
  size: 8.6,
  color: COLOR.bandMuted,
});

/* Contact row: shrink to 7pt if all four links would overflow the margin. */
function contactRowWidth(size) {
  return CONTACT_LINKS.reduce(
    (total, item, index) => total + textWidth(item.text, size) + (index > 0 ? textWidth("  |  ", size) : 0),
    0,
  );
}

let contactSize = 8.4;
while (contactSize > 7 && contactRowWidth(contactSize) > CONTENT_WIDTH) {
  contactSize = Number((contactSize - 0.1).toFixed(1));
}

const contactY = PAGE.height - 82;
let contactX = MARGIN;
CONTACT_LINKS.forEach((item, index) => {
  if (index > 0) {
    const separator = "  |  ";
    pdf.text(separator, contactX, contactY, { size: contactSize, color: COLOR.bandMuted });
    contactX += textWidth(separator, contactSize);
  }
  contactX += linkText(item.text, contactX, contactY, {
    size: contactSize,
    color: COLOR.bandLink,
    uri: item.uri,
  });
});

pdf.y = PAGE.height - BAND_HEIGHT - 18;

/* --------------------------------- body --------------------------------- */

heading("Profile");
paragraph(
  "Data Analyst specializing in Power BI, advanced Excel, SQL (PostgreSQL) and Python. Works end to end: profiling and cleaning raw data, modelling it into a reusable structure, then designing dashboards that answer one specific business question. Every project is documented as a case study covering the data, the approach, the findings and the impact.",
);

heading("Core Skills");
definitionLine("BI & Visualization", "Power BI, DAX, Power Query, Excel dashboards, Plotly, KPI design");
definitionLine(
  "Databases & ETL",
  "PostgreSQL, SQL, Star-schema modeling, ETL, n8n automation, Data validation",
);
definitionLine("Programming & Analytics", "Python, Pandas, Jupyter, Exploratory data analysis, Aggregation");

heading("Featured Projects");

projectBlock({
  title: "BanglaLedger - Financial Transaction Analytics Dashboard",
  tools: "Power BI, DAX, Power Query, Star-schema data modeling",
  points: [
    "Built a full-scale financial dashboard modelling 8 transaction types across 5 customer segments and 8 Bangladesh divisions.",
    "Delivered five dynamic KPI cards - Amount, Transactions, Average Value, Fee and Tax - each with automatic year-over-year growth indicators.",
    "Created a parameter-driven trend chart that switches metrics in a single click, plus Success/Failed/Pending status analysis with transaction-level drill-down.",
  ],
});

projectBlock({
  title: "Sales Performance Dashboard",
  tools: "Advanced Excel, SUMIFS, MAXIFS, CHOOSE/SWITCH, Synchronized slicers",
  points: [
    "Built a fully interactive sales dashboard with synchronized slicers across Region, Product and Sales Person.",
    "Analysed 1B+ in aggregate sales, including 178M in revenue from Sylhet and 293.5M from the Laptop product line.",
    "Added a one-click Qty/Sales toggle and a formula-driven radial network diagram for regional performance analysis.",
  ],
});

projectBlock({
  title: "Bank Loan Data Analysis",
  tools: "Python, Pandas, Plotly Express",
  points: [
    "Analysed bank lending data to uncover loan distribution patterns, borrower demographics and risk drivers.",
    "Found Debt Consolidation to be the dominant loan purpose and borrowers with 10+ years of employment tenure to receive the highest funding volume.",
    "Linked home ownership status (Rent/Mortgage) to loan volume, with funding rising steadily toward year-end.",
  ],
});

heading("Selected Outcomes");
bullet("Gives executives a real-time view of transaction performance, risk and customer behavior through one finance-grade interface.");
bullet("Enables real-time sales performance tracking without IT dependency.");
bullet("Supports risk assessment and lending strategy through clear, data-backed borrower patterns.");

heading("Portfolio");

const portfolioLead = "Case studies, dashboard screenshots and live repositories: ";
const portfolioLabel = PORTFOLIO_URL.replace(/^https?:\/\//, "");
pdf.text(portfolioLead, MARGIN, pdf.y, { size: 9.5, color: COLOR.muted });
const leadWidth = textWidth(portfolioLead, 9.5);
const portfolioWidth = linkText(portfolioLabel, MARGIN + leadWidth, pdf.y, {
  size: 9.5,
  color: COLOR.accent,
  uri: PORTFOLIO_URL,
});
pdf.line(MARGIN + leadWidth, pdf.y - 2.3, MARGIN + leadWidth + portfolioWidth, pdf.y - 2.3, {
  width: 0.5,
  color: COLOR.accent,
});
pdf.y -= 16;

/* ------------------------------ page footers ------------------------------ */

const totalPages = pdf.pages.length + 1;
const pages = [...pdf.pages, { ops: pdf.ops, links: pdf.links }];

pages.forEach((page, index) => {
  const pageLabel = `Page ${index + 1} of ${totalPages}`;
  page.ops.push(
    `BT ${pdf.color(COLOR.muted)} rg /${FONT.regular} 8 Tf 0 Tc 1 0 0 1 ${MARGIN} 34 Tm (${escapeText(
      `${NAME} - ${ROLE}`,
    )}) Tj ET`,
    `BT ${pdf.color(COLOR.muted)} rg /${FONT.regular} 8 Tf 0 Tc 1 0 0 1 ${(
      PAGE.width - MARGIN - textWidth(pageLabel, 8)
    ).toFixed(2)} 34 Tm (${escapeText(pageLabel)}) Tj ET`,
    `${pdf.color(COLOR.rule)} RG 0.7 w ${MARGIN} 46 m ${(PAGE.width - MARGIN).toFixed(2)} 46 l S`,
  );
});

/* ------------------------------ PDF writer ------------------------------ */

const objects = [];
function addObject(body) {
  objects.push(body);
  return objects.length; // object number
}

const regularFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
const boldFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
const italicFontId = addObject(
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>",
);

const pageIds = [];
const pageObjectIndexes = [];

for (const page of pages) {
  const stream = page.ops.join("\n");
  const contentId = addObject(`<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`);

  // The page dictionary is the next object, and its annotations follow it, so the
  // ids can be computed before anything is written.
  const pageId = objects.length + 1;
  const annotIds = page.links.map((_, index) => pageId + 1 + index);

  const annots =
    annotIds.length > 0 ? ` /Annots [${annotIds.map((id) => `${id} 0 R`).join(" ")}]` : "";

  const pageObjectIndex =
    objects.push(
      `<< /Type /Page /Parent @@PAGES@@ 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R /F3 ${italicFontId} 0 R >> >> /Contents ${contentId} 0 R${annots} >>`,
    ) - 1;

  pageObjectIndexes.push(pageObjectIndex);
  pageIds.push(pageId);

  for (const link of page.links) {
    objects.push(
      `<< /Type /Annot /Subtype /Link /Rect [${link.rect
        .map((value) => value.toFixed(2))
        .join(" ")}] /Border [0 0 0] /A << /S /URI /URI (${escapeUri(link.uri)}) >> >>`,
    );
  }
}

const pagesId = objects.length + 1;
for (const index of pageObjectIndexes) {
  objects[index] = objects[index].replace("@@PAGES@@", String(pagesId));
}

objects.push(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);
const catalogId = objects.length + 1;
objects.push(
  `<< /Type /Catalog /Pages ${pagesId} 0 R /Lang (en-US) /ViewerPreferences << /DisplayDocTitle true >> >>`,
);

let pdfBody = "%PDF-1.4\n%\u00E2\u00E3\u00CF\u00D3\n";
const offsets = [0];
objects.forEach((body, index) => {
  offsets.push(Buffer.byteLength(pdfBody, "latin1"));
  pdfBody += `${index + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdfBody, "latin1");
pdfBody += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i += 1) {
  pdfBody += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
pdfBody += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R /Info << /Title (${escapeText(
  `${NAME} - ${ROLE} Resume`,
)}) /Author (${escapeText(NAME)}) >> >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

const outDir = path.resolve("public");
await mkdir(outDir, { recursive: true });
const outFile = path.join(outDir, "Md-Idris-Resume.pdf");
const buffer = Buffer.from(pdfBody, "latin1");
await writeFile(outFile, buffer);

const linkCount = pages.reduce((total, page) => total + page.links.length, 0);
console.log(
  `  Md-Idris-Resume.pdf  ${pages.length} page(s), ${linkCount} link(s), ${(buffer.length / 1024).toFixed(1)} KB`,
);
if (pages.length === 1) {
  console.log(`  slack below the last block: ${(pdf.y - (MARGIN + 40)).toFixed(0)}pt`);
}
console.log(`\nResume written to ${outFile}`);
