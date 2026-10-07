import { renderNavbar, renderFooter } from '../modules/navbar';
import { initVocabQuizPage } from '../modules/vocabQuiz';
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
    initVocabQuizPage();
});
