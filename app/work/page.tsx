import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GitHubWork from "@/components/GitHubWork";
import { SectionHeading } from "@/components/Section";
import { featuredRepoNames } from "@/lib/projects";
import { getRepos } from "@/lib/github";
import { site } from "@/lib/site";
import { GitHubIcon } from "@/components/BrandIcons";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Explore More Work",
  description:
    "A live feed of every public repository from Md Idris — Power BI dashboards, Excel reporting, SQL and Python analytics — pulled from GitHub and refreshed hourly.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Explore More Work | Md Idris",
    description:
      "Live GitHub feed of data analytics repositories: Power BI, Excel, SQL and Python projects.",
    url: "/work",
  },
};

export default async function WorkPage() {
  const { repos, error } = await getRepos();
  const otherRepos = repos.filter((repo) => !featuredRepoNames.includes(repo.name.toLowerCase()));

  return (
    <div className="container-max py-14 sm:py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mt-8">
        <SectionHeading
          eyebrow="Live from GitHub"
          title="Explore more work"
          description={
            <>
              Everything outside the featured case studies, fetched directly from{" "}
              <span className="font-medium text-[var(--foreground)]">github.com/{site.githubHandle}</span>{" "}
              and refreshed every hour. Forks and the featured projects are filtered out, so what
              you see here is the rest of the body of work.
            </>
          }
          action={
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <GitHubIcon className="h-4 w-4" />
              Follow on GitHub
            </a>
          }
        />
      </div>

      <p className="mt-8 text-sm text-muted">
        <span className="tabular font-semibold text-[var(--foreground)]">{otherRepos.length}</span>{" "}
        {otherRepos.length === 1 ? "repository" : "repositories"} found
        {otherRepos.length > 0 ? " · filter by tool below" : ""}
      </p>

      <div className="mt-6">
        <GitHubWork repos={otherRepos} error={error} />
      </div>

      <div className="card mt-12 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg">Prefer the curated version?</h2>
          <p className="mt-1.5 text-sm text-muted">
            The featured case studies cover the problem, the data model and the business impact.
          </p>
        </div>
        <Link href="/projects" className="btn btn-primary shrink-0">
          View case studies
        </Link>
      </div>
    </div>
  );
}
