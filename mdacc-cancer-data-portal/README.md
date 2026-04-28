# MD Anderson Cancer Data Portal

A clean, modern research discovery portal for exploring **who is working on what**, **what data exists**, and **which technologies are being used** across cancer research activities.

This project is designed to help users such as external collaborators, internal investigators, clinicians, and research staff quickly answer questions like:

- Who at MD Anderson is working in breast cancer research?
- What datasets are being produced or used in this area?
- Which measurement technologies are involved?
- Where are the strongest collaboration opportunities?

The portal is intentionally designed to be **simple in infrastructure** and **high-value in navigation**:

- **Frontend:** Next.js + Tailwind CSS
- **Data source:** CSV files
- **Data pipeline:** CSV -> validated/normalized JSON
- **Primary user experience:** search, browse, filter, and cross-link among researchers, datasets, technologies, projects, and disease areas

---

## 1. Project purpose

The MD Anderson Cancer Data Portal is a **research discovery portal**, not just a static catalog.

Its purpose is to make research activity easier to understand and navigate by organizing information around a few core questions:

- **Who** is doing the work?
- **What** data is being generated or used?
- **Which** technologies and measurement platforms are involved?
- **Where** are the opportunities for collaboration?

The portal should feel:

- clean
- modern
- trustworthy
- comfortable to navigate
- academically serious without being visually heavy

---

## 2. Product principles

The product should follow these principles throughout design and implementation:

### Discovery first
Users should be able to discover relevant people, data resources, and technologies quickly.

### Simple infrastructure
The initial version should avoid unnecessary backend complexity. CSV files are acceptable for the MVP.

### Strong relationships
The portal should feel richly connected. Users should be able to move naturally among disease areas, researchers, datasets, technologies, and projects.

### Controlled vocabulary
Names for disease areas, technologies, data types, and units should be standardized so that filtering and browsing remain clean.

### Modern but restrained design
The interface should be contemporary and polished, but not flashy.

### Incremental growth
The MVP should stay small and stable, but the data model and code structure should support future expansion.

---

## 3. MVP scope

The first version should support the following user flow:

1. A user searches for a disease area such as **breast cancer**.
2. The portal returns relevant researchers, datasets, technologies, and related projects.
3. The user can apply filters and explore detail pages.
4. The user can move between connected entities easily.

### Included in MVP

- home page
- global search
- explore page
- researcher listing and detail pages
- dataset listing and detail pages
- technology listing and detail pages
- disease area listing and detail pages
- CSV validation and normalization pipeline
- client-friendly processed JSON for the frontend

### Not included in MVP

- authentication
- user accounts
- dataset upload workflows
- administrative dashboards
- AI assistant or chatbot
- complex analytics dashboards
- large-scale backend/database services

---

## 4. Core entities

The portal is built around five primary entity types:

- **Researchers**
- **Projects / Programs**
- **Datasets / Data resources**
- **Technologies / Measurement platforms**
- **Disease areas**

These entities are related through many-to-many connections stored in relationship CSV files.

---

## 5. Repository structure

```text
mdacc-cancer-data-portal/
├─ AGENTS.md
├─ README.md
├─ package.json
├─ tsconfig.json
├─ next.config.ts
├─ postcss.config.mjs
├─ eslint.config.mjs
├─ .gitignore
├─ .codex/
│  └─ config.toml
├─ docs/
│  ├─ PROJECT_BLUEPRINT.md
│  ├─ DATA_SCHEMA.md
│  ├─ SITE_MAP_PAGE_PLAN.md
│  ├─ UI_GUIDELINES.md
│  └─ DECISIONS.md
├─ data/
│  ├─ raw/
│  ├─ processed/
│  └─ sample/
├─ scripts/
│  ├─ csv_to_json.ts
│  ├─ validate_csv.ts
│  ├─ normalize_terms.ts
│  └─ build_search_index.ts
├─ public/
│  ├─ images/
│  ├─ icons/
│  └─ logos/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ lib/
│  ├─ types/
│  └─ content/
└─ tests/
```

### File placement guidance

- Keep **AGENTS.md** at the repository root.
- Keep planning and design documents in **docs/**.
- Keep maintained CSV files in **data/raw/**.
- Keep generated JSON files in **data/processed/**.
- Keep data transformation utilities in **scripts/**.

---

## 6. Data strategy

The initial data source is CSV.

### Why CSV for phase 1

- simple to manage
- easy to inspect manually
- low infrastructure overhead
- sufficient for early validation of the portal concept

### Important constraint

CSV should remain **structured and normalized**. Avoid a single giant spreadsheet. Use:

- core entity files
- relationship files
- stable IDs
- controlled vocabulary

### Recommended flow

1. Maintain source CSV files in `data/raw/`
2. Validate required columns, IDs, and controlled terms
3. Normalize terms where needed
4. Generate processed JSON into `data/processed/`
5. Use processed JSON in the frontend

---

## 7. Tech stack

### Frontend
- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Supporting logic
- lightweight TypeScript utilities for data loading, relation mapping, and search

### Testing
- unit tests for data utilities and transformation logic
- integration tests for key user flows when needed

This project should stay lightweight until the product direction is validated.

---

## 8. Design goals

The portal should provide a comfortable and modern browsing experience.

### Priorities
- strong search visibility
- clean layout
- generous spacing
- readable typography
- obvious navigation
- consistent cards and tags
- fast comprehension of relationships

### Avoid
- visual clutter
- overly dense tables
- too many charts
- excessive color usage
- long text-heavy pages without structure

See `docs/UI_GUIDELINES.md` for detailed visual and interaction guidance.

---

## 9. Primary routes

Planned top-level routes:

- `/`
- `/explore`
- `/dashboard`
- `/researchers`
- `/researchers/[id]`
- `/datasets`
- `/datasets/[id]`
- `/technologies`
- `/technologies/[id]`
- `/disease-areas`
- `/disease-areas/[id]`
- `/projects`
- `/projects/[id]`
- `/compare`
- `/about`
- `/status`

These routes support both direct lookup and exploratory navigation.

---

## 10. Development workflow

Recommended implementation order:

### Phase 0 — planning and setup
- finalize project documents
- scaffold the Next.js app
- define TypeScript types
- create sample CSV files

### Phase 1 — data foundation
- implement CSV validation
- implement CSV -> JSON processing
- load processed data into the app

### Phase 2 — core pages
- home page
- explore page
- listing pages
- entity detail pages

### Phase 3 — refinement
- improve filters
- improve search ranking
- improve empty states and loading states
- improve responsive behavior
- improve visual consistency

---

## 11. How Codex should be used

Codex should be used in a structured way:

- work from the documents in `docs/`
- follow the rules in `AGENTS.md`
- make small, reviewable changes
- preserve the clean architecture
- avoid introducing unnecessary dependencies
- prefer clarity over cleverness

When using Codex, tasks should be framed narrowly, for example:

- scaffold the base Next.js structure
- implement CSV validation for required columns
- build the researchers listing page
- build a reusable filter sidebar
- implement the disease area detail page

Avoid asking Codex to "build the whole portal" in one step.

---

## 12. Success criteria for the MVP

The MVP is successful if a user can:

- search a disease area such as breast cancer
- identify relevant researchers
- see associated datasets and technologies
- click through connected pages naturally
- understand the portal quickly without training

In other words, the portal should make collaboration discovery **faster, clearer, and more pleasant**.

---

## 13. Future directions

Possible future enhancements:

- better search ranking and synonym handling
- visual relationship maps
- administrative editing workflow
- authentication and permissions
- internal vs public data views
- API-backed data services
- AI-assisted discovery features

These should only be added after the MVP proves useful.

---

## 14. Related documents

- `docs/PROJECT_BLUEPRINT.md`
- `docs/DATA_SCHEMA.md`
- `docs/SITE_MAP_PAGE_PLAN.md`
- `docs/UI_GUIDELINES.md`
- `docs/DEPLOYMENT.md`
- `docs/DATA_REFRESH_RUNBOOK.md`
- `docs/CONTRIBUTING_DATA.md`
- `AGENTS.md`

---

## 15. Development commands

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Validate raw CSV inputs:

```bash
npm run data:validate
```

Rebuild processed JSON artifacts:

```bash
npm run data:build
```

Regenerate raw CSV header templates from the shared contract:

```bash
npm run data:templates
```

Run a lightweight contributor/operator preflight summary:

```bash
npm run data:preflight
```

Run the unified verification workflow:

```bash
npm run verify
```

Build for production:

```bash
npm run build
```

---

## 16. Deployment and data refresh handoff

For lightweight handoff/runbook guidance, use:

- `docs/DEPLOYMENT.md` for production build and metadata/deployment notes
- `docs/DATA_REFRESH_RUNBOOK.md` for source CSV update and regeneration workflow

---

## 17. Lightweight operational checklist

When source data changes:

1. Update CSV source-of-truth files in `data/raw/`.
2. Run `npm run data:validate`.
3. Run `npm run data:build`.
4. Run `npm run verify`.
5. Review `data/processed/build_metadata.json` for generated date and warnings.
6. Sanity-check key routes (`/`, `/explore`, list pages, and representative detail pages).

---

## 18. Contributor data-safety notes

Raw-data contract source of truth:

- `scripts/data_contract.ts`

Validation report output:

- `data/processed/validation_report.json`

Generated contributor templates:

- `data/templates/*.csv`
- `data/templates/raw_data_contract.json`

Recommended contributor flow for CSV updates:

1. Copy template headers from `data/templates/` (or run `npm run data:templates` first).
2. Update files in `data/raw/`.
3. Run `npm run data:validate`.
4. Review `data/processed/validation_report.json` for grouped errors/warnings.
5. Run `npm run data:preflight` for a quick health summary.
6. Run `npm run data:build`.
7. Run `npm run verify`.

---

## 19. Stakeholder demo quickstart

Suggested first-time demo flow:

1. Open `/` and use the Start Here cards.
2. Open one curated example discovery path into `/explore` or a list page.
3. Click into one detail page and follow related-entity links.
4. Open `/about` and `/status` for scope/stewardship and data-health context.
