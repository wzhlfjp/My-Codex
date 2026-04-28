import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:mb-8 sm:px-7 sm:py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600">MD Anderson Cancer Data Portal</p>
          <h1 className="break-words text-2xl font-semibold tracking-tight text-[#1f3f70] sm:text-4xl">{title}</h1>
          <p className="max-w-5xl break-words text-sm leading-6 text-slate-600 sm:text-[15px]">{description}</p>
        </div>
        {actions}
      </div>
    </section>
  );
}
