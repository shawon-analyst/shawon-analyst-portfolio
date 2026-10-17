import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/Section";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every featured data analytics case study from Md Idris — Power BI dashboards, Excel reporting, and Python exploratory analysis with the data, approach and business impact documented.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Md Idris",
    description:
      "Featured data analytics case studies: Power BI dashboards, interactive Excel reporting and Python analysis.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
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
          eyebrow="Case studies"
          title="Featured projects"
          description="Four end-to-end projects, each documented with the problem, the data, the modelling approach, the findings and the business impact."
        />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.07} className="h-full">
            {/* The grid is two-up at lg, so both cards of the first row sit above
                the fold and should load eagerly. */}
            <ProjectCard project={project} eager={index < 2} />
          </Reveal>
        ))}
      </div>

      <div className="card mt-12 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg">Looking for the rest of my work?</h2>
          <p className="mt-1.5 text-sm text-muted">
            The live GitHub feed lists every other repository, refreshed hourly.
          </p>
        </div>
        <Link href="/work" className="btn btn-primary shrink-0">
          Explore more work
        </Link>
      </div>
    </div>
  );
}
