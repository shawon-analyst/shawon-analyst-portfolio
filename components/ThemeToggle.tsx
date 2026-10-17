"use client";

import { Moon, Sun } from "lucide-react";

/**
 * Stateless theme toggle.
 *
 * The active theme lives as a `dark` class on <html>, applied before first
 * paint by the bootstrap script in the root layout. That means the icon can be
 * switched purely with CSS (`dark:` variants), so there is no effect, no
 * hydration mismatch and no flash of the wrong theme.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      window.localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable — the toggle still applies to this page view */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-[var(--surface-2)] text-muted transition-colors hover:text-[var(--foreground)] ${className ?? ""}`}
    >
      <Moon aria-hidden="true" className="h-[18px] w-[18px] dark:hidden" />
      <Sun aria-hidden="true" className="hidden h-[18px] w-[18px] dark:block" />
    </button>
  );
}
