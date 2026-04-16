# MD Anderson Cancer Data Portal — Site Map and Page Plan

## 1. Site strategy

The portal should feel like a connected discovery experience rather than a collection of isolated pages.

A user should always know:

- where they are,
- what they can do next,
- and how to move to related information.

The site map should therefore be shallow, predictable, and relationship-driven.

---

## 2. Top-level navigation

Recommended top-level navigation:

- **Home**
- **Explore**
- **Researchers**
- **Datasets**
- **Technologies**
- **Disease Areas**
- **About**

For MVP, this is enough.

A persistent global search bar should be prominently placed in the header or hero section.

---

## 3. Site map

```text
Home
├── Explore
├── Researchers
│   └── Researcher Detail
├── Datasets
│   └── Dataset Detail
├── Technologies
│   └── Technology Detail
├── Disease Areas
│   └── Disease Area Detail
└── About
```

Optional later:
- Projects
- Contact / collaboration request flow
- Glossary / methods guide

---

## 4. Page-by-page plan

## 4.1 Home page

### Purpose
Introduce the portal and help users start quickly.

### Main elements
- Clean hero section
- One-sentence value proposition
- Primary global search bar
- Quick links to popular disease areas
- Featured researchers / technologies / datasets (optional but light)
- Short explanation of how to use the portal

### Sample hero message
**Discover MD Anderson research expertise, data resources, and measurement technologies.**

### Notes
The home page should not be crowded. Its job is orientation and entry.

---

## 4.2 Explore page

### Purpose
Provide the main discovery workspace.

### Layout
- Left sidebar: filters
- Main content area: results cards or compact table/cards
- Top controls: search, sort, active filters, result count

### Supported filters
- Disease area
- Entity type
- Dataset type
- Technology category
- Department / program

### Results behavior
Search should return mixed entities with clear type labels, for example:
- Researcher
- Dataset
- Technology
- Disease Area

### Why this page matters
This is likely the most-used page after Home.

---

## 4.3 Researchers list page

### Purpose
Help users browse or filter all researchers.

### Main elements
- Search by name or keyword
- Filters by disease area, technology, department
- Researcher cards or rows with:
  - name
  - title
  - department
  - short summary
  - disease tags
  - technology tags

### Design note
The list should be highly scannable.

---

## 4.4 Researcher detail page

### Purpose
Present one researcher as a collaboration discovery node.

### Main sections
- Name, title, department
- Short bio / research summary
- Disease areas
- Technologies used or developed
- Related datasets
- Related projects/programs
- External profile/contact link

### UX note
This page should make it easy to continue browsing by clicking into disease areas, technologies, and datasets.

---

## 4.5 Datasets list page

### Purpose
Let users browse available datasets/resources.

### Main elements
- Search by dataset name or keyword
- Filters by type, disease area, access level, technology
- Dataset cards or compact rows showing:
  - dataset name
  - dataset type
  - summary
  - associated disease tags
  - associated technology tags

---

## 4.6 Dataset detail page

### Purpose
Explain what a dataset is and how it relates to research activity.

### Main sections
- Dataset name
- Type and modality
- Summary
- Access level / notes
- Associated disease areas
- Associated researchers
- Associated projects
- Associated technologies
- External link if available

### UX note
Avoid too much technical detail at once. Use expandable sections if needed later.

---

## 4.7 Technologies list page

### Purpose
Help users discover the methods/platform side of the ecosystem.

### Main elements
- Search by technology/platform/method
- Filters by category and disease area
- Technology cards/rows showing:
  - technology name
  - category
  - short summary
  - related disease tags

---

## 4.8 Technology detail page

### Purpose
Show what a technology measures and who uses it.

### Main sections
- Technology name
- Category
- Summary
- Measurement focus
- Related researchers
- Related datasets
- Related disease areas
- Optional vendor/platform field

---

## 4.9 Disease areas list page

### Purpose
Provide a disease-oriented entry point.

### Main elements
- Disease area cards
- Search/filter if the list grows
- Summary counts or highlights kept minimal

---

## 4.10 Disease area detail page

### Purpose
Act as the key entry page for users coming with a cancer-specific question.

### Main sections
- Disease area name and overview
- Related researchers
- Related datasets
- Related technologies
- Related projects/programs

### Example user flow
A breast cancer researcher may land here first, then branch into people, datasets, and technologies.

---

## 4.11 About page

### Purpose
Explain the portal’s purpose and limits.

### Main elements
- What the portal is
- Who it is for
- What data is included
- How often it is updated
- Contact / stewardship information

---

## 5. Shared components

The following components should be reusable across the site:

- Header / top navigation
- Global search bar
- Filter sidebar
- Result card
- Tag/badge component
- Breadcrumbs
- Empty state panel
- Section heading block
- Related-items panel

Reusability will make Codex-generated implementation cleaner and more maintainable.

---

## 6. Design guidance for comfort and modern feel

### Layout
- Use a centered content container
- Avoid excessive width for text-heavy content
- Maintain clear spacing between sections

### Typography
- Strong page titles
- Clean secondary headings
- Short paragraphs
- Avoid dense walls of text

### Visual language
- Restrained color system
- Soft borders/shadows
- Clean tags and chips
- Minimal icons used carefully

### Interaction
- Obvious hover/click states
- Fast filtering
- Clear active filters
- No surprising navigation patterns

---

## 7. Recommended user journeys

## Journey A — disease-first discovery
1. User searches or clicks **Breast Cancer**
2. Opens disease area page
3. Reviews relevant researchers
4. Clicks a researcher profile
5. Reviews technologies and datasets
6. Identifies collaboration possibilities

## Journey B — technology-first discovery
1. User searches a technology such as **single-cell RNA sequencing**
2. Opens the technology page
3. Sees which groups use it
4. Moves to researcher or dataset pages

## Journey C — person-first discovery
1. User looks up a known investigator
2. Opens profile page
3. Explores linked datasets, disease areas, and technologies

---

## 8. What not to overbuild in v1

Avoid these until the core browsing experience is working well:

- giant landing dashboards,
- deep navigation trees,
- multiple search systems,
- too many metrics or charts,
- complicated interactive graphs,
- very long profiles with hidden structure.

---

## 9. MVP implementation order

1. Build navigation shell and page layout
2. Build Home page
3. Build Explore page with filters
4. Build Researchers list and detail pages
5. Build Disease Areas list and detail pages
6. Build Datasets list and detail pages
7. Build Technologies list and detail pages
8. Add About page and polish states

---

## 10. Success test for the site map

The site map is working if users can intuitively do the following without instruction:

- start from a disease area,
- find relevant people,
- understand related datasets and technologies,
- and continue browsing without confusion.
