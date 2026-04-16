export type StartHereCardContent = {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
};

export const START_HERE_CARD_CONTENT: StartHereCardContent[] = [
  {
    id: "disease-first",
    title: "Find who works in a disease area",
    description: "Start from a disease context, then branch into linked researchers, datasets, technologies, and projects.",
    actionLabel: "Start Disease-First",
  },
  {
    id: "dataset-first",
    title: "See what datasets are available",
    description: "Move from disease-focused questions into concrete data resources and their connected teams and methods.",
    actionLabel: "Start From Datasets",
  },
  {
    id: "technology-first",
    title: "Understand technologies in use",
    description: "Browse measurement platforms and methods, then follow links to related datasets and investigators.",
    actionLabel: "Start From Technologies",
  },
  {
    id: "collaboration-first",
    title: "Discover collaboration pathways",
    description: "Use Explore and related links to connect people, data assets, technologies, and projects around a question.",
    actionLabel: "Start In Explore",
  },
];

export const EXAMPLE_QUESTION_PROMPTS: string[] = [
  "Who is working in this disease area, and what methods do they use?",
  "What datasets can help me orient around this disease question?",
  "Which technologies are commonly linked to these datasets?",
  "Are there related projects or programs I should review next?",
];
