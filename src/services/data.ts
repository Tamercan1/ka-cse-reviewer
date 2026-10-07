import type { QuizQuestion, ExamQuestion, Category } from '../types/question';
import type { VocabularyDay, VocabQuizDay } from '../types/vocabulary';

/**
 * Centralized data-access layer.
 *
 * All JSON file paths are defined here — nowhere else in the application.
 * Quiz/exam/vocabulary logic calls these functions instead of using fetch() directly.
 *
 * Path strategy:
 *   - In Vite dev mode, paths are resolved from the server root.
 *   - Pages live in /pages/, so they use '../data/' relative paths.
 *   - index.html lives at root, so it uses 'data/' paths.
 *   - To avoid duplicating path logic, callers pass a `basePath` (default '../').
 *   - index.html / main.ts overrides this with ''.
 */

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching ${url}`);
    }
    return (await response.json()) as T;
  } catch (e) {
    console.error(`Failed to fetch JSON from ${url}:`, e);
    return null;
  }
}

/** Data file names, relative to the /data/ directory */
const DATA_FILES = {
  numerical: 'numerical.json',
  verbal: 'verbal.json',
  analytical: 'analytical.json',
  clerical: 'clerical.json',
  genInfo: 'gen-info.json',
  vocabulary: 'vocabulary.json',
  vocabQuiz: 'vocab-quiz.json',
} as const;

/** Maps Category to its data filename */
const CATEGORY_FILE: Record<Category, string> = {
  Numerical: DATA_FILES.numerical,
  Verbal: DATA_FILES.verbal,
  Analytical: DATA_FILES.analytical,
  Clerical: DATA_FILES.clerical,
  'General Information': DATA_FILES.genInfo,
};

/**
 * Load questions for a single quiz category.
 * @param category - The quiz category to load.
 * @param basePath - Prefix before 'data/', e.g. '../' for pages/, '' for root.
 */
export async function loadCategoryQuestions(
  category: Category,
  basePath = '../'
): Promise<QuizQuestion[]> {
  const filename = CATEGORY_FILE[category];
  const data = await fetchJSON<QuizQuestion[]>(`${basePath}data/${filename}`);
  return data ?? [];
}

/**
 * Load all five question categories for the mock exam, in parallel.
 * Returns them tagged with their category.
 * @param basePath - Prefix before 'data/', e.g. '../' for pages/, '' for root.
 */
export async function loadAllExamQuestions(basePath = '../'): Promise<ExamQuestion[]> {
  const categories: Category[] = [
    'Numerical',
    'Verbal',
    'Analytical',
    'Clerical',
    'General Information',
  ];

  const results = await Promise.all(
    categories.map((cat) =>
      fetchJSON<QuizQuestion[]>(`${basePath}data/${CATEGORY_FILE[cat]}`)
    )
  );

  const allQuestions: ExamQuestion[] = [];
  results.forEach((qList, idx) => {
    if (!qList) return;
    const cat = categories[idx];
    qList.forEach((q) => allQuestions.push({ ...q, category: cat }));
  });

  return allQuestions;
}

/**
 * Load daily vocabulary data.
 * @param basePath - Prefix before 'data/'.
 */
export async function loadVocabularyData(basePath = '../'): Promise<VocabularyDay[]> {
  const data = await fetchJSON<VocabularyDay[]>(`${basePath}data/${DATA_FILES.vocabulary}`);
  return data ?? [];
}

/**
 * Load daily vocabulary quiz data.
 * @param basePath - Prefix before 'data/'.
 */
export async function loadVocabQuizData(basePath = '../'): Promise<VocabQuizDay[]> {
  const data = await fetchJSON<VocabQuizDay[]>(`${basePath}data/${DATA_FILES.vocabQuiz}`);
  return data ?? [];
}
