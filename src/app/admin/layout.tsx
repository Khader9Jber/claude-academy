"use client";

import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Admin header */}
          <header
            data-testid="admin-header"
            className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/80 px-6 backdrop-blur-xl lg:px-8"
          >
            {/* Left spacer for mobile hamburger */}
            <div className="w-10 lg:hidden" />
            <h1 className="text-lg font-semibold text-foreground">
              Admin Dashboard
            </h1>
          </header>

          {/* Page content */}
          <div className="flex-1 p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}
