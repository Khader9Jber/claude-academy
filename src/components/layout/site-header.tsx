"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/prompt-lab", label: "Prompt Lab" },
  { href: "/cheatsheet", label: "Cheatsheet" },
  { href: "/templates", label: "Templates" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "border-b border-border bg-background/80 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-serif text-xl italic text-accent">
            Claude Academy
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium",
                "text-muted hover:text-foreground hover:bg-surface-2",
                "transition-colors duration-200"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <button
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              "border border-border bg-surface text-muted",
              "hover:text-foreground hover:border-border-accent",
              "transition-colors duration-200"
            )}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg md:hidden",
              "border border-border bg-surface text-muted",
              "hover:text-foreground hover:border-border-accent",
              "transition-colors duration-200"
            )}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2.5 rounded-lg text-sm font-medium",
                  "text-muted hover:text-foreground hover:bg-surface-2",
                  "transition-colors duration-200"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
