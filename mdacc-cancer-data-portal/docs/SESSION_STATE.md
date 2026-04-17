# SESSION_STATE

Last updated: 2026-04-16

## Current Status
- Portal is in MVP+ phase with local CSV -> processed JSON pipeline, contract-backed validation, and generated build/validation artifacts.
- Core entity support is implemented end-to-end for Researchers, Projects, Datasets, Technologies, and Disease Areas.
- Main discovery surfaces are implemented and connected: Home, Explore, list pages, detail pages, About, and Status.
- About/transparency patterns are implemented: data-scope callouts, build-info summary, and links to operational status.
- Shared UI patterns are established: browse toolbar, entity list cards, metadata chips, empty-state panel, related-entity panel, breadcrumbs, detail quick-nav, and validation summary patterns.
- Detail-page depth/navigation pass is implemented across all entity detail routes with section quick-nav, enriched metadata, related-section summaries, and browse-all pathways into list pages.
- Lightweight share/export capability is implemented across Explore, all entity list pages, and entity detail pages.
- Lightweight compare/shortlist workflow is implemented for all core entity types (Researchers, Datasets, Projects, Technologies, Disease Areas) with tray, shareable compare URL, compare page, and JSON export.
- Lightweight explainable recommendation layer is implemented on researcher/dataset/project detail pages with clear "why suggested" signals and browse-more links.
- Synonym-aware keyword matching is implemented for Explore and list browsing (acronym/terminology variants such as MRI and proteomics) with shared token-group scoring helpers.
- Deployment-readiness pass is implemented with metadataBase/canonical/OG defaults, sitemap, robots, verify script, CI verify workflow, and handoff runbooks.

## Active Routes
- `/`
- `/explore`
- `/about`
- `/status`
- `/compare`
- `/researchers`
- `/researchers/[id]`
- `/projects`
- `/projects/[id]`
- `/datasets`
- `/datasets/[id]`
- `/technologies`
- `/technologies/[id]`
- `/disease-areas`
- `/disease-areas/[id]`

## Data & Discovery Integration
- Processed data loaders include projects and relationship-aware detail loading across all core entities.
- Current raw-data snapshot has no project rows (`projects.csv` and project relationship CSVs are empty), and project surfaces rely on established sparse/empty-state handling.
- Explore includes projects in mixed results and entity type filtering.
- Related-entity panels surface project relationships where available.
- Sparse project coverage is handled with calm empty states and transparency copy.
- Project status/type/date display is normalized through shared formatting helpers used in project list/detail and Explore shaping.
- URL-driven list/explore states are shareable and exportable (CSV/JSON), and detail pages support copy-link + JSON export.
- Compare state supports one type at a time (researcher/dataset/project/technology/disease-area), with capped selection and shareable compare URLs.
- Recommendation helpers use deterministic overlap signals (shared disease areas/technologies/datasets/projects/researchers and project-type context) with short explainable reason text.
- Public route metadata is standardized via shared helpers for titles, descriptions, canonical paths, and share metadata.

## Testing & Validation
- Vitest suite is in place with focused helper and pipeline integration coverage.
- Positive and negative end-to-end pipeline integration tests are implemented.
- Helper-level coverage includes data contract, validation report shaping, data-health/preflight summaries, browse helpers, explore helpers, compare helpers, export helpers, metadata helpers, onboarding helpers, and recommendations.
- Latest verified run (2026-04-16) passed end-to-end via `npm run verify`.
- Latest test snapshot (2026-04-16): 21 test files passed, 62 tests passed.
- Latest validation warning snapshot (2026-04-16): project source CSV files currently contain no rows.
- Current checks pass:
- `npm run test`
- `npm run lint`
- `npm run build`
- `npm run verify`

## Recent UI Fix
- Fixed dark-button text color behavior so active/primary dark buttons keep white text on Home/Explore/nav states.
- Updated base font stack to prefer Mona Sans -> Regolapro -> Segoe UI/Tahoma/Geneva/Verdana/sans-serif.

## Recent Search Refinement
- Added shared search token helpers (`src/lib/search.ts`) for normalized keyword tokenization, synonym expansion, grouped token matching, and grouped relevance scoring.
- List browse pages now support synonym/acronym-aware keyword matching through `src/lib/list-browse.ts`.
- Explore ranking now uses grouped token scoring with the same synonym-aware matching behavior for consistency.

## Environment Note
- In this workspace, Vitest may fail under sandbox with `spawn EPERM`; rerunning test/verify with escalated execution resolves it.
