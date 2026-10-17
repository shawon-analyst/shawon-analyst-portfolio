import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/BrandIcons";

const stats = [
  { value: "1B+", label: "in sales analysed" },
  { value: String(projects.length), label: "featured case studies" },
  { value: "8", label: "transaction types modelled" },
];

export default function Hero() {
  const hero = projects[0];

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="sky-fade pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <div
        aria-hidden="true"
        className="surface-grid pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.35] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />

      <div className="container-max relative grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="animate-in-up">
          <p className="eyebrow mb-5">
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]" />
            {site.role} · {site.location}
          </p>

          <h1 className="text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            {site.name}
          </h1>

          <p className="mt-5 max-w-xl text-lg font-medium leading-snug text-[var(--foreground)] sm:text-xl">
            {site.headline}
          </p>

          <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted">
            {site.valueStatement}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="btn btn-primary">
              View Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={site.resumePath} download className="btn btn-secondary">
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-[var(--foreground)]"
            >
              <GitHubIcon className="h-4 w-4" />
              {site.githubHandle}
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-[var(--foreground)]"
            >
              <LinkedInIcon className="h-4 w-4" />
              shawonanalyst
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              {site.location}
            </span>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="tabular block font-display text-2xl text-gradient sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-muted">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-in-up relative [animation-delay:120ms]">
          <div className="absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-[color-mix(in_oklab,var(--accent)_22%,transparent)] to-[color-mix(in_oklab,var(--accent-2)_16%,transparent)] blur-2xl" />
          <figure className="card overflow-hidden shadow-[0_30px_60px_-40px_rgba(3,10,26,0.7)]">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 truncate text-xs font-medium text-muted">
                {hero.shortName} · Power BI
              </span>
            </div>
            <div className="relative aspect-video">
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-line px-5 py-4 text-xs leading-relaxed text-muted">
              {hero.insight}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
