import type { VocabQuizQuestion } from '../types/vocabulary';
import { LIMITS } from '../config';
import { save, load } from '../services/storage';
import { loadVocabQuizData } from '../services/data';
import { shuffleArray } from '../utils/shuffle';
import { showToast } from '../utils/toast';
import { getElement, setText } from '../utils/dom';
import { STORAGE_KEYS } from '../types/storage';

interface VocabQuizState {
  currentDay: number;
  currentQuestion: number;
  score: number;
  questions: VocabQuizQuestion[];
  selectedAnswer: string | null;
  isSubmitted: boolean;
}

const state: VocabQuizState = {
  currentDay: 1,
  currentQuestion: 0,
  score: 0,
  questions: [],
  selectedAnswer: null,
  isSubmitted: false,
};

async function loadQuiz(): Promise<void> {
  state.currentDay = load<number>(STORAGE_KEYS.VOCAB_DAY, 1);

  setText('day-badge', `Day ${state.currentDay} Quiz`);
  setText('question-index-label', `Day ${state.currentDay}`);

  const data = await loadVocabQuizData();
  const dayData = data.find((d) => d.day === state.currentDay);

  if (dayData && dayData.questions.length > 0) {
    const shuffled = shuffleArray([...dayData.questions]);
    const selectCount = Math.min(LIMITS.VOCAB_QUIZ_LIMIT, shuffled.length);
    state.questions = shuffled.slice(0, selectCount);
    state.currentQuestion = 0;
    state.score = 0;
    showQuestion();
  } else {
    showError(`No quiz questions found for Day ${state.currentDay}`);
  }
}

function showError(msg: string): void {
  const cardBody = getElement('quiz-card-body');
  if (cardBody) {
    cardBody.innerHTML = `
        <div class="text-center py-8 select-none">
            <div class="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 animate-pulse">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"></path>
                </svg>
            </div>
            <p class="text-slate-650 font-medium">${msg}</p>
            <a href="vocabulary.html" class="inline-block mt-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm">
                Return to Vocabulary
            </a>
        </div>
    `;
  }
  const footer = getElement('quiz-card-footer');
  if (footer) footer.classList.add('hidden');
}

const CHOICE_DEFAULT_CLASS =
  'w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-450 hover:bg-slate-50/50 flex items-center space-x-3 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-100';
const BADGE_DEFAULT_CLASS =
  'w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 text-slate-500 flex items-center justify-center font-semibold text-sm transition-colors border border-slate-200 select-none';
const CHOICE_SELECTED_CLASS =
  'w-full text-left p-4 rounded-xl border-2 border-blue-500 bg-blue-50/30 flex items-center space-x-3 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-200';
const BADGE_SELECTED_CLASS =
  'w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm transition-colors border border-blue-600 select-none';
const CHOICE_CORRECT_CLASS =
  'w-full text-left p-4 rounded-xl border-2 border-blue-500 bg-blue-50/30 flex items-center space-x-3 transition-all duration-200 focus:outline-none';
const BADGE_CORRECT_CLASS =
  'w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm border border-blue-600 select-none';
const CHOICE_WRONG_CLASS =
  'w-full text-left p-4 rounded-xl border-2 border-rose-300 bg-rose-50/20 flex items-center space-x-3 transition-all duration-200 focus:outline-none';
const BADGE_WRONG_CLASS =
  'w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-semibold text-sm border border-rose-500 select-none';
const CHOICE_MUTED_CLASS =
  'w-full text-left p-4 rounded-xl border border-slate-100 flex items-center space-x-3 opacity-60 cursor-not-allowed focus:outline-none';
const BADGE_MUTED_CLASS =
  'w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center font-semibold text-sm border border-slate-200 select-none';

function showQuestion(): void {
  state.selectedAnswer = null;
  state.isSubmitted = false;

  const question = state.questions[state.currentQuestion];

  setText('question-text', question.question);

  const container = getElement('choices-container');
  if (container) {
    container.innerHTML = '';
    question.choices.forEach((choice, index) => {
      const choiceBtn = document.createElement('button');
      choiceBtn.className = CHOICE_DEFAULT_CLASS;
      choiceBtn.id = `choice-${index}`;
      choiceBtn.innerHTML = `
        <span class="${BADGE_DEFAULT_CLASS}">${String.fromCharCode(65 + index)}</span>
        <span class="text-slate-700 font-medium">${choice}</span>
      `;
      choiceBtn.addEventListener('click', () => selectAnswer(choice, index));
      container.appendChild(choiceBtn);
    });
  }

  const expBox = getElement('explanation-box');
  if (expBox) expBox.classList.add('hidden');

  const actionBtn = getElement<HTMLButtonElement>('action-btn');
  if (actionBtn) {
    actionBtn.textContent = 'Submit Answer';
    actionBtn.disabled = true;
    actionBtn.className =
      'w-full py-3.5 bg-slate-150 text-slate-400 font-semibold rounded-xl transition-all cursor-not-allowed';
  }

  updateProgress();
}

function selectAnswer(choice: string, index: number): void {
  if (state.isSubmitted) return;

  state.selectedAnswer = choice;

  state.questions[state.currentQuestion].choices.forEach((_, idx) => {
    const btn = getElement(`choice-${idx}`);
    if (!btn) return;
    const badge = btn.querySelector('span');
    btn.className = CHOICE_DEFAULT_CLASS;
    if (badge) badge.className = BADGE_DEFAULT_CLASS;
  });

  const selectedBtn = getElement(`choice-${index}`);
  if (selectedBtn) {
    const selectedBadge = selectedBtn.querySelector('span');
    selectedBtn.className = CHOICE_SELECTED_CLASS;
    if (selectedBadge) selectedBadge.className = BADGE_SELECTED_CLASS;
  }

  const actionBtn = getElement<HTMLButtonElement>('action-btn');
  if (actionBtn) {
    actionBtn.disabled = false;
    actionBtn.className =
      'w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all cursor-pointer';
  }
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

  question.choices.forEach((choice, index) => {
    const btn = getElement(`choice-${index}`);
    if (!btn) return;
    const badge = btn.querySelector('span');

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

  const expBox = getElement('explanation-box');
  const expText = getElement('explanation-text');
  if (expBox && expText) {
    expText.textContent = question.explanation;
    expBox.classList.remove('hidden');
  }

  const actionBtn = getElement<HTMLButtonElement>('action-btn');
  if (actionBtn) {
    const isLast = state.currentQuestion === state.questions.length - 1;
    actionBtn.textContent = isLast ? 'Finish Quiz' : 'Next Question';
    actionBtn.className =
      'w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all cursor-pointer';
  }
}

function nextQuestion(): void {
  if (state.currentQuestion < state.questions.length - 1) {
    state.currentQuestion++;
    showQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz(): void {
  const streak = load(STORAGE_KEYS.STREAK, 1);
  save(STORAGE_KEYS.STREAK, streak + 1);

  const cardBody = getElement('quiz-card-body');
  const cardFooter = getElement('quiz-card-footer');
  const completionPanel = getElement('quiz-completion-panel');

  if (cardBody) cardBody.classList.add('hidden');
  if (cardFooter) cardFooter.classList.add('hidden');

  const percentage = Math.round((state.score / state.questions.length) * 100);

  if (completionPanel) {
    completionPanel.classList.remove('hidden');
    completionPanel.innerHTML = `
        <div class="text-center py-8 select-none animate-fade-in">
            <div class="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm animate-bounce">
                <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-800 mb-2">Challenge Completed!</h3>
            <p class="text-slate-500 mb-6 max-w-sm mx-auto">You've finished Day ${state.currentDay} Vocabulary Challenge.</p>
            
            <div class="inline-flex flex-col items-center bg-slate-50 border border-slate-100 p-6 rounded-2xl mb-8">
                <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Your Score</span>
                <span class="text-4xl font-extrabold text-blue-600">${state.score} / ${state.questions.length}</span>
                <span class="text-sm font-medium text-emerald-600 mt-1">${percentage}% Score</span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                <button id="retake-quiz-btn" class="py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition-all cursor-pointer">
                    Retake Quiz
                </button>
                <a href="vocabulary.html" class="py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center shadow-md shadow-blue-100 transition-all cursor-pointer">
                    Back to Vocabulary
                </a>
            </div>
        </div>
    `;

    const retakeBtn = completionPanel.querySelector('#retake-quiz-btn');
    if (retakeBtn) retakeBtn.addEventListener('click', restartQuiz);
  }
}

function restartQuiz(): void {
  const cardBody = getElement('quiz-card-body');
  const cardFooter = getElement('quiz-card-footer');
  const completionPanel = getElement('quiz-completion-panel');

  if (completionPanel) completionPanel.classList.add('hidden');
  if (cardBody) cardBody.classList.remove('hidden');
  if (cardFooter) cardFooter.classList.remove('hidden');

  loadQuiz();
}

function updateProgress(): void {
  const total = state.questions.length;
  const current = state.currentQuestion + 1;

  setText('progress-text', `Question ${current} of ${total}`);
  setText('question-index-label', `Question ${current}`);

  const progBar = getElement<HTMLDivElement>('progress-bar');
  if (progBar) {
    progBar.style.width = `${(current / total) * 100}%`;
  }
}

export function initVocabQuizPage(): void {
  loadQuiz();

  const actionBtn = getElement('action-btn');
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
