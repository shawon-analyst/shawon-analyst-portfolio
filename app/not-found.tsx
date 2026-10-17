import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-max flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-[var(--surface)] text-[var(--accent)]">
        <FileQuestion aria-hidden="true" className="h-7 w-7" />
      </span>
      <p className="eyebrow mt-6">Error 404</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">This page is not in the dataset</h1>
      <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted">
        The page you were looking for has moved or never existed. Try the projects list, or head back
        to the home page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <Link href="/projects" className="btn btn-secondary">
          View projects
        </Link>
      </div>
    </div>
  );
}
