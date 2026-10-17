export type Skill = {
  name: string;
  /** Two-character monogram, shown as a small logo-style badge. */
  mono?: string;
  /** Badge colour. Omitted for skills that have no product identity. */
  color?: string;
};

export type SkillGroup = {
  title: string;
  icon: "chart" | "database" | "code";
  summary: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "BI & Visualization",
    icon: "chart",
    summary: "Building reports that answer the question on the first screen.",
    skills: [
      { name: "Power BI", mono: "Pb", color: "#EAB900" },
      { name: "DAX measures", mono: "Dx", color: "#C9A000" },
      { name: "Power Query", mono: "PQ", color: "#2E9C5C" },
      { name: "Advanced Excel dashboards", mono: "Xl", color: "#217346" },
      { name: "Plotly Express", mono: "Pl", color: "#6366F1" },
      { name: "KPI & trend design" },
    ],
  },
  {
    title: "Databases & ETL",
    icon: "database",
    summary: "Modelling and automating data so it stays fast, consistent and reusable.",
    skills: [
      { name: "PostgreSQL", mono: "Pg", color: "#3E7BA8" },
      { name: "SQL", mono: "SQ", color: "#E38C00" },
      { name: "Star-schema data modeling" },
      { name: "Data cleaning & ETL" },
      { name: "n8n Automation", mono: "n8", color: "#EA4B71" },
      { name: "Data validation" },
      { name: "Slicers & parameters" },
    ],
  },
  {
    title: "Programming & Analytics",
    icon: "code",
    summary: "Exploratory analysis that turns raw tables into findings.",
    skills: [
      { name: "Python", mono: "Py", color: "#3776AB" },
      { name: "Pandas", mono: "Pd", color: "#7C6BD6" },
      { name: "Jupyter Notebook", mono: "Jn", color: "#DA5B0B" },
      { name: "Exploratory data analysis" },
      { name: "Grouping & aggregation" },
      { name: "Insight write-ups" },
    ],
  },
];
