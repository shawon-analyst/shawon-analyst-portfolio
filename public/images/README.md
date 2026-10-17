# Dashboard screenshots

These are the **real dashboards**, produced by `npm run assets:images` from the
GitHub repositories and the local `img/` folder. They are not generated placeholders.

```bash
npm run assets:images              # only builds what is missing
npm run assets:images -- --force   # rebuilds and overwrites everything
```

`scripts/build-images.mjs` holds the source mapping and does three things worth
knowing about:

- Fits every image inside a 16:9 canvas by **padding, not cropping**, so no KPI card
  or axis label is cut off.
- Colours the padding bars from the source image's own corner pixel, so a dark
  screenshot gets dark bars. Anything brighter than 55% luminance falls back to the
  site surface colour `#111A2E` — that is what keeps white Plotly charts from
  getting a white frame in dark mode.
- Deletes any file in this folder that is no longer in the mapping.

| File | Project | Source |
|---|---|---|
| `banglaledger-cover.jpg` | BanglaLedger | GitHub — `Dashboard_Img/Overview.jpg` |
| `banglaledger-1.jpg` | BanglaLedger (gallery) | GitHub — `Dashboard_Img/Transactions.jpg` |
| `sales-performance-cover.jpg` | Sales Performance | local — `img/Sales Performance img.png` |
| `sales-performance-1.png` | Sales Performance (gallery) | GitHub — `dashboard-sales-view.png` |
| `sales-performance-2.png` | Sales Performance (gallery) | GitHub — `dashboard-cross-filter-view.png` |
| `bank-loan-cover.png` | Bank Loan | local — `img/Bank_loan.png` (cropped to the dark panel) |
| `bank-loan-hero.png` | Bank Loan (case-study hero) | generated — `scripts/graphics/bank-loan-hero.mjs` |
| `bank-loan-1.png` | Bank Loan (gallery) | GitHub — `Total Funded Amount by Home Ownership.png` |
| `bank-loan-2.png` | Bank Loan (gallery) | GitHub — `Total Funded Amount by Term.png` |
| `foodpanda-cover.jpg` | FoodPanda | GitHub — `Dashboard_Img/Overview.jpg` |
| `foodpanda-1.jpg` | FoodPanda (gallery) | GitHub — `Dashboard_Img/User_Performance.jpg` |
| `foodpanda-2.jpg` | FoodPanda (gallery) | GitHub — `Dashboard_Img/City_Perfomance.jpg` |
| `foodpanda-3.jpg` | FoodPanda (gallery) | GitHub — `Dashboard_Img/Home.jpg` |

> FoodPanda is the one exception to rule 2 below. Three of its four exports are
> white-template Power BI pages and the repository has no dark equivalents, so
> they ship as they are rather than being recoloured — inverting or remapping a
> report's own palette would misstate what the dashboard looks like. The fourth
> (`foodpanda-3.jpg`, the Home page) is dark.

When a file changes:

1. Check the screenshot for personal or sensitive information.
2. Prefer dark-background exports — a light chart can't be blended into dark mode
   without misrepresenting its colours.
3. Update `image`, `gallery`, `imageAlt` and `galleryCaptions` in `data/projects.json`
   so the copy still matches what the reader can see.
