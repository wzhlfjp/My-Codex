import Link from "next/link";
import { NAV_ITEMS } from "@/lib/navigation";
import { TopNav } from "@/components/layout/top-nav";
import { PageContainer } from "@/components/layout/page-container";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <PageContainer>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            MD Anderson Cancer Data Portal
          </Link>
          <TopNav items={NAV_ITEMS} />
        </div>
      </PageContainer>
    </header>
  );
}
