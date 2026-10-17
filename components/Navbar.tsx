"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Download, Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import ThemeToggle from "@/components/ThemeToggle";

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return pathname === "/";
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`no-print sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-[var(--background)]/80 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        className="container-max flex h-[var(--nav-height)] items-center justify-between gap-4"
        aria-label="Main"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/avatar.png"
            alt=""
            width={36}
            height={36}
            loading="eager"
            className="h-9 w-9 rounded-full object-cover ring-1 ring-line"
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-[0.95rem]">{site.name}</span>
            <span className="text-[0.7rem] font-medium text-muted">{site.role}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(pathname, link.href)
                  ? "text-[var(--foreground)]"
                  : "text-muted hover:text-[var(--foreground)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={site.resumePath}
            download
            className="btn btn-secondary hidden lg:inline-flex"
            aria-label="Download resume as PDF"
          >
            <Download className="h-4 w-4" />
            Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-[var(--surface-2)] text-muted lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-line bg-[var(--background)]/95 backdrop-blur-xl lg:hidden"
        >
          <div className="container-max flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive(pathname, link.href)
                    ? "bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--foreground)]"
                    : "text-muted hover:bg-[color-mix(in_oklab,var(--foreground)_5%,transparent)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a href={site.resumePath} download className="btn btn-primary mt-2 self-start">
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
