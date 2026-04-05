"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Bell,
  Settings,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    testId: "admin-nav-dashboard",
  },
  {
    href: "/admin/content",
    label: "Content",
    icon: FileText,
    testId: "admin-nav-content",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    testId: "admin-nav-users",
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    testId: "admin-nav-analytics",
  },
  {
    href: "/admin/announcements",
    label: "Announcements",
    icon: Bell,
    testId: "admin-nav-announcements",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    testId: "admin-nav-settings",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const navContent = (
    <>
      {/* Brand / title */}
      <div className="mb-6 px-3">
        <h2 className="text-lg font-semibold text-foreground">Admin</h2>
        <p className="text-xs text-muted">Claude Academy</p>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={item.testId}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                "transition-colors duration-200",
                active
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted hover:text-foreground hover:bg-surface-2 border border-transparent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Back to site */}
      <div className="border-t border-border pt-4 mt-4">
        <Link
          href="/"
          data-testid="admin-nav-back"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
            "text-muted hover:text-foreground hover:bg-surface-2",
            "transition-colors duration-200"
          )}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span>Back to Site</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        data-testid="admin-sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        className={cn(
          "fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg lg:hidden",
          "border border-border bg-surface text-muted",
          "hover:text-foreground hover:border-border-accent",
          "transition-colors duration-200"
        )}
        aria-label="Toggle admin sidebar"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          data-testid="admin-sidebar-overlay"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        data-testid="admin-sidebar-mobile"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col",
          "border-r border-border bg-surface p-4",
          "transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mt-14 flex flex-col h-full">{navContent}</div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        data-testid="admin-sidebar"
        className={cn(
          "hidden lg:flex w-64 shrink-0 flex-col",
          "border-r border-border bg-surface p-4 h-full"
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
