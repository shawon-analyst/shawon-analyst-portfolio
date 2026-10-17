import { ArrowUpRight, Calendar, Star } from "lucide-react";
import type { Repo } from "@/lib/github";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const languageColors: Record<string, string> = {
  Python: "#3776AB",
  "Jupyter Notebook": "#DA5B0B",
  "T-SQL": "#e38c00",
  SQL: "#e38c00",
  PLpgSQL: "#336790",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  R: "#198CE7",
};

export default function RepoCard({ repo }: { repo: Repo }) {
  const updated = dateFormatter.format(new Date(repo.updated_at));
  const topics = (repo.topics ?? []).slice(0, 4);

  return (
    <article className="card card-hover flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base leading-snug">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)]"
          >
            {repo.name.replace(/[-_]/g, " ")}
          </a>
        </h3>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${repo.name} on GitHub`}
          className="text-muted transition-colors hover:text-[var(--accent)]"
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {repo.description ?? "No description yet — this repository is still being documented."}
      </p>

      {topics.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <li key={topic} className="chip">
              {topic}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        {repo.language ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: languageColors[repo.language] ?? "var(--accent)" }}
            />
            {repo.language}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1.5">
          <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
          <span className="tabular">Updated {updated}</span>
        </span>
        {repo.stargazers_count > 0 ? (
          <span className="inline-flex items-center gap-1.5">
            <Star aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="tabular">{repo.stargazers_count}</span>
          </span>
        ) : null}
      </div>
    </article>
  );
}
