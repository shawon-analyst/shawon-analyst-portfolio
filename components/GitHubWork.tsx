"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { repoFilters, repoMatchesFilter, type Repo } from "@/lib/github";
import RepoCard from "@/components/RepoCard";

export default function GitHubWork({
  repos,
  error,
  limit,
  showFilters = true,
}: {
  repos: Repo[];
  error: string | null;
  limit?: number;
  showFilters?: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const visible = useMemo(() => {
    const active = repoFilters.find((filter) => filter.label === activeFilter)?.label ?? "All";
    const filtered = repos.filter((repo) => repoMatchesFilter(repo, active));
    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  }, [repos, activeFilter, limit]);

  return (
    <div className="flex flex-col gap-6">
      {showFilters ? (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter repositories by tool">
          {repoFilters.map((filter) => {
            const isActive = filter.label === activeFilter;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => setActiveFilter(filter.label)}
                aria-pressed={isActive}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "border-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white"
                    : "border-line text-muted hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--line))] hover:text-[var(--foreground)]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {error ? (
        <p className="flex items-start gap-2.5 rounded-xl border border-line bg-[var(--surface-2)] p-4 text-sm text-muted">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-2)]" />
          {error}
        </p>
      ) : null}

      {visible.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
          {repos.length === 0
            ? "No public repositories to show yet. In the meantime, every featured case study has its own write-up."
            : `No repositories tagged with ${activeFilter} yet. Try another filter, or select All.`}
        </p>
      )}
    </div>
  );
}
