import responsibleAi from "@/data/responsible-ai.json";
import workloads from "@/data/workloads.json";
import modelSelection from "@/data/model-selection.json";
import foundryAgents from "@/data/foundry-agents.json";
import foundryImplementation from "@/data/foundry-implementation.json";
import flashcardsData from "@/data/flashcards.json";
import type {
  Askable,
  CaseQuestion,
  ChoiceQuestion,
  Difficulty,
  ExamPool,
  Flashcard,
  Question,
  Section,
  SectionSummary,
} from "./types";

const raw = [
  responsibleAi,
  workloads,
  modelSelection,
  foundryAgents,
  foundryImplementation,
] as unknown as Section[];

const bySlug = new Map<string, Section>(raw.map((s) => [s.section, s]));

export function getSection(slug: string): Section | undefined {
  return bySlug.get(slug);
}

export function getSlugs(): string[] {
  return raw.map((s) => s.section);
}

function isCase(q: Question): q is CaseQuestion {
  return q.type === "case";
}

/** Flatten a section's questions into graded units. Case questions become one Askable per sub-question. */
export function expandSection(section: Section): Askable[] {
  const out: Askable[] = [];
  for (const q of section.questions) {
    if (isCase(q)) {
      for (const sub of q.subQuestions) {
        out.push({
          uid: sub.id,
          type: sub.type,
          stem: sub.stem,
          caseStem: q.stem,
          options: sub.options,
          correct: sub.correct,
          explanation: sub.explanation,
          difficulty: q.difficulty ?? "hard",
        });
      }
    } else {
      const c = q as ChoiceQuestion;
      out.push({
        uid: c.id,
        type: c.type,
        stem: c.stem,
        options: c.options,
        correct: c.correct,
        explanation: c.explanation,
        difficulty: c.difficulty ?? "medium",
      });
    }
  }
  return out;
}

export function summarise(section: Section): SectionSummary {
  const askables = expandSection(section);
  const mix: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  for (const a of askables) mix[a.difficulty] += 1;
  const types = { single: 0, multi: 0, case: 0 };
  for (const q of section.questions) types[q.type] += 1;
  return {
    slug: section.section,
    title: section.title,
    blueprintRef: section.blueprintRef,
    total: askables.length,
    mix,
    types,
  };
}

export function getSummaries(): SectionSummary[] {
  return raw.map(summarise);
}

export function getFlashcards(): Flashcard[] {
  return (flashcardsData as { cards: Flashcard[] }).cards;
}

const CONCEPT_SLUGS = ["responsible-ai", "workloads", "model-selection"];
const FOUNDRY_SLUGS = ["foundry-agents", "foundry-implementation"];

/** Build the exam pool, grouped by the two blueprint domains, for client-side weighted sampling. */
export function getExamPool(): ExamPool {
  const collect = (slugs: string[]) =>
    slugs.flatMap((slug) => {
      const s = bySlug.get(slug);
      return s ? expandSection(s) : [];
    });
  return {
    concepts: collect(CONCEPT_SLUGS),
    foundry: collect(FOUNDRY_SLUGS),
  };
}
