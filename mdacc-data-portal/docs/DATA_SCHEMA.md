# MD Anderson Cancer Data Portal — Data Schema

## 1. Schema design goals

The v1 data model should be:

- **simple** enough to maintain in CSV,
- **normalized** enough to avoid duplication,
- **structured** enough to support filtering and cross-linking,
- **stable** enough to support future migration to a database.

The most important rule is:

> Do not put everything into one giant CSV file.

Instead, use core entity tables plus relationship tables.

---

## 2. Global rules

### Stable IDs
Every core entity must have a unique stable ID.

Examples:
- `researcher_id`
- `project_id`
- `dataset_id`
- `technology_id`
- `disease_area_id`

Recommended format:
- `R001`, `R002`
- `P001`, `P002`
- `D001`, `D002`
- `T001`, `T002`
- `C001`, `C002`

### Controlled vocabulary
Use standardized values for:
- disease area names,
- data type names,
- technology/platform names,
- department/program names,
- tag labels.

### Null handling
Use empty cells for missing values unless a specific placeholder is needed.

### List values
Avoid storing long comma-separated lists in a single cell unless absolutely necessary.
Use relationship tables instead.

---

## 3. Core entity tables

## 3.1 `researchers.csv`

One row per researcher.

| Column | Required | Description |
|---|---:|---|
| `researcher_id` | Yes | Unique stable identifier |
| `full_name` | Yes | Full display name |
| `title` | No | Academic/professional title |
| `department` | No | Department or division |
| `center_program` | No | Center, institute, or program affiliation |
| `email` | No | Contact email if appropriate |
| `profile_url` | No | External/internal profile link |
| `short_bio` | No | 1–3 sentence description |
| `lab_name` | No | Lab or group name |
| `active` | Yes | `TRUE` / `FALSE` |
| `last_updated` | No | Content update date |

### Example
| researcher_id | full_name | title | department | center_program | lab_name | active |
|---|---|---|---|---|---|---|
| R001 | Jane Smith, MD, PhD | Professor | Breast Medical Oncology | Cancer Systems Biology Program | Smith Lab | TRUE |

---

## 3.2 `projects.csv`

One row per project, program, initiative, or major effort.

| Column | Required | Description |
|---|---:|---|
| `project_id` | Yes | Unique stable identifier |
| `project_name` | Yes | Display name |
| `project_type` | Yes | e.g., `project`, `program`, `initiative`, `core resource` |
| `summary` | Yes | Short description |
| `status` | No | e.g., `active`, `planned`, `archived` |
| `department_owner` | No | Primary owner department |
| `start_year` | No | Optional start year |
| `end_year` | No | Optional end year |
| `project_url` | No | Optional link |
| `last_updated` | No | Content update date |

---

## 3.3 `datasets.csv`

One row per dataset, data resource, cohort, or curated data asset.

| Column | Required | Description |
|---|---:|---|
| `dataset_id` | Yes | Unique stable identifier |
| `dataset_name` | Yes | Display name |
| `dataset_type` | Yes | High-level type, e.g., `clinical`, `imaging`, `genomics`, `pathology`, `single-cell` |
| `summary` | Yes | Short plain-language description |
| `data_modality` | No | More specific modality label |
| `access_level` | No | e.g., `public`, `internal`, `restricted` |
| `access_notes` | No | Short note on access |
| `sample_scope` | No | e.g., patient cohort, cell lines, tissue specimens |
| `dataset_url` | No | Optional link |
| `active` | Yes | `TRUE` / `FALSE` |
| `last_updated` | No | Content update date |

---

## 3.4 `technologies.csv`

One row per measurement technology, platform, assay, or method.

| Column | Required | Description |
|---|---:|---|
| `technology_id` | Yes | Unique stable identifier |
| `technology_name` | Yes | Display name |
| `technology_category` | Yes | e.g., `sequencing`, `imaging`, `mass spectrometry`, `cytometry` |
| `summary` | Yes | Short description |
| `measurement_focus` | No | What the technology measures |
| `vendor_platform` | No | Optional platform/vendor name |
| `technology_url` | No | Optional link |
| `active` | Yes | `TRUE` / `FALSE` |
| `last_updated` | No | Content update date |

---

## 3.5 `disease_areas.csv`

One row per disease area.

| Column | Required | Description |
|---|---:|---|
| `disease_area_id` | Yes | Unique stable identifier |
| `disease_area_name` | Yes | Preferred display name |
| `disease_group` | No | Broader grouping, e.g., `solid tumor`, `hematologic malignancy` |
| `summary` | No | Short overview |
| `active` | Yes | `TRUE` / `FALSE` |
| `last_updated` | No | Content update date |

### Example values
- Breast Cancer
- Lung Cancer
- Pancreatic Cancer
- Melanoma
- Leukemia

---

## 4. Relationship tables

These tables handle many-to-many relationships and should usually contain only IDs plus optional metadata.

## 4.1 `researcher_disease_areas.csv`

| Column | Required | Description |
|---|---:|---|
| `researcher_id` | Yes | Links to `researchers.csv` |
| `disease_area_id` | Yes | Links to `disease_areas.csv` |
| `relevance_type` | No | e.g., `primary`, `secondary` |

---

## 4.2 `researcher_technologies.csv`

| Column | Required | Description |
|---|---:|---|
| `researcher_id` | Yes | Links to researcher |
| `technology_id` | Yes | Links to technology |
| `usage_type` | No | e.g., `uses`, `develops`, `collaborates on` |

---

## 4.3 `researcher_datasets.csv`

| Column | Required | Description |
|---|---:|---|
| `researcher_id` | Yes | Links to researcher |
| `dataset_id` | Yes | Links to dataset |
| `relationship_type` | No | e.g., `owner`, `contributor`, `user` |

---

## 4.4 `project_researchers.csv`

| Column | Required | Description |
|---|---:|---|
| `project_id` | Yes | Links to project |
| `researcher_id` | Yes | Links to researcher |
| `role` | No | e.g., `lead`, `member`, `collaborator` |

---

## 4.5 `project_datasets.csv`

| Column | Required | Description |
|---|---:|---|
| `project_id` | Yes | Links to project |
| `dataset_id` | Yes | Links to dataset |
| `relationship_type` | No | e.g., `produces`, `uses`, `curates` |

---

## 4.6 `project_disease_areas.csv`

| Column | Required | Description |
|---|---:|---|
| `project_id` | Yes | Links to project |
| `disease_area_id` | Yes | Links to disease area |

---

## 4.7 `dataset_technologies.csv`

| Column | Required | Description |
|---|---:|---|
| `dataset_id` | Yes | Links to dataset |
| `technology_id` | Yes | Links to technology |
| `relationship_type` | No | e.g., `generated_by`, `analyzed_with` |

---

## 4.8 `dataset_disease_areas.csv`

| Column | Required | Description |
|---|---:|---|
| `dataset_id` | Yes | Links to dataset |
| `disease_area_id` | Yes | Links to disease area |

---

## 5. Optional support tables

These are not required for v1, but may help later.

### `tags.csv`
For reusable tags.

### `entity_tags.csv`
For assigning tags to different entity types.

### `departments.csv`
If department metadata becomes important enough to normalize.

---

## 6. Controlled vocabulary recommendations

## 6.1 Dataset types
Use a small controlled set for `dataset_type`:

- `clinical`
- `imaging`
- `genomics`
- `transcriptomics`
- `proteomics`
- `pathology`
- `single-cell`
- `spatial-omics`
- `preclinical`
- `multimodal`

## 6.2 Technology categories
Use a small controlled set for `technology_category`:

- `sequencing`
- `imaging`
- `microscopy`
- `mass spectrometry`
- `cytometry`
- `computational`
- `molecular assay`
- `pathology workflow`

## 6.3 Project types
- `project`
- `program`
- `initiative`
- `core resource`
- `consortium`

## 6.4 Access levels
- `public`
- `internal`
- `restricted`

---

## 7. Seed dataset recommendation

For the first development pass, create a small but realistic seed dataset:

- 8–12 researchers
- 5–8 projects
- 10–15 datasets
- 8–12 technologies
- 5–8 disease areas
- enough relationship rows to demonstrate cross-linking

This is large enough to test the UI, but small enough to maintain manually.

---

## 8. Validation rules

Before build-time conversion to JSON, validate that:

- all required columns exist,
- all IDs are unique in core tables,
- all foreign keys in relationship tables refer to valid IDs,
- controlled vocabulary values are valid,
- no duplicated relationship rows exist,
- all boolean fields use consistent values,
- text fields are trimmed and normalized.

---

## 9. Example implementation order

1. Create the five core CSV files
2. Create the main relationship tables
3. Populate a small seed dataset
4. Write a CSV validation script
5. Convert CSV to JSON for the frontend
6. Build filters directly on normalized data

---

## 10. Future-proofing note

If this portal grows, the same schema can later move to:

- SQLite,
- PostgreSQL,
- a headless CMS,
- or a graph-oriented data layer.

That is another reason to keep IDs and relationship tables clean from the beginning.
