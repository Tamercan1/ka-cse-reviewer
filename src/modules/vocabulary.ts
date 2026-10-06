import type { VocabularyDay, VocabularyWord } from '../types/vocabulary';
import { save, load } from '../services/storage';
import { loadVocabularyData } from '../services/data';
import { showToast } from '../utils/toast';
import { getElement } from '../utils/dom';
import { STORAGE_KEYS } from '../types/storage';

interface VocabularyState {
  currentDay: number;
  vocabData: VocabularyDay[];
  masteredWords: string[];
}

const state: VocabularyState = {
  currentDay: 1,
  vocabData: [],
  masteredWords: [],
};

async function loadVocabulary(): Promise<void> {
  state.masteredWords = load<string[]>(STORAGE_KEYS.MASTERED_WORDS, []);
  state.currentDay = load<number>(STORAGE_KEYS.VOCAB_DAY, 1);

  const data = await loadVocabularyData();
  if (data.length > 0) {
    state.vocabData = data;
    showTodayWords();
  } else {
    console.error('Failed to load vocabulary data.');
  }
}

function highlightWord(sentence: string, word: string): string {
  const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b(${escaped}[a-z]*)\\b`, 'gi');
  return sentence.replace(regex, '<strong class="text-blue-600 font-semibold">$1</strong>');
}

export function toggleMastered(word: string): void {
  const idx = state.masteredWords.indexOf(word);
  if (idx > -1) {
    state.masteredWords.splice(idx, 1);
    showToast(`"${word}" removed from mastered words.`, 'info');
  } else {
    state.masteredWords.push(word);
    showToast(`"${word}" marked as mastered!`, 'success');
  }
  save(STORAGE_KEYS.MASTERED_WORDS, state.masteredWords);
  showTodayWords();
}

function showTodayWords(): void {
  const dayData = state.vocabData.find((d) => d.day === state.currentDay);
  if (!dayData) return;

  const dayIndicator = getElement('day-indicator');
  if (dayIndicator) dayIndicator.textContent = `Day ${state.currentDay}`;

  const container = getElement('vocabulary-list-container');
  if (!container) return;

  container.innerHTML = '';

  dayData.words.forEach((item: VocabularyWord) => {
    const isMastered = state.masteredWords.includes(item.word);

    const synonymsHTML = item.synonyms
      ? item.synonyms
          .map(
            (syn) => `
          <span class="inline-block bg-slate-100 text-slate-650 text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200/60 font-semibold select-none">
              ${syn}
          </span>`
          )
          .join('')
      : '';

    const antonymsHTML = item.antonyms
      ? item.antonyms
          .map(
            (ant) => `<span class="inline-block bg-slate-100 text-slate-650 text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200/60 font-semibold select-none">
              ${ant}
          </span>`
          )
          .join('')
      : '';

    const starIconHTML = isMastered
      ? `<svg class="w-4 h-4 text-emerald-600 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
      : `<svg class="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

    const card = document.createElement('div');
    card.className = `bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border-slate-200`;

    if (isMastered) {
      card.className += ' border-l-4 border-l-emerald-500';
    } else {
      card.className += ' border-l-4 border-l-blue-400';
    }

    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h4 class="text-xl font-bold text-slate-800 tracking-tight">${item.word}</h4>
                <div class="flex items-center space-x-2 mt-1">
                    <span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                        ${item.type ?? 'word'}
                    </span>
                    <span class="text-xs text-slate-400 font-mono">${item.ipa ?? ''}</span>
                </div>
            </div>
            <button id="master-btn-${item.word}" class="group p-2 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-semibold focus:outline-none cursor-pointer ${
              isMastered
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                : 'bg-white text-slate-555 border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 hover:text-blue-600'
            }" title="${isMastered ? 'Word Mastered' : 'Mark as Mastered'}">
                ${starIconHTML}
                <span>${isMastered ? 'Mastered' : 'Master'}</span>
            </button>
        </div>
        
        <p class="text-slate-600 text-sm leading-relaxed mb-4">
            <strong class="text-slate-700 text-xs uppercase tracking-wider font-semibold block mb-1">Definition</strong>
            ${item.definition}
        </p>

        <div class="mb-4 space-y-2.5">
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[70px]">Synonyms:</span>
                <div class="flex flex-wrap gap-1.5">${synonymsHTML}</div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[70px]">Antonyms:</span>
                <div class="flex flex-wrap gap-1.5">${antonymsHTML}</div>
            </div>
        </div>
        
        <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Context Sentence</span>
            <p class="text-slate-500 text-xs italic leading-relaxed">
                "${highlightWord(item.example, item.word)}"
            </p>
        </div>
    `;

    container.appendChild(card);
    
    // Bind toggleMastered event dynamically instead of inline onclick string
    const masterBtn = card.querySelector(`#master-btn-${item.word}`);
    if (masterBtn) {
      masterBtn.addEventListener('click', () => toggleMastered(item.word));
    }
  });

  save(STORAGE_KEYS.VOCAB_DAY, state.currentDay);
  updateDayNavigationButtons();
}

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextDay(): void {
  const maxDay = Math.max(...state.vocabData.map((d) => d.day), 1);
  if (state.currentDay < maxDay) {
    state.currentDay++;
    showTodayWords();
    scrollToTop();
  }
}

function previousDay(): void {
  if (state.currentDay > 1) {
    state.currentDay--;
    showTodayWords();
    scrollToTop();
  }
}

function updateDayNavigationButtons(): void {
  const prevBtn = getElement<HTMLButtonElement>('prev-day-btn');
  const nextBtn = getElement<HTMLButtonElement>('next-day-btn');
  const prevBtnBottom = getElement<HTMLButtonElement>('prev-day-btn-bottom');
  const nextBtnBottom = getElement<HTMLButtonElement>('next-day-btn-bottom');

  const isFirstDay = state.currentDay === 1;
  const maxDay = Math.max(...state.vocabData.map((d) => d.day), 1);
  const isLastDay = state.currentDay >= maxDay;

  const btnClasses = {
    disabledSmall: 'px-4 py-2.5 bg-slate-50 text-slate-300 font-semibold rounded-xl border border-slate-100 cursor-not-allowed text-sm flex items-center space-x-1.5',
    enabledSmall: 'px-4 py-2.5 bg-white text-slate-655 font-semibold rounded-xl border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all text-sm flex items-center space-x-1.5 cursor-pointer',
    disabledLarge: 'w-full sm:w-auto px-5 py-3 bg-slate-50 text-slate-300 font-semibold rounded-2xl border border-slate-100 cursor-not-allowed text-sm flex items-center justify-center space-x-1.5 select-none transition-all',
    enabledLarge: 'w-full sm:w-auto px-5 py-3 bg-white text-slate-655 font-semibold rounded-2xl border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all text-sm flex items-center justify-center space-x-1.5 cursor-pointer select-none',
  };

  if (prevBtn) {
    prevBtn.disabled = isFirstDay;
    prevBtn.className = isFirstDay ? btnClasses.disabledSmall : btnClasses.enabledSmall;
  }
  if (prevBtnBottom) {
    prevBtnBottom.disabled = isFirstDay;
    prevBtnBottom.className = isFirstDay ? btnClasses.disabledLarge : btnClasses.enabledLarge;
  }
  if (nextBtn) {
    nextBtn.disabled = isLastDay;
    nextBtn.className = isLastDay ? btnClasses.disabledSmall : btnClasses.enabledSmall;
  }
  if (nextBtnBottom) {
    nextBtnBottom.disabled = isLastDay;
    nextBtnBottom.className = isLastDay ? btnClasses.disabledLarge : btnClasses.enabledLarge;
  }
}

export function initVocabularyPage(): void {
  loadVocabulary();

  const prevBtn = getElement('prev-day-btn');
  const nextBtn = getElement('next-day-btn');
  const prevBtnBottom = getElement('prev-day-btn-bottom');
  const nextBtnBottom = getElement('next-day-btn-bottom');
  const backToTopBtn = getElement('back-to-top-btn');

  if (prevBtn) prevBtn.addEventListener('click', previousDay);
  if (nextBtn) nextBtn.addEventListener('click', nextDay);
  if (prevBtnBottom) prevBtnBottom.addEventListener('click', previousDay);
  if (nextBtnBottom) nextBtnBottom.addEventListener('click', nextDay);
  if (backToTopBtn) backToTopBtn.addEventListener('click', scrollToTop);
}
