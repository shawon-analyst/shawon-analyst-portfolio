import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/BrandIcons";

/** Email and location are shown as direct details beside the form, so the
 *  channel list only carries the networks that need explaining. */
const channels = [
  {
    label: "LinkedIn",
    value: "linkedin.com/in/shawonanalyst",
    href: site.linkedin,
    hint: "Connect, message me, or follow along with new work.",
    icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    value: `github.com/${site.githubHandle}`,
    href: site.github,
    hint: "Source notebooks, dashboards and every project in this portfolio.",
    icon: GitHubIcon,
  },
];

export default function ContactSection() {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      <div className="flex flex-col gap-5">
        <p className="text-[0.98rem] leading-relaxed text-muted">
          I&apos;m open to data analyst and BI analyst opportunities, and happy to talk through
          any of the case studies on this site. Send the form across, or reach me directly —
          email is the fastest way to get a reply.
        </p>

        <div className="card divide-y divide-line p-5">
          <a href={`mailto:${site.email}`} className="flex items-start gap-3.5 pb-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)]">
              <Mail className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="field-label">Email</span>
              <span className="mt-0.5 block truncate text-sm font-medium text-[var(--accent)]">
                {site.email}
              </span>
            </span>
            <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted" />
          </a>

          <div className="flex items-start gap-3.5 pt-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)]">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="field-label">Location</span>
              <span className="mt-0.5 block text-sm text-muted">
                {site.location} · open to remote and hybrid roles
              </span>
            </span>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-hover flex h-full items-start gap-3.5 p-4"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold">{channel.label}</span>
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-muted" />
                    </span>
                    <span className="mt-1 block truncate text-xs font-medium text-[var(--accent)]">
                      {channel.value}
                    </span>
                    <span className="mt-1.5 block text-xs leading-relaxed text-muted">
                      {channel.hint}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <ContactForm />
    </div>
  );
}
