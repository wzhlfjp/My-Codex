export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Researchers", href: "/researchers" },
  { label: "Projects", href: "/projects" },
  { label: "Datasets", href: "/datasets" },
  { label: "Technologies", href: "/technologies" },
  { label: "Disease Areas", href: "/disease-areas" },
  { label: "About", href: "/about" },
];
