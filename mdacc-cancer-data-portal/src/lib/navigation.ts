export type NavItem = {
  label: string;
  href: string;
  icon:
    | "home"
    | "explore"
    | "dashboard"
    | "researchers"
    | "projects"
    | "datasets"
    | "technologies"
    | "disease-areas"
    | "compare"
    | "status"
    | "about";
  group: "primary" | "secondary";
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: "home", group: "primary" },
  { label: "Explore", href: "/explore", icon: "explore", group: "primary" },
  { label: "Dashboard", href: "/dashboard", icon: "dashboard", group: "primary" },
  { label: "Researchers", href: "/researchers", icon: "researchers", group: "primary" },
  { label: "Projects", href: "/projects", icon: "projects", group: "primary" },
  { label: "Datasets", href: "/datasets", icon: "datasets", group: "primary" },
  { label: "Technologies", href: "/technologies", icon: "technologies", group: "primary" },
  { label: "Disease Areas", href: "/disease-areas", icon: "disease-areas", group: "primary" },
  { label: "Portal Status", href: "/status", icon: "status", group: "secondary" },
  { label: "About", href: "/about", icon: "about", group: "secondary" },
];
