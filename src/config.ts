/**
 * Application configuration constants.
 * These mirror the `limits` object from the original utils.js.
 * Centralizing them here ensures quiz.ts and exam.ts always agree.
 */
export const LIMITS = {
  /** Total questions in a mock exam */
  EXAM_LIMIT: 170,
  /** Total questions in a practice quiz session */
  QUIZ_LIMIT: 25,
  /** Exam timer in seconds: 3 hours 10 minutes = 11400s */
  TIME_LIMIT: 11400,
  /** Number of Numerical questions selected for the exam */
  EXAM_NUMERICAL: 45,
  /** Number of Verbal questions selected for the exam */
  EXAM_VERBAL: 45,
  /** Number of Analytical questions selected for the exam */
  EXAM_ANALYTICAL: 45,
  /** Number of Clerical questions selected for the exam */
  EXAM_CLERICAL: 15,
  /** Number of General Information questions selected for the exam */
  EXAM_GEN_INFO: 20,
  /** Number of vocabulary quiz questions per session */
  VOCAB_QUIZ_LIMIT: 15,
  /** Passing percentage threshold for mock exam */
  PASSING_SCORE: 80,
  /** Maximum exam history entries to keep */
  MAX_HISTORY: 5,
  /** Timer warning threshold in seconds (10 minutes) */
  TIMER_WARNING: 600,
} as const;
