export type Difficulty = "easy" | "medium" | "hard";
export type ChoiceType = "single" | "multi";

export interface Option {
  key: string;
  text: string;
}

export interface Explanation {
  correct: string;
  distractors: Record<string, string>;
}

export interface ChoiceQuestion {
  id: string;
  type: ChoiceType;
  difficulty?: Difficulty;
  stem: string;
  options: Option[];
  correct: string[];
  explanation: Explanation;
  tags?: string[];
}

export interface CaseQuestion {
  id: string;
  type: "case";
  difficulty?: Difficulty;
  stem: string;
  subQuestions: ChoiceQuestion[];
  tags?: string[];
}

export type Question = ChoiceQuestion | CaseQuestion;

export interface Section {
  section: string;
  title: string;
  blueprintRef: string;
  source: string;
  questions: Question[];
}

/** A single graded unit shown to the user (case questions are flattened into their sub-questions). */
export interface Askable {
  uid: string;
  type: ChoiceType;
  stem: string;
  caseStem?: string;
  options: Option[];
  correct: string[];
  explanation: Explanation;
  difficulty: Difficulty;
}

export interface SectionSummary {
  slug: string;
  title: string;
  blueprintRef: string;
  total: number;
  mix: Record<Difficulty, number>;
  types: { single: number; multi: number; case: number };
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  tags?: string[];
}

export interface ExamPool {
  concepts: Askable[];
  foundry: Askable[];
}
