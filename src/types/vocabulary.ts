/**
 * A single vocabulary word entry as stored in vocabulary.json.
 * Note: `synonyms`, `antonyms`, `ipa`, and `type` are optional because
 * not all word entries in the current dataset include them.
 */
export interface VocabularyWord {
  word: string;
  definition: string;
  example: string;
  type?: string;   // part of speech, e.g. "noun", "adjective"
  ipa?: string;    // IPA pronunciation
  synonyms?: string[];
  antonyms?: string[];
}

/**
 * A day's worth of vocabulary words as stored in vocabulary.json.
 */
export interface VocabularyDay {
  day: number;
  words: VocabularyWord[];
}

/**
 * A single vocabulary quiz question as stored in vocab-quiz.json.
 */
export interface VocabQuizQuestion {
  question: string;
  choices: [string, string, string, string];
  answer: string;
  explanation: string;
}

/**
 * A day's worth of vocabulary quiz questions as stored in vocab-quiz.json.
 */
export interface VocabQuizDay {
  day: number;
  questions: VocabQuizQuestion[];
}
