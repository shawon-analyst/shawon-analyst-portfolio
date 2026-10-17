import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Lightbulb, Target } from "lucide-react";
import type { ProjectData } from "@/lib/projects";
import TagChip from "@/components/TagChip";
import { GitHubIcon } from "@/components/BrandIcons";

/**
 * Featured project card. Order follows the portfolio spec exactly:
 * name → image → one-line insight → tools → business impact → actions.
 *
 * `eager` marks the above-the-fold cards on the projects index so the first row
 * can be the Largest Contentful Paint without an "add loading=eager" warning.
 */
export default function ProjectCard({
  project,
  eager = false,
}: {
  project: ProjectData;
  eager?: boolean;
}) {
  return (
    <article className="card card-hover flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-1 px-6 pt-6">
        <h3 className="font-display text-xl leading-snug">
          <Link href={`/projects/${project.slug}`} className="hover:text-[var(--accent)]">
            {project.shortName}
          </Link>
        </h3>
        <p className="text-sm text-muted">{project.subtitle}</p>
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="group relative mx-6 mt-5 block overflow-hidden rounded-xl border border-line"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative aspect-video">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 px-6 pt-5">
        <p className="flex gap-2.5 text-sm leading-relaxed text-[var(--foreground)]">
          <Lightbulb aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-2)]" />
          <span>
            <span className="font-semibold">Insight: </span>
            {project.insight}
          </span>
        </p>

        <ul className="flex flex-wrap gap-2" aria-label="Tools used">
          {project.tools.map((tool) => (
            <li key={tool}>
              <TagChip>{tool}</TagChip>
            </li>
          ))}
        </ul>

        <p className="flex gap-2.5 text-sm leading-relaxed text-muted">
          <Target aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
          <span>
            <span className="font-semibold text-[var(--foreground)]">Impact: </span>
            {project.impact}
          </span>
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-line px-6 py-5">
        <Link href={`/projects/${project.slug}`} className="btn btn-primary">
          View Case Study
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          <GitHubIcon className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </article>
  );
}
