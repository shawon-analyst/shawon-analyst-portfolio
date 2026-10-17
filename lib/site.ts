export const site = {
  name: "Md Idris",
  role: "Data Analyst",
  headline: "I turn messy data into dashboards people actually decide from.",
  valueStatement:
    "Data Analyst specializing in Power BI, Excel, SQL (PostgreSQL), and Python — building case-study-grade dashboards and actionable business solutions that drive data-backed decision-making.",
  description:
    "Portfolio of Md Idris, a Data Analyst specializing in Power BI, advanced Excel, SQL (PostgreSQL) and Python. Featured dashboards presented as case studies with insights, data models and business impact.",
  location: "Bangladesh",
  email: "idris.shawon@gmail.com",
  github: "https://github.com/shawon-analyst",
  githubHandle: "shawon-analyst",
  linkedin: "https://www.linkedin.com/in/shawonanalyst",
  resumePath: "/Md-Idris-Resume.pdf",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://shawon-analyst-portfolio.vercel.app",
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Work", href: "/work" },
  { label: "Skills", href: "/#skills" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export const socialLinks = [
  { label: "GitHub", href: site.github, icon: "github" },
  { label: "LinkedIn", href: site.linkedin, icon: "linkedin" },
  { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
] as const;
