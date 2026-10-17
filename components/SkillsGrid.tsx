import type { ComponentType } from "react";
import { Code2, Database } from "lucide-react";
import Reveal from "@/components/Reveal";
import { ColumnsIcon } from "@/components/BrandIcons";
import { skillGroups, type SkillGroup } from "@/lib/skills";

const icons: Record<SkillGroup["icon"], ComponentType<{ className?: string }>> = {
  chart: ColumnsIcon,
  database: Database,
  code: Code2,
};

/**
 * Grouped skills grid. Skills with a product identity get a coloured monogram
 * badge; the rest render as plain chips so the grid stays readable.
 *
 * Hover motion is pure CSS and lives in globals.css (`.skill-card` lifts the
 * card with an accent glow, `.chip-interactive` scales and tints the pills), so
 * this stays a server component.
 */
export default function SkillsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {skillGroups.map((group, index) => {
        const Icon = icons[group.icon];
        return (
          <Reveal key={group.title} delay={index * 0.06} className="h-full">
            <article className="card skill-card h-full p-6">
              <div className="flex items-center gap-3">
                <span className="skill-icon grid h-11 w-11 place-items-center rounded-xl border border-line bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent)]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg">{group.title}</h3>
              </div>

              <p className="mt-4 text-sm text-muted">{group.summary}</p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="chip chip-interactive gap-2 pr-3">
                    {skill.mono ? (
                      <span
                        aria-hidden="true"
                        className="chip-mono grid h-5 w-5 shrink-0 place-items-center rounded-[6px] text-[9px] font-bold text-white"
                        style={{ backgroundColor: skill.color }}
                      >
                        {skill.mono}
                      </span>
                    ) : null}
                    {skill.name}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
