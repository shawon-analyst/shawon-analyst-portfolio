import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/Section";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Download or read the resume of Md Idris, Data Analyst specializing in Power BI, advanced Excel, SQL (PostgreSQL) and Python.",
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Resume | Md Idris",
    description:
      "Resume of Md Idris, Data Analyst — Power BI, Excel, SQL (PostgreSQL) and Python.",
    url: "/resume",
  },
};

const highlights = [
  { label: "Role", value: site.role },
  { label: "Specialisms", value: "Power BI · Excel · SQL (PostgreSQL) · Python" },
  { label: "Featured work", value: `${projects.length} documented case studies` },
  { label: "Location", value: `${site.location} · open to remote` },
];

export default function ResumePage() {
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
          eyebrow="Resume"
          title={`Md Idris — ${site.role}`}
          description="Read it inline below, or download the PDF to share with a hiring team. The featured case studies on this site go deeper than the one-page version."
          action={
            <div className="flex flex-wrap gap-3">
              <a href={site.resumePath} download className="btn btn-primary">
                <Download className="h-4 w-4" />
                Download PDF
              </a>
              <a
                href={site.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <ExternalLink className="h-4 w-4" />
                Open in new tab
              </a>
            </div>
          }
        />
      </div>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <div key={item.label} className="card p-5">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {item.label}
            </dt>
            <dd className="mt-2 text-sm font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="card mt-8 overflow-hidden p-2 sm:p-3">
        <object
          data={`${site.resumePath}#view=FitH`}
          type="application/pdf"
          className="h-[72vh] min-h-[520px] w-full rounded-xl bg-[var(--surface-2)]"
          aria-label="Embedded PDF resume for Md Idris"
        >
          <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
            <p className="text-sm text-muted">
              Your browser cannot display the embedded PDF. You can still download it below.
            </p>
            <a href={site.resumePath} download className="btn btn-primary">
              <Download className="h-4 w-4" />
              Download Resume (PDF)
            </a>
          </div>
        </object>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Tip: replace{" "}
        <code className="rounded bg-[var(--surface)] px-1.5 py-0.5">public/Md-Idris-Resume.pdf</code>{" "}
        with your latest export and the embedded viewer and every download link update automatically.
      </p>
    </div>
  );
}
