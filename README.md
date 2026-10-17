# Md Idris — Data Analyst Portfolio

A professional, case-study-driven portfolio website for **Md Idris**, Data Analyst specializing in Power BI, Excel, SQL (PostgreSQL), and Python.

The site presents selected projects as structured case studies and surfaces the remaining work from GitHub automatically.

- **Live site:** https://shawon-analyst-portfolio.vercel.app
- **GitHub:** https://github.com/shawon-analyst
- **LinkedIn:** https://www.linkedin.com/in/shawonanalyst
- **Email:** idris.shawon@gmail.com

---

## 1. Project Goals

1. Present a clean, credible, recruiter-friendly first impression within five seconds.
2. Showcase featured projects as case studies: visual, insight-led, and tied to business impact.
3. Provide a transparent view of the broader body of work through a live GitHub feed.
4. Make the portfolio easy to maintain: adding a project means adding one data entry, not editing page code.

---

## 2. Recommended Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | File-based routing, static generation, strong SEO |
| Styling | Tailwind CSS | Fast, consistent design system |
| Animation | Framer Motion (subtle only) | Polished transitions without distraction |
| Icons | Lucide React | Clean, consistent icon set |
| Content | Local `projects.json` | Simple, version-controlled content |
| GitHub feed | GitHub REST API | Automatically lists additional repositories |
| Hosting | Vercel | Zero-config deploys from GitHub |

---

## 3. Site Structure

```
/                    Home (Hero, Featured Projects, Skills, About, Contact)
/projects            All featured case studies
/projects/[slug]     Individual case study page
/work                Explore More Work (live GitHub repositories)
/resume              Embedded resume + download button
```

### Home page sections (in order)

1. **Navigation bar** — Home, Projects, Work, Skills, About, Contact; sticky with a subtle blur on scroll. Skills, About and Contact jump to home-page sections (`/#skills`, `/#about`, `/#contact`); Projects and Work open their own routes. Home-page sections keep stable ids (`#projects`, `#skills`, `#about`, `#work`, `#contact`) so any of them can be linked or shared directly.
2. **Hero** — Name, role headline, one-line value statement, and two buttons: *View Projects* and *Download Resume*.
3. **Featured Projects** — Four large project cards (see Section 5).
4. **Skills & Tools** — Three-card grid: BI & Visualization, Databases & ETL, Programming & Analytics. Cards lift with an accent glow and the skill pills scale and tint on hover. Includes **n8n Automation** under Databases & ETL.
5. **About** — Short professional summary and what kind of work Md Idris is seeking.
6. **Explore More Work** — Live grid of other GitHub repositories (see Section 7).
7. **Contact** — Inquiry form (interest selector, name, email, optional organization, message) with a prominent *Send inquiry* button, alongside email and location as direct details and links to LinkedIn and GitHub. The site is static, so submitting composes a pre-filled email and hands it to the visitor's mail client; the direct address stays on screen as a fallback.
8. **Footer** — Copyright and social links.

---

## 4. Design System

**Style direction:** minimal, modern, data-professional. Generous whitespace, strong typography, high-quality dashboard screenshots as the visual focus.

**Color palette**

| Role | Value |
|---|---|
| Background | `#0B1220` (dark navy) or `#FFFFFF` (light mode option) |
| Surface / Cards | `#111A2E` |
| Primary accent | `#3B82F6` |
| Secondary accent | `#22D3EE` |
| Text primary | `#F8FAFC` |
| Text muted | `#94A3B8` |

**Typography**

- Headings: *Inter* or *Plus Jakarta Sans*, semi-bold
- Body: *Inter*, regular
- Numbers and metrics: tabular figures for alignment

**Layout rules**

- Maximum content width: 1200px
- 8px spacing grid
- Rounded corners (12–16px), soft borders, subtle shadows
- Fully responsive: mobile, tablet, desktop
- Light and dark mode toggle (optional but recommended)
- The sticky navbar height lives in one variable (`--nav-height`, `4rem`). The navbar sizes itself from it and `html` uses it as its **only** `scroll-padding-top`, so an anchor jump lands the target section flush under the navbar and never reveals a strip of the previous one. Section components must not add their own `scroll-margin`: the two offsets would stack and land the section far too low.

---

## 5. Project Card Layout (Home Page)

Each featured project card follows this exact order:

1. **Project name** (top)
2. **Project image** (dashboard screenshot, 16:9)
3. **One-line insight** (the key finding)
4. **Tools used** (tag chips)
5. **Business impact** (one sentence)
6. **Buttons:** *View Case Study* and *GitHub*

---

## 6. Case Study Page Template (`/projects/[slug]`)

Every featured project uses the same template:

| Section | Content |
|---|---|
| Header | Project name, tools, role, project type |
| Hero image | Full-width dashboard screenshot |
| Overview | The problem and objective in 2–3 sentences |
| Data | Source, size, structure (e.g., star schema) |
| Approach | Data cleaning, modeling, analysis steps |
| Key Insights | 3–4 bullet findings with numbers |
| Business Impact | What decisions this analysis supports |
| Dashboard Gallery | Additional screenshots with captions |
| Tools & Skills | Tag chips |
| Links | GitHub repository, live demo (if available) |

---

## 7. Featured Projects Content

Use the following content in `data/projects.json`. All figures below are taken from the resume.

### 7.1 BanglaLedger — Financial Transaction Analytics Dashboard

- **Tools:** Power BI, DAX, Power Query, Star-Schema Data Modeling
- **Overview:** A full-scale financial transaction analytics dashboard modeling 8 transaction types across 5 customer segments and 8 Bangladesh divisions.
- **Key insights:**
  - Five dynamic KPI cards: Amount, Transactions, Average Value, Fee, and Tax, each with automatic YoY growth indicators.
  - A parameter-driven trend chart that switches between metrics with a single click.
  - Success, Failed, and Pending status analysis with full transaction-level drill-down.
- **Business impact:** Gives executives a real-time view of transaction performance, risk, and customer behavior through a finance-grade interface.

### 7.2 Sales Performance Dashboard

- **Tools:** Advanced Excel, SUMIFS, MAXIFS, CHOOSE/SWITCH, Slicers
- **Overview:** A fully interactive sales dashboard with synchronized slicers across Region, Product, and Sales Person.
- **Key insights:**
  - 1B+ in aggregate sales analyzed.
  - 178M in revenue from Sylhet.
  - 293.5M in revenue from the Laptop product line.
  - One-click Qty ⇄ Sales toggle and a formula-driven radial network diagram for regional analysis.
- **Business impact:** Enables real-time performance tracking without IT dependency.

### 7.3 Bank Loan Data Analysis

- **Tools:** Python, Pandas, Plotly Express
- **Overview:** Analysis of bank lending data to uncover loan distribution patterns, borrower demographics, and risk drivers.
- **Key insights:**
  - Debt Consolidation is the dominant loan purpose.
  - Borrowers with 10+ years of employment tenure receive the highest funding volume.
  - Home ownership status (Rent/Mortgage) is linked to loan volume, with funding rising steadily toward year-end.
- **Business impact:** Supports risk assessment and lending strategy through clear, data-backed borrower patterns.

### 7.4 FoodPanda Sales & Customer Analytics Dashboard

- **Tools:** Power BI, DAX, Power Query, Star-Schema Data Modeling, Custom Visuals
- **Overview:** A Power BI report on foodpanda order, user, restaurant and menu data across 87 cities, modelled so a viewer can move from company-wide KPIs down to a single city's scorecard.
- **Key insights:**
  - Churn runs ahead of acquisition: 11,635 users gained against 32,798 lost, a net decline of roughly 21,000.
  - Dhaka dominates order volume at 383K (about 2.9x the next city), yet Feni tops sales value and Narsingdi tops order count.
  - Veg orders carry the highest rating count on the lowest volume; Non-veg is the reverse.
  - Sales peaked in 2018 at 1.0M and eased to 0.4M by 2020.
- **Business impact:** Gives commercial and retention teams one navigable report spanning sales performance, customer health and city-level operations.
- **Live report:** the repository README links a public Power BI build. `demo` is left empty here — add that URL to surface the *Live demo* button on the case study.

### Data entry format

```json
{
  "slug": "banglaledger",
  "name": "BanglaLedger — Financial Transaction Analytics Dashboard",
  "image": "/images/banglaledger-cover.jpg",
  "gallery": ["/images/banglaledger-1.jpg"],
  "insight": "One-line key finding",
  "tools": ["Power BI", "DAX", "Power Query", "Data Modeling"],
  "impact": "One-sentence business impact",
  "overview": "2–3 sentences",
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "github": "https://github.com/shawon-analyst/REPO-NAME",
  "demo": ""
}
```

---

## 8. "Explore More Work" Page (`/work`)

Purpose: allow visitors to see all remaining work from GitHub without cluttering the featured section.

**Implementation**

- Fetch repositories server-side from:
  `https://api.github.com/users/shawon-analyst/repos?sort=updated&per_page=100`
- Filter out forks, archived repositories, the featured repositories, and the
  two repos that exist only to host profile assets:
  `shawon-analyst/Shawon-analyst` (profile README) and `shawon-analyst/img`.
- Revalidate every hour (`revalidate: 3600`) to stay within API rate limits.
- Each repository card shows: name, description, primary language, last updated date, and a link.
- Add filter chips: *All, Power BI, Excel, SQL, Python*.
- Filtering is driven by `REPO_CATEGORIES` in `lib/github.ts` — an explicit
  repository-to-tool map. Keyword matching against topics, name, description and
  language is still there as a fallback, but it cannot classify these
  repositories on its own: they carry no description, no topics, and most have no
  detected language, so they appeared under *All* but never under their own tool.
- A repository can sit in more than one category —
  `Smart-Data-Management-System` is Python + SQL. Add a repository by its
  lower-cased name; anything left out falls through to the keyword match.
- Tip: add GitHub **topics** and a clear **description** to every repository so
  cards look complete and the fallback starts working.

---

## 9. Getting Started

### Prerequisites

- Node.js 20 or later
- npm or pnpm
- Git

### Setup

This repository already contains the full Next.js project, so setup is just:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open http://localhost:3000.

To scaffold an equivalent project from scratch instead:

```bash
npx create-next-app@latest portfolio --typescript --tailwind --app
cd portfolio
npm install framer-motion lucide-react
```

### Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build, including the TypeScript check |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint using the Next.js core-web-vitals and TypeScript rules |
| `npm run assets:images` | Rebuild the dashboard images in `public/images` (add `-- --force` to overwrite) |
| `npm run assets:brand` | Rebuild the favicon, Apple touch icon and navbar avatar from `img/favicon.png` (add `-- --force` to overwrite) |
| `npm run assets:resume` | Regenerate `public/Md-Idris-Resume.pdf` from the portfolio content (one page, with clickable email / GitHub / LinkedIn / portfolio links) |

### Environment variables

Copy `.env.example` to `.env.local`. Both variables are optional:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used for metadata, `sitemap.xml` and Open Graph tags. Defaults to the Vercel URL above. |
| `GITHUB_TOKEN` | Raises the GitHub REST API rate limit for the `/work` feed from 60 to 5000 requests per hour. |

### Folder structure

```
portfolio/
├── app/
│   ├── layout.tsx               # Fonts, metadata, theme bootstrap, navbar + footer
│   ├── page.tsx                 # Home
│   ├── globals.css              # Design tokens (light + dark) and component classes
│   ├── projects/
│   │   ├── page.tsx             # All projects
│   │   └── [slug]/page.tsx      # Case study template
│   ├── work/page.tsx            # GitHub repositories
│   ├── resume/page.tsx          # Embedded resume + downloads
│   ├── sitemap.ts               # sitemap.xml
│   ├── robots.ts                # robots.txt
│   ├── manifest.ts              # Web manifest
│   ├── opengraph-image.tsx      # Generated Open Graph image
│   ├── icon.png                 # Favicon (generated — see assets:brand)
│   ├── apple-icon.png           # iOS home-screen icon (generated)
│   └── not-found.tsx            # 404
├── components/
│   ├── Navbar.tsx               # Sticky nav with blur on scroll + theme toggle
│   ├── Hero.tsx
│   ├── ProjectCard.tsx          # Spec order: name, image, insight, tools, impact, actions
│   ├── SkillsGrid.tsx
│   ├── RepoCard.tsx
│   ├── GitHubWork.tsx           # Filter chips + grid (client)
│   ├── AboutSection.tsx
│   ├── ContactSection.tsx       # Direct details + channel links
│   ├── ContactForm.tsx          # Inquiry form (client)
│   ├── Footer.tsx
│   ├── Section.tsx              # Section wrapper + heading
│   ├── Reveal.tsx               # Subtle scroll-in animation
│   └── ThemeToggle.tsx
├── data/
│   └── projects.json            # All project content
├── lib/
│   ├── projects.ts              # Typed access to projects.json
│   ├── github.ts                # GitHub feed + filter mapping
│   ├── skills.ts                # Skills grid content
│   └── site.ts                  # Name, links, nav, canonical URL
├── public/
│   ├── images/                  # Dashboard screenshots + the generated Bank Loan hero
│   ├── avatar.png               # Navbar/footer avatar (generated from img/favicon.png)
│   └── Md-Idris-Resume.pdf      # Generated resume
├── scripts/
│   ├── build-images.mjs         # Builds the dashboard images (GitHub + local + generated)
│   ├── build-brand-assets.mjs   # Builds the favicon, Apple icon and avatar
│   ├── graphics/
│   │   └── bank-loan-hero.mjs   # SVG source for the generated Bank Loan hero
│   └── generate-resume.mjs      # Builds the resume PDF
├── img/                         # Source images (not served)
└── README.md
```

---

## 10. Project Images

Every dashboard image is produced by one script, from either a GitHub repository
or the local `img/` folder:

```bash
npm run assets:images                # fills in anything missing
npm run assets:images -- --force     # rebuilds and overwrites everything
```

`scripts/build-images.mjs` fits each source inside a 16:9 canvas — padding instead
of cropping, so no KPI card or axis label is cut off — and writes it to
`public/images`. Two details matter for dark mode:

- The letterbox bars take the colour of the source image's own corner pixel, so a
  dark screenshot gets dark bars. **Any corner brighter than 55% luminance falls
  back to the site surface colour (`#111A2E`)**, which is what stops a white
  Plotly chart from getting a white frame around it.
- `crop` trims a light mockup backdrop off a local screenshot before it is scaled.
  `Bank_loan.png` ships on a light backdrop, so it is cropped to the dark panel.

The source mapping lives at the top of the script — update it if a repository is
renamed or an image is replaced. Files that are no longer in the mapping are
deleted from `public/images` on the next run.

| File | Source |
|---|---|
| `banglaledger-cover.jpg` | GitHub — `Dashboard_Img/Overview.jpg` |
| `banglaledger-1.jpg` | GitHub — `Dashboard_Img/Transactions.jpg` |
| `sales-performance-cover.jpg` | local — `img/Sales Performance img.png` |
| `sales-performance-1.png` | GitHub — `dashboard-sales-view.png` |
| `sales-performance-2.png` | GitHub — `dashboard-cross-filter-view.png` |
| `bank-loan-cover.png` | local — `img/Bank_loan.png` (cropped to the panel) |
| `bank-loan-hero.png` | generated — `scripts/graphics/bank-loan-hero.mjs` |
| `bank-loan-1.png` | GitHub — `Total Funded Amount by Home Ownership.png` |
| `bank-loan-2.png` | GitHub — `Total Funded Amount by Term.png` |
| `foodpanda-cover.jpg` | GitHub — `Dashboard_Img/Overview.jpg` |
| `foodpanda-1.jpg` | GitHub — `Dashboard_Img/User_Performance.jpg` |
| `foodpanda-2.jpg` | GitHub — `Dashboard_Img/City_Perfomance.jpg` |
| `foodpanda-3.jpg` | GitHub — `Dashboard_Img/Home.jpg` |

House rules for any replacement screenshot:

1. Check it for personal or sensitive information before it ships.
2. Keep it 16:9 so the cards and galleries never crop badly.
3. Prefer dark-background exports: a light chart cannot be blended into dark mode
   without misrepresenting its colours.
4. Update `image`, `gallery`, `imageAlt` and `galleryCaptions` in `data/projects.json`
   whenever a file name or the story it tells changes.
5. Meaningful `alt` text and captions on every image — the next/Image component
   handles the rest of the optimisation.

### Card thumbnail vs case-study hero

A project can carry a separate hero for its own page while the home page and the
projects index keep the plain card thumbnail:

| Field | Used by | Falls back to |
|---|---|---|
| `image` / `imageAlt` | `ProjectCard` (home + `/projects`), Open Graph tags | — |
| `heroImage` / `heroImageAlt` / `heroCaption` | the case study header figure | `image` / `imageAlt` |

Bank Loan is the only project that uses the split. Its repository has no
dark-background export, and its Plotly charts are all on a white template, so
`scripts/graphics/bank-loan-hero.mjs` draws a notebook preview instead — generic
pandas / Plotly Express calls beside a plot of something real (funded amount by
loan term: 273.0M at 36 months, 162.7M at 60 months). It is a stylised workflow
graphic, not a screenshot, and the caption says so.

---

## 11. Brand Assets

`img/favicon.png` (192×192) is the single source for the site's brand marks:

```bash
npm run assets:brand                # fills in anything missing
npm run assets:brand -- --force     # rebuilds and overwrites everything
```

| Output | Where it shows |
|---|---|
| `app/icon.png` | Browser tab icon — Next's file-based icon metadata emits the `<link rel="icon">` |
| `app/apple-icon.png` | iOS home-screen icon (`<link rel="apple-touch-icon">`) |
| `public/avatar.png` | Navbar and footer avatar |

`app/manifest.ts` points the web manifest at `icon.png` and `apple-icon.png`. The
PNGs are palette-quantised, which takes the photograph from ~76 KB to ~18 KB —
worth doing for a mark that mostly renders between 16px and 40px.

To swap the mark, replace `img/favicon.png` and re-run the script. Nothing is
upscaled: the script warns in the console if an output size exceeds the source.

> The tab icon is a photograph, so at 16px it reads as a small avatar rather than
> a symbol. If it looks muddy, either crop tighter to the face or switch
> `app/icon.svg` back to a monogram.

---

## 12. Deployment (Vercel)

1. Push the project to a GitHub repository.
2. Sign in to [vercel.com](https://vercel.com) with GitHub.
3. Click **Add New → Project** and import the repository.
4. Keep the default Next.js settings and click **Deploy**.
5. Every future `git push` to `main` redeploys automatically.
6. Optional: connect a custom domain under **Settings → Domains**.

---

## 13. SEO and Performance Checklist

- [x] Unique page `<title>` and meta description for every page
- [x] Open Graph image so links preview well on LinkedIn
- [x] `sitemap.xml` and `robots.txt`
- [ ] Lighthouse score of 90+ across all categories
- [x] Images optimized and lazy-loaded
- [x] Semantic HTML and accessible color contrast
- [x] Favicon and web manifest

---

## 14. Quality Checklist Before Launch

- [x] Every project has a cover image, insight, tools, and business impact
- [x] All GitHub links open the correct repository
- [x] Resume PDF downloads correctly
- [ ] Layout verified on mobile, tablet, and desktop
- [x] No spelling or grammar errors; all public text is professional English
- [x] Contact links tested
- [x] Inquiry form validates empty and malformed input and composes a filled email
- [ ] Site loads in under three seconds

---

## 15. Roadmap

- Add a short blog or "Insights" section for analytical write-ups
- Embed interactive Power BI reports via publish-to-web
- Add a testimonials or certifications section
- Add analytics (Vercel Analytics or Plausible)

---

## License

© Md Idris. All rights reserved. Project data and screenshots belong to their respective projects.
