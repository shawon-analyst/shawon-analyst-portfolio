import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import SkillsGrid from "@/components/SkillsGrid";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import GitHubWork from "@/components/GitHubWork";
import Reveal from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { featuredRepoNames, projects } from "@/lib/projects";
import { getRepos } from "@/lib/github";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function HomePage() {
  const { repos, error } = await getRepos();
  const otherRepos = repos.filter((repo) => !featuredRepoNames.includes(repo.name.toLowerCase()));

  return (
    <>
      <Hero />

      <Section id="projects" muted>
        <SectionHeading
          eyebrow="Featured case studies"
          title="Four projects, four business questions answered"
          description="Each project is written up as a full case study: the data behind it, the modelling decisions, the findings, and the decisions the analysis supports."
          action={
            <Link href="/projects" className="btn btn-secondary">
              All projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.07} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="skills">
        <SectionHeading
          eyebrow="Skills & tools"
          title="The stack behind the dashboards"
          description="Grouped by what each tool is actually used for, from the visualisation layer to the data model underneath it."
        />
        <div className="mt-10">
          <SkillsGrid />
        </div>
      </Section>

      <Section id="about" muted>
        <SectionHeading
          eyebrow="About"
          title="A data analyst who ships, then explains"
          description="Short version: I like the part where the numbers finally agree — and the part where someone uses them."
        />
        <div className="mt-10">
          <AboutSection />
        </div>
      </Section>

      <Section id="work">
        <SectionHeading
          eyebrow="Explore more work"
          title="Everything else, straight from GitHub"
          description="Repositories that are not featured case studies yet, pulled live from GitHub and refreshed hourly. Filter by tool to narrow the list."
          action={
            <Link href="/work" className="btn btn-secondary">
              Open the full feed
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-10">
          <GitHubWork repos={otherRepos} error={error} limit={6} />
        </div>
      </Section>

      <Section id="contact" muted>
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk about data"
          description="Whether it is a role, a project or a question about one of these dashboards — I reply to every message."
        />
        <div className="mt-10">
          <ContactSection />
        </div>
        <p className="mt-8 text-sm text-muted">
          Prefer the one-page version?{" "}
          <a
            href={site.resumePath}
            download
            className="font-semibold text-[var(--accent)] underline decoration-dotted underline-offset-4"
          >
            Download my resume
          </a>
          .
        </p>
      </Section>
    </>
  );
}
