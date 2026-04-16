# AGENTS.md

## Project

This repository contains the **MD Anderson Cancer Data Portal**, a lightweight, modern web portal for discovering:

- researchers,
- projects/programs,
- datasets/data resources,
- technologies/measurement platforms,
- and disease areas.

The portal’s main job is to help users answer questions like:

> Who at MD Anderson works in breast cancer, what data do they generate or use, and what technologies are involved?

The portal must feel:

- simple,
- clean,
- modern,
- and comfortable to navigate.

---

## Product priorities

When making implementation decisions, prioritize in this order:

1. **Clarity of navigation**
2. **Search and filtering usefulness**
3. **Consistency of data display**
4. **Simple maintainable architecture**
5. **Visual polish**
6. **Advanced features**

Do not add complexity unless it clearly improves the main discovery workflow.

---

## Scope guidance

### In scope for MVP
- Home page
- Explore/search page
- Researchers list/detail pages
- Datasets list/detail pages
- Technologies list/detail pages
- Disease areas list/detail pages
- CSV-based data pipeline
- Client-side filtering/search for MVP-size data

### Out of scope unless explicitly requested
- authentication,
- permissions,
- CMS/editor UI,
- AI chatbot,
- analytics dashboards,
- enterprise integrations,
- complex graph/network visualization,
- backend database migration.

---

## Tech preferences

Preferred stack unless instructed otherwise:

- **Next.js** for frontend app structure
- **TypeScript**
- **Tailwind CSS** for styling
- **CSV -> JSON** preprocessing pipeline
- Static/local data loading for MVP

If starting from scratch, prefer a structure that is simple for a single developer and easy for Codex to modify.

---

## Repository structure

Preferred structure:

```text
/data
  researchers.csv
  projects.csv
  datasets.csv
  technologies.csv
  disease_areas.csv
  researcher_disease_areas.csv
  researcher_technologies.csv
  researcher_datasets.csv
  project_researchers.csv
  project_datasets.csv
  project_disease_areas.csv
  dataset_technologies.csv
  dataset_disease_areas.csv

/scripts
  csv_to_json.*
  validate_data.*

/src
  /app or /pages
  /components
  /lib
  /styles
  /types

/docs
  PROJECT_BLUEPRINT.md
  DATA_SCHEMA.md
  SITE_MAP_PAGE_PLAN.md
```

Keep the repo tidy. Avoid scattering logic across many folders unnecessarily.

---

## Data rules

### Core requirement
The portal uses normalized CSV files with stable IDs.

### Important rules
- Never replace stable IDs casually.
- Prefer relationship tables over comma-separated lists in a single CSV cell.
- Use controlled vocabulary for disease areas, dataset types, and technology categories.
- Validate foreign keys before using data in the frontend.
- Keep parsing and normalization logic centralized.

### If you modify data handling
Also update:
- validation logic,
- types/interfaces,
- and any transformation utilities.

---

## UI and UX rules

### Overall style
The UI should feel like **scholarly data with consumer-grade navigation**.

### Required characteristics
- spacious layout,
- restrained color palette,
- clear typography,
- strong visual hierarchy,
- highly scannable cards/lists,
- consistent tags/badges,
- clean empty states,
- obvious interactive elements.

### Avoid
- cluttered dashboards,
- dense academic-looking tables everywhere,
- too many colors,
- excessive animations,
- overuse of icons,
- fancy UI patterns that reduce clarity.

### Page behavior
Every detail page should prominently show:
- summary information,
- related entities,
- and clear next-click opportunities.

---

## Coding style

### General
- Write readable, maintainable code.
- Prefer small composable components.
- Avoid premature abstraction.
- Use descriptive names.
- Keep data transformation code separate from presentation code.

### TypeScript
- Use explicit types/interfaces for all entity records.
- Prefer safe handling of optional fields.
- Avoid `any` unless absolutely necessary.

### Components
- Build reusable components for cards, tags, filters, and related-item panels.
- Keep page-level files focused on layout and orchestration.

### Styling
- Use Tailwind utility classes consistently.
- Prefer a clean neutral palette with one restrained accent color.
- Prioritize whitespace and rhythm over visual density.

---

## Search and filtering behavior

For MVP, search and filtering should be straightforward and predictable.

### Expectations
- Search should support keyword matching across major fields.
- Filters should be transparent and easy to reset.
- Active filters should always be visible.
- Results should clearly label the entity type.

Do not implement overly clever ranking unless explicitly requested.

---

## Accessibility and responsiveness

Minimum expectations:
- semantic HTML,
- accessible form labels,
- keyboard-friendly interactions,
- sufficient color contrast,
- responsive layout for laptop and tablet sizes.

Mobile support should be reasonable, but desktop/laptop discovery is the priority.

---

## When asked to implement new features

Follow this workflow:

1. Understand the user-facing goal
2. Check whether the request fits MVP scope
3. Propose a small implementation plan if the task is non-trivial
4. Reuse existing data structures/components where possible
5. Keep changes localized and maintainable
6. Mention any schema or content assumptions clearly

---

## When asked to generate UI

Prefer:
- a clean search-first homepage,
- structured detail pages,
- relationship panels,
- filterable list pages,
- polished but restrained styling.

Do not default to flashy marketing pages or generic admin dashboards.

---

## Done criteria

A task is considered done when:

- the feature works,
- the code is readable,
- the implementation matches the project’s design principles,
- no unnecessary complexity was introduced,
- and the result improves the portal’s discovery experience.

---

## First tasks Codex should support well

- scaffold the app
- define TypeScript entity types
- parse and validate CSV files
- convert CSV to JSON
- build navigation and layout shell
- implement Explore page with filters
- implement list/detail pages for core entities
- refine visual design for simplicity and comfort

---

## Instruction for ambiguous choices

If there are multiple reasonable solutions, choose the one that is:

- simpler,
- clearer,
- easier to maintain,
- and more consistent with a modern research discovery portal.

When in doubt, optimize for **clarity over cleverness**.
