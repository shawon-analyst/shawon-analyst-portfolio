import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/BrandIcons";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="no-print border-t border-line bg-[var(--surface)]">
      <div className="container-max grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold">
            <Image
              src="/avatar.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-line"
            />
            <span className="font-display text-[0.95rem]">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {site.role} turning messy data into dashboards people actually decide from.
          </p>
          <ul className="mt-5 flex items-center gap-3">
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-[var(--accent)]"
              >
                <GitHubIcon className="h-[18px] w-[18px]" />
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-[var(--accent)]"
              >
                <LinkedInIcon className="h-[18px] w-[18px]" />
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                aria-label="Email Md Idris"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-[var(--accent)]"
              >
                <Mail className="h-[18px] w-[18px]" />
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm font-semibold">Explore</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-[var(--accent)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-semibold">Get in touch</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="transition-colors hover:text-[var(--accent)]"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.resumePath}
                download
                className="transition-colors hover:text-[var(--accent)]"
              >
                Download resume (PDF)
              </a>
            </li>
            <li>{site.location}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-max flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p>
            Project data and screenshots belong to their respective projects. Built with Next.js,
            Tailwind CSS and the GitHub REST API.
          </p>
        </div>
      </div>
    </footer>
  );
}
