import projectsData from "@/data/projects.json";

export type GalleryItem = {
  src: string;
  caption: string;
};

export type ProjectData = {
  slug: string;
  name: string;
  shortName: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  /**
   * Optional case-study hero. Falls back to `image`, which stays the card
   * thumbnail used on the home page and the projects index.
   */
  heroImage?: string;
  heroImageAlt?: string;
  heroCaption?: string;
  gallery: string[];
  galleryCaptions: string[];
  role: string;
  projectType: string;
  tools: string[];
  insight: string;
  impact: string;
  overview: string;
  data: {
    source: string;
    volume: string;
    structure: string;
  };
  approach: string[];
  insights: string[];
  businessImpact: string[];
  github: string;
  demo?: string;
};

export const projects: ProjectData[] = projectsData as ProjectData[];

/** Repositories that already appear as featured case studies. */
export const featuredRepoNames: string[] = projects
  .map((project) => repositoryName(project.github))
  .filter((name): name is string => Boolean(name));

/** Pull the repository name out of a GitHub URL. */
export function repositoryName(url: string): string | null {
  if (!url) return null;
  try {
    const { pathname } = new URL(url);
    const segment = pathname.split("/").filter(Boolean).pop();
    return segment ? segment.toLowerCase() : null;
  } catch {
    return null;
  }
}

export function getProject(slug: string): ProjectData | undefined {
  return projects.find((project) => project.slug === slug);
}

/** The image at the top of a case study, with its alt text and caption. */
export function heroImage(project: ProjectData): {
  src: string;
  alt: string;
  caption: string;
} {
  return {
    src: project.heroImage ?? project.image,
    alt: project.heroImageAlt ?? project.imageAlt,
    caption: project.heroCaption ?? `${project.shortName} — main dashboard view.`,
  };
}

export function galleryItems(project: ProjectData): GalleryItem[] {
  return project.gallery.map((src, index) => ({
    src,
    caption: project.galleryCaptions?.[index] ?? project.shortName,
  }));
}

export function projectNeighbours(slug: string): {
  previous: ProjectData | null;
  next: ProjectData | null;
} {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: projects[(index - 1 + projects.length) % projects.length] ?? null,
    next: projects[(index + 1) % projects.length] ?? null,
  };
}
