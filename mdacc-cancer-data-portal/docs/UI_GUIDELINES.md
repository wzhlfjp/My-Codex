# UI Guidelines

## MD Anderson Cancer Data Portal

This document defines the visual and interaction principles for the MD Anderson Cancer Data Portal.

The goal is to create a portal that feels:

- simple
- modern
- calm
- credible
- easy to navigate
- appropriate for serious academic and clinical research contexts

The visual language should support discovery without overwhelming the user.

---

## 1. Design philosophy

The portal should follow this principle:

> Scholarly data underneath, consumer-grade navigation on top.

That means:

- information is structured carefully
- navigation feels intuitive
- visuals are polished but restrained
- users can move through the portal naturally even if the content is complex

The site should not feel like a dense administrative database or an overly flashy startup landing page.

---

## 2. Overall tone

### The interface should feel
- clean
- modern
- light
- professional
- trustworthy
- organized

### The interface should not feel
- cluttered
- crowded
- overly technical
- visually noisy
- decorative for its own sake
- dominated by dashboards and charts

---

## 3. Primary UX objective

The most important user experience goal is:

> Help users find relevant people, data, and technologies quickly and comfortably.

Users should be able to:

- scan pages easily
- understand what is clickable
- understand relationships among entities
- move between related items with minimal friction
- feel oriented at all times

---

## 4. Visual principles

### 4.1 Use generous whitespace
Whitespace is one of the most important tools in this project.

Use spacing to:
- separate sections clearly
- reduce visual pressure
- improve scanability
- make the portal feel modern and calm

Avoid tightly packed sections and overly dense card grids.

### 4.2 Prioritize typography
Typography should do much of the visual work.

Use clear hierarchy:
- page titles
- section headings
- card titles
- metadata
- body text
- captions and badges

Typography should be readable first and stylish second.

### 4.3 Use a restrained color system
Use a limited palette.

Recommended pattern:
- neutral backgrounds
- dark text for readability
- one primary accent color
- one or two subtle supporting colors for badges or category cues

Do not use many competing colors across cards, filters, or tags.

### 4.4 Use visual consistency
All repeated UI elements should look and behave consistently.

Examples:
- cards should have consistent structure
- badges should use consistent styles
- filters should appear in predictable places
- section spacing should follow a repeatable rhythm

Consistency is more important than visual novelty.

---

## 5. Layout guidelines

### 5.1 Page layout
Each page should have a clear structure:

1. page heading area
2. optional page description
3. primary search or filters
4. main content region
5. related content or secondary sections

Users should understand the page purpose within a few seconds.

### 5.2 Content width
Avoid content stretching too wide across the screen.

Recommended approach:
- keep reading areas comfortably narrow
- allow wider layouts for search results and grids
- preserve clear margins on both sides

Very wide academic pages can become tiring to read.

### 5.3 Grid usage
Use grids for listings, but do not over-pack them.

Recommended:
- 1 column on small screens
- 2–3 columns on medium and large screens for cards when appropriate
- larger spacing between rows than typical dashboard UIs

### 5.4 Sidebars
If filters are placed in a sidebar, the sidebar should:
- remain simple
- group filters clearly
- avoid long, intimidating stacks of controls
- collapse gracefully on smaller screens

---

## 6. Navigation guidelines

### 6.1 Global navigation
Global navigation should be simple and stable.

Recommended top-level navigation:
- Home
- Explore
- Researchers
- Datasets
- Technologies
- Disease Areas

Keep the navigation concise.

### 6.2 Search prominence
Search should be highly visible.

Because discovery is the main value of the portal, search should appear prominently:
- on the home page
- on the explore page
- optionally within entity listing pages

### 6.3 Breadcrumbs
Use breadcrumbs on detail pages.

These help users stay oriented when moving through a connected information structure.

Example:
`Home / Researchers / Jane Smith`

### 6.4 Related links
Every entity detail page should include related links.

Examples:
- a researcher page links to datasets, technologies, projects, and disease areas
- a dataset page links to researchers and technologies
- a disease area page links to relevant researchers and datasets

This connected navigation is central to the product.

---

## 7. Home page guidance

The home page should be clean and welcoming.

### Recommended structure
- concise hero title
- one-sentence explanation of portal purpose
- prominent search bar
- browse-by-category shortcuts
- optional featured disease areas or featured technologies

### Avoid
- long mission statements
- too many panels
- too many statistics
- heavy visuals that distract from discovery

The home page should invite exploration, not overwhelm the user.

---

## 8. Explore page guidance

The explore page is likely the most important page in the portal.

### It should include
- search input
- filter controls
- active filter summary
- sortable results
- clear result cards or rows

### Important behavior
Users should understand why items are appearing in results.

For each result, show enough metadata to support scanning, such as:
- name/title
- entity type
- short description
- disease areas
- technologies or tags

### Filters should be useful, not exhaustive
Good filters might include:
- disease area
- entity type
- data type
- technology
- department or unit

Do not start with too many niche filters.

---

## 9. Listing page guidance

Listing pages such as Researchers, Datasets, and Technologies should feel consistent.

### Recommended structure
- page title
- short descriptive text
- optional search/filter controls
- consistent listing cards or rows

### Listing items should support quick scanning
Each item should have:
- clear title
- concise subtitle or role/type
- 1–2 lines of summary
- badges or tags for key metadata

Avoid forcing users to click into each item just to understand the basics.

---

## 10. Detail page guidance

Detail pages are where users build understanding.

### Each detail page should include
- title and primary identity information
- concise summary
- structured metadata
- related entities
- clear section headings

### Recommended sections for entity detail pages

#### Researcher page
- profile summary
- disease areas
- datasets
- technologies
- related projects
- contact or external links if appropriate

#### Dataset page
- description
- data type
- disease areas
- associated researchers
- technologies used
- access notes

#### Technology page
- overview
- what it measures or supports
- who uses it
- related datasets
- related disease areas

#### Disease area page
- overview
- featured researchers
- featured datasets
- relevant technologies
- related projects

### Important
Do not overload the top of the page with too much metadata at once.
Use sections and spacing to pace the information.

---

## 11. Card design guidance

Cards should be simple, readable, and consistent.

### Recommended card structure
- title
- subtitle or type label
- short summary
- badges/tags
- optional small metadata row

### Card style guidance
- soft border or subtle shadow
- rounded corners
- adequate padding
- hover state that is visible but restrained

Cards should feel interactive without looking loud.

---

## 12. Tag and badge usage

Tags and badges are very useful in this portal because they help users scan connected metadata quickly.

Good use cases:
- disease area
- technology
- data type
- entity category

Guidelines:
- keep labels short
- avoid too many badges on a single item
- use consistent casing and style
- do not use bright colors for every badge type

---

## 13. Tables vs cards

Default to cards for exploratory browsing.

Use tables only when:
- comparison is important
- there are many similar records
- the structure genuinely benefits from rows and columns

For the MVP, cards will likely make the portal feel more approachable than dense tables.

---

## 14. Empty states and zero-result states

These are important and should be designed deliberately.

### Empty state guidance
If there are no results:
- explain that no matches were found
- suggest removing filters or broadening the search
- preserve the user’s current query and filters so they can adjust easily

The portal should feel helpful even when it has no match.

---

## 15. Search UX guidance

Search is a central interaction.

### Search should support
- disease names
- technology names
- researcher names
- dataset-related terms

### Search behavior should be forgiving
Where possible, support:
- case-insensitive matching
- partial matching
- modest synonym handling later if needed

### Search result presentation
Each result should clearly show:
- what the item is
- why it is relevant
- what related metadata is attached

---

## 16. Filter UX guidance

Filters should help users narrow the space without creating anxiety.

### Good filter behavior
- visible and easy to reset
- grouped logically
- active selections easy to understand
- lightweight, not overly technical

### Important
Always show the currently active filters.
Users should never wonder why results disappeared.

---

## 17. Interaction guidelines

### Hover states
Use subtle hover cues on links, cards, and buttons.

### Click targets
Interactive elements should be easy to click and not crowded together.

### Motion
Use minimal motion.
Transitions can be smooth and polished, but they should not distract.

### Feedback
Provide simple feedback for:
- loading
- no results
- filter changes
- navigation context

---

## 18. Accessibility guidance

Accessibility should be considered from the beginning.

### Priorities
- strong color contrast
- keyboard navigability
- visible focus states
- semantic headings
- readable text sizes
- descriptive link text

A calm and clean design often also improves accessibility.

---

## 19. Responsive design guidance

The portal should work well across screen sizes, but desktop and laptop use will likely be primary.

### Mobile guidance
- preserve strong search access
- collapse filters gracefully
- stack content cleanly
- avoid overcrowded metadata blocks

### Desktop guidance
- take advantage of horizontal space carefully
- do not make lines too wide
- keep sidebars and content areas balanced

---

## 20. Content style guidance

The language across the portal should be:
- concise
- clear
- professional
- neutral
- informative

Avoid:
- jargon-heavy marketing language
- overly casual phrasing
- long explanatory paragraphs where a short summary would do

The writing should help users orient themselves quickly.

---

## 21. MVP visual priorities

If there is limited design time, focus on these first:

1. typography hierarchy
2. spacing rhythm
3. search visibility
4. card consistency
5. detail-page section structure
6. filter clarity
7. navigation simplicity

These seven elements will shape the perceived quality more than decorative additions.

---

## 22. Final principle

When making design decisions, prefer the option that makes the portal feel:

- calmer
- clearer
- easier to scan
- easier to trust
- easier to navigate

The best version of this portal will not be the flashiest one.
It will be the one that helps a researcher quickly find the right people, data, and technologies with confidence.

