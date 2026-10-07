import type { Category, ExamQuestion, QuizQuestion } from './question';

/**
 * Saved state of an in-progress practice quiz session.
 * Written to localStorage under the key 'cse_quiz_progress'.
 */
export interface QuizProgress {
  status: 'in-progress';
  category: Category;
  currentQuestion: number;
  score: number;
  selectedAnswer: string | null;
  selectedAnswers: (string | null)[];
  isSubmitted: boolean;
  questions: QuizQuestion[];
}

/**
 * Saved state of an in-progress mock exam session.
 * Written to localStorage under the key 'cse_exam_progress'.
 */
export interface ExamProgress {
  status: 'in-progress';
  currentQuestion: number;
  score: number;
  selectedAnswers: (string | null)[];
  timeRemaining: number;
  markedForReview: boolean[];
  questionIds: string[];
}

/**
 * Per-category score breakdown stored in an exam result.
 */
export interface CategoryStat {
  correct: number;
  total: number;
}

/**
 * A log entry for a single question in a completed exam result.
 */
export interface ExamQuestionLog {
  question: string;
  category: Category;
  choices: string[];
  correctAnswer: string;
  userAnswer: string | null;
  explanation: string;
  isCorrect: boolean;
}

/**
 * Full result of a completed mock exam.
 * Written to localStorage under the key 'cse_last_exam_result'.
 */
export interface ExamResult {
  date: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  categoryStats: Record<Category, CategoryStat>;
  questionsLog: ExamQuestionLog[];
}

/**
 * A compact history entry added to the rolling history log.
 * Written to localStorage under the key 'cse_exam_history'.
 */
export interface ExamHistoryEntry {
  date: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
}

/**
 * Best practice quiz scores per category.
 * Written to localStorage under the key 'cse_best_scores'.
 */
export type BestScores = Record<Category, number>;

/**
 * All localStorage keys used by the application.
 * Centralizing them prevents typos across modules.
 */
export const STORAGE_KEYS = {
  VOCAB_DAY: 'cse_vocab_day',
  BEST_SCORES: 'cse_best_scores',
  MASTERED_WORDS: 'cse_mastered_words',
  EXAM_HISTORY: 'cse_exam_history',
  LAST_EXAM_RESULT: 'cse_last_exam_result',
  QUIZ_PROGRESS: 'cse_quiz_progress',
  EXAM_PROGRESS: 'cse_exam_progress',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Re-export ExamQuestion for convenience
export type { ExamQuestion };
