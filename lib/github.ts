import { site } from "@/lib/site";

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
};

export type RepoFeed = {
  repos: Repo[];
  error: string | null;
};

const REPOS_ENDPOINT = `https://api.github.com/users/${site.githubHandle}/repos?sort=updated&per_page=100`;

/**
 * Repositories that are deliberately kept out of the live feed:
 * the profile README repo and the image-hosting repo.
 */
const HIDDEN_REPOS = new Set(["shawon-analyst", "img"]);

/**
 * Live repository feed for the "Explore More Work" section.
 * Revalidates hourly to stay well inside the GitHub API rate limit.
 */
export async function getRepos(): Promise<RepoFeed> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(REPOS_ENDPOINT, {
      headers,
      next: { revalidate: 3600, tags: ["github-repos"] },
    });

    if (!response.ok) {
      return {
        repos: [],
        error:
          response.status === 403 || response.status === 429
            ? "GitHub is rate-limiting the repository feed right now. Please check back shortly."
            : `GitHub returned an unexpected response (${response.status}).`,
      };
    }

    const payload = (await response.json()) as Repo[];

    if (!Array.isArray(payload)) {
      return { repos: [], error: "GitHub returned an unexpected payload." };
    }

    return {
      repos: payload.filter(
        (repo) =>
          !repo.fork && !repo.archived && !HIDDEN_REPOS.has(repo.name.toLowerCase()),
      ),
      error: null,
    };
  } catch {
    return {
      repos: [],
      error: "Could not reach the GitHub API. The live feed will return on the next refresh.",
    };
  }
}

/**
 * Topic keywords that map a repository to one of the filter chips.
 *
 * This is the fallback path. Most of these repositories carry no description,
 * no topics and often no detected language, so there is nothing for a keyword
 * to match against — which is exactly why they appeared under "All" but never
 * under their own tool. `REPO_CATEGORIES` below is the primary mechanism.
 */
export const repoFilters = [
  { label: "All", match: null },
  { label: "Power BI", match: ["power-bi", "powerbi", "power bi", "dax", "powerquery", "power query", "pbi"] },
  { label: "Excel", match: ["excel", "spreadsheet", "xlsx", "sumifs", "pivot table"] },
  { label: "SQL", match: ["sql", "postgres", "postgresql", "mysql", "sqlite", "database"] },
  { label: "Python", match: ["python", "pandas", "numpy", "plotly", "jupyter", "ipynb", "notebook", "eda"] },
] as const;

export type RepoFilterLabel = (typeof repoFilters)[number]["label"];

/**
 * Explicit tool categories per repository, keyed by the lower-cased repo name.
 *
 * A repository can legitimately sit in more than one category. The entries
 * below are verified against each repository's file tree, not guessed from the
 * name:
 *
 *   Hospital-ER-Performance-Dashboard  — Excel workbook, no BI file
 *   HR-Attrition-Analysis              — ships Dashboard.pbix
 *   Pizza-Sales-Performance-Analysis   — ships Pizza_Sales_Report.pbix
 *   Smart-Data-Management-System       — Streamlit app over a SQLite database
 *   superstore-dashboard               — Python dashboard over an .xls extract
 *
 * A repository that is not listed here falls back to keyword matching, so
 * adding GitHub topics to a repository still works without editing this file.
 */
const REPO_CATEGORIES: Record<string, readonly RepoFilterLabel[]> = {
  // Excel
  "excel-interactive-sales-dashboard": ["Excel"],
  "sales-performance-dashboard-excel": ["Excel"],
  "hospital-er-performance-dashboard": ["Excel"],

  // Power BI
  "banglaledger-financial-transaction-analytics-dashboard": ["Power BI"],
  "foodpanda-sales-customer-analytics-dashboard": ["Power BI"],
  "e-commerce-sales-dashboard": ["Power BI"],
  "hr-analytics-dashboard": ["Power BI"],
  "hr-attrition-analysis": ["Power BI"],
  "pizza-sales-performance-analysis": ["Power BI"],
  "amazon-sales-fashion-analytics-dashboard": ["Power BI"],
  "ecodrive-motors-powerbi-dashboard": ["Power BI"],

  // Python
  "bank-loan-data-analysis": ["Python"],
  "diwali-sales-analysis": ["Python"],
  "ipl-2022-data-analysis": ["Python"],
  "superstore-dashboard": ["Python"],

  // Python + SQL
  "smart-data-management-system": ["Python", "SQL"],
};

export function repoMatchesFilter(repo: Repo, label: RepoFilterLabel): boolean {
  if (label === "All") return true;

  const declared = REPO_CATEGORIES[repo.name.toLowerCase()];
  if (declared) return declared.includes(label);

  const filter = repoFilters.find((entry) => entry.label === label);
  if (!filter?.match) return false;

  const haystack = [repo.name, repo.description ?? "", repo.language ?? "", ...(repo.topics ?? [])]
    .join(" ")
    .toLowerCase();

  return filter.match.some((keyword) => haystack.includes(keyword));
}
