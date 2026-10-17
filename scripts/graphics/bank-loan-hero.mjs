/**
 * The Bank Loan Data Analysis case-study hero.
 *
 * The repository has no dark-background screenshot for this project — its
 * Plotly exports are all on a white template, which turns into a glaring white
 * block on a dark card. Rather than recolouring real charts (which would
 * misrepresent the bars), this builds a notebook preview instead: generic pandas
 * / Plotly Express calls beside a plot of the funded amount by loan term.
 *
 * The two figures in the chart are the real ones from the analysis
 * (36-month loans 273.0M, 60-month loans 162.7M). Nothing else here is a claim
 * about the data — it is a stylised workflow graphic, not a screenshot.
 *
 * Rendered to PNG by `scripts/build-images.mjs` via sharp.
 */

const WIDTH = 1920;
const HEIGHT = 1080;

const CARD = { x: 170, y: 130, width: 1580, height: 820, radius: 28 };
const HEADER_HEIGHT = 64;
const PAD = 40;

const CONTENT_LEFT = CARD.x + PAD;
const CONTENT_RIGHT = CARD.x + CARD.width - PAD;
const PANE_TOP = 230;
const PANE_BOTTOM = 910;

const CODE_PANE = { x: CONTENT_LEFT, y: PANE_TOP, width: 800, height: PANE_BOTTOM - PANE_TOP };
const PLOT_PANE = {
  x: CONTENT_RIGHT - 628,
  y: PANE_TOP,
  width: 628,
  height: PANE_BOTTOM - PANE_TOP,
};
const DIVIDER_X = (CODE_PANE.x + CODE_PANE.width + PLOT_PANE.x) / 2;

const COLOURS = {
  background: "#0B1220",
  card: "#111A2E",
  chrome: "#0F1828",
  pane: "#0B1220",
  plotArea: "#0E1626",
  line: "#1E2A44",
  axis: "#334155",
  grid: "#233350",
  strong: "#F8FAFC",
  body: "#CBD5E1",
  muted: "#94A3B8",
  faint: "#64748B",
  gutter: "#475569",
  accent: "#3B82F6",
  accent2: "#22D3EE",
};

/** Code token colours, loosely matching a dark editor theme. */
const SYNTAX = {
  kw: "#C084FC",
  mod: "#93C5FD",
  str: "#86EFAC",
  fn: "#22D3EE",
  num: "#FDBA74",
  id: "#CBD5E1",
  op: "#7C8CA6",
};

const MONO = "Consolas, 'DejaVu Sans Mono', 'Courier New', monospace";
const SANS = "'Segoe UI', Inter, Arial, sans-serif";

/**
 * Notebook source, one array per line. Each token is `colour:text` — the colour
 * name indexes SYNTAX. Backticks keep the double quotes readable.
 */
const CODE_LINES = [
  [`kw:import`, `id: `, `mod:pandas`, `id: `, `kw:as`, `id: `, `mod:pd`],
  [`kw:import`, `id: `, `mod:plotly.express`, `id: `, `kw:as`, `id: `, `mod:px`],
  ``,
  [`id:loans`, `op: = `, `mod:pd`, `op:.`, `fn:read_csv`, `op:(`, `str:"loan_data.csv"`, `op:)`],
  [`id:loans`, `op: = `, `id:loans`, `op:.`, `fn:drop_duplicates`, `op:()`],
  [
    `id:loans`,
    `op:["`,
    `str:term`,
    `op:"] = `,
    `id:loans`,
    `op:["`,
    `str:term`,
    `op:"]`,
    `op:.`,
    `id:str`,
    `op:.`,
    `fn:strip`,
    `op:()`,
  ],
  ``,
  [
    `id:loans`,
    `op:["`,
    `str:issue_month`,
    `op:"] = `,
    `mod:pd`,
    `op:.`,
    `fn:to_datetime`,
    `op:(`,
  ],
  [`id:    loans`, `op:["`, `str:issue_date`, `op:"]`],
  [`op:).`, `id:dt`, `op:.`, `fn:to_period`, `op:(`, `str:"M"`, `op:)`],
  ``,
  [
    `id:by_term`,
    `op: = `,
    `id:loans`,
    `op:.`,
    `fn:groupby`,
    `op:(`,
    `str:"term"`,
    `op:)[`,
    `str:"funded_amount"`,
    `op:]`,
  ],
  [
    `mod:px`,
    `op:.`,
    `fn:bar`,
    `op:(`,
    `id:by_term`,
    `op:.`,
    `fn:sum`,
    `op:()`,
    `op:.`,
    `fn:reset_index`,
    `op:()`,
    `op:.`,
    `fn:show`,
    `op:()`,
  ],
];

const CODE_FONT_SIZE = 21;
const CODE_LINE_HEIGHT = 46;
const CODE_FIRST_BASELINE = PANE_TOP + 70;
const GUTTER_WIDTH = 34;
const GUTTER_GAP = 24;
const CODE_TEXT_X = CODE_PANE.x + 36 + GUTTER_WIDTH + GUTTER_GAP;

/** Plot geometry: funded amount by loan term. */
const PLOT = { left: 1190, right: 1666, top: 370, bottom: 800 };
const PLOT_MAX = 300_000_000;
const TICKS = [0, 100_000_000, 200_000_000, 300_000_000];

/** Real figures from the analysis. */
const BARS = [
  { label: "36 months", value: 273_000_000, display: "273.0M" },
  { label: "60 months", value: 162_700_000, display: "162.7M" },
];

const escapeXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const valueToY = (value) =>
  PLOT.bottom - (value / PLOT_MAX) * (PLOT.bottom - PLOT.top);

const formatTick = (value) => `${Math.round(value / 1_000_000)}M`;

function codeLine(line, index) {
  if (!line) return "";
  const y = CODE_FIRST_BASELINE + index * CODE_LINE_HEIGHT;
  const spans = line
    .map((token) => {
      const separator = token.indexOf(":");
      const colour = SYNTAX[token.slice(0, separator)] ?? SYNTAX.id;
      const text = token.slice(separator + 1);
      return `<tspan fill="${colour}">${escapeXml(text)}</tspan>`;
    })
    .join("");

  return [
    `<text x="${CODE_PANE.x + 36 + GUTTER_WIDTH}" y="${y}" text-anchor="end"`,
    ` font-family="${MONO}" font-size="19" fill="${COLOURS.gutter}">${index + 1}</text>`,
    `<text x="${CODE_TEXT_X}" y="${y}" xml:space="preserve"`,
    ` font-family="${MONO}" font-size="${CODE_FONT_SIZE}" fill="${COLOURS.body}">${spans}</text>`,
  ].join("");
}

function plotGridlines() {
  return TICKS.map((tick) => {
    const y = valueToY(tick);
    return [
      `<line x1="${PLOT.left}" y1="${y}" x2="${PLOT.right}" y2="${y}"`,
      ` stroke="${tick === 0 ? COLOURS.axis : COLOURS.grid}" stroke-width="1"/>`,
      `<text x="${PLOT.left - 18}" y="${y + 6}" text-anchor="end"`,
      ` font-family="${SANS}" font-size="18" fill="${COLOURS.faint}">${formatTick(tick)}</text>`,
    ].join("");
  }).join("");
}

function plotBars() {
  const slot = (PLOT.right - PLOT.left) / BARS.length;
  const barWidth = 132;

  return BARS.map((bar, index) => {
    const centre = PLOT.left + slot * (index + 0.5);
    const top = valueToY(bar.value);
    const x = centre - barWidth / 2;

    return [
      `<rect x="${x}" y="${top}" width="${barWidth}" height="${PLOT.bottom - top}"`,
      ` fill="url(#barFill)"/>`,
      `<text x="${centre}" y="${top - 20}" text-anchor="middle"`,
      ` font-family="${SANS}" font-size="22" font-weight="600"`,
      ` fill="${COLOURS.strong}">${bar.display}</text>`,
      `<text x="${centre}" y="${PLOT.bottom + 38}" text-anchor="middle"`,
      ` font-family="${SANS}" font-size="19" fill="${COLOURS.muted}">${bar.label}</text>`,
    ].join("");
  }).join("");
}

export function bankLoanHeroSvg() {
  const headerMidY = CARD.y + HEADER_HEIGHT / 2;
  const headerBottom = CARD.y + HEADER_HEIGHT;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${COLOURS.accent}" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="${COLOURS.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${COLOURS.accent2}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${COLOURS.accent2}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLOURS.accent2}"/>
      <stop offset="100%" stop-color="${COLOURS.accent}"/>
    </linearGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="${COLOURS.accent}" stroke-opacity="0.09" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLOURS.background}"/>
  <circle cx="140" cy="60" r="520" fill="url(#glowA)"/>
  <circle cx="1810" cy="1020" r="560" fill="url(#glowB)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <rect x="${CARD.x}" y="${CARD.y}" width="${CARD.width}" height="${CARD.height}"
        rx="${CARD.radius}" fill="${COLOURS.card}" stroke="${COLOURS.line}" stroke-width="1.5"/>
  <path d="M${CARD.x} ${CARD.y + CARD.radius}
           a${CARD.radius} ${CARD.radius} 0 0 1 ${CARD.radius} -${CARD.radius}
           h${CARD.width - CARD.radius * 2}
           a${CARD.radius} ${CARD.radius} 0 0 1 ${CARD.radius} ${CARD.radius}
           v${HEADER_HEIGHT - CARD.radius}
           h-${CARD.width} z" fill="${COLOURS.chrome}"/>
  <line x1="${CARD.x}" y1="${headerBottom}" x2="${CARD.x + CARD.width}" y2="${headerBottom}"
        stroke="${COLOURS.line}" stroke-width="1"/>

  <circle cx="${CARD.x + 36}" cy="${headerMidY}" r="7" fill="#F87171" opacity="0.7"/>
  <circle cx="${CARD.x + 64}" cy="${headerMidY}" r="7" fill="#FBBF24" opacity="0.7"/>
  <circle cx="${CARD.x + 92}" cy="${headerMidY}" r="7" fill="#34D399" opacity="0.7"/>
  <text x="${CARD.x + 132}" y="${headerMidY + 7}" font-family="${MONO}"
        font-size="20" fill="${COLOURS.muted}">bank_loan_analysis.ipynb</text>
  <text x="${CARD.x + CARD.width - 36}" y="${headerMidY + 7}" text-anchor="end"
        font-family="${SANS}" font-size="18" fill="${COLOURS.faint}">Python 3</text>

  <rect x="${CODE_PANE.x}" y="${CODE_PANE.y}" width="${CODE_PANE.width}" height="${CODE_PANE.height}"
        rx="18" fill="${COLOURS.pane}" stroke="${COLOURS.line}" stroke-width="1"/>
  <line x1="${DIVIDER_X}" y1="${PANE_TOP + 40}" x2="${DIVIDER_X}" y2="${PANE_BOTTOM - 40}"
        stroke="${COLOURS.line}" stroke-width="1"/>
  <rect x="${PLOT_PANE.x}" y="${PLOT_PANE.y}" width="${PLOT_PANE.width}" height="${PLOT_PANE.height}"
        rx="18" fill="${COLOURS.pane}" stroke="${COLOURS.line}" stroke-width="1"/>

  <text x="${PLOT_PANE.x + PLOT_PANE.width / 2}" y="${PANE_TOP + 58}" text-anchor="middle"
        font-family="${SANS}" font-size="22" font-weight="600"
        fill="${COLOURS.body}">Funded amount by term</text>
  <rect x="${PLOT.left}" y="${PLOT.top}" width="${PLOT.right - PLOT.left}"
        height="${PLOT.bottom - PLOT.top}" rx="6" fill="${COLOURS.plotArea}"/>
  ${plotGridlines()}
  ${plotBars()}

  ${CODE_LINES.map(codeLine).join("\n  ")}
</svg>`;
}
