"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Search, Menu, X, LogIn, User, BarChart3, LogOut, Trophy } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SearchDialog } from "@/components/search/search-dialog";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/curriculum", label: "Curriculum", testId: "nav-curriculum" },
  { href: "/prompt-lab", label: "Prompt Lab", testId: "nav-prompt-lab" },
  { href: "/cheatsheet", label: "Cheatsheet", testId: "nav-cheatsheet" },
  { href: "/templates", label: "Templates", testId: "nav-templates" },
  { href: "/leaderboard", label: "Leaderboard", testId: "nav-leaderboard" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = user?.user_metadata?.full_name?.[0]
    ?? user?.user_metadata?.name?.[0]
    ?? user?.email?.[0]
    ?? "U";

  const avatarUrl = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;

  return (
    <header
      data-testid="site-header"
      className={cn(
        "sticky top-0 z-50 w-full",
        "border-b border-border bg-background/80 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" data-testid="site-logo" className="flex items-center gap-2 shrink-0">
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
              data-testid={link.testId}
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

          {/* Auth section */}
          {!loading && (
            <>
              {user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    data-testid="auth-user-menu"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden",
                      "border border-border bg-surface text-muted",
                      "hover:text-foreground hover:border-border-accent",
                      "transition-colors duration-200"
                    )}
                    aria-label="User menu"
                  >
                    {avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        data-testid="auth-user-avatar"
                      />
                    ) : (
                      <span className="text-sm font-medium uppercase" data-testid="auth-user-initial">
                        {userInitial}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div
                      data-testid="auth-user-dropdown"
                      className={cn(
                        "absolute right-0 mt-2 w-48 rounded-lg",
                        "border border-border bg-surface shadow-lg",
                        "py-1 z-50"
                      )}
                    >
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.user_metadata?.full_name ?? user.user_metadata?.name ?? "User"}
                        </p>
                        <p className="text-xs text-muted truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        data-testid="auth-menu-profile"
                        onClick={() => setUserMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm text-muted",
                          "hover:text-foreground hover:bg-surface-2 transition-colors"
                        )}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        href="/progress"
                        data-testid="auth-menu-progress"
                        onClick={() => setUserMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm text-muted",
                          "hover:text-foreground hover:bg-surface-2 transition-colors"
                        )}
                      >
                        <BarChart3 className="h-4 w-4" />
                        Progress
                      </Link>
                      <Link
                        href="/leaderboard"
                        data-testid="auth-menu-leaderboard"
                        onClick={() => setUserMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm text-muted",
                          "hover:text-foreground hover:bg-surface-2 transition-colors"
                        )}
                      >
                        <Trophy className="h-4 w-4" />
                        Leaderboard
                      </Link>
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          data-testid="auth-signout-btn"
                          onClick={async () => {
                            setUserMenuOpen(false);
                            await signOut();
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 px-3 py-2 text-sm text-red",
                            "hover:bg-red/10 transition-colors"
                          )}
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  data-testid="auth-login-btn"
                  className={cn(
                    "hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg text-sm font-medium",
                    "border border-accent/30 bg-accent/10 text-accent",
                    "hover:bg-accent/20 hover:border-accent/50",
                    "transition-colors duration-200"
                  )}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
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
            {!loading && !user && (
              <Link
                href="/auth/login"
                data-testid="auth-login-btn-mobile"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium",
                  "text-accent hover:bg-accent/10",
                  "transition-colors duration-200"
                )}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
