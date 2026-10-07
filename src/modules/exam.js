import { LIMITS } from '../config';
import { save, load, remove } from '../services/storage';
import { loadAllExamQuestions } from '../services/data';
import { shuffleArray } from '../utils/shuffle';
import { startTimer, stopTimer, formatTimer } from '../utils/timer';
import { showToast } from '../utils/toast';
import { getElement, setText } from '../utils/dom';
import { STORAGE_KEYS } from '../types/storage';
const state = {
    questions: [],
    selectedAnswers: [],
    markedForReview: [],
    currentQuestion: 0,
    timeRemaining: LIMITS.TIME_LIMIT,
    finished: false,
};
// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------
function saveProgress() {
    if (state.questions.length === 0 || state.finished)
        return;
    const progress = {
        status: 'in-progress',
        currentQuestion: state.currentQuestion,
        score: 0,
        selectedAnswers: state.selectedAnswers,
        timeRemaining: state.timeRemaining,
        markedForReview: state.markedForReview,
        questionIds: state.questions.map((q) => q.id),
    };
    save(STORAGE_KEYS.EXAM_PROGRESS, progress);
}
// ---------------------------------------------------------------------------
// UI Helpers
// ---------------------------------------------------------------------------
function updateProgressUI() {
    const total = state.questions.length;
    const current = state.currentQuestion + 1;
    setText('question-number', `Question ${current} of ${total}`);
    const bar = getElement('progress-bar');
    if (bar)
        bar.style.width = `${(current / total) * 100}%`;
}
function renderGrid() {
    const gridContainer = getElement('question-grid');
    if (!gridContainer)
        return;
    gridContainer.innerHTML = '';
    const total = state.questions.length;
    for (let i = 0; i < total; i++) {
        const btn = document.createElement('button');
        btn.id = `grid-btn-${i}`;
        updateGridBtnClass(btn, i);
        btn.innerHTML = `
      <span>${i + 1}</span>
      <svg id="grid-flag-${i}" class="w-2.5 h-2.5 text-amber-500 absolute top-0.5 right-0.5 fill-current ${state.markedForReview[i] ? '' : 'hidden'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
      </svg>
    `;
        btn.addEventListener('click', () => {
            const prevActive = state.currentQuestion;
            state.currentQuestion = i;
            showQuestion(prevActive);
        });
        gridContainer.appendChild(btn);
    }
}
function updateGridBtnClass(btn, index) {
    const isCurrent = index === state.currentQuestion;
    const isAnswered = state.selectedAnswers[index] !== null;
    const isFlagged = state.markedForReview[index];
    let baseClass = 'relative w-10 h-10 rounded-xl font-semibold text-sm transition-all focus:outline-none flex items-center justify-center border ';
    if (isCurrent) {
        baseClass += 'border-blue-600 ring-2 ring-blue-100 bg-blue-50 text-blue-700';
    }
    else if (isFlagged) {
        baseClass += 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100';
    }
    else if (isAnswered) {
        baseClass += 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200/70';
    }
    else {
        baseClass += 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600';
    }
    btn.className = baseClass;
}
function scrollContainerToElement(container, element) {
    if (!container || !element)
        return;
    const containerRect = container.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();
    let newScrollTop = container.scrollTop;
    if (elemRect.top < containerRect.top) {
        newScrollTop -= (containerRect.top - elemRect.top);
    }
    else if (elemRect.bottom > containerRect.bottom) {
        newScrollTop += (elemRect.bottom - containerRect.bottom);
    }
    if (newScrollTop !== container.scrollTop) {
        container.scrollTo({
            top: newScrollTop,
            behavior: 'smooth'
        });
    }
}
// ---------------------------------------------------------------------------
// Flagging
// ---------------------------------------------------------------------------
function toggleFlag() {
    if (state.finished)
        return;
    const qIndex = state.currentQuestion;
    state.markedForReview[qIndex] = !state.markedForReview[qIndex];
    updateFlagButtonUI();
    const flagSpan = getElement(`grid-flag-${qIndex}`);
    if (flagSpan) {
        if (state.markedForReview[qIndex]) {
            flagSpan.classList.remove('hidden');
        }
        else {
            flagSpan.classList.add('hidden');
        }
    }
    const gridBtn = getElement(`grid-btn-${qIndex}`);
    if (gridBtn) {
        updateGridBtnClass(gridBtn, qIndex);
    }
    saveProgress();
}
function updateFlagButtonUI() {
    const isFlagged = state.markedForReview[state.currentQuestion];
    const flagBtn = getElement('flag-review-btn');
    if (!flagBtn)
        return;
    if (isFlagged) {
        flagBtn.className =
            'flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-sm font-semibold transition-all hover:bg-amber-100 hover:border-amber-300 hover:text-amber-800 cursor-pointer select-none';
        flagBtn.innerHTML = `
      <svg class="w-4 h-4 text-amber-600 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
      </svg>
      <span>Flagged for Review</span>
    `;
    }
    else {
        flagBtn.className =
            'flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-slate-500 border border-slate-200 hover:border-amber-300 hover:text-amber-600 transition-all text-sm font-semibold cursor-pointer select-none';
        flagBtn.innerHTML = `
      <svg class="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
      </svg>
      <span>Flag for Review</span>
    `;
    }
}
// ---------------------------------------------------------------------------
// Question Display
// ---------------------------------------------------------------------------
const CHOICE_DEFAULT_CLASS = 'w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50/50 flex items-center space-x-2.5 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-100';
const BADGE_DEFAULT_CLASS = 'w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 text-slate-500 flex items-center justify-center font-bold text-xs transition-colors border border-slate-200 select-none';
const CHOICE_SELECTED_CLASS = 'w-full text-left p-3 rounded-xl border-2 border-blue-500 bg-blue-50/30 flex items-center space-x-2.5 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-200';
const BADGE_SELECTED_CLASS = 'w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs transition-colors border border-blue-600 select-none';
function choiceLetterHTML(index, badgeClass) {
    return `<span class="${badgeClass}">${String.fromCharCode(65 + index)}</span>`;
}
function showQuestion(prevActive) {
    if (state.questions.length === 0)
        return;
    if (prevActive !== undefined) {
        const oldBtn = getElement(`grid-btn-${prevActive}`);
        if (oldBtn)
            updateGridBtnClass(oldBtn, prevActive);
    }
    const newBtn = getElement(`grid-btn-${state.currentQuestion}`);
    if (newBtn) {
        updateGridBtnClass(newBtn, state.currentQuestion);
        const scrollContainer = newBtn.closest('.overflow-y-auto');
        scrollContainerToElement(scrollContainer, newBtn);
    }
    const question = state.questions[state.currentQuestion];
    setText('question-category', question.category);
    setText('question-text', question.question);
    const container = getElement('choices-container');
    if (container) {
        container.innerHTML = '';
        question.choices.forEach((choice, index) => {
            const isSelected = choice === state.selectedAnswers[state.currentQuestion];
            const btn = document.createElement('button');
            btn.id = `choice-${index}`;
            btn.className = isSelected ? CHOICE_SELECTED_CLASS : CHOICE_DEFAULT_CLASS;
            const badgeClass = isSelected ? BADGE_SELECTED_CLASS : BADGE_DEFAULT_CLASS;
            btn.innerHTML = `
        ${choiceLetterHTML(index, badgeClass)}
        <span class="text-slate-700 text-sm font-medium">${choice}</span>
      `;
            btn.addEventListener('click', () => selectAnswer(choice, index));
            container.appendChild(btn);
        });
    }
    updateProgressUI();
    updateFlagButtonUI();
    // Navigation Buttons State
    const prevBtn = getElement('prev-question-btn');
    const nextBtn = getElement('next-question-btn');
    if (prevBtn) {
        prevBtn.disabled = state.currentQuestion === 0;
        prevBtn.className = state.currentQuestion === 0
            ? 'px-4 py-2.5 bg-slate-50 text-slate-300 rounded-xl border border-slate-100 cursor-not-allowed text-sm font-semibold flex items-center space-x-1'
            : 'px-4 py-2.5 bg-white text-slate-600 rounded-xl border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all text-sm font-semibold flex items-center space-x-1 cursor-pointer';
    }
    if (nextBtn) {
        if (state.currentQuestion === state.questions.length - 1) {
            nextBtn.disabled = false;
            nextBtn.innerHTML = `<span>Submit</span><span>&rarr;</span>`;
            nextBtn.className = 'px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl border border-blue-600 text-sm font-semibold flex items-center space-x-1 cursor-pointer transition-all shadow-sm';
        }
        else {
            nextBtn.disabled = false;
            nextBtn.innerHTML = `<span>Next</span><span>&rarr;</span>`;
            nextBtn.className = 'px-4 py-2.5 bg-white text-slate-655 rounded-xl border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all text-sm font-semibold flex items-center space-x-1 cursor-pointer';
        }
    }
}
function selectAnswer(choice, index) {
    if (state.finished)
        return;
    state.selectedAnswers[state.currentQuestion] = choice;
    const choices = state.questions[state.currentQuestion].choices;
    choices.forEach((_, idx) => {
        const btn = getElement(`choice-${idx}`);
        if (!btn)
            return;
        const badge = btn.querySelector('span');
        btn.className = CHOICE_DEFAULT_CLASS;
        if (badge)
            badge.className = BADGE_DEFAULT_CLASS;
    });
    const selectedBtn = getElement(`choice-${index}`);
    if (selectedBtn) {
        const selectedBadge = selectedBtn.querySelector('span');
        selectedBtn.className = CHOICE_SELECTED_CLASS;
        if (selectedBadge)
            selectedBadge.className = BADGE_SELECTED_CLASS;
    }
    const gridBtn = getElement(`grid-btn-${state.currentQuestion}`);
    if (gridBtn) {
        updateGridBtnClass(gridBtn, state.currentQuestion);
    }
    saveProgress();
}
function goNext() {
    if (state.currentQuestion < state.questions.length - 1) {
        const prev = state.currentQuestion;
        state.currentQuestion++;
        showQuestion(prev);
    }
    else {
        confirmSubmit();
    }
}
function goPrev() {
    if (state.currentQuestion > 0) {
        const prev = state.currentQuestion;
        state.currentQuestion--;
        showQuestion(prev);
    }
}
// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------
async function loadExam() {
    const container = getElement('exam-container');
    if (container) {
        container.classList.add('opacity-50');
    }
    const allQuestions = await loadAllExamQuestions();
    if (allQuestions.length === 0) {
        if (container)
            container.classList.remove('opacity-50');
        const cardBody = getElement('exam-card-body');
        if (cardBody) {
            cardBody.innerHTML = `<div class="text-center py-20 text-rose-500 font-medium">Failed to load exam data.</div>`;
        }
        return;
    }
    if (container)
        container.classList.remove('opacity-50');
    // Group by category
    const categorized = {
        Numerical: [],
        Verbal: [],
        Analytical: [],
        Clerical: [],
        'General Information': [],
    };
    allQuestions.forEach((q) => {
        if (categorized[q.category])
            categorized[q.category].push(q);
    });
    // Select questions according to limits
    const selected = [
        ...shuffleArray(categorized.Numerical).slice(0, LIMITS.EXAM_NUMERICAL),
        ...shuffleArray(categorized.Verbal).slice(0, LIMITS.EXAM_VERBAL),
        ...shuffleArray(categorized.Analytical).slice(0, LIMITS.EXAM_ANALYTICAL),
        ...shuffleArray(categorized.Clerical).slice(0, LIMITS.EXAM_CLERICAL),
        ...shuffleArray(categorized['General Information']).slice(0, LIMITS.EXAM_GEN_INFO),
    ];
    // Final shuffle of the combined exam
    shuffleArray(selected);
    state.questions = selected.slice(0, LIMITS.EXAM_LIMIT);
    state.selectedAnswers = new Array(state.questions.length).fill(null);
    state.markedForReview = new Array(state.questions.length).fill(false);
    state.currentQuestion = 0;
    state.timeRemaining = LIMITS.TIME_LIMIT;
    state.finished = false;
    const savedState = load(STORAGE_KEYS.EXAM_PROGRESS, null);
    if (savedState && savedState.status === 'in-progress') {
        const wantsToResume = confirm('You have an unfinished mock exam in progress. Do you want to resume it?');
        if (wantsToResume) {
            // Re-map saved IDs to full question objects to ensure data consistency
            const mappedQuestions = [];
            const idMap = new Map(allQuestions.map((q) => [q.id, q]));
            savedState.questionIds.forEach((id) => {
                if (idMap.has(id))
                    mappedQuestions.push(idMap.get(id));
            });
            if (mappedQuestions.length === savedState.questionIds.length) {
                state.questions = mappedQuestions;
                state.currentQuestion = savedState.currentQuestion;
                state.selectedAnswers = savedState.selectedAnswers;
                state.markedForReview = savedState.markedForReview || new Array(mappedQuestions.length).fill(false);
                state.timeRemaining = savedState.timeRemaining;
            }
        }
        else {
            remove(STORAGE_KEYS.EXAM_PROGRESS);
        }
    }
    const flagBtn = getElement('flag-review-btn');
    if (flagBtn)
        flagBtn.addEventListener('click', toggleFlag);
    showQuestion();
    renderGrid();
    // Start Timer
    startTimer(state.timeRemaining, (remaining) => {
        state.timeRemaining = remaining;
        setText('exam-timer', formatTimer(remaining));
        const timerEl = getElement('exam-timer');
        if (timerEl) {
            if (remaining <= LIMITS.TIMER_WARNING) {
                timerEl.className = "text-xl font-bold font-mono text-rose-600 animate-pulse";
            }
            else {
                timerEl.className = "text-xl font-bold font-mono text-slate-700";
            }
        }
        if (remaining % 60 === 0) {
            saveProgress();
        }
    }, () => {
        showToast('Time is up! Submitting exam...', 'error');
        submitExam(true);
    });
}
// ---------------------------------------------------------------------------
// Submission
// ---------------------------------------------------------------------------
function confirmSubmit() {
    const answeredCount = state.selectedAnswers.filter((a) => a !== null).length;
    const flaggedCount = state.markedForReview.filter(Boolean).length;
    const unansweredCount = state.questions.length - answeredCount;
    setText('modal-answered', answeredCount.toString());
    setText('modal-unanswered', unansweredCount.toString());
    setText('modal-flagged', flaggedCount.toString());
    const modal = getElement('submit-confirm-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}
function closeSubmitModal() {
    const modal = getElement('submit-confirm-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}
function submitExam(autoSubmit = false) {
    if (state.finished)
        return;
    state.finished = true;
    stopTimer();
    const modal = getElement('submit-confirm-modal');
    if (modal && !autoSubmit) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    let correctCount = 0;
    const categoryStats = {
        Numerical: { correct: 0, total: 0 },
        Verbal: { correct: 0, total: 0 },
        Analytical: { correct: 0, total: 0 },
        Clerical: { correct: 0, total: 0 },
        'General Information': { correct: 0, total: 0 },
    };
    const questionsLog = [];
    state.questions.forEach((q, index) => {
        const userAnswer = state.selectedAnswers[index];
        const isCorrect = userAnswer === q.answer;
        if (isCorrect) {
            correctCount++;
            categoryStats[q.category].correct++;
        }
        categoryStats[q.category].total++;
        questionsLog.push({
            question: q.question,
            category: q.category,
            choices: [...q.choices],
            correctAnswer: q.answer,
            userAnswer,
            explanation: q.explanation,
            isCorrect,
        });
    });
    const percentage = Math.round((correctCount / state.questions.length) * 100);
    const passed = percentage >= LIMITS.PASSING_SCORE;
    const result = {
        date: new Date().toISOString(),
        score: correctCount,
        total: state.questions.length,
        percentage,
        passed,
        timeSpent: LIMITS.TIME_LIMIT - state.timeRemaining,
        categoryStats,
        questionsLog,
    };
    // Save full result
    save(STORAGE_KEYS.LAST_EXAM_RESULT, result);
    // Append to history
    const history = load(STORAGE_KEYS.EXAM_HISTORY, []);
    history.unshift({
        date: result.date,
        score: result.score,
        total: result.total,
        percentage: result.percentage,
        passed: result.passed,
    });
    if (history.length > LIMITS.MAX_HISTORY)
        history.pop();
    save(STORAGE_KEYS.EXAM_HISTORY, history);
    remove(STORAGE_KEYS.EXAM_PROGRESS);
    // Redirect
    window.location.href = 'dashboard.html';
}
// ---------------------------------------------------------------------------
// Page Initialization
// ---------------------------------------------------------------------------
export function initExamPage() {
    const prevBtn = getElement('prev-question-btn');
    const nextBtn = getElement('next-question-btn');
    const submitBtn = getElement('submit-exam-btn');
    const confirmBtn = getElement('modal-confirm-submit');
    const cancelBtn = getElement('modal-cancel-submit');
    if (prevBtn)
        prevBtn.addEventListener('click', goPrev);
    if (nextBtn)
        nextBtn.addEventListener('click', goNext);
    if (submitBtn)
        submitBtn.addEventListener('click', confirmSubmit);
    if (confirmBtn)
        confirmBtn.addEventListener('click', () => submitExam());
    if (cancelBtn)
        cancelBtn.addEventListener('click', closeSubmitModal);
    // Sidebar toggle for mobile
    const toggleBtn = getElement('toggle-sidebar-btn');
    const sidebar = getElement('grid-sidebar');
    const sidebarOverlay = getElement('sidebar-overlay');
    const closeSidebarBtn = getElement('close-sidebar-btn');
    function openSidebar() {
        if (sidebar)
            sidebar.classList.remove('translate-x-full');
        if (sidebarOverlay)
            sidebarOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        if (sidebar)
            sidebar.classList.add('translate-x-full');
        if (sidebarOverlay)
            sidebarOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
    if (toggleBtn)
        toggleBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn)
        closeSidebarBtn.addEventListener('click', closeSidebar);
    if (sidebarOverlay)
        sidebarOverlay.addEventListener('click', closeSidebar);
    loadExam();
}
