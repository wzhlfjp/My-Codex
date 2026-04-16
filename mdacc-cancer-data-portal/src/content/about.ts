export const ABOUT_PAGE_CONTENT = {
  title: "About The Portal",
  intro:
    "The MD Anderson Cancer Data Portal is a discovery and collaboration-support tool that helps users find relevant researchers, projects, datasets, technologies, and disease areas.",
  sections: [
    {
      heading: "Purpose",
      points: [
        "Support discovery of research expertise and data capabilities across connected cancer research entities.",
        "Help users move from a disease question to relevant people, projects, datasets, and methods with minimal friction.",
      ],
    },
    {
      heading: "Who It Helps",
      points: [
        "External collaborators exploring potential partnerships.",
        "Internal MD Anderson teams looking for related expertise, resources, or measurement approaches.",
        "Program and strategy users seeking a clearer cross-entity discovery view.",
      ],
    },
    {
      heading: "What You Can Discover",
      points: [
        "Researcher profiles with linked disease areas, datasets, and technologies.",
        "Projects and programs with linked researchers, datasets, and disease contexts.",
        "Datasets and data resources with high-level metadata and connected entities.",
        "Technologies and measurement platforms connected to datasets and disease areas.",
        "Disease-area entry points for disease-first exploration.",
      ],
    },
    {
      heading: "Current Data Scope",
      points: [
        "Current content is based on local CSV seed data transformed into processed JSON.",
        "Coverage is partial and evolving; this is not a complete institutional inventory.",
        "Records are intended to support discovery and orientation, not definitive institutional reporting.",
      ],
    },
    {
      heading: "How Data Is Organized",
      points: [
        "Core entity tables (researchers, datasets, technologies, disease areas, projects) use stable IDs.",
        "Relationship tables connect entities for cross-navigation (for example researcher-to-disease-area and dataset-to-technology).",
        "Terminology and categories are being standardized to improve filtering consistency over time.",
      ],
    },
    {
      heading: "Update And Stewardship Notes",
      points: [
        "Data quality and schema checks are performed through local validation and CSV-to-JSON processing scripts.",
        "As the portal matures, data coverage, consistency, and relationship completeness will continue to improve.",
      ],
    },
    {
      heading: "Suggested First-Use Workflow",
      points: [
        "Start on Home and use a guided Start Here pathway or a curated example link.",
        "Use Explore for mixed-entity discovery, then refine with shareable URL filters.",
        "Open list pages when you want entity-specific browsing (researchers, datasets, technologies, disease areas, projects).",
        "Use detail pages and related-entity sections to move through collaboration context step by step.",
      ],
    },
    {
      heading: "Where To Go Next",
      points: [
        "Explore: mixed search and filtering across entity types.",
        "Entity lists: focused browse surfaces for each entity category.",
        "Portal Status: current build and validation health snapshot.",
      ],
    },
    {
      heading: "Important Limitations",
      points: [
        "Use this portal as a starting point for discovery and follow-up, not as a final source of record.",
        "Absence of a record does not necessarily mean absence of activity.",
        "Some metadata fields may be sparse while curation and normalization continue.",
      ],
    },
  ],
};
