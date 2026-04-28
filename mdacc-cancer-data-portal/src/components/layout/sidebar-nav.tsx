"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";

function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavIcon({ icon }: { icon: NavItem["icon"] }) {
  const classes = "h-4 w-4";

  if (icon === "home") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3v-10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "explore") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
        <path d="m14 10-6 6 8-4 4-8-6 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
        <path d="M4 20V10m6 10V5m6 15v-7m4 7V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "researchers") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 19c.9-2.7 3-4 6.5-4s5.6 1.3 6.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 18.5c.6-1.7 1.8-2.5 3.7-2.5 1.2 0 2.2.3 3 .9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "projects") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
        <rect x="3" y="4" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="4" width="8" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="10" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="13" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (icon === "datasets") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 6v4c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 10v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (icon === "technologies") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
        <path d="M8 3v6M16 3v6M4 9h16M7 14h.01M12 14h.01M17 14h.01M7 18h.01M12 18h.01M17 18h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "disease-areas") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
        <path d="M12 21s7-4.5 7-10a4 4 0 0 0-7-2.5A4 4 0 0 0 5 11c0 5.5 7 10 7 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "compare") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
        <path d="M7 4h4v16H7zM13 8h4v12h-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "status") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
        <rect x="5" y="4" width="14" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 8h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m9 14 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={classes} aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4l2.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SidebarLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      key={item.href}
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-white font-semibold text-blue-900 shadow-sm ring-1 ring-blue-100"
          : "font-medium text-slate-600 hover:bg-white hover:text-slate-900",
      ].join(" ")}
    >
      <span
        className={[
          "absolute inset-y-2 left-0 w-1 rounded-r-md",
          active ? "bg-blue-500" : "bg-transparent group-hover:bg-slate-300",
        ].join(" ")}
        aria-hidden="true"
      />
      <span className="ml-1 text-inherit">
        <NavIcon icon={item.icon} />
      </span>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function SidebarNavDesktop() {
  const pathname = usePathname();
  const primary = NAV_ITEMS.filter((item) => item.group === "primary");
  const secondary = NAV_ITEMS.filter((item) => item.group === "secondary");

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-1">
        <Link href="/" className="block rounded-xl px-2 py-1.5 hover:bg-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-500">MD Anderson</p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Cancer Data Portal</p>
          <p className="mt-1 text-xs text-slate-500">Discovery Workspace</p>
        </Link>
      </div>

      <nav aria-label="Primary" className="space-y-1">
        {primary.map((item) => (
          <SidebarLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-slate-200 pt-4">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Stewardship</p>
        <nav aria-label="Secondary" className="space-y-1">
          {secondary.map((item) => (
            <SidebarLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
      </div>
    </div>
  );
}

export function SidebarNavMobile() {
  const pathname = usePathname();
  const items = NAV_ITEMS;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">MD Anderson Cancer Data Portal</p>
          <p className="truncate text-xs text-slate-500">Discovery Workspace</p>
        </Link>
      </div>
      <nav aria-label="Primary" className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                active
                  ? "border-blue-200 bg-blue-50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-600",
              ].join(" ")}
            >
              <NavIcon icon={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
