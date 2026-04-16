# MD Anderson Cancer Data Portal — Project Blueprint

## 1. Project overview

The **MD Anderson Cancer Data Portal** is a simple, modern web portal that helps researchers discover:

- who is working in a given cancer area,
- what kinds of data are being produced or used,
- what measurement technologies are involved,
- and where collaboration opportunities may exist.

A representative use case is:

> A breast cancer researcher wants to collaborate with MD Anderson. They visit the portal to find relevant investigators, the types of data those groups generate, and the technologies or platforms those groups use.

The portal should feel:

- **simple** — clear navigation, limited clutter, obvious page structure,
- **clean** — strong typography, whitespace, restrained color palette,
- **modern** — responsive layout, polished cards/tables, smooth filtering,
- **comfortable** — users can browse without feeling lost or overloaded.

For the first version, the data source can be **CSV files** rather than a database.

---

## 2. Core product goal

The portal’s main job is:

> Help researchers discover people, projects, datasets, technologies, and disease areas relevant to a scientific question, and navigate naturally among them.

The portal is therefore a combination of:

- an **expert directory**,
- a **data catalog**,
- a **technology map**,
- and a **collaboration discovery interface**.

---

## 3. Primary users

### External collaborators
Researchers outside MD Anderson who want to identify possible collaborators, relevant programs, and data capabilities.

### Internal researchers
Faculty, staff, trainees, and program leaders who want to discover related work across departments or disease areas.

### Administrative / strategic users
Leaders or support staff who want a structured view of research activity, data resources, and technology usage.

---

## 4. Key user questions

The portal should help users answer questions such as:

- Who at MD Anderson works on **breast cancer**?
- Which groups produce **imaging**, **genomics**, **single-cell**, or **clinical** data?
- What technologies are used for a given disease area?
- Which datasets are associated with a specific lab, project, or platform?
- Which researchers appear to be relevant collaboration candidates for a given scientific topic?

---

## 5. MVP definition

The first release should be intentionally small.

### MVP capabilities

A user should be able to:

- search by disease area, researcher name, technology, or keyword,
- browse key entities,
- filter results,
- open detail pages,
- follow links between related entities,
- and understand the landscape for a disease area quickly.

### MVP entity types

The portal should support five main entity types:

1. **Researchers**
2. **Projects / Programs**
3. **Datasets / Data Resources**
4. **Technologies / Measurement Platforms**
5. **Disease Areas**

### Explicitly out of scope for MVP

Do **not** build these initially unless there is a strong reason:

- login / authentication,
- fine-grained permissions,
- upload workflows,
- live data editing,
- AI chat assistant,
- advanced analytics dashboards,
- automated integration with multiple enterprise systems,
- complex network visualizations.

---

## 6. Product principles

### Principle 1 — Discovery first
The product should prioritize helping users find relevant people and resources quickly.

### Principle 2 — Relationships matter
The portal should feel connected. Users should be able to move easily between disease areas, researchers, datasets, and technologies.

### Principle 3 — Simple underneath, polished on top
The backend can remain lightweight (CSV-driven), but the user experience should feel modern and professional.

### Principle 4 — Standardized data is more important than fancy UI
A clean and controlled data model is essential. Poorly standardized content will damage usability more than limited features.

### Principle 5 — Build for extension
Even with CSVs, the structure should anticipate future growth into richer data management, search, or analytics.

---

## 7. Functional requirements

### Search and browse
- Global search across major entity types
- Browse by disease area
- Browse by researcher
- Browse by technology
- Browse by dataset/resource

### Filtering
- Disease area
- Data type
- Technology
- Department / center / program
- Research modality (e.g., clinical, imaging, omics, pathology)

### Detail pages
Each entity should have its own detail page with linked related entities.

### Cross-navigation
Users should be able to move between pages in intuitive ways, for example:

- breast cancer → researchers
- researcher → datasets
- dataset → technologies
- technology → disease areas
- project → participating researchers

### Metadata display
The portal should make it easy to scan:

- short descriptions,
- tags,
- affiliations,
- disease areas,
- data types,
- technologies,
- collaboration relevance.

---

## 8. Non-functional requirements

### Usability
- Low cognitive load
- Clear page hierarchy
- Strong search placement
- Consistent filter behavior
- Smooth browsing experience

### Visual design
- Minimalist but professional
- Spacious layout
- Limited accent colors
- Consistent cards/tables/tags
- Mobile-friendly layout where feasible

### Performance
- Fast page loads
- Lightweight data pipeline
- Efficient client-side filtering for MVP-size data

### Maintainability
- Human-editable CSVs
- Clear documentation
- Stable IDs across files
- Easy validation and build steps

---

## 9. Technical approach for v1

### Recommended stack
- **Frontend:** React-based framework (preferably Next.js)
- **Styling:** Tailwind CSS
- **Data source:** CSV files stored in a `data/` folder
- **Data pipeline:** small script to validate and convert CSV to JSON
- **Search/filter:** client-side for MVP
- **Deployment:** static or serverless-friendly deployment

### Why this is a good fit
This approach keeps the project:

- easy to prototype,
- easy for Codex to work on,
- easy to maintain,
- and flexible enough for later expansion.

---

## 10. Information architecture summary

The product should behave like a lightweight research knowledge graph, even if the data is stored in CSV files.

Users should feel that the site is organized around connected research entities rather than isolated pages.

### Example navigation path
- User searches **breast cancer**
- Opens disease area page
- Sees associated researchers, datasets, and technologies
- Clicks a researcher profile
- Views related projects and platforms
- Clicks a dataset or technology detail page
- Continues exploring related work

---

## 11. Risks and attention points

### 1. Scope creep
The biggest risk is trying to build too much at once. Keep the first version narrow and useful.

### 2. Inconsistent terminology
Disease names, technology names, and data types must use controlled vocabulary.

### 3. Weak search or filtering
If users cannot quickly narrow results, the portal will not feel useful.

### 4. Overly dense UI
A portal with too many panels, metrics, or charts will feel academic but uncomfortable.

### 5. No content maintenance plan
Someone must own the quality and updating of the CSV content.

---

## 12. Recommended phased roadmap

### Phase 0 — Planning and definition
Deliverables:
- project blueprint,
- site map,
- data schema,
- design guidelines,
- `AGENTS.md` for Codex.

### Phase 1 — MVP implementation
Deliverables:
- home page,
- explore/search page,
- researcher detail page,
- dataset detail page,
- technology detail page,
- disease area page,
- CSV-to-JSON pipeline.

### Phase 2 — UX refinement
Deliverables:
- improved ranking and filters,
- empty states and error states,
- stronger responsive design,
- better visual polish,
- content QA tools.

### Phase 3 — Advanced extensions
Possible additions:
- admin editing workflows,
- richer search,
- internal/private resource support,
- analytics,
- AI-assisted exploration.

---

## 13. Definition of success for MVP

The MVP is successful if a user can answer a question like:

> “Who at MD Anderson works in breast cancer and uses single-cell technologies?”

within about a minute, without training or explanation.

A second success criterion is that the site feels credible and comfortable enough that users would want to return to it.

---

## 14. Immediate next build targets

The first implementation tasks should be:

1. Finalize CSV schema and controlled vocabulary
2. Create a small seed dataset
3. Scaffold the frontend app
4. Build the page layout and navigation shell
5. Implement search and filters
6. Build detail pages for core entities
7. Polish visual consistency and interactions

---

## 15. One-sentence design philosophy

> **Scholarly data underneath, consumer-grade navigation on top.**
