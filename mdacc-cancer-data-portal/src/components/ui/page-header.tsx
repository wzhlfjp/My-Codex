import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 sm:mb-8 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <h1 className="break-words text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
          <p className="max-w-3xl break-words text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {actions}
      </div>
    </section>
  );
}
