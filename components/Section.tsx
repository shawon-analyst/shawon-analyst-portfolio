import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={`max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
        {eyebrow ? (
          <p className="eyebrow mb-3">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
            />
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl leading-tight sm:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-4 text-[0.98rem] leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
  muted = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-16 sm:py-20 ${muted ? "bg-[var(--surface)]" : ""} ${className ?? ""}`}
    >
      <div className="container-max">{children}</div>
    </section>
  );
}
