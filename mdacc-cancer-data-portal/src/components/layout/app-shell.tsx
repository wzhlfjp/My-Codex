import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { SidebarNavDesktop, SidebarNavMobile } from "@/components/layout/sidebar-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-[var(--sidebar-bg)] lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto px-5 py-6">
            <SidebarNavDesktop />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-[var(--sidebar-bg)] lg:hidden">
            <div className="px-4 py-3 sm:px-6">
              <SidebarNavMobile />
            </div>
          </header>

          <main className="flex-1 px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
            <PageContainer>{children}</PageContainer>
          </main>

          <div className="px-3 pb-4 sm:px-4 sm:pb-6 lg:px-8 lg:pb-8">
            <PageContainer>
              <SiteFooter />
            </PageContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
