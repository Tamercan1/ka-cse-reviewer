/**
 * Represents a single quiz/exam question as stored in the JSON data files.
 * Schema: analytical.json, clerical.json, gen-info.json, numerical.json, verbal.json
 */
export interface QuizQuestion {
  id: string;
  question: string;
  choices: [string, string, string, string];
  answer: string;
  explanation: string;
}

/**
 * A QuizQuestion that has been tagged with its category during exam assembly.
 * The `category` field is injected at runtime by exam.ts — it does NOT exist in the JSON.
 */
export interface ExamQuestion extends QuizQuestion {
  category: Category;
}

/**
 * The five quiz categories, matching both the data files and the display names.
 */
export type Category =
  | 'Numerical'
  | 'Verbal'
  | 'Analytical'
  | 'Clerical'
  | 'General Information';

/**
 * Maps Category to its display label.
 */
export const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
  Numerical: 'Numerical Reasoning',
  Verbal: 'Verbal Reasoning',
  Analytical: 'Analytical Reasoning',
  Clerical: 'Clerical Ability',
  'General Information': 'General Information',
};

/**
 * Maps the question ID prefix (e.g. 'num') used in categoryLabels in the original exam.js.
 * Retained for reference but not strictly used in the new code.
 */
export const CATEGORY_ID_PREFIX: Record<string, Category> = {
  num: 'Numerical',
  verb: 'Verbal',
  anal: 'Analytical',
  cler: 'Clerical',
  gen: 'General Information',
};
