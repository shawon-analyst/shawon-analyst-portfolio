import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Database,
  Download,
  Lightbulb,
  Layers,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import TagChip from "@/components/TagChip";
import { GitHubIcon } from "@/components/BrandIcons";
import { galleryItems, getProject, heroImage, projectNeighbours, projects } from "@/lib/projects";
import { site } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Case study not found" };
  }

  const title = `${project.shortName} case study`;
  const description = `${project.insight} ${project.impact}`;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${title} | ${site.name}`,
      description,
      url: `/projects/${project.slug}`,
      images: [
        {
          url: project.image,
          width: 1920,
          height: 1080,
          alt: project.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [project.image],
    },
  };
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const gallery = galleryItems(project);
  const hero = heroImage(project);
  const { previous, next } = projectNeighbours(project.slug);

  return (
    <article className="pb-20">
      <header className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="sky-fade pointer-events-none absolute inset-x-0 top-0 h-64" />
        <div className="container-max relative py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-[var(--foreground)]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/projects" className="transition-colors hover:text-[var(--foreground)]">
              Projects
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--foreground)]">{project.shortName}</span>
          </nav>

          <p className="eyebrow mt-8">{project.projectType}</p>
          <h1 className="mt-4 max-w-4xl text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
            {project.name}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-muted">
            {project.insight}
          </p>

          <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
            <MetaRow label="Role" value={project.role} />
            <MetaRow label="Project type" value={project.projectType} />
            <MetaRow
              label="Links"
              value={
                <span className="flex flex-wrap gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline"
                  >
                    <GitHubIcon className="h-3.5 w-3.5" />
                    Repository
                  </a>
                  {project.demo ? (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Live demo
                    </a>
                  ) : null}
                </span>
              }
            />
          </dl>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Tools</p>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="Tools used in this project">
            {project.tools.map((tool) => (
              <li key={tool}>
                <TagChip tone="accent">{tool}</TagChip>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="container-max">
        <figure className="card mt-10 overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
          <figcaption className="border-t border-line px-5 py-3.5 text-xs leading-relaxed text-muted">
            {hero.caption}
          </figcaption>
        </figure>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
          <div className="flex flex-col gap-14">
            <section aria-labelledby="overview">
              <h2 id="overview" className="text-2xl">
                Overview
              </h2>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-muted">{project.overview}</p>
            </section>

            <section aria-labelledby="data">
              <h2 id="data" className="text-2xl">
                Data
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Source", value: project.data.source, icon: Database },
                  { label: "Size", value: project.data.volume, icon: Layers },
                  { label: "Structure", value: project.data.structure, icon: Layers },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Reveal key={`${item.label}-${index}`} delay={index * 0.05}>
                      <div className="card h-full p-5">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                          <Icon aria-hidden="true" className="h-3.5 w-3.5 text-[var(--accent)]" />
                          {item.label}
                        </span>
                        <p className="mt-3 text-sm leading-relaxed text-muted">{item.value}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="approach">
              <h2 id="approach" className="text-2xl">
                Approach
              </h2>
              <ol className="mt-5 flex flex-col gap-4">
                {project.approach.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="tabular grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-[var(--surface)] text-xs font-semibold text-[var(--accent)]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-[0.95rem] leading-relaxed text-muted">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="insights">
              <h2 id="insights" className="text-2xl">
                Key insights
              </h2>
              <ul className="mt-5 grid gap-4">
                {project.insights.map((insight, index) => (
                  <Reveal key={insight} as="li" delay={index * 0.05}>
                    <span className="card flex h-full gap-3 p-5">
                      <Lightbulb
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-2)]"
                      />
                      <span className="text-[0.95rem] leading-relaxed text-muted">{insight}</span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </section>

            <section aria-labelledby="impact">
              <h2 id="impact" className="text-2xl">
                Business impact
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {project.businessImpact.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted">
                    <TrendingUp
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {gallery.length > 0 ? (
              <section aria-labelledby="gallery">
                <h2 id="gallery" className="text-2xl">
                  Dashboard gallery
                </h2>
                <div className="mt-5 grid gap-6">
                  {gallery.map((item, index) => (
                    <Reveal key={item.src} delay={index * 0.05}>
                      <figure className="card overflow-hidden">
                        <div className="relative aspect-video">
                          <Image
                            src={item.src}
                            alt={`${project.shortName} — ${item.caption}`}
                            fill
                            sizes="(max-width: 1200px) 100vw, 900px"
                            className="object-cover"
                          />
                        </div>
                        <figcaption className="border-t border-line px-5 py-3.5 text-xs leading-relaxed text-muted">
                          {item.caption}
                        </figcaption>
                      </figure>
                    </Reveal>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:h-fit">
            <div className="card p-6">
              <h2 className="flex items-center gap-2 text-base">
                <Wrench aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                Tools & skills
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <li key={tool} className="chip">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h2 className="flex items-center gap-2 text-base">
                <Target aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                Links
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary w-full"
                >
                  <GitHubIcon className="h-4 w-4" />
                  View on GitHub
                </a>
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary w-full"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    Live demo
                  </a>
                ) : null}
                <a href={site.resumePath} download className="btn btn-secondary w-full">
                  <Download className="h-4 w-4" />
                  Download resume
                </a>
              </div>
            </div>
          </aside>
        </div>

        <nav
          aria-label="Other case studies"
          className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
        >
          {previous ? (
            <Link
              href={`/projects/${previous.slug}`}
              className="card card-hover flex items-center gap-3 p-5"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4 text-muted" />
              <span>
                <span className="block text-xs uppercase tracking-[0.12em] text-muted">Previous</span>
                <span className="mt-1 block font-display text-sm font-semibold">
                  {previous.shortName}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="card card-hover flex items-center justify-end gap-3 p-5 text-right sm:col-start-2"
            >
              <span>
                <span className="block text-xs uppercase tracking-[0.12em] text-muted">Next</span>
                <span className="mt-1 block font-display text-sm font-semibold">{next.shortName}</span>
              </span>
              <ArrowRight aria-hidden="true" className="h-4 w-4 text-muted" />
            </Link>
          ) : null}
        </nav>
      </div>
    </article>
  );
}
