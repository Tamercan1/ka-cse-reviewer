import type { QuizQuestion, Category } from '../types/question';
import type { QuizProgress } from '../types/storage';
import { CATEGORY_DISPLAY_NAMES } from '../types/question';
import { LIMITS } from '../config';
import { save, load, remove } from '../services/storage';
import { loadCategoryQuestions } from '../services/data';
import { shuffleArray } from '../utils/shuffle';
import { showToast } from '../utils/toast';
import { getElement, setText } from '../utils/dom';
import { STORAGE_KEYS } from '../types/storage';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface QuizState {
  category: Category;
  currentQuestion: number;
  score: number;
  questions: QuizQuestion[];
  selectedAnswer: string | null;
  selectedAnswers: (string | null)[];
  isSubmitted: boolean;
}

const state: QuizState = {
  category: 'Numerical',
  currentQuestion: 0,
  score: 0,
  questions: [],
  selectedAnswer: null,
  selectedAnswers: [],
  isSubmitted: false,
};

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

function saveProgress(): void {
  if (state.questions.length === 0) return;
  const progress: QuizProgress = {
    status: 'in-progress',
    category: state.category,
    currentQuestion: state.currentQuestion,
    score: state.score,
    selectedAnswer: state.selectedAnswer,
    selectedAnswers: state.selectedAnswers,
    isSubmitted: state.isSubmitted,
    questions: state.questions,
  };
  save(STORAGE_KEYS.QUIZ_PROGRESS, progress);
}

// ---------------------------------------------------------------------------
// UI Helpers
// ---------------------------------------------------------------------------

function updateProgress(): void {
  const total = state.questions.length;
  const current = state.currentQuestion + 1;

  setText('progress-text', `Question ${current} of ${total}`);

  const bar = getElement<HTMLDivElement>('progress-bar');
  if (bar) bar.style.width = `${(current / total) * 100}%`;
}

function disableInteraction(): void {
  document.querySelectorAll<HTMLButtonElement>('#choices-container button').forEach((btn) => {
    btn.disabled = true;
  });
  const actionBtn = getElement<HTMLButtonElement>('action-btn');
  if (actionBtn) {
    actionBtn.disabled = true;
    actionBtn.className =
      'w-full py-3.5 bg-slate-100 text-slate-400 font-semibold rounded-xl transition-all cursor-not-allowed';
  }
}

function enableInteraction(): void {
  const actionBtn = getElement<HTMLButtonElement>('action-btn');
  if (actionBtn) actionBtn.disabled = false;
}

// ---------------------------------------------------------------------------
// Choice Rendering
// ---------------------------------------------------------------------------

const CHOICE_DEFAULT_CLASS =
  'w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50/50 flex items-center space-x-2.5 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-100';
const BADGE_DEFAULT_CLASS =
  'w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 text-slate-500 flex items-center justify-center font-bold text-xs transition-colors border border-slate-200 select-none';
const CHOICE_SELECTED_CLASS =
  'w-full text-left p-3 rounded-xl border-2 border-blue-500 bg-blue-50/30 flex items-center space-x-2.5 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-200';
const BADGE_SELECTED_CLASS =
  'w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs transition-colors border border-blue-600 select-none';
const CHOICE_CORRECT_CLASS =
  'w-full text-left p-3 rounded-xl border-2 border-blue-500 bg-blue-50/30 flex items-center space-x-2.5 transition-all duration-200 focus:outline-none';
const BADGE_CORRECT_CLASS =
  'w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs border border-blue-600 select-none';
const CHOICE_WRONG_CLASS =
  'w-full text-left p-3 rounded-xl border-2 border-rose-300 bg-rose-50/20 flex items-center space-x-2.5 transition-all duration-200 focus:outline-none';
const BADGE_WRONG_CLASS =
  'w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs border border-rose-500 select-none';
const CHOICE_MUTED_CLASS =
  'w-full text-left p-3 rounded-xl border border-slate-100 flex items-center space-x-2.5 opacity-60 cursor-not-allowed focus:outline-none';
const BADGE_MUTED_CLASS =
  'w-7 h-7 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-200 select-none';

function choiceLetterHTML(index: number, badgeClass: string): string {
  return `<span class="${badgeClass}">${String.fromCharCode(65 + index)}</span>`;
}

function renderChoiceButton(choice: string, index: number, isSelected: boolean): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.id = `choice-${index}`;
  btn.className = isSelected ? CHOICE_SELECTED_CLASS : CHOICE_DEFAULT_CLASS;
  const badgeClass = isSelected ? BADGE_SELECTED_CLASS : BADGE_DEFAULT_CLASS;
  btn.innerHTML = `
    ${choiceLetterHTML(index, badgeClass)}
    <span class="text-slate-700 text-sm font-medium">${choice}</span>
  `;
  btn.addEventListener('click', () => selectAnswer(choice, index));
  return btn;
}

// ---------------------------------------------------------------------------
// Question Display
// ---------------------------------------------------------------------------

export function showQuestion(): void {
  state.selectedAnswer = null;
  state.isSubmitted = false;

  const question = state.questions[state.currentQuestion];

  setText('question-text', question.question);

  const container = getElement<HTMLDivElement>('choices-container');
  if (container) {
    container.innerHTML = '';
    question.choices.forEach((choice, index) => {
      container.appendChild(renderChoiceButton(choice, index, false));
    });
  }

  // Hide explanation boxes
  const expBox = getElement('explanation-box');
  if (expBox) expBox.classList.add('hidden');
  const expBoxDesktop = getElement('explanation-box-desktop');
  if (expBoxDesktop) expBoxDesktop.classList.add('hidden');

  // Reset action button
  const actionBtn = getElement<HTMLButtonElement>('action-btn');
  if (actionBtn) {
    actionBtn.textContent = 'Submit Answer';
    actionBtn.disabled = true;
    actionBtn.className =
      'w-full py-3.5 bg-slate-150 text-slate-400 font-semibold rounded-xl transition-all cursor-not-allowed';
  }

  updateProgress();
  saveProgress();
}

function renderCheckedQuestion(): void {
  const question = state.questions[state.currentQuestion];

  setText('question-text', question.question);

  const container = getElement<HTMLDivElement>('choices-container');
  if (container) {
    container.innerHTML = '';
    question.choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.id = `choice-${index}`;

      if (choice === question.answer) {
        btn.className = CHOICE_CORRECT_CLASS;
        btn.innerHTML = `${choiceLetterHTML(index, BADGE_CORRECT_CLASS)}<span class="text-slate-700 text-sm font-medium">${choice}</span>`;
      } else if (choice === state.selectedAnswer) {
        btn.className = CHOICE_WRONG_CLASS;
        btn.innerHTML = `${choiceLetterHTML(index, BADGE_WRONG_CLASS)}<span class="text-slate-700 text-sm font-medium">${choice}</span>`;
      } else {
        btn.className = CHOICE_MUTED_CLASS;
        btn.innerHTML = `${choiceLetterHTML(index, BADGE_MUTED_CLASS)}<span class="text-slate-700 text-sm font-medium">${choice}</span>`;
      }
      container.appendChild(btn);
    });
  }

  // Show explanation
  const expText = question.explanation;
  const expBox = getElement('explanation-box');
  const expTextEl = getElement('explanation-text');
  if (expBox && expTextEl) {
    expTextEl.textContent = expText;
    expBox.classList.remove('hidden');
  }
  const expBoxDesktop = getElement('explanation-box-desktop');
  const expTextDesktop = getElement('explanation-text-desktop');
  if (expBoxDesktop && expTextDesktop) {
    expTextDesktop.textContent = expText;
    expBoxDesktop.classList.remove('hidden');
  }

  const actionBtn = getElement<HTMLButtonElement>('action-btn');
  if (actionBtn) {
    const isLast = state.currentQuestion === state.questions.length - 1;
    actionBtn.textContent = isLast ? 'Finish Quiz' : 'Next Question';
    actionBtn.className =
      'w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all cursor-pointer';
  }
}

// ---------------------------------------------------------------------------
// Answer Handling
// ---------------------------------------------------------------------------

function selectAnswer(choice: string, index: number): void {
  if (state.isSubmitted) return;

  state.selectedAnswer = choice;
  state.selectedAnswers[state.currentQuestion] = choice;

  // Reset all choice buttons
  state.questions[state.currentQuestion].choices.forEach((_, idx) => {
    const btn = getElement<HTMLButtonElement>(`choice-${idx}`);
    if (!btn) return;
    const badge = btn.querySelector<HTMLSpanElement>('span');
    btn.className = CHOICE_DEFAULT_CLASS;
    if (badge) badge.className = BADGE_DEFAULT_CLASS;
  });

  // Style selected
  const selectedBtn = getElement<HTMLButtonElement>(`choice-${index}`);
  if (selectedBtn) {
    const selectedBadge = selectedBtn.querySelector<HTMLSpanElement>('span');
    selectedBtn.className = CHOICE_SELECTED_CLASS;
    if (selectedBadge) selectedBadge.className = BADGE_SELECTED_CLASS;
  }

  // Enable submit
  const actionBtn = getElement<HTMLButtonElement>('action-btn');
  if (actionBtn) {
    actionBtn.disabled = false;
    actionBtn.className =
      'w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all cursor-pointer';
  }

  saveProgress();
}

function checkAnswer(): void {
  if (state.isSubmitted) return;
  state.isSubmitted = true;

  const question = state.questions[state.currentQuestion];
  const isCorrect = state.selectedAnswer === question.answer;

  if (isCorrect) {
    state.score++;
    showToast('Correct! Great job.', 'success');
  } else {
    showToast('Incorrect answer.', 'error');
  }

  // Update choice styles
  question.choices.forEach((choice, index) => {
    const btn = getElement<HTMLButtonElement>(`choice-${index}`);
    if (!btn) return;
    const badge = btn.querySelector<HTMLSpanElement>('span');

    if (choice === question.answer) {
      btn.className = CHOICE_CORRECT_CLASS;
      if (badge) badge.className = BADGE_CORRECT_CLASS;
    } else if (choice === state.selectedAnswer) {
      btn.className = CHOICE_WRONG_CLASS;
      if (badge) badge.className = BADGE_WRONG_CLASS;
    } else {
      btn.className = CHOICE_MUTED_CLASS;
      if (badge) badge.className = BADGE_MUTED_CLASS;
    }
  });

  // Show explanation
  const expBox = getElement('explanation-box');
  const expTextEl = getElement('explanation-text');
  if (expBox && expTextEl) {
    expTextEl.textContent = question.explanation;
    expBox.classList.remove('hidden');
  }
  const expBoxDesktop = getElement('explanation-box-desktop');
  const expTextDesktop = getElement('explanation-text-desktop');
  if (expBoxDesktop && expTextDesktop) {
    expTextDesktop.textContent = question.explanation;
    expBoxDesktop.classList.remove('hidden');
  }

  // Update action button
  const actionBtn = getElement<HTMLButtonElement>('action-btn');
  if (actionBtn) {
    const isLast = state.currentQuestion === state.questions.length - 1;
    actionBtn.textContent = isLast ? 'Finish Quiz' : 'Next Question';
    actionBtn.className =
      'w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all cursor-pointer';
  }

  saveProgress();
}

function nextQuestion(): void {
  if (state.currentQuestion < state.questions.length - 1) {
    state.currentQuestion++;
    showQuestion();
  } else {
    finishQuiz();
  }
}

// ---------------------------------------------------------------------------
// Quiz Lifecycle
// ---------------------------------------------------------------------------

export async function startCategory(category: Category): Promise<void> {
  state.category = category;
  state.currentQuestion = 0;
  state.score = 0;
  state.selectedAnswer = null;
  state.selectedAnswers = [];
  state.isSubmitted = false;

  const data = await loadCategoryQuestions(category);
  if (data.length === 0) {
    console.error('Failed to load questions for', category);
    return;
  }

  shuffleArray(data);
  state.questions = data.slice(0, LIMITS.QUIZ_LIMIT);

  setText('question-category', `${category} Quiz`);
  showQuestion();
  updateProgress();
  saveProgress();
}

function finishQuiz(): void {
  remove(STORAGE_KEYS.QUIZ_PROGRESS);

  const percentage = Math.round((state.score / state.questions.length) * 100);

  // Update best scores
  const bestScores = load<Record<string, number>>(STORAGE_KEYS.BEST_SCORES, {});
  if (!bestScores[state.category] || percentage > bestScores[state.category]) {
    bestScores[state.category] = percentage;
    save(STORAGE_KEYS.BEST_SCORES, bestScores);
  }

  // Hide quiz UI, show completion panel
  const cardBody = getElement('quiz-card-body');
  const cardFooter = getElement('quiz-card-footer');
  const completionPanel = getElement('quiz-completion-panel');

  if (cardBody) cardBody.classList.add('hidden');
  if (cardFooter) cardFooter.classList.add('hidden');

  if (completionPanel) {
    completionPanel.classList.remove('hidden');
    completionPanel.innerHTML = `
      <div class="text-center py-8 select-none">
        <div class="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm animate-bounce">
          <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-slate-800 mb-2">Quiz Completed!</h3>
        <p class="text-slate-500 mb-6 max-w-sm mx-auto">You've finished the practice quiz for <strong class="text-slate-700">${state.category}</strong>.</p>

        <div class="inline-flex flex-col items-center bg-slate-50 border border-slate-100 p-6 rounded-2xl mb-8">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Your Score</span>
          <span class="text-4xl font-extrabold text-blue-600">${state.score} / ${state.questions.length}</span>
          <span class="text-sm font-medium text-emerald-600 mt-1">${percentage}% Score</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          <button id="retake-quiz-btn" class="py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition-all cursor-pointer">
            Retake Quiz
          </button>
          <button id="choose-category-btn" class="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-center shadow-md shadow-blue-100 transition-all cursor-pointer">
            Choose Category
          </button>
        </div>
      </div>
    `;

    // Attach completion panel button listeners (avoids inline onclick)
    const retakeBtn = completionPanel.querySelector<HTMLButtonElement>('#retake-quiz-btn');
    const chooseCatBtn = completionPanel.querySelector<HTMLButtonElement>('#choose-category-btn');

    if (retakeBtn) retakeBtn.addEventListener('click', restartCategory);
    if (chooseCatBtn) {
      chooseCatBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        restartCategory();
      });
    }
  }
}

function restartCategory(): void {
  remove(STORAGE_KEYS.QUIZ_PROGRESS);

  const completionPanel = getElement('quiz-completion-panel');
  const cardBody = getElement('quiz-card-body');
  const cardFooter = getElement('quiz-card-footer');

  if (completionPanel) completionPanel.classList.add('hidden');
  if (cardBody) cardBody.classList.remove('hidden');
  if (cardFooter) cardFooter.classList.remove('hidden');

  startCategory(state.category);
}

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

function resumeQuiz(savedState: QuizProgress): void {
  state.category = savedState.category;
  state.currentQuestion = savedState.currentQuestion;
  state.score = savedState.score;
  state.questions = savedState.questions;
  state.selectedAnswer = savedState.selectedAnswer;
  state.selectedAnswers = savedState.selectedAnswers ?? [];
  state.isSubmitted = savedState.isSubmitted ?? false;

  const resumeCard = getElement('resume-card');
  if (resumeCard) resumeCard.classList.add('hidden');

  enableInteraction();

  setText('question-category', `${state.category} Quiz`);

  if (state.isSubmitted) {
    renderCheckedQuestion();
  } else {
    showQuestion();
    if (state.selectedAnswer !== null) {
      const idx = state.questions[state.currentQuestion].choices.indexOf(state.selectedAnswer);
      if (idx !== -1) selectAnswer(state.selectedAnswer, idx);
    }
  }
  updateProgress();
}

function startOver(): void {
  remove(STORAGE_KEYS.QUIZ_PROGRESS);
  const resumeCard = getElement('resume-card');
  if (resumeCard) resumeCard.classList.add('hidden');
  enableInteraction();
  startCategory(state.category ?? 'Numerical');
}

// ---------------------------------------------------------------------------
// Page Initialization
// ---------------------------------------------------------------------------

export function initPracticePage(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.category-tab');

  // Set question count labels in tabs
  document.querySelectorAll<HTMLParagraphElement>('.category-tab span p').forEach((el) => {
    el.textContent = String(LIMITS.QUIZ_LIMIT);
  });

  if (tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      remove(STORAGE_KEYS.QUIZ_PROGRESS);

      const resumeCard = getElement('resume-card');
      if (resumeCard) resumeCard.classList.add('hidden');
      enableInteraction();

      // Update tab styles
      tabs.forEach((t) => {
        t.className =
          'category-tab w-full text-left px-4 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-600 font-medium flex justify-between items-center transition-all';
      });
      (e.currentTarget as HTMLButtonElement).className =
        'category-tab w-full text-left px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/50 text-blue-700 font-semibold flex justify-between items-center transition-all shadow-sm';

      const cat = (e.currentTarget as HTMLButtonElement).getAttribute('data-category') as Category;
      startCategory(cat);

      // Scroll to quiz card on mobile
      if (window.innerWidth < 1024) {
        const quizCard = getElement('quiz-card');
        if (quizCard) quizCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Check for saved session
  const savedState = load<QuizProgress | null>(STORAGE_KEYS.QUIZ_PROGRESS, null);

  if (savedState && savedState.status === 'in-progress') {
    const resumeCard = getElement('resume-card');
    const sessionDetails = getElement('resume-session-details');

    if (sessionDetails) {
      sessionDetails.textContent =
        CATEGORY_DISPLAY_NAMES[savedState.category] ?? savedState.category;
    }
    if (resumeCard) resumeCard.classList.remove('hidden');

    const resumeBtn = getElement<HTMLButtonElement>('resume-btn');
    if (resumeBtn) resumeBtn.onclick = () => resumeQuiz(savedState);

    const startOverBtn = getElement<HTMLButtonElement>('start-over-btn');
    if (startOverBtn) startOverBtn.onclick = () => startOver();

    // Highlight saved category tab
    tabs.forEach((t) => {
      const cat = t.getAttribute('data-category');
      t.className =
        cat === savedState.category
          ? 'category-tab w-full text-left px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/50 text-blue-700 font-semibold flex justify-between items-center transition-all shadow-sm'
          : 'category-tab w-full text-left px-4 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-600 font-medium flex justify-between items-center transition-all';
    });

    disableInteraction();
  } else {
    startCategory('Numerical');
  }

  // Action button handler
  const actionBtn = getElement<HTMLButtonElement>('action-btn');
  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      if (!state.isSubmitted) {
        checkAnswer();
      } else {
        nextQuestion();
      }
    });
  }
}
