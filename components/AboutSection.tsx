import { CheckCircle2 } from "lucide-react";

const strengths = [
  "End-to-end delivery: raw extract → cleaning and modelling → a dashboard people actually use.",
  "Comfortable across the stack recruiters ask for: Power BI, Excel, PostgreSQL and Python.",
  "Writes up every project as a case study, so the thinking is as visible as the visuals.",
];

export default function AboutSection() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
      <div className="flex flex-col gap-5 text-[0.98rem] leading-relaxed text-muted">
        <p>
          I&apos;m a Data Analyst based in Bangladesh. I work the full path from messy source
          data to a decision-ready dashboard: profiling and cleaning the extract, modelling it so it
          stays fast and consistent, then designing the report around the question someone is
          actually trying to answer.
        </p>
        <p>
          My recent work spans a Power BI financial transaction dashboard built on a star schema with
          DAX-driven KPIs, an interactive Excel sales dashboard covering more than a billion in sales,
          and an exploratory lending analysis in Python with Pandas and Plotly Express. Each one is
          documented as a case study with the data, the approach, the findings and the business
          impact.
        </p>
        <p>
          I care about the details that make analysis trustworthy — consistent definitions, tabular
          figures that line up, sensible drill-downs, and numbers that reconcile.
        </p>
      </div>

      <div className="card h-fit p-6">
        <h3 className="text-lg">What I&apos;m looking for</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          A data analyst or BI analyst role where reporting for a real business function is
          mine to own — with the room to grow toward data modelling and analytics engineering.
        </p>
        <ul className="mt-5 flex flex-col gap-3">
          {strengths.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
          <div>
            <p className="font-display text-base text-[var(--foreground)]">Open to</p>
            <p className="mt-1 text-muted">Data analyst &amp; BI analyst roles</p>
          </div>
          <div>
            <p className="font-display text-base text-[var(--foreground)]">Focus areas</p>
            <p className="mt-1 text-muted">BI reporting · Data modelling · EDA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
