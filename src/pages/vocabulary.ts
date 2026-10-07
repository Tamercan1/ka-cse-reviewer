import { renderNavbar, renderFooter } from '../modules/navbar';
import { initVocabularyPage } from '../modules/vocabulary';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  initVocabularyPage();
});
