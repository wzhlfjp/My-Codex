export type EntityId = string;

export interface Researcher {
  id: EntityId;
  fullName: string;
  title?: string;
  department?: string;
  centerProgram?: string;
  email?: string;
  profileUrl?: string;
  shortBio?: string;
  labName?: string;
  active: boolean;
  lastUpdated?: string;
}

export interface Dataset {
  id: EntityId;
  datasetName: string;
  datasetType: string;
  summary: string;
  dataModality?: string;
  accessLevel?: string;
  accessNotes?: string;
  sampleScope?: string;
  datasetUrl?: string;
  active: boolean;
  lastUpdated?: string;
}

export interface Technology {
  id: EntityId;
  technologyName: string;
  technologyCategory: string;
  summary: string;
  measurementFocus?: string;
  vendorPlatform?: string;
  technologyUrl?: string;
  active: boolean;
  lastUpdated?: string;
}

export interface DiseaseArea {
  id: EntityId;
  diseaseAreaName: string;
  diseaseGroup?: string;
  summary?: string;
  active: boolean;
  lastUpdated?: string;
}

export interface Project {
  id: EntityId;
  projectName: string;
  projectType: string;
  summary: string;
  status?: string;
  departmentOwner?: string;
  startYear?: number;
  endYear?: number;
  projectUrl?: string;
  lastUpdated?: string;
}

export interface RelationshipMaps {
  researcherToDiseaseAreas: Record<EntityId, EntityId[]>;
  researcherToTechnologies: Record<EntityId, EntityId[]>;
  researcherToDatasets: Record<EntityId, EntityId[]>;
  researcherToProjects: Record<EntityId, EntityId[]>;
  projectToResearchers: Record<EntityId, EntityId[]>;
  projectToDatasets: Record<EntityId, EntityId[]>;
  projectToDiseaseAreas: Record<EntityId, EntityId[]>;
  datasetToTechnologies: Record<EntityId, EntityId[]>;
  datasetToDiseaseAreas: Record<EntityId, EntityId[]>;
  datasetToResearchers: Record<EntityId, EntityId[]>;
  datasetToProjects: Record<EntityId, EntityId[]>;
  diseaseAreaToResearchers: Record<EntityId, EntityId[]>;
  diseaseAreaToDatasets: Record<EntityId, EntityId[]>;
  diseaseAreaToProjects: Record<EntityId, EntityId[]>;
  diseaseAreaToTechnologies: Record<EntityId, EntityId[]>;
  technologyToResearchers: Record<EntityId, EntityId[]>;
  technologyToDatasets: Record<EntityId, EntityId[]>;
  technologyToDiseaseAreas: Record<EntityId, EntityId[]>;
}

export interface PortalData {
  researchers: Researcher[];
  projects: Project[];
  datasets: Dataset[];
  technologies: Technology[];
  diseaseAreas: DiseaseArea[];
  relationships: RelationshipMaps;
}

export interface ResearcherDetailData {
  researcher: Researcher;
  diseaseAreas: DiseaseArea[];
  technologies: Technology[];
  datasets: Dataset[];
  projects: Project[];
}

export interface DatasetDetailData {
  dataset: Dataset;
  diseaseAreas: DiseaseArea[];
  technologies: Technology[];
  researchers: Researcher[];
  projects: Project[];
}

export interface TechnologyDetailData {
  technology: Technology;
  diseaseAreas: DiseaseArea[];
  datasets: Dataset[];
  researchers: Researcher[];
  projects: Project[];
}

export interface DiseaseAreaDetailData {
  diseaseArea: DiseaseArea;
  researchers: Researcher[];
  datasets: Dataset[];
  technologies: Technology[];
  projects: Project[];
}

export interface ProjectDetailData {
  project: Project;
  researchers: Researcher[];
  datasets: Dataset[];
  diseaseAreas: DiseaseArea[];
  technologies: Technology[];
}

export type ExploreEntityType = "all" | "researcher" | "dataset" | "technology" | "disease-area" | "project";
export type CompareEntityType = "researcher" | "dataset" | "project" | "technology" | "disease-area";

export interface ExploreQuery {
  q?: string;
  type?: ExploreEntityType;
  disease?: string;
}

export interface ExploreResult {
  id: EntityId;
  type: Exclude<ExploreEntityType, "all">;
  title: string;
  href: string;
  summary?: string;
  diseaseAreaIds: EntityId[];
  diseaseAreaNames: string[];
  technologyNames: string[];
  chips: string[];
  searchTitle: string;
  searchBody: string;
  score: number;
}

export interface BuildMetadata {
  generatedAt: string;
  sourceFilesUsed: string[];
  processedEntityCounts: {
    researchers: number;
    projects: number;
    datasets: number;
    technologies: number;
    diseaseAreas: number;
  };
  latestSourceUpdateDate?: string;
  validationStatus: "passed" | "passed_with_warnings";
  validationWarningsSummary: {
    count: number;
    warnings: string[];
  };
}

export type ValidationStatus = "passed" | "passed_with_warnings" | "failed";

export interface ValidationReportFileSummary {
  rowCount: number;
  errors: string[];
  warnings: string[];
}

export interface ValidationNormalizationSubstitution {
  fileName: string;
  column: string;
  from: string;
  to: string;
  count: number;
}

export interface ValidationReport {
  generatedAt: string;
  status: ValidationStatus;
  summary: {
    filesScanned: number;
    tableCount: {
      core: number;
      relationship: number;
      total: number;
    };
    rowCount: number;
    issueCountBySeverity: {
      error: number;
      warning: number;
    };
    issueCountByType: Record<string, number>;
    normalizationSubstitutionCount: number;
  };
  issuesByFile: Record<string, ValidationReportFileSummary>;
  normalizationSummary: {
    totalSubstitutions: number;
    substitutions: ValidationNormalizationSubstitution[];
  };
}
