import Link from "next/link";

export function EmptyStatePanel({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
      <h2 className="text-lg font-semibold text-[#1f3f70]">{title}</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
      {actionHref && actionLabel ? (
        <p className="mt-4 text-sm">
          <Link href={actionHref} className="font-medium text-blue-800 underline underline-offset-2 hover:text-blue-700">
            {actionLabel}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
